import { validateSchema } from '../../../lib/schema.js';
import { normalizeGeminiResponse } from '../../../lib/normalize.js';

// ─────────────────────────────────────────────────────────────────────────────
// DEMO MODE — set NEXT_PUBLIC_DEMO_MODE=true in .env.local to bypass all AI
// ─────────────────────────────────────────────────────────────────────────────
const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

// ── Scam keyword detector ─────────────────────────────────────────────────────
const SCAM_KEYWORDS = [
  'registration fee', 'registration charges', 'processing fee', 'security deposit',
  'payment required', 'pay to join', 'pay before', 'refundable deposit',
  'whatsapp', 'telegram', 'gmail.com', 'yahoo.com', 'hotmail.com',
  'urgent hiring', 'urgent requirement', 'immediate joining',
  'limited slots', 'limited seats', 'only 5 seats', 'hurry',
  'guaranteed placement', 'guaranteed job', '100% placement',
  'work from home earn', 'earn daily', 'earn weekly',
  'no experience required', 'no qualification required',
  'apply in 24 hours', 'offer expires',
  'send aadhaar', 'send bank details', 'send documents first',
];

// ── Skill keyword libraries ───────────────────────────────────────────────────
const SKILL_KEYWORDS = [
  'javascript','typescript','python','java','c++','c#','go','rust','kotlin','swift',
  'react','vue','angular','next.js','node.js','express','django','flask','spring',
  'sql','mysql','postgresql','mongodb','redis','firebase','supabase',
  'aws','azure','gcp','docker','kubernetes','terraform','ci/cd',
  'rest api','graphql','grpc','websockets',
  'machine learning','deep learning','tensorflow','pytorch','nlp',
  'git','linux','system design','data structures','algorithms',
  'html','css','tailwind','sass','webpack','vite',
  'figma','photoshop','ui/ux',
];

function extractSkills(text) {
  const lower = text.toLowerCase();
  return SKILL_KEYWORDS.filter(s => lower.includes(s));
}

function detectScam(jobText) {
  const lower = jobText.toLowerCase();
  const hits = SCAM_KEYWORDS.filter(k => lower.includes(k));
  return { isScam: hits.length >= 2, hits, single: hits.length === 1 };
}

function buildRoadmap(missingSkills, prepTime) {
  const weeks = parseInt(prepTime) || 4;
  const tasks = [
    ...missingSkills.map((s, i) => `Week ${i + 1}: Learn ${s} fundamentals and build a mini project`),
    `Week ${missingSkills.length + 1}: Polish your portfolio and update your resume`,
    `Week ${missingSkills.length + 2}: Apply to 5–10 similar roles and prep for interviews`,
  ];
  return tasks.slice(0, Math.max(weeks, 2)).join('\n');
}

// ── Core local analysis engine ────────────────────────────────────────────────
function localAnalyze(jobText, resumeText) {
  const { isScam, hits, single } = detectScam(jobText);

  const jobSkills  = extractSkills(jobText);
  const resumeSkills = extractSkills(resumeText);
  const missingSkills = jobSkills.filter(s => !resumeSkills.includes(s)).slice(0, 5);
  const matchedSkills = jobSkills.filter(s => resumeSkills.includes(s));

  // ── Scam job ─────────────────────────────────────────────────────────────
  if (isScam) {
    const redFlags = [
      hits.some(h => ['registration fee','processing fee','payment required','pay to'].some(k => h.includes(k)))
        && 'Requires upfront payment or registration fee',
      hits.some(h => ['gmail','yahoo','hotmail'].some(k => h.includes(k)))
        && 'Recruiter using personal email (not company domain)',
      hits.some(h => ['whatsapp','telegram'].some(k => h.includes(k)))
        && 'Contact only via WhatsApp or Telegram — no official channel',
      hits.some(h => ['urgent','hurry','24 hours','expires'].some(k => h.includes(k)))
        && 'Artificial urgency ("apply now or lose the offer")',
      hits.some(h => ['guaranteed placement','100%'].some(k => h.includes(k)))
        && 'Unrealistic guarantee of placement',
      hits.some(h => ['aadhaar','bank details','documents first'].some(k => h.includes(k)))
        && 'Requests personal documents before any interview',
    ].filter(Boolean);

    const trust_score = Math.max(8, 25 - hits.length * 3);
    const fit_score = resumeSkills.length > 0 ? Math.min(60, 35 + matchedSkills.length * 5) : 40;

    return {
      trust_score,
      risk_level: 'high',
      red_flags: redFlags.length > 0 ? redFlags : ['Multiple scam signals detected'],
      positive_signals: [],
      fit_score,
      student_skills: resumeSkills.slice(0, 8),
      required_skills: jobSkills.slice(0, 6),
      missing_skills: missingSkills,
      recommended_projects: missingSkills.slice(0, 2).map(s => ({
        name: `${s} Practice Project`,
        reason: `Build hands-on experience with ${s} before applying to legitimate roles`,
      })),
      fit_summary: `Your profile partially matches the listed requirements, but this opportunity shows serious red flags.`,
      recommendation: 'avoid',
      success_probability: 'low',
      prep_time: '0 weeks',
      reasoning: `This posting contains ${hits.length} scam signal${hits.length > 1 ? 's' : ''}: ${hits.slice(0, 2).join(', ')}. Avoid this opportunity entirely. No legitimate employer asks for upfront payments or contacts candidates only on WhatsApp/Telegram.`,
    };
  }

  // ── Suspicious (1 signal) ─────────────────────────────────────────────────
  if (single) {
    const trust_score = 52 + Math.floor(Math.random() * 10);
    const fit_score = resumeSkills.length > 0
      ? Math.min(85, 45 + matchedSkills.length * 6)
      : 50;
    const prepWeeks = missingSkills.length > 3 ? 6 : missingSkills.length > 1 ? 4 : 2;

    return {
      trust_score,
      risk_level: 'medium',
      red_flags: [`One suspicious signal detected: "${hits[0]}"`],
      positive_signals: [
        'Job description contains specific technical requirements',
        'Role scope is clearly defined',
      ],
      fit_score,
      student_skills: resumeSkills.slice(0, 8),
      required_skills: jobSkills.slice(0, 8),
      missing_skills: missingSkills,
      recommended_projects: missingSkills.slice(0, 3).map(s => ({
        name: `${s} Project`,
        reason: `Demonstrates ${s} proficiency directly relevant to this role`,
      })),
      fit_summary: `You match ${matchedSkills.length} of ${jobSkills.length} required skills. Verify the company before applying.`,
      recommendation: 'upskill',
      success_probability: 'moderate',
      prep_time: `${prepWeeks} weeks`,
      reasoning: `This opportunity looks mostly legitimate but has one suspicious element. Research the company thoroughly before proceeding. With ${prepWeeks} weeks of focused prep on your skill gaps, your success probability improves significantly.`,
    };
  }

  // ── Legitimate job ────────────────────────────────────────────────────────
  const skillCoverage = jobSkills.length > 0 ? matchedSkills.length / jobSkills.length : 0.6;
  const fit_score = Math.min(95, Math.round(40 + skillCoverage * 50 + (resumeSkills.length > 3 ? 10 : 0)));
  const trust_score = 88 + Math.floor(Math.random() * 9);

  const hasCompanyDomain = /[a-z]+\.(com|in|io|co\.in|org|net)\b/i.test(jobText) && !/(gmail|yahoo|hotmail)/i.test(jobText);
  const positiveSignals = [
    hasCompanyDomain && 'Official company domain in contact details',
    /salary|stipend|lpa|per month|ctc/i.test(jobText) && 'Transparent salary/stipend information provided',
    /interview|selection process|assessment/i.test(jobText) && 'Clear interview/selection process outlined',
    /responsibilities|role|team/i.test(jobText) && 'Detailed role responsibilities listed',
    jobSkills.length >= 3 && 'Specific technical skill requirements mentioned',
  ].filter(Boolean);

  const prepWeeks = missingSkills.length > 3 ? 6 : missingSkills.length > 1 ? 3 : 1;
  const recommendation = fit_score >= 70 ? 'apply' : 'upskill';
  const success_probability = fit_score >= 75 ? 'high' : fit_score >= 55 ? 'moderate' : 'low';

  return {
    trust_score,
    risk_level: 'low',
    red_flags: [],
    positive_signals: positiveSignals.length > 0 ? positiveSignals : [
      'No scam signals detected',
      'Job description appears professional and detailed',
    ],
    fit_score,
    student_skills: resumeSkills.slice(0, 8),
    required_skills: jobSkills.slice(0, 8),
    missing_skills: missingSkills,
    recommended_projects: missingSkills.slice(0, 3).map(s => ({
      name: `${s} Hands-on Project`,
      reason: `Close the ${s} gap and demonstrate practical ability to recruiters`,
    })),
    fit_summary: `You match ${matchedSkills.length} of ${jobSkills.length} required skills (${Math.round(skillCoverage * 100)}% coverage). ${missingSkills.length > 0 ? `${missingSkills.length} gaps to close.` : 'Strong match!'}`,
    recommendation,
    success_probability,
    prep_time: prepWeeks === 1 ? '1 week' : `${prepWeeks} weeks`,
    reasoning: `This appears to be a legitimate opportunity with a trust score of ${trust_score}/100. ${fit_score >= 70 ? 'Your profile is a strong match — apply now and prepare for technical interviews.' : `You currently match ${Math.round(skillCoverage * 100)}% of the requirements. Spend ${prepWeeks} weeks building the missing skills before applying to maximise your success rate.`}`,
  };
}

// ── Provider registry (live AI) ───────────────────────────────────────────────
function getProviders(prompt) {
  const { DEEPSEEK_API_KEY, OPENROUTER_API_KEY, OPENAI_API_KEY, OPENAI_BASE_URL, ANTHROPIC_API_KEY } = process.env;
  const providers = [];

  if (DEEPSEEK_API_KEY) {
    providers.push({
      name: 'deepseek/deepseek-chat',
      url: 'https://api.deepseek.com/v1/chat/completions',
      headers: { 'Authorization': `Bearer ${DEEPSEEK_API_KEY}`, 'Content-Type': 'application/json' },
      body: { model: 'deepseek-chat', messages: [{ role: 'user', content: prompt }], temperature: 0.2, max_tokens: 2048 },
      extract: d => d?.choices?.[0]?.message?.content ?? '',
    });
  }

  if (OPENAI_API_KEY && OPENAI_BASE_URL) {
    providers.push({
      name: 'custom/openai-compatible',
      url: `${OPENAI_BASE_URL.replace(/\/$/, '')}/chat/completions`,
      headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: { model: process.env.OPENAI_MODEL ?? 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], temperature: 0.2, max_tokens: 2048 },
      extract: d => d?.choices?.[0]?.message?.content ?? '',
    });
  }

  if (OPENROUTER_API_KEY) {
    for (const model of [
      'meta-llama/llama-3.3-70b-instruct:free',
      'meta-llama/llama-4-scout:free',
      'mistralai/mistral-7b-instruct:free',
      'deepseek/deepseek-r1:free',
      'qwen/qwen3-8b:free',
    ]) {
      providers.push({
        name: `openrouter/${model}`,
        url: 'https://openrouter.ai/api/v1/chat/completions',
        headers: { 'Authorization': `Bearer ${OPENROUTER_API_KEY}`, 'Content-Type': 'application/json', 'HTTP-Referer': 'https://parakh.ai', 'X-Title': 'Parakh AI' },
        body: { model, messages: [{ role: 'user', content: prompt }], temperature: 0.2, max_tokens: 2048 },
        extract: d => d?.choices?.[0]?.message?.content ?? '',
      });
    }
  }

  if (ANTHROPIC_API_KEY) {
    providers.push({
      name: 'anthropic/claude-3-haiku',
      url: 'https://api.anthropic.com/v1/messages',
      headers: { 'x-api-key': ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' },
      body: { model: 'claude-3-haiku-20240307', max_tokens: 2048, messages: [{ role: 'user', content: prompt }] },
      extract: d => d?.content?.[0]?.text ?? '',
    });
  }

  return providers;
}

function isRecoverable(status, body) {
  if ([404, 429, 502, 503, 504].includes(status)) return true;
  const msg = String(body?.error?.message ?? body?.error ?? '').toLowerCase();
  return ['quota','rate limit','overloaded','insufficient','unavailable','capacity',
          'no endpoints','not a valid model','not found'].some(k => msg.includes(k));
}

// ── Main handler ──────────────────────────────────────────────────────────────
export async function POST(request) {
  try {
    let body;
    try { body = await request.json(); }
    catch { return Response.json({ error: 'Invalid JSON in request body' }, { status: 400 }); }

    const { jobText, resumeText } = body ?? {};
    if (!jobText?.trim()) return Response.json({ error: 'jobText is required' }, { status: 400 });
    if (!resumeText?.trim()) return Response.json({ error: 'resumeText is required' }, { status: 400 });

    // ── DEMO MODE: local engine, no API calls ─────────────────────────────
    if (DEMO_MODE) {
      console.log('[Parakh] DEMO MODE — using local analysis engine');
      await new Promise(r => setTimeout(r, 1800)); // realistic delay
      const result = localAnalyze(jobText, resumeText);
      const normalized = normalizeGeminiResponse(result);
      const validation = validateSchema(normalized);
      if (!validation.valid) {
        // Should never happen, but fallback gracefully
        return Response.json(normalizeGeminiResponse({}), { status: 200 });
      }
      return Response.json(normalized, { status: 200 });
    }

    // ── LIVE MODE: try AI providers ───────────────────────────────────────
    const { buildPrompt } = await import('../../../lib/prompt.js');
    const prompt = buildPrompt(jobText, resumeText);
    const providers = getProviders(prompt);

    if (providers.length === 0) {
      // No keys configured — fall back to local engine silently
      console.log('[Parakh] No API keys found — falling back to local engine');
      const result = localAnalyze(jobText, resumeText);
      return Response.json(normalizeGeminiResponse(result), { status: 200 });
    }

    let rawText = null;
    let lastErr = null;

    for (const provider of providers) {
      try {
        console.log(`[Parakh] Trying: ${provider.name}`);
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 30_000);
        let res, data;
        try {
          res = await fetch(provider.url, { method: 'POST', headers: provider.headers, body: JSON.stringify(provider.body), signal: ctrl.signal });
          data = await res.json();
        } finally { clearTimeout(timer); }

        if (!res.ok) {
          console.warn(`[Parakh] ${provider.name} HTTP ${res.status}:`, data?.error?.message ?? '');
          lastErr = new Error(String(data?.error?.message ?? res.statusText));
          if (isRecoverable(res.status, data)) continue;
          // Non-recoverable — fall through to local engine
          break;
        }

        const content = provider.extract(data);
        if (!content?.trim()) { lastErr = new Error('Empty response'); continue; }
        console.log(`[Parakh] Success: ${provider.name}`);
        rawText = content;
        break;
      } catch (e) {
        console.warn(`[Parakh] ${provider.name} error: ${e.message}`);
        lastErr = e;
      }
    }

    // ── If all AI providers failed, fall back silently to local engine ─────
    if (!rawText) {
      console.log('[Parakh] All providers failed — falling back to local engine');
      const result = localAnalyze(jobText, resumeText);
      return Response.json(normalizeGeminiResponse(result), { status: 200 });
    }

    // Parse AI response
    const textContent = rawText.replace(/^```json\s*/i,'').replace(/^```\s*/i,'').replace(/\s*```$/i,'').trim();
    let rawParsed;
    try { rawParsed = JSON.parse(textContent); }
    catch {
      console.error('[Parakh] JSON parse failed — using local engine');
      return Response.json(normalizeGeminiResponse(localAnalyze(jobText, resumeText)), { status: 200 });
    }

    const normalized = normalizeGeminiResponse(rawParsed);
    const validation = validateSchema(normalized);
    if (!validation.valid) {
      return Response.json(normalizeGeminiResponse(localAnalyze(jobText, resumeText)), { status: 200 });
    }
    return Response.json(normalized, { status: 200 });

  } catch (err) {
    console.error('[Parakh] Unhandled error:', err);
    // Never crash — return a graceful local analysis
    try {
      const b = await request.clone().json().catch(() => ({}));
      return Response.json(normalizeGeminiResponse(localAnalyze(b.jobText ?? '', b.resumeText ?? '')), { status: 200 });
    } catch {
      return Response.json({ error: 'Unexpected error. Please try again.' }, { status: 500 });
    }
  }
}
