import CircularScore from './CircularScore';
import { getRiskColor, getScoreColor } from '../../lib/colors';

const riskBg = { low: 'bg-green-50 border-green-200 text-green-700', medium: 'bg-amber-50 border-amber-200 text-amber-700', high: 'bg-red-50 border-red-200 text-red-700' };

export default function TrustScoreCard({ trust_score, risk_level, red_flags = [], positive_signals = [] }) {
  const MAX = 5;
  const visibleFlags = red_flags.slice(0, MAX);
  const overflow = red_flags.length - MAX;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card space-y-6">
      {/* Header row */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Trust Score</h2>
          <p className="text-sm text-gray-500 mt-0.5">Job posting legitimacy</p>
        </div>
        <span className={`border text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide ${riskBg[risk_level] || riskBg.medium}`}>
          {risk_level} risk
        </span>
      </div>

      {/* Score + bars */}
      <div className="flex items-center gap-8">
        <CircularScore score={trust_score} label="Trust" />
        <div className="flex-1 space-y-2">
          <ScoreBar label="Legitimacy" value={trust_score} color={getScoreColor(trust_score)} />
          <ScoreBar label="Contact validity" value={Math.min(100, trust_score + 5)} color="#3b82f6" />
          <ScoreBar label="Salary realism" value={Math.max(0, trust_score - 8)} color="#8b5cf6" />
        </div>
      </div>

      {/* Red flags */}
      <div>
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
          Red Flags {red_flags.length > 0 && <span className="bg-red-100 text-red-700 text-xs px-1.5 py-0.5 rounded-full">{red_flags.length}</span>}
        </h3>
        {red_flags.length === 0
          ? <p className="text-sm text-gray-400">No red flags detected.</p>
          : (
            <>
              <ul className="space-y-1.5">
                {visibleFlags.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              {overflow > 0 && <p className="text-xs text-gray-400 mt-1.5">+{overflow} more red flag{overflow > 1 ? 's' : ''}</p>}
            </>
          )}
      </div>

      {/* Positive signals */}
      <div>
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
          Positive Signals
        </h3>
        {positive_signals.length === 0
          ? <p className="text-sm text-gray-400">No positive signals found.</p>
          : (
            <ul className="space-y-1.5">
              {positive_signals.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {s}
                </li>
              ))}
            </ul>
          )}
      </div>
    </div>
  );
}

function ScoreBar({ label, value, color }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-xs text-gray-500 w-28 flex-shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-bold text-gray-700 w-8 text-right">{value}</span>
    </div>
  );
}
