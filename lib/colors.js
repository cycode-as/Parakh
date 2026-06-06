export function getScoreColor(score) {
  if (score >= 70) return '#16a34a'   // green
  if (score >= 40) return '#d97706'   // amber
  return '#dc2626'                    // red
}

export function getRiskColor(risk_level) {
  if (risk_level === 'low') return '#16a34a'
  if (risk_level === 'medium') return '#d97706'
  return '#dc2626'
}

export function getRecommendationColor(recommendation) {
  if (recommendation === 'apply') return '#16a34a'
  if (recommendation === 'upskill') return '#d97706'
  return '#dc2626'
}
