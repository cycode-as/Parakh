import Link from 'next/link';

export default function Hero() {
  return (
    <section className="pt-32 pb-20 bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left — Text */}
          <div className="animate-slide-up">
            {/* Trust badge */}
            

            <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-6">
              Find Opportunities<br />
              <span className="text-blue-600">You Can Trust.</span><br />
              Know Whether<br />
              <span className="text-gray-500">You're Ready.</span>
            </h1>

            <p className="text-xl text-gray-500 leading-relaxed mb-8 max-w-lg">
              Analyze internships, jobs, and opportunities using your Resume, GitHub, LinkedIn, and Portfolio. Get your Trust Score in seconds.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/dashboard/analyze"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-sm hover:shadow-lg text-base">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Analyze Opportunity
              </Link>
              <Link href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all text-base">
                Go to Dashboard
              </Link>
            </div>

          </div>

          {/* Right — Illustration Card */}
          <div className="hidden lg:block relative animate-fade-in">
            <HeroIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroIllustration() {
  return (
    <div className="relative">
      {/* Floating background blobs */}
      <div className="absolute -top-10 -right-10 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-60" />
      <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-indigo-100 rounded-full blur-3xl opacity-60" />

      {/* Main card */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800 text-base">Opportunity Analysis</h3>
          <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full font-semibold">Live</span>
        </div>

        {/* Trust score ring */}
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="10" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#16a34a" strokeWidth="10"
                strokeDasharray="251.2" strokeDashoffset="50" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">82</span>
              <span className="text-xs text-gray-500">Trust</span>
            </div>
          </div>
          <div className="space-y-2 flex-1">
            <ScoreRow label="Fit Score" value={74} color="bg-blue-500" />
            <ScoreRow label="Resume" value={80} color="bg-violet-500" />
            <ScoreRow label="GitHub" value={65} color="bg-amber-500" />
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <span className="bg-green-50 text-green-700 border border-green-200 text-xs px-2.5 py-1 rounded-full font-medium">✓ Legitimate posting</span>
          <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs px-2.5 py-1 rounded-full font-medium">⚡ Upskill first</span>
          <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs px-2.5 py-1 rounded-full font-medium">2 weeks prep</span>
        </div>

        {/* Skill gap */}
        <div>
          <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Missing Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {['SQL', 'System Design', 'REST APIs'].map(s => (
              <span key={s} className="bg-red-50 text-red-600 border border-red-200 text-xs px-2 py-0.5 rounded-md font-medium">{s}</span>
            ))}
          </div>
        </div>

        {/* Recommended action */}
        <div className="bg-blue-600 text-white rounded-xl px-4 py-3 flex items-center justify-between">
          <span className="text-sm font-semibold">Recommendation</span>
          <span className="bg-white text-blue-600 text-xs font-bold px-3 py-1 rounded-lg">UPSKILL →</span>
        </div>
      </div>

      {/* Floating mini-cards */}
      <div className="absolute -top-4 -right-8 bg-white rounded-xl shadow-lg border border-gray-100 p-3 flex items-center gap-2">
        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-bold text-gray-800">Scam Detected</p>
          <p className="text-xs text-gray-500">Fake Amazon job</p>
        </div>
      </div>

      <div className="absolute -bottom-4 -left-6 bg-white rounded-xl shadow-lg border border-gray-100 p-3 flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-bold text-gray-800">+48% Match</p>
          <p className="text-xs text-gray-500">After upskilling</p>
        </div>
      </div>
    </div>
  );
}

function ScoreRow({ label, value, color }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 w-14 flex-shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs font-semibold text-gray-700 w-7 text-right">{value}</span>
    </div>
  );
}
