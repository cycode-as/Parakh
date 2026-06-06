import Anthropic from '@anthropic-ai/sdk';
import { buildPrompt } from '../../../lib/prompt.js';
import { validateSchema } from '../../../lib/schema.js';

export async function POST(request) {
  try {
    // Step 1: Parse request body and validate inputs
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

    // Step 2: Check API key
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey.trim().length === 0) {
      return Response.json(
        { error: 'ANTHROPIC_API_KEY is not configured' },
        { status: 500 }
      );
    }

    // Step 3: Build prompt and call Anthropic SDK
    const prompt = buildPrompt(jobText, resumeText);

    const client = new Anthropic({ apiKey });

    let claudeResponse;
    try {
      claudeResponse = await client.messages.create({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }],
      });
    } catch (err) {
      return Response.json(
        { error: `Claude API call failed: ${err.message}` },
        { status: 500 }
      );
    }

    // Step 4: Extract and JSON.parse the text content
    const textContent = claudeResponse.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('');

    let parsed;
    try {
      parsed = JSON.parse(textContent);
    } catch {
      return Response.json(
        { error: 'Failed to parse Claude response as JSON' },
        { status: 500 }
      );
    }

    // Step 5: Validate all 14 fields
    const validation = validateSchema(parsed);
    if (!validation.valid) {
      return Response.json(
        {
          error: `Invalid response schema from Claude: missing or invalid field '${validation.field}'`,
        },
        { status: 500 }
      );
    }

    // Step 6: Return validated result
    return Response.json(parsed, { status: 200 });
  } catch (err) {
    // Top-level catch-all
    return Response.json(
      { error: `Claude API call failed: ${err.message}` },
      { status: 500 }
    );
  }
}
