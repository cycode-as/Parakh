import TopNav from '../../../components/dashboard/TopNav';

export default function SettingsPage() {
  return (
    <>
      <TopNav title="Settings" subtitle="Manage your account and preferences" />
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-5">

          {/* Notifications */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card space-y-4">
            <h3 className="font-bold text-gray-800">Notifications</h3>
            {[
              { label: 'Email alerts for new analysis', desc: 'Get emailed when your analysis completes' },
              { label: 'Weekly career tips', desc: 'Curated tips to improve your profile' },
              { label: 'Scam alert digest', desc: 'Summary of trending job scams in your area' },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-800">{s.label}</p>
                  <p className="text-xs text-gray-500">{s.desc}</p>
                </div>
                <div className="w-10 h-6 bg-blue-600 rounded-full relative cursor-pointer flex-shrink-0">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
                </div>
              </div>
            ))}
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-2xl border border-red-100 p-6 shadow-card space-y-3">
            <h3 className="font-bold text-red-700">Danger Zone</h3>
            <p className="text-sm text-gray-500">These actions are permanent and cannot be undone.</p>
            <button className="text-sm text-red-600 border border-red-200 bg-red-50 px-4 py-2 rounded-xl hover:bg-red-100 transition-colors font-semibold">
              Delete Account
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
