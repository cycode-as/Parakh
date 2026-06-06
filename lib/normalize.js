/**
 * normalize.js
 *
 * Converts a raw AI provider response object into the canonical AnalysisResult shape.
 *
 * Handles three common model inconsistencies:
 *   1. camelCase keys  → renamed to snake_case
 *   2. Missing fields  → filled with sensible defaults derived from other fields
 *   3. Wrong types     → coerced to the expected type where safe
 */

// ── camelCase → snake_case key map ──────────────────────────────────────────
const CAMEL_TO_SNAKE = {
  trustScore:            'trust_score',
  riskLevel:             'risk_level',
  redFlags:              'red_flags',
  positiveSignals:       'positive_signals',
  fitScore:              'fit_score',
  studentSkills:         'student_skills',
  requiredSkills:        'required_skills',
  missingSkills:         'missing_skills',
  recommendedProjects:   'recommended_projects',
  fitSummary:            'fit_summary',
  successProbability:    'success_probability',
  prepTime:              'prep_time',
};

/**
 * Clamp a value to an integer in [0, 100].
 * @param {unknown} v
 * @param {number} fallback
 */
function clampScore(v, fallback) {
  const n = Number(v);
  if (Number.isNaN(n)) return fallback;
  return Math.max(0, Math.min(100, Math.round(n)));
}

/**
 * Derive a categorical success_probability string from numeric scores.
 * @param {number} trust
 * @param {number} fit
 * @returns {'high' | 'moderate' | 'low'}
 */
function deriveSuccessProbability(trust, fit) {
  const avg = Math.round((trust + fit) / 2);
  if (avg >= 70) return 'high';
  if (avg >= 40) return 'moderate';
  return 'low';
}

/**
 * Convert a value to a valid success_probability string.
 * Accepts:
 *   - 'high' | 'moderate' | 'low'  (already valid)
 *   - a number 0-100               (mapped to tier)
 * Falls back to deriveSuccessProbability when unrecognised.
 * @param {unknown} v
 * @param {number} trust
 * @param {number} fit
 * @returns {'high' | 'moderate' | 'low'}
 */
function normalizeSuccessProbability(v, trust, fit) {
  if (v === 'high' || v === 'moderate' || v === 'low') return v;

  // Handle numeric form (some models return 0-100)
  const n = Number(v);
  if (!Number.isNaN(n)) {
    if (n >= 70) return 'high';
    if (n >= 40) return 'moderate';
    return 'low';
  }

  return deriveSuccessProbability(trust, fit);
}

/**
 * Ensure every entry in an array-of-objects field has both `name` and `reason`
 * as strings.
 * @param {unknown} arr
 * @returns {Array<{name: string, reason: string}>}
 */
function normalizeProjects(arr) {
  if (!Array.isArray(arr)) return [];
  return arr
    .filter(p => p && typeof p === 'object')
    .map(p => ({
      name:   typeof p.name   === 'string' ? p.name   : String(p.name   ?? '[Untitled]'),
      reason: typeof p.reason === 'string' ? p.reason : String(p.reason ?? '[No reason provided]'),
    }));
}

/**
 * Ensure a value is an array of strings.
 * @param {unknown} v
 * @returns {string[]}
 */
function normalizeStringArray(v) {
  if (!Array.isArray(v)) return [];
  return v.map(item => (typeof item === 'string' ? item : String(item)));
}

/**
 * Normalize a raw parsed AI JSON object into a valid AnalysisResult.
 *
 * This function NEVER throws. All missing or malformed fields are replaced
 * with safe defaults.
 *
 * @param {Record<string, unknown>} raw
 * @returns {import('./schema.js').AnalysisResult}
 */
export function normalizeAIResponse(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    raw = {};
  }

  // Step 1 — remap any camelCase keys to snake_case (non-destructive)
  const obj = { ...raw };
  for (const [camel, snake] of Object.entries(CAMEL_TO_SNAKE)) {
    if (camel in obj && !(snake in obj)) {
      obj[snake] = obj[camel];
    }
  }

  // Step 2 — resolve core numeric scores first (other defaults depend on them)
  const trust_score = clampScore(obj.trust_score, 50);
  const fit_score   = clampScore(obj.fit_score,   50);

  // Step 3 — categorical fields with enum enforcement
  const RISK_LEVELS     = ['low', 'medium', 'high'];
  const RECOMMENDATIONS = ['apply', 'upskill', 'avoid'];

  const risk_level = RISK_LEVELS.includes(obj.risk_level)
    ? obj.risk_level
    : trust_score >= 70 ? 'low' : trust_score >= 40 ? 'medium' : 'high';

  const recommendation = RECOMMENDATIONS.includes(obj.recommendation)
    ? obj.recommendation
    : fit_score >= 70 ? 'apply' : fit_score >= 40 ? 'upskill' : 'avoid';

  const success_probability = normalizeSuccessProbability(
    obj.success_probability,
    trust_score,
    fit_score,
  );

  // Step 4 — array fields
  const red_flags            = normalizeStringArray(obj.red_flags);
  const positive_signals     = normalizeStringArray(obj.positive_signals);
  const student_skills       = normalizeStringArray(obj.student_skills);
  const required_skills      = normalizeStringArray(obj.required_skills);
  const missing_skills       = normalizeStringArray(obj.missing_skills);
  const recommended_projects = normalizeProjects(obj.recommended_projects);

  // Step 5 — string fields
  const fit_summary = typeof obj.fit_summary === 'string' && obj.fit_summary.trim()
    ? obj.fit_summary
    : `${fit_score}% match against the job requirements.`;

  const prep_time = typeof obj.prep_time === 'string' && obj.prep_time.trim()
    ? obj.prep_time
    : '2–4 weeks';

  const reasoning = typeof obj.reasoning === 'string' && obj.reasoning.trim()
    ? obj.reasoning
    : `Based on a trust score of ${trust_score} and fit score of ${fit_score}, the recommendation is to ${recommendation}.`;

  return {
    trust_score,
    risk_level,
    red_flags,
    positive_signals,
    fit_score,
    student_skills,
    required_skills,
    missing_skills,
    recommended_projects,
    fit_summary,
    recommendation,
    success_probability,
    prep_time,
    reasoning,
  };
}

export const normalizeGeminiResponse = normalizeAIResponse;
