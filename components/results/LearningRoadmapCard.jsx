export default function LearningRoadmapCard({ missing_skills = [], prep_time = '4 weeks', recommended_projects = [] }) {
  // Build a simple week-by-week timeline from available data
  const totalWeeks = parseInt(prep_time) || 4;

  const weeks = [];
  for (let w = 1; w <= Math.min(totalWeeks, 6); w++) {
    const skill = missing_skills[w - 1];
    const project = recommended_projects[w - 1];
    weeks.push({
      week: w,
      focus: skill ? `Learn ${skill}` : (project ? `Build: ${project.name}` : `Practice & review`),
      tasks: skill
        ? [`Study ${skill} fundamentals`, `Complete 2–3 exercises`, `Apply to a mini project`]
        : project
          ? [project.reason || 'Build and deploy the project', 'Write clear README', 'Add to portfolio']
          : ['Revise previous topics', 'Mock interviews', 'Polish portfolio'],
      status: w === 1 ? 'current' : 'upcoming',
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Learning Roadmap</h2>
          <p className="text-sm text-gray-500 mt-0.5">Your personalized week-by-week plan</p>
        </div>
        <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold px-3 py-1.5 rounded-full">
          {prep_time} plan
        </span>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[1.375rem] top-3 bottom-3 w-0.5 bg-gray-100" />

        <div className="space-y-5">
          {weeks.map((week, i) => (
            <div key={i} className="relative flex gap-5 items-start">
              {/* Dot */}
              <div className={`relative z-10 w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0
                ${week.status === 'current'
                  ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                  : 'bg-gray-100 text-gray-500'}`}>
                W{week.week}
              </div>
              {/* Content */}
              <div className={`flex-1 rounded-xl p-4 ${week.status === 'current' ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50 border border-gray-100'}`}>
                <p className={`text-sm font-bold mb-2 ${week.status === 'current' ? 'text-blue-800' : 'text-gray-700'}`}>
                  Week {week.week}: {week.focus}
                </p>
                <ul className="space-y-1">
                  {week.tasks.map((t, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-gray-500">
                      <svg className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${week.status === 'current' ? 'text-blue-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
