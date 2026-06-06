# Implementation Plan: CareerShield AI

## Overview

Build a single-page Next.js 14 App Router application that accepts a job description and resume, sends them to the Anthropic Claude API, and renders a four-card structured analysis report. The build follows the PRD order: scaffold → API route → input UI → loading state → four report cards → page wiring → deploy. Property-based tests (fast-check + Jest) are added alongside the code they validate.

---

## Tasks

- [x] 1. Scaffold the Next.js 14 project and configure Tailwind CSS
  - [x] 1.1 Initialize the Next.js 14 App Router project with Tailwind CSS and configure `globals.css` with Tailwind base/components/utilities directives
    - Create `app/globals.css`, `app/layout.jsx`, `tailwind.config.js`, and `postcss.config.js`
    - `app/layout.jsx` imports `globals.css`, sets `<html>` and `<body>` with a neutral background
    - _Requirements: 10.1, 10.4_
  - [x] 1.2 Create the placeholder `app/page.jsx` with the centered 720px-max-width single-column shell and CareerShield AI header + tagline
    - Render header text "CareerShield AI" and tagline "Verify opportunities. Measure readiness. Plan your next move."
    - Page shell: `mx-auto max-w-[720px] px-4` wrapper
    - _Requirements: 10.1, 10.2_
  - [x] 1.3 Add `.env.local` template with `ANTHROPIC_API_KEY=` placeholder and install the `@anthropic-ai/sdk` package
    - _Requirements: 11.1_

- [x] 2. Implement the color utility library and property tests
  - [x] 2.1 Create `lib/colors.js` exporting `getScoreColor`, `getRiskColor`, and `getRecommendationColor` with the exact hex thresholds from the design
    - `getScoreColor`: ≥70 → `#16a34a`, 40–69 → `#d97706`, <40 → `#dc2626`
    - `getRiskColor`: "low" → `#16a34a`, "medium" → `#d97706`, else → `#dc2626`
    - `getRecommendationColor`: "apply" → `#16a34a`, "upskill" → `#d97706`, else → `#dc2626`
    - _Requirements: 5.2–5.4, 6.2–6.4, 8.2, 9.1–9.3_
  - [x] 2.2 Write property test for `getScoreColor` — Property 2: Score color mapping correct for all values 0–100
    - **Property 2: Score color mapping is correct for all values**
    - **Validates: Requirements 5.2–5.4, 6.2–6.4, 9.1–9.3**
    - Use `fc.integer({ min: 0, max: 100 })`; assert correct hex for each tier boundary
    - File: `__tests__/colors.property.test.js`
  - [x] 2.3 Write property test for `getRecommendationColor` — Property 3: Recommendation color mapping exhaustive
    - **Property 3: Recommendation color mapping is exhaustive and correct**
    - **Validates: Requirements 8.2, 9.1–9.3**
    - Use `fc.constantFrom('apply', 'upskill', 'avoid')`; assert each value returns the correct hex
    - File: `__tests__/colors.property.test.js`

- [x] 3. Implement the prompt builder and demo presets
  - [x] 3.1 Create `lib/prompt.js` exporting `buildPrompt(jobText, resumeText)` with the exact prompt template from the design, including all scam-signal hints and the 14-field JSON schema example
    - _Requirements: 3.2_
  - [x] 3.2 Create `lib/presets.js` exporting `PRESETS.fake` and `PRESETS.real` with the exact `jobText` and `resumeText` seed data from the design
    - _Requirements: 2.1–2.5, 12.1–12.3_

- [x] 4. Implement the `/api/analyze` route with schema validation
  - [x] 4.1 Create `app/api/analyze/route.js` as a Next.js 14 App Router POST handler
    - Step 1: Parse request body; return 400 with `{ error: "..." }` if `jobText` or `resumeText` is missing or not a string
    - Step 2: Return 500 if `ANTHROPIC_API_KEY` env var is absent or empty
    - Step 3: Call `buildPrompt` and invoke the Anthropic SDK (`claude-3-5-haiku-20241022`, `max_tokens: 2048`)
    - Step 4: `JSON.parse()` the text content from Claude's response
    - Step 5: Validate all 14 fields (types and enum values per the schema table in the design); return 500 if invalid
    - Step 6: Return 200 with the validated `AnalysisResult` JSON
    - All unhandled exceptions caught in top-level try/catch → 500
    - _Requirements: 3.1–3.6, 11.1, 11.2_
  - [x] 4.2 Extract the 14-field schema validation logic into a standalone exported function `validateSchema(obj)` in `lib/schema.js`
    - Must return `{ valid: true }` or `{ valid: false, field: '<fieldName>' }`
    - _Requirements: 3.3, 3.4_
  - [x] 4.3 Write property test for `validateSchema` — Property 4: Schema validation accepts/rejects correctly
    - **Property 4: Schema validation correctly accepts and rejects AnalysisResult objects**
    - **Validates: Requirements 3.3, 3.4**
    - Generator: build valid 14-field objects; then mutate one field at a time (wrong type, out-of-range, wrong enum)
    - Assert `validateSchema` returns valid for correct objects and invalid for any mutation
    - File: `__tests__/schema.property.test.js`
  - [x] 4.4 Write property test for the API route — Property 5: API route returns 400 for malformed requests
    - **Property 5: API route returns 400 for any malformed request body**
    - **Validates: Requirements 3.6**
    - Use Next.js route handler unit test pattern with mocked `Request`; generate bodies missing `jobText`, missing `resumeText`, or with non-string types
    - Assert all result in HTTP 400 with `{ error: "..." }` body
    - File: `__tests__/analyze-route.property.test.js`

- [x] 5. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement `InputForm.jsx`
  - [x] 6.1 Create `components/InputForm.jsx` with two labeled textareas (job description, resume), both with `min-height: 200px`, `maxLength={20000}`, and visible labels above each textarea
    - Accept props: `jobText`, `resumeText`, `onJobTextChange`, `onResumeTextChange`, `onSubmit`, `disabled`, `jobRef`
    - _Requirements: 1.1–1.4_
  - [x] 6.2 Add client-side validation to `InputForm.jsx`: on submit, trim both fields; if either is empty/whitespace-only, set per-field inline error messages and block the `onSubmit()` call
    - Render the "Analyze →" full-width submit button; disable it when `disabled=true`
    - _Requirements: 1.5, 1.6_
  - [x] 6.3 Write property test for whitespace validation — Property 1: Whitespace-only inputs are rejected
    - **Property 1: Whitespace-only inputs are rejected**
    - **Validates: Requirements 1.5**
    - Generator: `fc.stringMatching(/^\s+$/)` for invalid; `fc.string().filter(s => s.trim().length > 0)` for valid
    - Extract the validation logic into a pure function `isValidInput(str)` in `lib/validation.js` and test it directly
    - Assert `isValidInput` returns `false` for all-whitespace and `true` for strings with content
    - File: `__tests__/validation.property.test.js`

- [x] 7. Implement `LoadingState.jsx`
  - [x] 7.1 Create `components/LoadingState.jsx` that cycles through the four step messages using `setInterval` at ~1500ms, displays a spinner animation alongside the current message, and cleans up the interval on unmount
    - Messages in order: "Scanning job for red flags...", "Reading your resume...", "Comparing skills...", "Generating your report..."
    - Accept props: `active: boolean`
    - _Requirements: 4.1–4.3_
  - [x] 7.2 Write property test for loading message cycling — Property 6: Loading message cycling
    - **Property 6: Loading message cycling covers all messages and repeats correctly**
    - **Validates: Requirements 4.3**
    - Extract the index-selection logic `getMessageAtTick(n)` as a pure function; use `fc.nat()` to test that `getMessageAtTick(n) === MESSAGES[n % MESSAGES.length]` for all N
    - File: `__tests__/loading.property.test.js`

- [x] 8. Implement `TrustCard.jsx`
  - [x] 8.1 Create `components/TrustCard.jsx` that renders `trust_score` as a large primary number colored via `getScoreColor`, `risk_level` as a color-coded badge via `getRiskColor`, up to 5 `red_flags` as bullet points (with "+N more" overflow indicator when the array exceeds 5), and all `positive_signals` as bullet points (with "No positive signals found" when empty)
    - Accept props: `trust_score`, `risk_level`, `red_flags`, `positive_signals`
    - _Requirements: 5.1–5.6_
  - [x] 8.2 Write property test for red flags cap — Property 7: Red flags capped at 5
    - **Property 7: Red flags list is always capped at 5 displayed items**
    - **Validates: Requirements 5.5**
    - Use `fc.array(fc.string(), { minLength: 0, maxLength: 20 })`; render `TrustCard` with React Testing Library; assert rendered bullet count equals `Math.min(5, arr.length)` and overflow indicator is present iff `arr.length > 5`
    - File: `__tests__/TrustCard.property.test.js`

- [x] 9. Implement `FitCard.jsx`
  - [x] 9.1 Create `components/FitCard.jsx` that renders `fit_score` as a large primary number colored via `getScoreColor`, `fit_summary` as a caption beneath the score, and placeholder text for any null/missing fields
    - Accept props: `fit_score`, `fit_summary`
    - _Requirements: 6.1–6.6_

- [x] 10. Implement `SkillGap.jsx`
  - [x] 10.1 Create `components/SkillGap.jsx` with a two-column layout ("You have" / "Job requires"), rendering `student_skills` on the left and `required_skills` on the right; any skill in `required_skills` that appears in `missing_skills` must be rendered with color `#dc2626`
    - Accept props: `student_skills`, `required_skills`, `missing_skills`, `recommended_projects`
    - _Requirements: 7.1, 7.2_
  - [x] 10.2 Add the `recommended_projects` section below the skill columns: render each project's `name` (bold) and `reason`; show placeholder for a missing `name` or `reason`; render section header with no entries when the array is empty
    - _Requirements: 7.3, 7.4_
  - [x] 10.3 Write property test for missing skills highlighting — Property 8: Missing skills highlighted in red, present skills not
    - **Property 8: Missing skills are highlighted in red, present skills are not**
    - **Validates: Requirements 7.2**
    - Generator: `fc.array(fc.string())` for `required_skills`; derive `missing_skills` as a random subset; render `SkillGap` with React Testing Library; assert each missing skill has `color: rgb(220, 38, 38)` and no non-missing skill does
    - File: `__tests__/SkillGap.property.test.js`

- [x] 11. Implement `ActionCard.jsx`
  - [x] 11.1 Create `components/ActionCard.jsx` that renders `recommendation` as a large pill badge with color from `getRecommendationColor`, and `success_probability`, `prep_time`, and `reasoning` as labeled fields with placeholder text for any missing/null value
    - Accept props: `recommendation`, `success_probability`, `prep_time`, `reasoning`
    - _Requirements: 8.1–8.3_

- [x] 12. Wire everything together in `app/page.jsx`
  - [x] 12.1 Replace the placeholder `app/page.jsx` with the full state-machine implementation: `phase` state (`idle` | `loading` | `result`), `jobText`/`resumeText` controlled inputs, `result`, and `error` state; wire `onLoadPreset` to populate both textareas and focus `jobRef`
    - _Requirements: 2.1–2.5, 4.1, 4.2_
  - [x] 12.2 Implement the `handleSubmit` function in `app/page.jsx`: set phase to `loading`, POST to `/api/analyze`, on success set phase to `result` and store result, on any error set phase to `idle` and display the error banner with re-enabled submit button
    - _Requirements: 3.1, 4.1, 4.4, 4.5_
  - [x] 12.3 Render all four report cards (`TrustCard`, `FitCard`, `SkillGap`, `ActionCard`) in the `result` phase, stacked vertically below the input form, passing the correct fields from the `result` object to each card's props
    - _Requirements: 5.1, 6.1, 7.1, 8.1, 10.3_
  - [x] 12.4 Add the two demo preset buttons above `InputForm` in `app/page.jsx`, wired to `PRESETS.fake` and `PRESETS.real` from `lib/presets.js`; clicking a button overwrites textareas and focuses the job textarea
    - _Requirements: 2.1–2.5_

- [x] 13. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
