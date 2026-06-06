/**
 * Validates an AnalysisResult object against the 14-field schema.
 * @param {object} obj - The object to validate
 * @returns {{ valid: true } | { valid: false, field: string }}
 */
export function validateSchema(obj) {
  if (!obj || typeof obj !== 'object') {
    return { valid: false, field: 'root' };
  }

  // trust_score: number 0–100 (NaN is explicitly rejected)
  if (
    typeof obj.trust_score !== 'number' ||
    Number.isNaN(obj.trust_score) ||
    obj.trust_score < 0 ||
    obj.trust_score > 100
  ) {
    return { valid: false, field: 'trust_score' };
  }

  // fit_score: number 0–100 (NaN is explicitly rejected)
  if (
    typeof obj.fit_score !== 'number' ||
    Number.isNaN(obj.fit_score) ||
    obj.fit_score < 0 ||
    obj.fit_score > 100
  ) {
    return { valid: false, field: 'fit_score' };
  }

  // risk_level: 'low' | 'medium' | 'high'
  if (!['low', 'medium', 'high'].includes(obj.risk_level)) {
    return { valid: false, field: 'risk_level' };
  }

  // recommendation: 'apply' | 'upskill' | 'avoid'
  if (!['apply', 'upskill', 'avoid'].includes(obj.recommendation)) {
    return { valid: false, field: 'recommendation' };
  }

  // success_probability: 'high' | 'moderate' | 'low'
  if (!['high', 'moderate', 'low'].includes(obj.success_probability)) {
    return { valid: false, field: 'success_probability' };
  }

  // red_flags: Array
  if (!Array.isArray(obj.red_flags)) {
    return { valid: false, field: 'red_flags' };
  }

  // positive_signals: Array
  if (!Array.isArray(obj.positive_signals)) {
    return { valid: false, field: 'positive_signals' };
  }

  // student_skills: Array
  if (!Array.isArray(obj.student_skills)) {
    return { valid: false, field: 'student_skills' };
  }

  // required_skills: Array
  if (!Array.isArray(obj.required_skills)) {
    return { valid: false, field: 'required_skills' };
  }

  // missing_skills: Array
  if (!Array.isArray(obj.missing_skills)) {
    return { valid: false, field: 'missing_skills' };
  }

  // recommended_projects: Array (each entry has name and reason as strings)
  if (!Array.isArray(obj.recommended_projects)) {
    return { valid: false, field: 'recommended_projects' };
  }
  for (const project of obj.recommended_projects) {
    if (
      !project ||
      typeof project !== 'object' ||
      typeof project.name !== 'string' ||
      typeof project.reason !== 'string'
    ) {
      return { valid: false, field: 'recommended_projects' };
    }
  }

  // fit_summary: string
  if (typeof obj.fit_summary !== 'string') {
    return { valid: false, field: 'fit_summary' };
  }

  // prep_time: string
  if (typeof obj.prep_time !== 'string') {
    return { valid: false, field: 'prep_time' };
  }

  // reasoning: string
  if (typeof obj.reasoning !== 'string') {
    return { valid: false, field: 'reasoning' };
  }

  return { valid: true };
}
