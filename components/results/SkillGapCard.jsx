export default function SkillGapCard({ student_skills = [], required_skills = [], missing_skills = [] }) {
  const missingSet = new Set(missing_skills);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card space-y-5">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Skill Gap Analysis</h2>
        <p className="text-sm text-gray-500 mt-0.5">Your skills vs. what the job requires</p>
      </div>

      {/* Summary bar */}
      {required_skills.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>Skills you have</span>
            <span>{required_skills.length - missing_skills.length} / {required_skills.length}</span>
          </div>
          <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full transition-all duration-700"
              style={{ width: `${((required_skills.length - missing_skills.length) / required_skills.length) * 100}%` }} />
          </div>
          {missing_skills.length > 0 && (
            <p className="text-xs text-red-600 mt-2 font-medium">⚠ {missing_skills.length} skill{missing_skills.length > 1 ? 's' : ''} missing</p>
          )}
        </div>
      )}

      {/* Two columns */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> You Have
          </h3>
          <div className="flex flex-wrap gap-2">
            {student_skills.length === 0
              ? <p className="text-sm text-gray-400">No skills listed.</p>
              : student_skills.map((s, i) => (
                <span key={i} className="bg-green-50 text-green-700 border border-green-200 text-xs px-2.5 py-1 rounded-lg font-medium">
                  ✓ {s}
                </span>
              ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Job Requires
          </h3>
          <div className="flex flex-wrap gap-2">
            {required_skills.length === 0
              ? <p className="text-sm text-gray-400">No requirements listed.</p>
              : required_skills.map((s, i) => {
                const missing = missingSet.has(s);
                return (
                  <span key={i}
                    className={`text-xs px-2.5 py-1 rounded-lg font-medium border
                      ${missing
                        ? 'bg-red-50 text-red-600 border-red-200'
                        : 'bg-green-50 text-green-700 border-green-200'}`}>
                    {missing ? '✗ ' : '✓ '}{s}
                  </span>
                );
              })}
          </div>
        </div>
      </div>

      {/* Missing skills callout */}
      {missing_skills.length > 0 && (
        <div className="border border-red-100 bg-red-50 rounded-xl p-4">
          <h3 className="text-xs font-bold text-red-700 uppercase tracking-widest mb-2">Missing Skills</h3>
          <div className="flex flex-wrap gap-2">
            {missing_skills.map((s, i) => (
              <span key={i} className="bg-red-100 text-red-700 border border-red-200 text-xs px-2.5 py-1 rounded-lg font-bold">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
