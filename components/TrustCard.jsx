import { getScoreColor, getRiskColor } from '../lib/colors.js';

const MAX_RED_FLAGS = 5;

export default function TrustCard({ trust_score, risk_level, red_flags, positive_signals }) {
  const scoreColor = getScoreColor(trust_score);
  const riskColor = getRiskColor(risk_level);

  const visibleRedFlags = red_flags.slice(0, MAX_RED_FLAGS);
  const overflowCount = red_flags.length - MAX_RED_FLAGS;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col gap-6">
      {/* Header */}
      <h2 className="text-lg font-semibold text-gray-800">Trust Score</h2>

      {/* Score + Badge row */}
      <div className="flex items-center gap-4">
        {/* Large score number */}
        <span
          className="text-6xl font-bold leading-none tabular-nums"
          style={{ color: scoreColor }}
          aria-label={`Trust score: ${trust_score}`}
        >
          {trust_score}
        </span>

        {/* Risk level badge */}
        <span
          className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold uppercase tracking-wide"
          style={{ color: riskColor, borderColor: riskColor, backgroundColor: `${riskColor}1A` }}
          aria-label={`Risk level: ${risk_level}`}
        >
          {risk_level} risk
        </span>
      </div>

      {/* Red Flags */}
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Red Flags</h3>
        {red_flags.length === 0 ? (
          <p className="text-sm text-gray-500">No red flags detected.</p>
        ) : (
          <>
            <ul className="flex flex-col gap-1 list-disc list-inside">
              {visibleRedFlags.map((flag, index) => (
                <li key={index} className="text-sm text-gray-700">
                  {flag}
                </li>
              ))}
            </ul>
            {overflowCount > 0 && (
              <p className="text-sm text-gray-500 mt-1">+{overflowCount} more</p>
            )}
          </>
        )}
      </div>

      {/* Positive Signals */}
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Positive Signals</h3>
        {positive_signals.length === 0 ? (
          <p className="text-sm text-gray-500">No positive signals found</p>
        ) : (
          <ul className="flex flex-col gap-1 list-disc list-inside">
            {positive_signals.map((signal, index) => (
              <li key={index} className="text-sm text-gray-700">
                {signal}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
