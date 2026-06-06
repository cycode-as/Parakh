import CircularScore from './CircularScore';
import { getScoreColor } from '../../lib/colors';

export default function CareerMatchCard({ fit_score, fit_summary }) {
  const score = fit_score ?? 0;
  // Derived sub-scores (mock in absence of real API data)
  const resumeScore   = Math.min(100, Math.round(score * 1.1));
  const githubScore   = Math.max(0,   Math.round(score * 0.85));
  const linkedinScore = Math.min(100, Math.round(score * 0.95));
  const projectsScore = Math.max(0,   Math.round(score * 0.75));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Career Match</h2>
        <p className="text-sm text-gray-500 mt-0.5">How well you match this opportunity</p>
      </div>

      {/* Overall + sub scores */}
      <div className="flex items-center gap-6 flex-wrap">
        <CircularScore score={score} size={128} label="Overall Match" />
        <div className="flex-1 grid grid-cols-2 gap-4 min-w-48">
          {[
            { label: 'Resume',   value: resumeScore,   icon: '📄' },
            { label: 'GitHub',   value: githubScore,   icon: '⚡' },
            { label: 'LinkedIn', value: linkedinScore, icon: '💼' },
            { label: 'Projects', value: projectsScore, icon: '🚀' },
          ].map(s => (
            <div key={s.label} className="bg-gray-50 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span>{s.icon}</span>
                <span className="text-xs font-semibold text-gray-600">{s.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${s.value}%`, backgroundColor: getScoreColor(s.value) }} />
                </div>
                <span className="text-xs font-bold text-gray-700 w-7 text-right"
                  style={{ color: getScoreColor(s.value) }}>{s.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
        <p className="text-sm text-blue-800 font-medium leading-relaxed">
          {fit_summary || 'No summary available.'}
        </p>
      </div>
    </div>
  );
}
