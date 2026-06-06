export default function SkillGap({ student_skills, required_skills, missing_skills, recommended_projects }) {
  const missingSet = new Set(missing_skills);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col gap-6">
      {/* Header */}
      <h2 className="text-lg font-semibold text-gray-800">Skill Gap Analysis</h2>

      {/* Two-column skill comparison */}
      <div className="grid grid-cols-2 gap-4">
        {/* Left column: You have */}
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">You have</h3>
          {student_skills.length === 0 ? (
            <p className="text-sm text-gray-500">No skills listed.</p>
          ) : (
            <ul className="flex flex-col gap-1 list-disc list-inside">
              {student_skills.map((skill, index) => (
                <li key={index} className="text-sm text-gray-700">
                  {skill}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right column: Job requires */}
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Job requires</h3>
          {required_skills.length === 0 ? (
            <p className="text-sm text-gray-500">No requirements listed.</p>
          ) : (
            <ul className="flex flex-col gap-1 list-disc list-inside">
              {required_skills.map((skill, index) => {
                const isMissing = missingSet.has(skill);
                return (
                  <li
                    key={index}
                    className="text-sm"
                    style={isMissing ? { color: '#dc2626' } : undefined}
                  >
                    <span className={isMissing ? undefined : 'text-gray-700'}>{skill}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Recommended Projects */}
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Recommended Projects</h3>
        {recommended_projects.length > 0 && (
          <ul className="flex flex-col gap-2">
            {recommended_projects.map((project, index) => (
              <li key={index} className="text-sm text-gray-700">
                <span className="font-semibold">
                  {project.name && project.name.trim() ? project.name : '[Untitled Project]'}
                </span>
                {' — '}
                {project.reason && project.reason.trim() ? project.reason : '[No reason provided]'}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
