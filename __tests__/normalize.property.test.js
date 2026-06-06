/**
 * Property tests for lib/normalize.js
 *
 * Verifies that normalizeGeminiResponse() produces a schema-valid object
 * under all the chaotic inputs Gemini can realistically return.
 */

import * as fc from 'fast-check';
import { normalizeGeminiResponse } from '../lib/normalize.js';
import { validateSchema } from '../lib/schema.js';

// ── Helpers ───────────────────────────────────────────────────────────────────

function assertValid(input) {
  const result = normalizeGeminiResponse(input);
  const validation = validateSchema(result);
  if (!validation.valid) {
    throw new Error(
      `normalizeGeminiResponse produced an invalid object.\n` +
      `Failing field: ${validation.field}\n` +
      `Input: ${JSON.stringify(input)}\n` +
      `Output: ${JSON.stringify(result)}`
    );
  }
}

// ── Arbitraries ───────────────────────────────────────────────────────────────

const validScore   = fc.integer({ min: 0, max: 100 });
const anyValue     = fc.anything();
const stringArr    = fc.array(fc.string());

// A fully valid snake_case Gemini response
const validSnakeArb = fc.record({
  trust_score:          validScore,
  fit_score:            validScore,
  risk_level:           fc.constantFrom('low', 'medium', 'high'),
  recommendation:       fc.constantFrom('apply', 'upskill', 'avoid'),
  success_probability:  fc.constantFrom('high', 'moderate', 'low'),
  red_flags:            stringArr,
  positive_signals:     stringArr,
  student_skills:       stringArr,
  required_skills:      stringArr,
  missing_skills:       stringArr,
  recommended_projects: fc.array(fc.record({ name: fc.string(), reason: fc.string() })),
  fit_summary:          fc.string({ minLength: 1 }),
  prep_time:            fc.string({ minLength: 1 }),
  reasoning:            fc.string({ minLength: 1 }),
});

// A fully valid camelCase Gemini response
const validCamelArb = fc.record({
  trustScore:           validScore,
  fitScore:             validScore,
  riskLevel:            fc.constantFrom('low', 'medium', 'high'),
  recommendation:       fc.constantFrom('apply', 'upskill', 'avoid'),
  successProbability:   fc.constantFrom('high', 'moderate', 'low'),
  redFlags:             stringArr,
  positiveSignals:      stringArr,
  studentSkills:        stringArr,
  requiredSkills:       stringArr,
  missingSkills:        stringArr,
  recommendedProjects:  fc.array(fc.record({ name: fc.string(), reason: fc.string() })),
  fitSummary:           fc.string({ minLength: 1 }),
  prepTime:             fc.string({ minLength: 1 }),
  reasoning:            fc.string({ minLength: 1 }),
});

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('normalizeGeminiResponse — property tests', () => {

  test('property: valid snake_case objects always produce a valid schema', () => {
    fc.assert(
      fc.property(validSnakeArb, (input) => { assertValid(input); }),
      { numRuns: 200 }
    );
  });

  test('property: valid camelCase objects always produce a valid schema', () => {
    fc.assert(
      fc.property(validCamelArb, (input) => { assertValid(input); }),
      { numRuns: 200 }
    );
  });

  test('property: empty object {} is healed to a valid result', () => {
    assertValid({});
  });

  test('property: null input is healed to a valid result', () => {
    assertValid(null);
  });

  test('property: completely random objects never throw and always produce a valid schema', () => {
    fc.assert(
      fc.property(fc.anything(), (input) => { assertValid(input); }),
      { numRuns: 500 }
    );
  });

  test('property: numeric success_probability is correctly mapped to categorical', () => {
    fc.assert(
      fc.property(validScore, validScore, fc.integer({ min: 0, max: 100 }), (trust, fit, numericProb) => {
        const result = normalizeGeminiResponse({
          trust_score: trust,
          fit_score: fit,
          success_probability: numericProb,
        });
        expect(['high', 'moderate', 'low']).toContain(result.success_probability);
      }),
      { numRuns: 200 }
    );
  });

  test('property: missing success_probability is derived from trust_score and fit_score', () => {
    fc.assert(
      fc.property(validScore, validScore, (trust, fit) => {
        const result = normalizeGeminiResponse({ trust_score: trust, fit_score: fit });
        const avg = Math.round((trust + fit) / 2);
        const expected = avg >= 70 ? 'high' : avg >= 40 ? 'moderate' : 'low';
        expect(result.success_probability).toBe(expected);
      }),
      { numRuns: 200 }
    );
  });

  test('property: snake_case keys always win over camelCase duplicates', () => {
    fc.assert(
      fc.property(validScore, validScore, (snake, camel) => {
        fc.pre(snake !== camel); // only test when values differ
        const result = normalizeGeminiResponse({
          trust_score: snake,
          trustScore:  camel,  // snake_case should take precedence
        });
        expect(result.trust_score).toBe(Math.max(0, Math.min(100, Math.round(snake))));
      }),
      { numRuns: 100 }
    );
  });

  test('property: scores are always clamped to [0, 100]', () => {
    fc.assert(
      fc.property(fc.integer({ min: -1000, max: 1000 }), fc.integer({ min: -1000, max: 1000 }), (trust, fit) => {
        const result = normalizeGeminiResponse({ trust_score: trust, fit_score: fit });
        expect(result.trust_score).toBeGreaterThanOrEqual(0);
        expect(result.trust_score).toBeLessThanOrEqual(100);
        expect(result.fit_score).toBeGreaterThanOrEqual(0);
        expect(result.fit_score).toBeLessThanOrEqual(100);
      }),
      { numRuns: 200 }
    );
  });

  test('specific: successProbability camelCase is renamed correctly', () => {
    const result = normalizeGeminiResponse({
      trust_score: 80,
      fit_score: 70,
      successProbability: 'high',
    });
    expect(result.success_probability).toBe('high');
  });

  test('specific: numeric successProbability 85 maps to "high"', () => {
    const result = normalizeGeminiResponse({
      trust_score: 85, fit_score: 85, successProbability: 85,
    });
    expect(result.success_probability).toBe('high');
  });

  test('specific: numeric successProbability 50 maps to "moderate"', () => {
    const result = normalizeGeminiResponse({
      trust_score: 50, fit_score: 50, successProbability: 50,
    });
    expect(result.success_probability).toBe('moderate');
  });

  test('specific: numeric successProbability 20 maps to "low"', () => {
    const result = normalizeGeminiResponse({
      trust_score: 20, fit_score: 20, successProbability: 20,
    });
    expect(result.success_probability).toBe('low');
  });

});
