import { GoogleGenAI } from '@google/genai';
import { buildPrompt } from '../../../lib/prompt.js';
import { validateSchema } from '../../../lib/schema.js';
import { normalizeGeminiResponse } from '../../../lib/normalize.js';

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
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim().length === 0) {
      return Response.json(
        { error: 'GEMINI_API_KEY is not configured' },
        { status: 500 }
      );
    }

    // ── Step 3: Build prompt and call Gemini ──────────────────────────────
    const prompt = buildPrompt(jobText, resumeText);
    const ai = new GoogleGenAI({ apiKey });

    // Model fallback list — tried in order if the previous one is quota-exhausted.
    // These are the correct v1beta API model IDs as of 2025.
    // gemini-1.5-flash is a separate free-tier quota from gemini-2.0-flash-lite.
    const MODEL_FALLBACK_ORDER = [
      'gemini-2.0-flash-lite',   // cheapest / highest RPM on free tier
      'gemini-2.0-flash',        // standard free-tier model
      'gemini-1.5-flash',        // separate quota bucket
      'gemini-1.5-flash-8b',     // smallest, highest free-tier limits
    ];

    let geminiResponse;
    let lastErr;

    for (const model of MODEL_FALLBACK_ORDER) {
      try {
        console.log(`[Parakh] Trying model: ${model}`);
        geminiResponse = await ai.models.generateContent({
          model,
          contents: prompt,
          config: { responseMimeType: 'text/plain' },
        });
        console.log(`[Parakh] Success with model: ${model}`);
        break; // got a response — stop trying
      } catch (err) {
        lastErr = err;
        const isQuota =
          err.message?.includes('429') ||
          err.message?.includes('RESOURCE_EXHAUSTED') ||
          err.message?.includes('quota');
        const isNotFound =
          err.message?.includes('404') ||
          err.message?.includes('NOT_FOUND') ||
          err.message?.includes('not found');

        console.warn(
          `[Parakh] Model ${model} failed (${isQuota ? 'quota' : isNotFound ? 'not-found' : 'error'}): ${err.message?.slice(0, 150)}`
        );

        if (!isQuota && !isNotFound) {
          // Non-recoverable error (auth failure, bad request, etc.)
          return Response.json(
            { error: `Gemini API call failed: ${err.message}` },
            { status: 500 }
          );
        }
        // quota or not-found → try next model
      }
    }

    if (!geminiResponse) {
      const quotaMsg =
        'All Gemini models are quota-exhausted or unavailable. Please wait a few minutes and try again, or check your quota at https://ai.dev/rate-limit';
      console.error('[Parakh]', quotaMsg, lastErr?.message);
      return Response.json(
        { error: quotaMsg },
        { status: 429 }
      );
    }

    // ── Step 4: Extract raw text ──────────────────────────────────────────
    const rawText = geminiResponse.text ?? '';

    // Log raw output so developers can inspect exactly what Gemini returned
    console.log('[Parakh] Raw Gemini output:\n', rawText);

    // Strip markdown code fences that Gemini sometimes adds despite instructions
    const textContent = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    // ── Step 5: Parse JSON ────────────────────────────────────────────────
    let rawParsed;
    try {
      rawParsed = JSON.parse(textContent);
    } catch (parseErr) {
      console.error('[Parakh] JSON.parse failed. Text received:\n', textContent);
      return Response.json(
        { error: 'Failed to parse Gemini response as JSON' },
        { status: 500 }
      );
    }

    console.log('[Parakh] Parsed (pre-normalization):', JSON.stringify(rawParsed, null, 2));

    // ── Step 6: Normalize ─────────────────────────────────────────────────
    // Handles camelCase → snake_case, missing fields, wrong enum values,
    // and numeric success_probability. Never throws.
    const normalized = normalizeGeminiResponse(rawParsed);

    console.log('[Parakh] Normalized result:', JSON.stringify(normalized, null, 2));

    // ── Step 7: Validate the normalized result ────────────────────────────
    // After normalization this should always pass. If it doesn't, log the
    // exact failing field and return a 500 without crashing the process.
    const validation = validateSchema(normalized);
    if (!validation.valid) {
      console.error(
        `[Parakh] Schema validation failed AFTER normalization. Field: '${validation.field}'`,
        '\nNormalized object:', JSON.stringify(normalized, null, 2),
      );
      return Response.json(
        {
          error: `Invalid response schema from Gemini: missing or invalid field '${validation.field}'`,
          _debug_field: validation.field,
        },
        { status: 500 }
      );
    }

    // ── Step 8: Return validated result ──────────────────────────────────
    return Response.json(normalized, { status: 200 });

  } catch (err) {
    // Top-level catch-all — never let an unhandled exception crash the route
    console.error('[Parakh] Unhandled error in /api/analyze:', err);
    return Response.json(
      { error: `Analysis failed: ${err.message}` },
      { status: 500 }
    );
  }
}
