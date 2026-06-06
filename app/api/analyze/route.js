import { buildPrompt } from '../../../lib/prompt.js';
import { validateSchema } from '../../../lib/schema.js';
import { normalizeGeminiResponse } from '../../../lib/normalize.js';

// OpenRouter model fallback list — tried in order on quota/error.
// All are free or very cheap on OpenRouter.
// See full list: https://openrouter.ai/models
const MODELS = [
  'google/gemini-2.0-flash-exp:free',
  'google/gemini-flash-1.5:free',
  'meta-llama/llama-3.3-70b-instruct:free',
  'mistralai/mistral-7b-instruct:free',
];

export async function POST(request) {
  try {
    // ── Step 1: Parse and validate request body ────────────────────────────
    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { jobText, resumeText } = body ?? {};

    if (!jobText || typeof jobText !== 'string' || jobText.trim().length === 0) {
      return Response.json(
        { error: 'jobText is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length === 0) {
      return Response.json(
        { error: 'resumeText is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    // ── Step 2: Check API key ─────────────────────────────────────────────
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey || apiKey.trim().length === 0) {
      return Response.json(
        { error: 'OPENROUTER_API_KEY is not configured' },
        { status: 500 }
      );
    }

    // ── Step 3: Try models in order ───────────────────────────────────────
    const prompt = buildPrompt(jobText, resumeText);
    let rawText = null;
    let lastErr = null;

    for (const model of MODELS) {
      try {
        console.log(`[Parakh] Trying model: ${model}`);

        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://parakh.ai',
            'X-Title': 'Parakh AI',
          },
          body: JSON.stringify({
            model,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.2,
            max_tokens: 2048,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          const errMsg = data?.error?.message ?? data?.error ?? res.statusText;
          const isQuota =
            res.status === 429 ||
            String(errMsg).toLowerCase().includes('quota') ||
            String(errMsg).toLowerCase().includes('rate limit') ||
            String(errMsg).toLowerCase().includes('insufficient');
          const isUnavailable = res.status === 503 || res.status === 404;

          console.warn(`[Parakh] Model ${model} HTTP ${res.status}: ${errMsg}`);
          lastErr = new Error(String(errMsg));

          if (isQuota || isUnavailable) continue; // try next model
          // Other errors (auth, bad request) — stop immediately
          return Response.json({ error: `API error: ${errMsg}` }, { status: res.status });
        }

        rawText = data?.choices?.[0]?.message?.content ?? '';
        if (!rawText.trim()) {
          console.warn(`[Parakh] Model ${model} returned empty content, trying next`);
          lastErr = new Error('Empty response');
          continue;
        }

        console.log(`[Parakh] Success with model: ${model}`);
        break;

      } catch (fetchErr) {
        console.warn(`[Parakh] Model ${model} fetch error: ${fetchErr.message}`);
        lastErr = fetchErr;
        // network errors — try next model
      }
    }

    if (!rawText) {
      const msg = 'All models are currently unavailable or quota-exhausted. Please try again in a few minutes.';
      console.error('[Parakh]', msg, lastErr?.message);
      return Response.json({ error: msg }, { status: 429 });
    }

    // ── Step 4: Strip markdown fences ────────────────────────────────────
    console.log('[Parakh] Raw output:\n', rawText);

    const textContent = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    // ── Step 5: Parse JSON ────────────────────────────────────────────────
    let rawParsed;
    try {
      rawParsed = JSON.parse(textContent);
    } catch {
      console.error('[Parakh] JSON.parse failed. Text received:\n', textContent);
      return Response.json(
        { error: 'Failed to parse AI response as JSON' },
        { status: 500 }
      );
    }

    console.log('[Parakh] Parsed (pre-normalization):', JSON.stringify(rawParsed, null, 2));

    // ── Step 6: Normalize ─────────────────────────────────────────────────
    const normalized = normalizeGeminiResponse(rawParsed);

    console.log('[Parakh] Normalized result:', JSON.stringify(normalized, null, 2));

    // ── Step 7: Validate ──────────────────────────────────────────────────
    const validation = validateSchema(normalized);
    if (!validation.valid) {
      console.error(
        `[Parakh] Schema validation failed AFTER normalization. Field: '${validation.field}'`,
        '\nObject:', JSON.stringify(normalized, null, 2),
      );
      return Response.json(
        {
          error: `Invalid response schema: missing or invalid field '${validation.field}'`,
          _debug_field: validation.field,
        },
        { status: 500 }
      );
    }

    // ── Step 8: Return ────────────────────────────────────────────────────
    return Response.json(normalized, { status: 200 });

  } catch (err) {
    console.error('[Parakh] Unhandled error in /api/analyze:', err);
    return Response.json(
      { error: `Analysis failed: ${err.message}` },
      { status: 500 }
    );
  }
}
