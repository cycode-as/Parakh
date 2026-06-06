'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TopNav from '../../../components/dashboard/TopNav';
import { PRESETS } from '../../../lib/presets';

export default function AnalyzePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    jobText: '',
    resumeText: '',
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  function handleChange(e) {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(p => ({ ...p, [e.target.name]: null }));
  }

  function loadPreset(preset) {
    setForm(p => ({ ...p, jobText: preset.jobText, resumeText: preset.resumeText }));
    setErrors({});
    setApiError(null);
  }

  async function handleAnalyze() {
    const newErrors = {};
    if (!form.jobText.trim()) newErrors.jobText = 'Job description is required';
    if (!form.resumeText.trim()) newErrors.resumeText = 'Resume is required';
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setLoading(true);
    setApiError(null);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobText: form.jobText, resumeText: form.resumeText }),
      });
      const data = await res.json();
      if (!res.ok) {
        // Give a friendlier message for quota errors
        const isQuota = res.status === 429 || data.error?.toLowerCase().includes('quota') || data.error?.toLowerCase().includes('exhausted');
        setApiError(
          isQuota
            ? '⏳ API quota reached. All free-tier Gemini models are temporarily exhausted. Please wait a few minutes and try again, or check your quota at https://ai.dev/rate-limit'
            : data.error || 'Analysis failed. Please try again.'
        );
        setLoading(false);
        return;
      }
      // Store result and navigate to results page
      sessionStorage.setItem('analysisResult', JSON.stringify(data));
      router.push('/dashboard/results');
    } catch {
      setApiError('Network error. Please check your connection and try again.');
      setLoading(false);
    }
  }

  return (
    <>
      <TopNav title="Analyze Opportunity" subtitle="Paste a job posting and your profile to get your full report" />
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* Preset buttons */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-card">
            <p className="text-sm font-semibold text-gray-700 mb-3">Try a demo first</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => loadPreset(PRESETS.fake)}
                className="flex-1 flex items-center gap-2 border border-red-200 bg-red-50 text-red-700 text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-red-100 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Try: Fake job (Amazon scam)
              </button>
              <button onClick={() => loadPreset(PRESETS.real)}
                className="flex-1 flex items-center gap-2 border border-green-200 bg-green-50 text-green-700 text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-green-100 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Try: Real job (Google SWE Intern)
              </button>
            </div>
          </div>

          {/* API error */}
          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 leading-relaxed" role="alert">
              <p className="font-semibold mb-0.5">Analysis failed</p>
              <p>{apiError}</p>
            </div>
          )}

          {/* Job Description */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card">
            <label className="block text-sm font-bold text-gray-800 mb-1.5">
              Job Description <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-3">Paste the full job posting from LinkedIn, Internshala, Naukri, etc.</p>
            <textarea
              name="jobText"
              value={form.jobText}
              onChange={handleChange}
              placeholder="Paste the job description here…"
              maxLength={20000}
              disabled={loading}
              className={`w-full rounded-xl border px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-y disabled:bg-gray-50 disabled:text-gray-400
                ${errors.jobText ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
              style={{ minHeight: '200px' }}
            />
            {errors.jobText && <p className="text-xs text-red-600 mt-1" role="alert">{errors.jobText}</p>}
            <p className="text-xs text-gray-400 mt-1 text-right">{form.jobText.length}/20,000</p>
          </div>

          {/* Resume */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card">
            <label className="block text-sm font-bold text-gray-800 mb-1.5">
              Your Resume <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-3">Paste your resume as plain text, or upload a file below.</p>
            <textarea
              name="resumeText"
              value={form.resumeText}
              onChange={handleChange}
              placeholder="Paste your resume content here…"
              maxLength={20000}
              disabled={loading}
              className={`w-full rounded-xl border px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-y disabled:bg-gray-50 disabled:text-gray-400
                ${errors.resumeText ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
              style={{ minHeight: '200px' }}
            />
            {errors.resumeText && <p className="text-xs text-red-600 mt-1" role="alert">{errors.resumeText}</p>}
            <p className="text-xs text-gray-400 mt-1 text-right">{form.resumeText.length}/20,000</p>

            {/* Upload area */}
            <div className="mt-3 border-2 border-dashed border-gray-200 rounded-xl px-6 py-5 text-center hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer">
              <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-sm text-gray-500 font-medium">Drop your resume PDF here, or <span className="text-blue-600">browse</span></p>
              <p className="text-xs text-gray-400 mt-1">PDF, DOCX up to 5MB</p>
            </div>
          </div>

          {/* Optional profile links */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card">
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="text-sm font-bold text-gray-800">Profile Links</h3>
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Optional — improves analysis</span>
            </div>
            <p className="text-xs text-gray-500 mb-4">Adding your GitHub and LinkedIn improves the Career Match analysis significantly.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { name: 'linkedinUrl', label: 'LinkedIn Profile', placeholder: 'https://linkedin.com/in/rahul-sharma', icon: '💼' },
                { name: 'githubUrl',   label: 'GitHub Profile',   placeholder: 'https://github.com/rahul-sharma', icon: '⚡' },
                { name: 'portfolioUrl',label: 'Portfolio / Website', placeholder: 'https://rahulsharma.dev', icon: '🌐' },
              ].map(f => (
                <div key={f.name} className={f.name === 'portfolioUrl' ? 'sm:col-span-2' : ''}>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">{f.icon} {f.label}</label>
                  <input
                    type="url"
                    name={f.name}
                    value={form[f.name]}
                    onChange={handleChange}
                    placeholder={f.placeholder}
                    disabled={loading}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-50"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl text-base hover:bg-blue-700 transition-all shadow-sm hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-3">
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Analyzing your opportunity…
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Analyze Opportunity
              </>
            )}
          </button>
          <p className="text-xs text-center text-gray-400">Analysis takes 10–30 seconds. Powered by Claude AI.</p>
        </div>
      </main>
    </>
  );
}
