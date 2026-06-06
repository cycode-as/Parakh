import { getRecommendationColor } from '../lib/colors.js';

export default function ActionCard({ recommendation, success_probability, prep_time, reasoning }) {
  const recColor = recommendation ? getRecommendationColor(recommendation) : '#9ca3af';

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col gap-6">
      {/* Header */}
      <h2 className="text-lg font-semibold text-gray-800">Action Recommendation</h2>

      {/* Recommendation pill badge */}
      <div>
        <span
          className="inline-flex items-center rounded-full border px-4 py-2 text-lg font-bold uppercase tracking-widest"
          style={{
            color: recColor,
            borderColor: recColor,
            backgroundColor: `${recColor}1A`,
          }}
          aria-label={`Recommendation: ${recommendation ?? 'unavailable'}`}
        >
          {recommendation ? recommendation.toUpperCase() : '—'}
        </span>
      </div>

      {/* Labeled fields */}
      <div className="flex flex-col gap-4">
        {/* Success Probability */}
        <div>
          <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Success Probability
          </span>
          <p className="text-sm text-gray-700 mt-0.5">
            {success_probability ?? '—'}
          </p>
        </div>

        {/* Prep Time */}
        <div>
          <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Prep Time
          </span>
          <p className="text-sm text-gray-700 mt-0.5">
            {prep_time ?? '—'}
          </p>
        </div>

        {/* Reasoning */}
        <div>
          <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Reasoning
          </span>
          <p className="text-sm text-gray-700 mt-0.5">
            {reasoning ?? '—'}
          </p>
        </div>
      </div>
    </div>
  );
}
