/**
 * @jest-environment node
 *
 * Feature: careershield-ai, Property 5: API route returns 400 for any malformed request body
 *
 * Validates: Requirements 3.6
 *
 * Property 5: API route returns 400 for any malformed request body
 *
 * The 400 validation fires BEFORE the Anthropic API call, so no SDK mocking
 * is needed. We test the following malformed body shapes:
 *   - missing `jobText` entirely
 *   - missing `resumeText` entirely
 *   - `jobText` is a non-string (number, null, boolean, array, object)
 *   - `resumeText` is a non-string (number, null, boolean, array, object)
 *   - both fields missing ({})
 *
 * Node 18+ provides Request, Response, Headers, and Response.json() as globals.
 * Using @jest-environment node ensures these native globals are available.
 */

import '@anthropic-ai/sdk/shims/node'
import * as fc from 'fast-check'
import { POST } from '../app/api/analyze/route.js'

// ── Helper ────────────────────────────────────────────────────────────────────

function makeRequest(body) {
  return new Request('http://localhost/api/analyze', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

async function assertIs400(body) {
  const response = await POST(makeRequest(body))
  expect(response.status).toBe(400)
  const json = await response.json()
  expect(typeof json.error).toBe('string')
  expect(json.error.length).toBeGreaterThan(0)
}

// ── Arbitraries ───────────────────────────────────────────────────────────────

/** Any non-string, non-undefined value for a field */
const nonStringArb = fc.oneof(
  fc.integer(),
  fc.float(),
  fc.boolean(),
  fc.constant(null),
  fc.array(fc.string()),
  fc.record({ x: fc.string() }),
)

/** A non-empty string (valid value) */
const validStringArb = fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0)

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('POST /api/analyze — Property 5: returns 400 for malformed request bodies', () => {
  // 1. Both fields missing
  test('returns 400 when both jobText and resumeText are missing ({})', async () => {
    await assertIs400({})
  })

  // 2. jobText missing (resumeText present and valid)
  test('property: returns 400 when jobText is missing', async () => {
    await fc.assert(
      fc.asyncProperty(validStringArb, async (resumeText) => {
        await assertIs400({ resumeText })
      }),
      { numRuns: 100 },
    )
  })

  // 3. resumeText missing (jobText present and valid)
  test('property: returns 400 when resumeText is missing', async () => {
    await fc.assert(
      fc.asyncProperty(validStringArb, async (jobText) => {
        await assertIs400({ jobText })
      }),
      { numRuns: 100 },
    )
  })

  // 4. jobText is a non-string type
  test('property: returns 400 when jobText is a non-string type', async () => {
    await fc.assert(
      fc.asyncProperty(nonStringArb, validStringArb, async (badJobText, resumeText) => {
        await assertIs400({ jobText: badJobText, resumeText })
      }),
      { numRuns: 100 },
    )
  })

  // 5. resumeText is a non-string type
  test('property: returns 400 when resumeText is a non-string type', async () => {
    await fc.assert(
      fc.asyncProperty(validStringArb, nonStringArb, async (jobText, badResumeText) => {
        await assertIs400({ jobText, resumeText: badResumeText })
      }),
      { numRuns: 100 },
    )
  })

  // 6. jobText is explicitly null
  test('returns 400 when jobText is null', async () => {
    await assertIs400({ jobText: null, resumeText: 'Some resume text' })
  })

  // 7. resumeText is explicitly null
  test('returns 400 when resumeText is null', async () => {
    await assertIs400({ jobText: 'Some job text', resumeText: null })
  })

  // 8. jobText is a number
  test('returns 400 when jobText is a number', async () => {
    await assertIs400({ jobText: 42, resumeText: 'Some resume text' })
  })

  // 9. jobText is a boolean
  test('returns 400 when jobText is a boolean', async () => {
    await assertIs400({ jobText: true, resumeText: 'Some resume text' })
  })

  // 10. jobText is an array
  test('returns 400 when jobText is an array', async () => {
    await assertIs400({ jobText: ['job', 'text'], resumeText: 'Some resume text' })
  })

  // 11. jobText is an object
  test('returns 400 when jobText is a plain object', async () => {
    await assertIs400({ jobText: { text: 'job' }, resumeText: 'Some resume text' })
  })

  // 12. resumeText is a number
  test('returns 400 when resumeText is a number', async () => {
    await assertIs400({ jobText: 'Some job text', resumeText: 99 })
  })

  // 13. resumeText is a boolean
  test('returns 400 when resumeText is a boolean', async () => {
    await assertIs400({ jobText: 'Some job text', resumeText: false })
  })

  // 14. resumeText is an array
  test('returns 400 when resumeText is an array', async () => {
    await assertIs400({ jobText: 'Some job text', resumeText: ['resume'] })
  })

  // 15. resumeText is an object
  test('returns 400 when resumeText is a plain object', async () => {
    await assertIs400({ jobText: 'Some job text', resumeText: { text: 'resume' } })
  })
})
