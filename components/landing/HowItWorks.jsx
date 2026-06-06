const steps = [
  {
    number: '01',
    title: 'Paste the Job Posting',
    desc: 'Copy the job description from any platform — Internshala, LinkedIn, Naukri, company website.',
    icon: '📋',
    color: 'bg-blue-600',
  },
  {
    number: '02',
    title: 'Add Your Profile',
    desc: 'Upload your resume, add your GitHub URL, LinkedIn, and portfolio for a complete analysis.',
    icon: '👤',
    color: 'bg-violet-600',
  },
  {
    number: '03',
    title: 'Get Your Report',
    desc: 'In under 30 seconds, receive your Trust Score, Fit Score, skill gaps, and action recommendation.',
    icon: '📊',
    color: 'bg-green-600',
  },
  {
    number: '04',
    title: 'Take Action',
    desc: 'Follow your personalized roadmap, apply with confidence, or avoid the scam before it wastes your time.',
    icon: '🚀',
    color: 'bg-amber-600',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 bg-green-50 text-green-700 border border-green-100 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            ⚡ Simple 4-step process
          </span>
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            From posting to decision <span className="text-blue-600">in 30 seconds</span>
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            No complex setup. Just paste, analyze, and decide.
          </p>
        </div>

        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-[3.25rem] left-[calc(12.5%-1px)] right-[calc(12.5%-1px)] h-0.5 bg-gradient-to-r from-blue-200 via-violet-200 via-green-200 to-amber-200" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-4">
                {/* Circle */}
                <div className={`relative w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center text-2xl shadow-lg flex-shrink-0 z-10`}>
                  {step.icon}
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                    {i + 1}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
