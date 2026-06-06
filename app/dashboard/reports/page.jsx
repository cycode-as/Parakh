import TopNav from '../../../components/dashboard/TopNav';
import Link from 'next/link';

const reports = [
  { id: 1, company: 'Google', role: 'SWE Intern', trustScore: 96, fitScore: 62, recommendation: 'upskill', date: 'Jun 6, 2026',  tags: ['Real', 'Backend', 'Internship'] },
  { id: 2, company: 'Amazon (Fake)', role: 'WFH Intern', trustScore: 18, fitScore: 42, recommendation: 'avoid', date: 'Jun 5, 2026',  tags: ['Scam', 'Remote'] },
  { id: 3, company: 'Razorpay', role: 'Backend Engineer', trustScore: 91, fitScore: 74, recommendation: 'apply', date: 'Jun 4, 2026', tags: ['Real', 'Backend', 'Full-time'] },
  { id: 4, company: 'Internshala ML', role: 'ML Intern', trustScore: 85, fitScore: 55, recommendation: 'upskill', date: 'Jun 3, 2026', tags: ['Real', 'ML', 'Internship'] },
  { id: 5, company: 'Wipro', role: 'Software Engineer', trustScore: 78, fitScore: 68, recommendation: 'apply', date: 'Jun 1, 2026', tags: ['Real', 'Full-time'] },
];

const recColors = {
  apply:   'bg-green-50 text-green-700 border-green-200',
  upskill: 'bg-amber-50 text-amber-700 border-amber-200',
  avoid:   'bg-red-50 text-red-700 border-red-200',
};
const scoreColor = s => s >= 70 ? 'text-green-600' : s >= 40 ? 'text-amber-600' : 'text-red-600';

export default function ReportsPage() {
  return (
    <>
      <TopNav title="Reports" subtitle="All your past analyses" />
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-4">

          {/* Header row */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{reports.length} analyses total</p>
            <Link href="/dashboard/analyze"
              className="text-sm bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
              + New Analysis
            </Link>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
            <div className="divide-y divide-gray-50">
              {reports.map(r => (
                <div key={r.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center flex-shrink-0">
                    {r.company.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">{r.role}</p>
                    <p className="text-xs text-gray-500">{r.company}</p>
                    <div className="flex gap-1.5 mt-1 flex-wrap">
                      {r.tags.map(t => (
                        <span key={t} className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0 text-center">
                    <div>
                      <p className={`text-sm font-bold ${scoreColor(r.trustScore)}`}>{r.trustScore}</p>
                      <p className="text-xs text-gray-400">Trust</p>
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${scoreColor(r.fitScore)}`}>{r.fitScore}</p>
                      <p className="text-xs text-gray-400">Fit</p>
                    </div>
                    <span className={`border text-xs font-semibold px-2.5 py-1 rounded-full uppercase ${recColors[r.recommendation]}`}>
                      {r.recommendation}
                    </span>
                    <p className="text-xs text-gray-400 w-24 text-right">{r.date}</p>
                    <Link href="/dashboard/results" className="text-xs text-blue-600 hover:text-blue-700 font-semibold">
                      View →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
