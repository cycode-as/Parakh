// Feature: parakh, Property 4: Schema validation correctly accepts and rejects AnalysisResult objects

import * as fc from 'fast-check'
import { validateSchema } from '../lib/schema.js'

/**
 * Validates: Requirements 3.3, 3.4
 *
 * Property 4: Schema validation correctly accepts and rejects AnalysisResult objects
 * For any valid 14-field AnalysisResult:
 *   - validateSchema returns { valid: true }
 * For any object with one mutated field (wrong type, out-of-range, wrong enum):
 *   - validateSchema returns { valid: false, field: '<fieldName>' }
 */

// ── Valid object builder ──────────────────────────────────────────────────────

/**
 * Returns a fully valid 14-field AnalysisResult object.
 * All fields use representative but clearly valid values.
 */
function buildValidObject() {
  return {
    trust_score: 75,
    fit_score: 60,
    risk_level: 'low',
    recommendation: 'apply',
    success_probability: 'high',
    red_flags: ['No company website found'],
    positive_signals: ['Official domain email'],
    student_skills: ['React', 'JavaScript'],
    required_skills: ['React', 'Node.js'],
    missing_skills: ['Node.js'],
    recommended_projects: [{ name: 'REST API project', reason: 'Closes Node.js gap' }],
    fit_summary: 'Good overall fit with one skill gap.',
    prep_time: '2 weeks',
    reasoning: 'The student meets most requirements and should apply after brushing up on Node.js.',
  }
}

// ── Arbitraries ───────────────────────────────────────────────────────────────

/** Generates a valid AnalysisResult object with randomised but valid field values */
const validObjectArb = fc.record({
  trust_score: fc.integer({ min: 0, max: 100 }),
  fit_score: fc.integer({ min: 0, max: 100 }),
  risk_level: fc.constantFrom('low', 'medium', 'high'),
  recommendation: fc.constantFrom('apply', 'upskill', 'avoid'),
  success_probability: fc.constantFrom('high', 'moderate', 'low'),
  red_flags: fc.array(fc.string()),
  positive_signals: fc.array(fc.string()),
  student_skills: fc.array(fc.string()),
  required_skills: fc.array(fc.string()),
  missing_skills: fc.array(fc.string()),
  recommended_projects: fc.array(
    fc.record({ name: fc.string(), reason: fc.string() })
  ),
  fit_summary: fc.string(),
  prep_time: fc.string(),
  reasoning: fc.string(),
})

// ── Property test: valid objects always pass ──────────────────────────────────

describe('validateSchema — Property 4: Schema validation correctly accepts and rejects AnalysisResult objects', () => {
  test('accepts any fully valid 14-field AnalysisResult object', () => {
    fc.assert(
      fc.property(validObjectArb, (obj) => {
        const result = validateSchema(obj)
        expect(result).toEqual({ valid: true })
      }),
      { numRuns: 100 }
    )
  })

  // ── Mutation tests: one invalid field → rejected with correct field name ────

  describe('rejects objects with invalid trust_score', () => {
    test('trust_score: -1 (below range)', () => {
      const obj = { ...buildValidObject(), trust_score: -1 }
      expect(validateSchema(obj)).toEqual({ valid: false, field: 'trust_score' })
    })

    test('trust_score: 101 (above range)', () => {
      const obj = { ...buildValidObject(), trust_score: 101 }
      expect(validateSchema(obj)).toEqual({ valid: false, field: 'trust_score' })
    })

    test('trust_score: "50" (wrong type — string)', () => {
      const obj = { ...buildValidObject(), trust_score: '50' }
      expect(validateSchema(obj)).toEqual({ valid: false, field: 'trust_score' })
    })

    test('trust_score: null (wrong type)', () => {
      const obj = { ...buildValidObject(), trust_score: null }
      expect(validateSchema(obj)).toEqual({ valid: false, field: 'trust_score' })
    })
  })

  describe('rejects objects with invalid fit_score', () => {
    test('fit_score: -1 (below range)', () => {
      const obj = { ...buildValidObject(), fit_score: -1 }
      expect(validateSchema(obj)).toEqual({ valid: false, field: 'fit_score' })
    })

    test('fit_score: 101 (above range)', () => {
      const obj = { ...buildValidObject(), fit_score: 101 }
      expect(validateSchema(obj)).toEqual({ valid: false, field: 'fit_score' })
    })

    test('fit_score: "50" (wrong type — string)', () => {
      const obj = { ...buildValidObject(), fit_score: '50' }
      expect(validateSchema(obj)).toEqual({ valid: false, field: 'fit_score' })
    })

    test('fit_score: null (wrong type)', () => {
      const obj = { ...buildValidObject(), fit_score: null }
      expect(validateSchema(obj)).toEqual({ valid: false, field: 'fit_score' })
    })
  })

  describe('rejects objects with invalid risk_level', () => {
    test('risk_level: "unknown" (invalid enum)', () => {
      const obj = { ...buildValidObject(), risk_level: 'unknown' }
      expect(validateSchema(obj)).toEqual({ valid: false, field: 'risk_level' })
    })

    test('risk_level: 42 (wrong type — number)', () => {
      const obj = { ...buildValidObject(), risk_level: 42 }
      expect(validateSchema(obj)).toEqual({ valid: false, field: 'risk_level' })
    })

    test('risk_level: null (wrong type)', () => {
      const obj = { ...buildValidObject(), risk_level: null }
      expect(validateSchema(obj)).toEqual({ valid: false, field: 'risk_level' })
    })
  })

  describe('rejects objects with invalid recommendation', () => {
    test('recommendation: "maybe" (invalid enum)', () => {
      const obj = { ...buildValidObject(), recommendation: 'maybe' }
      expect(validateSchema(obj)).toEqual({ valid: false, field: 'recommendation' })
    })

    test('recommendation: 1 (wrong type — number)', () => {
      const obj = { ...buildValidObject(), recommendation: 1 }
      expect(validateSchema(obj)).toEqual({ valid: false, field: 'recommendation' })
    })

    test('recommendation: null (wrong type)', () => {
      const obj = { ...buildValidObject(), recommendation: null }
      expect(validateSchema(obj)).toEqual({ valid: false, field: 'recommendation' })
    })
  })

  describe('rejects objects with invalid success_probability', () => {
    test('success_probability: "very high" (invalid enum)', () => {
      const obj = { ...buildValidObject(), success_probability: 'very high' }
      expect(validateSchema(obj)).toEqual({ valid: false, field: 'success_probability' })
    })

    test('success_probability: 0 (wrong type — number)', () => {
      const obj = { ...buildValidObject(), success_probability: 0 }
      expect(validateSchema(obj)).toEqual({ valid: false, field: 'success_probability' })
    })

    test('success_probability: null (wrong type)', () => {
      const obj = { ...buildValidObject(), success_probability: null }
      expect(validateSchema(obj)).toEqual({ valid: false, field: 'success_probability' })
    })
  })

  describe('rejects objects with invalid red_flags', () => {
    test('red_flags: "not an array" (wrong type — string)', () => {
      const obj = { ...buildValidObject(), red_flags: 'not an array' }
      expect(validateSchema(obj)).toEqual({ valid: false, field: 'red_flags' })
    })

    test('red_flags: null (wrong type)', () => {
      const obj = { ...buildValidObject(), red_flags: null }
      expect(validateSchema(obj)).toEqual({ valid: false, field: 'red_flags' })
    })
  })

  describe('rejects objects with invalid positive_signals', () => {
    test('positive_signals: "not an array" (wrong type — string)', () => {
      const obj = { ...buildValidObject(), positive_signals: 'not an array' }
      expect(validateSchema(obj)).toEqual({ valid: false, field: 'positive_signals' })
    })

    test('positive_signals: null (wrong type)', () => {
      const obj = { ...buildValidObject(), positive_signals: null }
      expect(validateSchema(obj)).toEqual({ valid: false, field: 'positive_signals' })
    })
  })

  describe('rejects objects with invalid student_skills', () => {
    test('student_skills: "not an array" (wrong type — string)', () => {
      const obj = { ...buildValidObject(), student_skills: 'not an array' }
      expect(validateSchema(obj)).toEqual({ valid: false, field: 'student_skills' })
    })

    test('student_skills: null (wrong type)', () => {
      const obj = { ...buildValidObject(), student_skills: null }
      expect(validateSchema(obj)).toEqual({ valid: false, field: 'student_skills' })
    })
  })

  describe('rejects objects with invalid required_skills', () => {
    test('required_skills: "not an array" (wrong type — string)', () => {
      const obj = { ...buildValidObject(), required_skills: 'not an array' }
      expect(validateSchema(obj)).toEqual({ valid: false, field: 'required_skills' })
    })

    test('required_skills: null (wrong type)', () => {
      const obj = { ...buildValidObject(), required_skills: null }
      expect(validateSchema(obj)).toEqual({ valid: false, field: 'required_skills' })
    })
  })

  describe('rejects objects with invalid missing_skills', () => {
    test('missing_skills: "not an array" (wrong type — string)', () => {
      const obj = { ...buildValidObject(), missing_skills: 'not an array' }
      expect(validateSchema(obj)).toEqual({ valid: false, field: 'missing_skills' })
    })

    test('missing_skills: null (wrong type)', () => {
      const obj = { ...buildValidObject(), missing_skills: null }
      expect(validateSchema(obj)).toEqual({ valid: false, field: 'missing_skills' })
    })
  })

  describe('rejects objects with invalid recommended_projects', () => {
    test('recommended_projects: "not an array" (wrong type — string)', () => {
      const obj = { ...buildValidObject(), recommended_projects: 'not an array' }
      expect(validateSchema(obj)).toEqual({ valid: false, field: 'recommended_projects' })
    })

    test('recommended_projects: null (wrong type)', () => {
      const obj = { ...buildValidObject(), recommended_projects: null }
      expect(validateSchema(obj)).toEqual({ valid: false, field: 'recommended_projects' })
    })

    test('recommended_projects: [{ name: 123, reason: "ok" }] (invalid name type)', () => {
      const obj = { ...buildValidObject(), recommended_projects: [{ name: 123, reason: 'ok' }] }
      expect(validateSchema(obj)).toEqual({ valid: false, field: 'recommended_projects' })
    })
  })

  describe('rejects objects with invalid fit_summary', () => {
    test('fit_summary: 42 (wrong type — number)', () => {
      const obj = { ...buildValidObject(), fit_summary: 42 }
      expect(validateSchema(obj)).toEqual({ valid: false, field: 'fit_summary' })
    })

    test('fit_summary: null (wrong type)', () => {
      const obj = { ...buildValidObject(), fit_summary: null }
      expect(validateSchema(obj)).toEqual({ valid: false, field: 'fit_summary' })
    })
  })

  describe('rejects objects with invalid prep_time', () => {
    test('prep_time: 42 (wrong type — number)', () => {
      const obj = { ...buildValidObject(), prep_time: 42 }
      expect(validateSchema(obj)).toEqual({ valid: false, field: 'prep_time' })
    })

    test('prep_time: null (wrong type)', () => {
      const obj = { ...buildValidObject(), prep_time: null }
      expect(validateSchema(obj)).toEqual({ valid: false, field: 'prep_time' })
    })
  })

  describe('rejects objects with invalid reasoning', () => {
    test('reasoning: 42 (wrong type — number)', () => {
      const obj = { ...buildValidObject(), reasoning: 42 }
      expect(validateSchema(obj)).toEqual({ valid: false, field: 'reasoning' })
    })

    test('reasoning: null (wrong type)', () => {
      const obj = { ...buildValidObject(), reasoning: null }
      expect(validateSchema(obj)).toEqual({ valid: false, field: 'reasoning' })
    })
  })

  // ── Property-based mutation test ─────────────────────────────────────────────

  /**
   * For each field, pick a random invalid mutation and assert validateSchema rejects it.
   * This sweeps over many generated valid base objects to ensure robustness.
   */

  const numericFieldMutations = fc.oneof(
    fc.constant(-1),
    fc.constant(101),
    fc.constant('50'),
    fc.constant(null),
    fc.double({ min: -1000, max: -0.01 }), // negative float
    fc.double({ min: 100.01, max: 1000 }),  // above-range float
  )

  const enumInvalidMutations = fc.oneof(
    fc.string().filter(s => !['low', 'medium', 'high', 'apply', 'upskill', 'avoid', 'high', 'moderate', 'low'].includes(s)),
    fc.integer(),
    fc.constant(null),
    fc.boolean(),
  )

  const nonArrayMutations = fc.oneof(
    fc.string(),
    fc.integer(),
    fc.constant(null),
    fc.boolean(),
    fc.record({}),
  )

  const nonStringMutations = fc.oneof(
    fc.integer(),
    fc.constant(null),
    fc.boolean(),
    fc.array(fc.string()),
  )

  test('property: trust_score mutation always causes rejection', () => {
    fc.assert(
      fc.property(validObjectArb, numericFieldMutations, (base, badValue) => {
        const obj = { ...base, trust_score: badValue }
        const result = validateSchema(obj)
        expect(result.valid).toBe(false)
      }),
      { numRuns: 100 }
    )
  })

  test('property: fit_score mutation always causes rejection', () => {
    fc.assert(
      fc.property(validObjectArb, numericFieldMutations, (base, badValue) => {
        const obj = { ...base, fit_score: badValue }
        const result = validateSchema(obj)
        expect(result.valid).toBe(false)
      }),
      { numRuns: 100 }
    )
  })

  test('property: risk_level invalid enum/type always causes rejection', () => {
    const invalidRiskLevels = fc.oneof(
      fc.string().filter(s => !['low', 'medium', 'high'].includes(s)),
      fc.integer(),
      fc.constant(null),
    )
    fc.assert(
      fc.property(validObjectArb, invalidRiskLevels, (base, badValue) => {
        const obj = { ...base, risk_level: badValue }
        const result = validateSchema(obj)
        expect(result.valid).toBe(false)
      }),
      { numRuns: 100 }
    )
  })

  test('property: recommendation invalid enum/type always causes rejection', () => {
    const invalidRecommendations = fc.oneof(
      fc.string().filter(s => !['apply', 'upskill', 'avoid'].includes(s)),
      fc.integer(),
      fc.constant(null),
    )
    fc.assert(
      fc.property(validObjectArb, invalidRecommendations, (base, badValue) => {
        const obj = { ...base, recommendation: badValue }
        const result = validateSchema(obj)
        expect(result.valid).toBe(false)
      }),
      { numRuns: 100 }
    )
  })

  test('property: success_probability invalid enum/type always causes rejection', () => {
    const invalidSuccessProbabilities = fc.oneof(
      fc.string().filter(s => !['high', 'moderate', 'low'].includes(s)),
      fc.integer(),
      fc.constant(null),
    )
    fc.assert(
      fc.property(validObjectArb, invalidSuccessProbabilities, (base, badValue) => {
        const obj = { ...base, success_probability: badValue }
        const result = validateSchema(obj)
        expect(result.valid).toBe(false)
      }),
      { numRuns: 100 }
    )
  })

  test('property: red_flags non-array always causes rejection', () => {
    fc.assert(
      fc.property(validObjectArb, nonArrayMutations, (base, badValue) => {
        const obj = { ...base, red_flags: badValue }
        const result = validateSchema(obj)
        expect(result.valid).toBe(false)
      }),
      { numRuns: 100 }
    )
  })

  test('property: positive_signals non-array always causes rejection', () => {
    fc.assert(
      fc.property(validObjectArb, nonArrayMutations, (base, badValue) => {
        const obj = { ...base, positive_signals: badValue }
        const result = validateSchema(obj)
        expect(result.valid).toBe(false)
      }),
      { numRuns: 100 }
    )
  })

  test('property: student_skills non-array always causes rejection', () => {
    fc.assert(
      fc.property(validObjectArb, nonArrayMutations, (base, badValue) => {
        const obj = { ...base, student_skills: badValue }
        const result = validateSchema(obj)
        expect(result.valid).toBe(false)
      }),
      { numRuns: 100 }
    )
  })

  test('property: required_skills non-array always causes rejection', () => {
    fc.assert(
      fc.property(validObjectArb, nonArrayMutations, (base, badValue) => {
        const obj = { ...base, required_skills: badValue }
        const result = validateSchema(obj)
        expect(result.valid).toBe(false)
      }),
      { numRuns: 100 }
    )
  })

  test('property: missing_skills non-array always causes rejection', () => {
    fc.assert(
      fc.property(validObjectArb, nonArrayMutations, (base, badValue) => {
        const obj = { ...base, missing_skills: badValue }
        const result = validateSchema(obj)
        expect(result.valid).toBe(false)
      }),
      { numRuns: 100 }
    )
  })

  test('property: fit_summary non-string always causes rejection', () => {
    fc.assert(
      fc.property(validObjectArb, nonStringMutations, (base, badValue) => {
        const obj = { ...base, fit_summary: badValue }
        const result = validateSchema(obj)
        expect(result.valid).toBe(false)
      }),
      { numRuns: 100 }
    )
  })

  test('property: prep_time non-string always causes rejection', () => {
    fc.assert(
      fc.property(validObjectArb, nonStringMutations, (base, badValue) => {
        const obj = { ...base, prep_time: badValue }
        const result = validateSchema(obj)
        expect(result.valid).toBe(false)
      }),
      { numRuns: 100 }
    )
  })

  test('property: reasoning non-string always causes rejection', () => {
    fc.assert(
      fc.property(validObjectArb, nonStringMutations, (base, badValue) => {
        const obj = { ...base, reasoning: badValue }
        const result = validateSchema(obj)
        expect(result.valid).toBe(false)
      }),
      { numRuns: 100 }
    )
  })
})
