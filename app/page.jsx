'use client';
import { useState, useRef } from 'react';
import InputForm from '../components/InputForm.jsx';
import LoadingState from '../components/LoadingState.jsx';
import TrustCard from '../components/TrustCard.jsx';
import FitCard from '../components/FitCard.jsx';
import SkillGap from '../components/SkillGap.jsx';
import ActionCard from '../components/ActionCard.jsx';
import { PRESETS } from '../lib/presets.js';

export default function Page() {
  const [jobText, setJobText] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [phase, setPhase] = useState('idle'); // 'idle' | 'loading' | 'result'
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const jobRef = useRef(null);

  function onLoadPreset(presetJobText, presetResumeText) {
    setJobText(presetJobText);
    setResumeText(presetResumeText);
    setError(null);
    jobRef.current?.focus();
  }

  async function handleSubmit() {
    setPhase('loading');
    setError(null);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobText, resumeText }),
      });
      const data = await response.json();
      if (!response.ok) {
        setPhase('idle');
        setError(data.error || 'Analysis failed. Please try again.');
        return;
      }
      setResult(data);
      setPhase('result');
    } catch (err) {
      setPhase('idle');
      setError('Network error. Please check your connection.');
    }
  }

  return (
    <main className="mx-auto max-w-[720px] px-4 py-8 flex flex-col gap-8">
      {/* Header */}
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-gray-900">CareerShield AI</h1>
        <p className="text-base text-gray-500">
          Verify opportunities. Measure readiness. Plan your next move.
        </p>
      </header>

      {/* Error banner */}
      {error && (
        <div
          className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* Demo preset buttons — Task 12.4 */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={() => onLoadPreset(PRESETS.fake.jobText, PRESETS.fake.resumeText)}
          className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
        >
          Try: Fake job (Amazon scam)
        </button>
        <button
          type="button"
          onClick={() => onLoadPreset(PRESETS.real.jobText, PRESETS.real.resumeText)}
          className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
        >
          Try: Real job (Google SWE Intern)
        </button>
      </div>

      {/* InputForm — always visible */}
      <InputForm
        jobText={jobText}
        resumeText={resumeText}
        onJobTextChange={setJobText}
        onResumeTextChange={setResumeText}
        onSubmit={handleSubmit}
        disabled={phase === 'loading'}
        jobRef={jobRef}
      />

      {/* Loading state */}
      <LoadingState active={phase === 'loading'} />

      {/* Report cards — Task 12.3 */}
      {phase === 'result' && result && (
        <div className="flex flex-col gap-6">
          <TrustCard
            trust_score={result.trust_score}
            risk_level={result.risk_level}
            red_flags={result.red_flags}
            positive_signals={result.positive_signals}
          />
          <FitCard
            fit_score={result.fit_score}
            fit_summary={result.fit_summary}
          />
          <SkillGap
            student_skills={result.student_skills}
            required_skills={result.required_skills}
            missing_skills={result.missing_skills}
            recommended_projects={result.recommended_projects}
          />
          <ActionCard
            recommendation={result.recommendation}
            success_probability={result.success_probability}
            prep_time={result.prep_time}
            reasoning={result.reasoning}
          />
        </div>
      )}
    </main>
  );
}
