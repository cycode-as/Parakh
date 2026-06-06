import TopNav from '../../components/dashboard/TopNav';
import Link from 'next/link';

const stats = [
  {
    label: 'Opportunities Analyzed',
    value: '47',
    change: '+12 this week',
    icon: '📊',
    color: 'bg-blue-50',
    iconColor: 'text-blue-600',
    trend: 'up',
  },
  {
    label: 'Average Match Score',
    value: '68%',
    change: '+4% improvement',
    icon: '🎯',
    color: 'bg-green-50',
    iconColor: 'text-green-600',
    trend: 'up',
  },
  {
    label: 'Scam Alerts Prevented',
    value: '9',
    change: '₹8,900 saved',
    icon: '🛡️',
    color: 'bg-red-50',
    iconColor: 'text-red-500',
    trend: 'neutral',
  },
  {
    label: 'Skills Improved',
    value: '14',
    change: '+3 this month',
    icon: '⚡',
    color: 'bg-violet-50',
    iconColor: 'text-violet-600',
    trend: 'up',
  },
];

const recentAnalyses = [
  { company: 'Google', role: 'SWE Intern', trustScore: 96, fitScore: 68, recommendation: 'upskill', date: '2 hours ago' },
  { company: 'Amazon (Fake)', role: 'WFH Intern', trustScore: 18, fitScore: 42, recommendation: 'avoid', date: '1 day ago' },
  { company: 'Razorpay', role: 'Backend Engineer', trustScore: 91, fitScore: 74, recommendation: 'apply', date: '2 days ago' },
  { company: 'Internshala', role: 'ML Intern', trustScore: 85, fitScore: 55, recommendation: 'upskill', date: '3 days ago' },
];

const recColors = { apply: 'bg-green-50 text-green-700 border-green-200', upskill: 'bg-amber-50 text-amber-700 border-amber-200', avoid: 'bg-red-50 text-red-700 border-red-200' };
const scoreColor = s => s >= 70 ? 'text-green-600' : s >= 40 ? 'text-amber-600' : 'text-red-600';

export default function DashboardPage() {
  return (
    <>
      <TopNav title="Dashboard" subtitle="Welcome back, Rahul 👋" />
      <main className="flex-1 p-6 space-y-6 overflow-y-auto">

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 flex items-center justify-between">
          <div className="text-white">
            <h2 className="text-lg font-bold mb-1">Ready to analyze your next opportunity?</h2>
            <p className="text-blue-100 text-sm">Paste a job description and get your Trust + Fit Score in 30 seconds.</p>
          </div>
          <Link href="/dashboard/analyze"
            className="flex-shrink-0 bg-white text-blue-600 font-bold text-sm px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow">
            Analyze Now →
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-card hover:shadow-card-hover transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center text-xl`}>{s.icon}</div>
                {s.trend === 'up' && (
                  <span className="text-xs text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    Up
                  </span>
                )}
              </div>
              <p className="text-2xl font-extrabold text-gray-900 mb-0.5">{s.value}</p>
              <p className="text-xs text-gray-500 font-medium">{s.label}</p>
              <p className="text-xs text-gray-400 mt-1">{s.change}</p>
            </div>
          ))}
        </div>

        {/* Recent Analyses */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-gray-800">Recent Analyses</h3>
            <Link href="/dashboard/reports" className="text-sm text-blue-600 font-medium hover:text-blue-700">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentAnalyses.map((item, i) => (
              <div key={i} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                {/* Company avatar */}
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">
                  {item.company.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-800 truncate">{item.role}</p>
                  <p className="text-xs text-gray-500">{item.company}</p>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-center">
                    <p className={`text-sm font-bold ${scoreColor(item.trustScore)}`}>{item.trustScore}</p>
                    <p className="text-xs text-gray-400">Trust</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-sm font-bold ${scoreColor(item.fitScore)}`}>{item.fitScore}</p>
                    <p className="text-xs text-gray-400">Fit</p>
                  </div>
                  <span className={`border text-xs font-semibold px-2.5 py-1 rounded-full uppercase ${recColors[item.recommendation]}`}>
                    {item.recommendation}
                  </span>
                  <p className="text-xs text-gray-400 w-20 text-right">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Skills */}
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card">
            <h3 className="font-bold text-gray-800 mb-4">Top Missing Skills</h3>
            <div className="space-y-3">
              {[
                { skill: 'System Design', count: 8 },
                { skill: 'SQL / Databases', count: 6 },
                { skill: 'REST APIs', count: 5 },
                { skill: 'Data Structures', count: 4 },
              ].map(s => (
                <div key={s.skill} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-36">{s.skill}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-red-400 rounded-full" style={{ width: `${(s.count / 10) * 100}%` }} />
                  </div>
                  <span className="text-xs text-gray-500 w-16 text-right">Missing in {s.count} jobs</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card">
            <h3 className="font-bold text-gray-800 mb-4">Your Strong Skills</h3>
            <div className="flex flex-wrap gap-2">
              {['React.js', 'Java', 'HTML/CSS', 'Git', 'JavaScript'].map(s => (
                <span key={s} className="bg-green-50 text-green-700 border border-green-200 text-sm px-3 py-1.5 rounded-xl font-medium">
                  ✓ {s}
                </span>
              ))}
              <span className="bg-amber-50 text-amber-700 border border-amber-200 text-sm px-3 py-1.5 rounded-xl font-medium">⚡ Learning SQL</span>
              <span className="bg-amber-50 text-amber-700 border border-amber-200 text-sm px-3 py-1.5 rounded-xl font-medium">⚡ Learning DSA</span>
            </div>
          </div>
        </div>

      </main>
    </>
  );
}
