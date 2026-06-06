const features = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    color:   'bg-blue-50 text-blue-600',
    border:  'border-blue-100',
    tag:     'Trust Score',
    title:   'Opportunity Verification',
    desc:    'Our AI scans every job posting for red flags — fake recruiter emails, unrealistic salaries, upfront fees, and suspicious contact methods. Get a Trust Score from 0–100 in seconds.',
    points:  ['99+ scam signals detected', 'Email domain verification', 'Company legitimacy check'],
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    color:   'bg-green-50 text-green-600',
    border:  'border-green-100',
    tag:     'Fit Score',
    title:   'Career Match Analysis',
    desc:    'We compare your Resume, GitHub activity, LinkedIn profile, and portfolio against the job requirements to give you a precise Career Fit Score with detailed breakdowns.',
    points:  ['Multi-source profile analysis', 'Skills gap identification', 'Success probability estimate'],
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    color:   'bg-violet-50 text-violet-600',
    border:  'border-violet-100',
    tag:     'Roadmap',
    title:   'Upskilling Roadmap',
    desc:    'Get a personalized week-by-week learning roadmap with project recommendations that close your skill gap and increase your application success probability.',
    points:  ['Week-by-week plan', 'Project recommendations', 'Resource links included'],
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-100 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            ✨ Everything you need
          </span>
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Powerful features for <span className="text-blue-600">smart students</span>
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            Stop guessing. Start knowing. CareerShield AI gives you data-driven insights before you hit apply.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title}
              className={`bg-white rounded-2xl border ${f.border} p-8 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300`}>
              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${f.color}`}>
                {f.icon}
              </div>
              {/* Tag */}
              <span className={`text-xs font-bold uppercase tracking-widest ${f.color.split(' ')[1]}`}>{f.tag}</span>
              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mt-2 mb-3">{f.title}</h3>
              {/* Desc */}
              <p className="text-sm text-gray-500 leading-relaxed mb-5">{f.desc}</p>
              {/* Points */}
              <ul className="space-y-2">
                {f.points.map(p => (
                  <li key={p} className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
