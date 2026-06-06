import { getRecommendationColor } from '../../lib/colors';

const recConfig = {
  apply: {
    label: 'APPLY',
    emoji: '🚀',
    bg: 'bg-green-600',
    light: 'bg-green-50 border-green-100',
    text: 'text-green-600',
    desc: 'You\'re a strong fit. Apply immediately and prepare for interviews.',
  },
  upskill: {
    label: 'UPSKILL',
    emoji: '⚡',
    bg: 'bg-amber-500',
    light: 'bg-amber-50 border-amber-100',
    text: 'text-amber-600',
    desc: 'You\'re close but not quite ready. Follow the roadmap, then apply.',
  },
  avoid: {
    label: 'AVOID',
    emoji: '🚨',
    bg: 'bg-red-600',
    light: 'bg-red-50 border-red-100',
    text: 'text-red-600',
    desc: 'This opportunity appears risky or isn\'t a realistic match right now.',
  },
};

export default function RecommendationCard({ recommendation, success_probability, prep_time, reasoning }) {
  const rec = recConfig[recommendation] || recConfig.upskill;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Action Recommendation</h2>
        <p className="text-sm text-gray-500 mt-0.5">Our AI's recommendation for you</p>
      </div>

      {/* Big recommendation pill */}
      <div className="flex flex-col items-center gap-4 py-4">
        <div className={`${rec.bg} text-white rounded-2xl px-10 py-5 text-center shadow-lg`}>
          <div className="text-4xl mb-2">{rec.emoji}</div>
          <p className="text-3xl font-black tracking-widest">{rec.label}</p>
        </div>
        <p className="text-sm text-gray-500 text-center max-w-sm">{rec.desc}</p>
      </div>

      {/* Detail grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className={`${rec.light} border rounded-xl p-4`}>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Success Probability</p>
          <p className={`text-lg font-extrabold capitalize ${rec.text}`}>{success_probability ?? '—'}</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Prep Time Needed</p>
          <p className="text-lg font-extrabold text-blue-700">{prep_time ?? '—'}</p>
        </div>
      </div>

      {/* Reasoning */}
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">AI Reasoning</p>
        <p className="text-sm text-gray-700 leading-relaxed">{reasoning ?? 'No reasoning provided.'}</p>
      </div>

      {/* CTA */}
      <div className="flex gap-3">
        {recommendation === 'apply' && (
          <button className="flex-1 bg-green-600 text-white font-semibold py-3 rounded-xl hover:bg-green-700 transition-colors text-sm">
            🚀 Prepare Interview Checklist
          </button>
        )}
        {recommendation === 'upskill' && (
          <button className="flex-1 bg-amber-500 text-white font-semibold py-3 rounded-xl hover:bg-amber-600 transition-colors text-sm">
            ⚡ Start Learning Roadmap
          </button>
        )}
        {recommendation === 'avoid' && (
          <button className="flex-1 bg-gray-900 text-white font-semibold py-3 rounded-xl hover:bg-gray-700 transition-colors text-sm">
            🔍 Analyze Another Opportunity
          </button>
        )}
      </div>
    </div>
  );
}
