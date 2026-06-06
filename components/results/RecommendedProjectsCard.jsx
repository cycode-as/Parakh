const projectColors = [
  'border-l-blue-500',
  'border-l-violet-500',
  'border-l-green-500',
  'border-l-amber-500',
];

export default function RecommendedProjectsCard({ recommended_projects = [] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card space-y-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Recommended Projects</h2>
        <p className="text-sm text-gray-500 mt-0.5">Build these to close your skill gap</p>
      </div>

      {recommended_projects.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🚀</div>
          <p className="text-sm text-gray-400">No specific projects recommended — great fit!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recommended_projects.map((proj, i) => (
            <div key={i}
              className={`border-l-4 ${projectColors[i % projectColors.length]} bg-gray-50 rounded-r-xl px-4 py-3.5`}>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">
                    {proj.name && proj.name.trim() ? proj.name : '[Untitled Project]'}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">
                    {proj.reason && proj.reason.trim() ? proj.reason : '[No reason provided]'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
