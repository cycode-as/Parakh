'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import TopNav from '../../../components/dashboard/TopNav';
import TrustScoreCard from '../../../components/results/TrustScoreCard';
import CareerMatchCard from '../../../components/results/CareerMatchCard';
import SkillGapCard from '../../../components/results/SkillGapCard';
import RecommendedProjectsCard from '../../../components/results/RecommendedProjectsCard';
import LearningRoadmapCard from '../../../components/results/LearningRoadmapCard';
import RecommendationCard from '../../../components/results/RecommendationCard';
import { SkeletonCard } from '../../../components/ui/Skeleton';

// Mock data for demo when no real API result is available
const MOCK_RESULT = {
  trust_score: 96,
  risk_level: 'low',
  red_flags: [],
  positive_signals: [
    'Uses official company domain (google.com)',
    'Listed on careers.google.com',
    'Realistic salary for the role and location',
    'Provides specific technical requirements',
  ],
  fit_score: 62,
  fit_summary: 'You have strong frontend skills but lack backend and data structures depth required for Google SWE.',
  student_skills: ['React.js', 'Java', 'HTML', 'CSS', 'Git'],
  required_skills: ['Data Structures & Algorithms', 'C++ or Python', 'SQL', 'REST APIs', 'System Design', 'Java'],
  missing_skills: ['Data Structures & Algorithms', 'SQL', 'REST APIs', 'System Design'],
  recommended_projects: [
    { name: 'LeetCode Daily Tracker', reason: 'Builds DSA habit and prepares you for Google\'s coding round.' },
    { name: 'REST API with Authentication', reason: 'Demonstrates backend skills and REST API proficiency.' },
    { name: 'Mini SQL Analytics Dashboard', reason: 'Covers SQL and data skills required for the role.' },
  ],
  recommendation: 'upskill',
  success_probability: 'moderate',
  prep_time: '6 weeks',
  reasoning: 'You have solid fundamentals in Java and web technologies, but Google SWE roles require strong DSA, system design, and SQL proficiency. With 6 weeks of focused preparation using the roadmap below, your success probability rises to high.',
};

export default function ResultsPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to load real result from sessionStorage, fall back to mock
    try {
      const stored = sessionStorage.getItem('analysisResult');
      if (stored) {
        setResult(JSON.parse(stored));
      } else {
        setResult(MOCK_RESULT);
      }
    } catch {
      setResult(MOCK_RESULT);
    }
    // Simulate brief loading for smooth UX
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <TopNav title="Analysis Report" subtitle="Your full opportunity breakdown" />
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-5">

          {/* Breadcrumb & actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Link href="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
              <span>/</span>
              <Link href="/dashboard/analyze" className="hover:text-blue-600 transition-colors">Analyze</Link>
              <span>/</span>
              <span className="text-gray-800 font-medium">Results</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-xl transition-colors bg-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>
              <Link href="/dashboard/analyze"
                className="flex items-center gap-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-xl transition-colors font-semibold">
                + New Analysis
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : result ? (
            <>
              {/* Summary banner */}
              <SummaryBanner result={result} />

              {/* Trust & Career Match — side by side on large screens */}
              <div className="grid lg:grid-cols-2 gap-5">
                <TrustScoreCard
                  trust_score={result.trust_score}
                  risk_level={result.risk_level}
                  red_flags={result.red_flags}
                  positive_signals={result.positive_signals}
                />
                <CareerMatchCard
                  fit_score={result.fit_score}
                  fit_summary={result.fit_summary}
                />
              </div>

              {/* Skill Gap */}
              <SkillGapCard
                student_skills={result.student_skills}
                required_skills={result.required_skills}
                missing_skills={result.missing_skills}
              />

              {/* Recommended Projects + Roadmap */}
              <div className="grid lg:grid-cols-2 gap-5">
                <RecommendedProjectsCard recommended_projects={result.recommended_projects} />
                <LearningRoadmapCard
                  missing_skills={result.missing_skills}
                  prep_time={result.prep_time}
                  recommended_projects={result.recommended_projects}
                />
              </div>

              {/* Final Recommendation */}
              <RecommendationCard
                recommendation={result.recommendation}
                success_probability={result.success_probability}
                prep_time={result.prep_time}
                reasoning={result.reasoning}
              />
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400">No results found. <Link href="/dashboard/analyze" className="text-blue-600 hover:underline">Run an analysis</Link></p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function SummaryBanner({ result }) {
  const recColors = {
    apply:   { bg: 'bg-green-600', badge: 'bg-green-100 text-green-800' },
    upskill: { bg: 'bg-amber-500', badge: 'bg-amber-100 text-amber-800' },
    avoid:   { bg: 'bg-red-600',   badge: 'bg-red-100 text-red-800' },
  };
  const c = recColors[result.recommendation] || recColors.upskill;
  const scoreColor = s => s >= 70 ? 'text-green-300' : s >= 40 ? 'text-amber-300' : 'text-red-300';

  return (
    <div className={`${c.bg} rounded-2xl p-6 text-white`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium opacity-80 mb-1">Analysis Complete</p>
          <h2 className="text-2xl font-extrabold">
            {result.recommendation === 'apply' && '🚀 You should apply!'}
            {result.recommendation === 'upskill' && '⚡ Upskill, then apply'}
            {result.recommendation === 'avoid' && '🚨 Avoid this opportunity'}
          </h2>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className={`text-3xl font-extrabold ${scoreColor(result.trust_score)}`}>{result.trust_score}</p>
            <p className="text-xs opacity-70 mt-0.5">Trust Score</p>
          </div>
          <div className="w-px h-10 bg-white/20" />
          <div className="text-center">
            <p className={`text-3xl font-extrabold ${scoreColor(result.fit_score)}`}>{result.fit_score}</p>
            <p className="text-xs opacity-70 mt-0.5">Fit Score</p>
          </div>
          <div className="w-px h-10 bg-white/20" />
          <div className="text-center">
            <p className="text-xl font-extrabold capitalize">{result.success_probability}</p>
            <p className="text-xs opacity-70 mt-0.5">Success Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
}
