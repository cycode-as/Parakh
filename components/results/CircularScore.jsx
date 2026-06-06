export default function CircularScore({ score, size = 120, label = 'Score', color }) {
  const r = (size / 2) - 10;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;

  const strokeColor = color || (score >= 70 ? '#16a34a' : score >= 40 ? '#d97706' : '#dc2626');

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Track */}
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none" stroke="#f3f4f6" strokeWidth="9"
          />
          {/* Progress */}
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none"
            stroke={strokeColor}
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="progress-ring__circle"
            style={{ transform: `rotate(-90deg)`, transformOrigin: '50% 50%' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-extrabold text-gray-900" style={{ color: strokeColor }}>{score}</span>
          <span className="text-xs text-gray-500 font-medium">/100</span>
        </div>
      </div>
      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</span>
    </div>
  );
}
