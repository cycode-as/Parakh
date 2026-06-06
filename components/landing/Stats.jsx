const stats = [
  { value: '1.2M+',  label: 'Jobs Analyzed',           icon: '📊', color: 'bg-blue-50 text-blue-600' },
  { value: '48K+',   label: 'Students Helped',          icon: '🎓', color: 'bg-green-50 text-green-600' },
  { value: '97.4%',  label: 'Scam Detection Accuracy',  icon: '🛡️', color: 'bg-purple-50 text-purple-600' },
  { value: '91.2%',  label: 'Career Match Accuracy',    icon: '🎯', color: 'bg-amber-50 text-amber-600' },
];

export default function Stats() {
  return (
    <section className="py-16 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center text-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${s.color}`}>
                {s.icon}
              </div>
              <div>
                <p className="text-3xl font-extrabold text-gray-900">{s.value}</p>
                <p className="text-sm text-gray-500 font-medium mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
