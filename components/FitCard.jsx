import { getScoreColor } from '../lib/colors.js';

export default function FitCard({ fit_score, fit_summary }) {
  const scoreColor = fit_score != null ? getScoreColor(fit_score) : '#9ca3af';

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col gap-6">
      {/* Header */}
      <h2 className="text-lg font-semibold text-gray-800">Fit Score</h2>

      {/* Large score number */}
      <div className="flex flex-col gap-2">
        <span
          className="text-6xl font-bold leading-none tabular-nums"
          style={{ color: scoreColor }}
          aria-label={fit_score != null ? `Fit score: ${fit_score}` : 'Fit score unavailable'}
        >
          {fit_score != null ? fit_score : '—'}
        </span>

        {/* Fit summary caption */}
        <p className="text-sm text-gray-600">
          {fit_summary != null && fit_summary !== '' ? fit_summary : 'No summary available.'}
        </p>
      </div>
    </div>
  );
}
