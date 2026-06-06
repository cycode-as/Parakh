import TopNav from '../../../components/dashboard/TopNav';

export default function ProfilePage() {
  return (
    <>
      <TopNav title="My Profile" subtitle="Manage your profile and preferences" />
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-5">

          {/* Avatar card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-blue-500 flex items-center justify-center text-white text-3xl font-extrabold flex-shrink-0">R</div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Rahul Sharma</h2>
              <p className="text-sm text-gray-500">rahul@vit.ac.in</p>
              <p className="text-sm text-gray-500 mt-0.5">B.Tech CSE · VIT Bhopal · 3rd Year</p>
              <button className="mt-2 text-xs bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg font-semibold hover:bg-blue-100 transition-colors">
                Edit Profile
              </button>
            </div>
          </div>

          {/* Profile fields */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card space-y-4">
            <h3 className="font-bold text-gray-800">Personal Information</h3>
            {[
              { label: 'Full Name', value: 'Rahul Sharma' },
              { label: 'Email', value: 'rahul@vit.ac.in' },
              { label: 'College', value: 'VIT Bhopal' },
              { label: 'Branch', value: 'Computer Science Engineering' },
              { label: 'Year', value: '3rd Year (2024–25)' },
              { label: 'CGPA', value: '8.4 / 10' },
            ].map(f => (
              <div key={f.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm font-medium text-gray-600">{f.label}</span>
                <span className="text-sm text-gray-800">{f.value}</span>
              </div>
            ))}
          </div>

          {/* Profile links */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card space-y-4">
            <h3 className="font-bold text-gray-800">Profile Links</h3>
            {[
              { label: '💼 LinkedIn', value: 'linkedin.com/in/rahul-sharma' },
              { label: '⚡ GitHub',   value: 'github.com/rahul-sharma' },
              { label: '🌐 Portfolio', value: 'rahulsharma.dev' },
            ].map(f => (
              <div key={f.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm font-medium text-gray-600">{f.label}</span>
                <span className="text-sm text-blue-600">{f.value || '—'}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
