# Design Document: CareerShield AI

## Overview

CareerShield AI is a single-page Next.js 14 application that accepts a job description and resume as plain text, sends them to the Anthropic Claude API, and renders a four-card structured analysis report. The system is deliberately minimal: there is no database, no user accounts, and no persistent state — every analysis is a stateless request/response cycle.

The architectural goal is maximum simplicity for a hackathon context while still being correct and resilient. The entire backend is a single Next.js API Route (`/api/analyze/route.js`). The frontend is a single page component (`app/page.jsx`) that owns all UI state transitions. Six presentational components handle report rendering.

### Key Design Decisions

- **No state management library**: React `useState` is sufficient because state is a simple linear progression: idle → loading → result (or error). No cross-component shared state is needed.
- **No database**: Analysis results are ephemeral — stored only in component state for the current session.
- **Claude as the sole AI backend**: The prompt is carefully structured to return raw JSON, eliminating the need for a parsing layer beyond `JSON.parse`.
- **Tailwind CSS utility classes**: All color-coding, spacing, and responsive layout is done with Tailwind. No CSS modules or styled-components.
- **Vercel deployment target**: The App Router structure and a single serverless API route are natively supported by Vercel with zero additional configuration.

---

## Architecture

The system has three layers:

```
┌─────────────────────────────────────────────────┐
│                  Browser Client                  │
│                                                  │
│  page.jsx (state machine)                        │
│    ├─ InputForm.jsx      (idle state)            │
│    ├─ LoadingState.jsx   (loading state)         │
│    └─ Report cards       (result state)          │
│         ├─ TrustCard.jsx                         │
│         ├─ FitCard.jsx                           │
│         ├─ SkillGap.jsx                          │
│         └─ ActionCard.jsx                        │
└────────────────┬────────────────────────────────┘
                 │  fetch POST /api/analyze
                 ▼
┌─────────────────────────────────────────────────┐
│            Next.js API Route (Vercel)            │
│                                                  │
│  app/api/analyze/route.js                        │
│    ├─ Input validation (400)                     │
│    ├─ lib/prompt.js (prompt construction)        │
│    ├─ Anthropic SDK call                         │
│    ├─ JSON parse + schema validation             │
│    └─ Response (200 JSON / 400 / 500)            │
└────────────────┬────────────────────────────────┘
                 │  HTTPS API call
                 ▼
┌─────────────────────────────────────────────────┐
│              Anthropic Claude API               │
└─────────────────────────────────────────────────┘
```

### State Machine (page.jsx)

The page owns a single `phase` state with three values:

| Phase     | What is visible                                                   |
|-----------|-------------------------------------------------------------------|
| `idle`    | Header + demo buttons + InputForm                                 |
| `loading` | Header + demo buttons + LoadingState                              |
| `result`  | Header + demo buttons + InputForm (collapsed) + four report cards |

On error, the phase returns to `idle` and an error banner is shown.

---

## Components and Interfaces

### `app/page.jsx`

The root page component. Owns all shared state.

**State:**
```js
const [jobText, setJobText] = useState('')
const [resumeText, setResumeText] = useState('')
const [phase, setPhase] = useState('idle')        // 'idle' | 'loading' | 'result'
const [result, setResult] = useState(null)         // AnalysisResult | null
const [error, setError] = useState(null)           // string | null
```

**Responsibilities:**
- Renders header and demo preset buttons
- Passes `onLoadPreset(jobText, resumeText)` callback to preset buttons
- Calls `POST /api/analyze` on form submit
- Transitions phase state based on request lifecycle
- Passes `result` down to report card components

---

### `components/InputForm.jsx`

**Props:**
```js
{
  jobText: string,
  resumeText: string,
  onJobTextChange: (value) => void,
  onResumeTextChange: (value) => void,
  onSubmit: () => void,
  disabled: boolean,        // true during loading
  jobRef: RefObject         // for focus after preset load
}
```

**Responsibilities:**
- Renders both labeled textareas with constraints (min-height 200px, maxLength 20000)
- Client-side validation: trims both fields, sets per-field inline error messages
- Calls `onSubmit()` only when both fields have non-whitespace content
- Renders the "Analyze →" submit button (full width, disabled when `disabled=true`)

---

### `components/LoadingState.jsx`

**Props:**
```js
{ active: boolean }
```

**Responsibilities:**
- Cycles through step messages using `setInterval` with ~1500ms delay
- Messages: `["Scanning job for red flags...", "Reading your resume...", "Comparing skills...", "Generating your report..."]`
- Displays a spinner animation alongside the current message
- Cleans up the interval on unmount

---

### `components/TrustCard.jsx`

**Props:**
```js
{
  trust_score: number,         // 0–100
  risk_level: string,          // "low" | "medium" | "high"
  red_flags: string[],
  positive_signals: string[]
}
```

**Responsibilities:**
- Renders `trust_score` as large primary number, colored via `getScoreColor(trust_score)`
- Renders `risk_level` as a color-coded badge
- Renders up to 5 `red_flags` as bullet points; if more than 5 exist, appends "+N more"
- Renders all `positive_signals` as bullet points; if empty, shows "No positive signals found"

---

### `components/FitCard.jsx`

**Props:**
```js
{
  fit_score: number | null,
  fit_summary: string | null
}
```

**Responsibilities:**
- Renders `fit_score` as large primary number colored via `getScoreColor(fit_score)`
- Renders `fit_summary` as a caption beneath the score
- Falls back to placeholder text for null/missing fields

---

### `components/SkillGap.jsx`

**Props:**
```js
{
  student_skills: string[],
  required_skills: string[],
  missing_skills: string[],
  recommended_projects: Array<{ name: string, reason: string }>
}
```

**Responsibilities:**
- Two-column layout: "You have" (student_skills) on the left, "Job requires" (required_skills) on the right
- Any skill in `required_skills` that also appears in `missing_skills` is rendered in red (#dc2626)
- Renders `recommended_projects` below the columns; each project shows `name` (bold) + `reason`
- Handles empty arrays gracefully (no project entries, no skill entries)
- Falls back to placeholder text when a project is missing `name` or `reason`

---

### `components/ActionCard.jsx`

**Props:**
```js
{
  recommendation: string,       // "apply" | "upskill" | "avoid"
  success_probability: string | null,
  prep_time: string | null,
  reasoning: string | null
}
```

**Responsibilities:**
- Renders `recommendation` as a large pill badge with color from `getRecommendationColor()`
- Renders `success_probability`, `prep_time`, and `reasoning` as labeled fields
- Displays placeholder text for any missing field

---

### `lib/prompt.js`

Exports a single function:

```js
export function buildPrompt(jobText, resumeText) {
  return `You are CareerShield AI, a career advisor for engineering students in India.
Analyze the job posting and student resume provided below.

Your job:
1. Determine if the job posting is legitimate or a scam/fake
2. Extract the student's skills and experience from their resume
3. Compare student profile against job requirements
4. Recommend whether the student should apply now, upskill first, or avoid

Common scam signals to detect:
- Registration or processing fees
- Recruiter using Gmail/Yahoo instead of company domain
- Unrealistically high salary (e.g. ₹1.5 lakh/month for a fresher intern)
- Vague or missing company information
- Urgent language ("apply in 24 hours or lose the opportunity")
- Requests for Aadhaar, bank details, or personal documents upfront
- Contact via WhatsApp or Telegram only

JOB POSTING:
${jobText}

STUDENT RESUME:
${resumeText}

Return ONLY a valid JSON object. No explanation, no markdown, no code fences. Just raw JSON matching this exact structure:

{
  "trust_score": 87,
  "risk_level": "low",
  "red_flags": ["list of specific red flags found, empty array if none"],
  "positive_signals": ["list of trust-building signals found"],
  "fit_score": 62,
  "student_skills": ["skills extracted from resume"],
  "required_skills": ["skills the job explicitly or implicitly requires"],
  "missing_skills": ["skills in required but not in student"],
  "recommended_projects": [
    { "name": "Project name", "reason": "Why this closes the skill gap" }
  ],
  "fit_summary": "One sentence summarizing the fit",
  "recommendation": "apply",
  "success_probability": "moderate",
  "prep_time": "2 weeks",
  "reasoning": "2-3 sentence explanation of the recommendation"
}`;
}
```

---

### `app/api/analyze/route.js`

**Method:** `POST`

**Request body:**
```json
{ "jobText": "string (max 20000 chars)", "resumeText": "string (max 20000 chars)" }
```

**Processing steps:**
1. Parse request body as JSON
2. Validate `jobText` and `resumeText` are present non-empty strings → 400 if not
3. Check `ANTHROPIC_API_KEY` env var is set → 500 if missing
4. Call `buildPrompt(jobText, resumeText)` from `lib/prompt.js`
5. Invoke Anthropic SDK: `client.messages.create({ model: "claude-3-5-haiku-20241022", max_tokens: 2048, messages: [{ role: "user", content: prompt }] })`
6. Extract text content from response
7. `JSON.parse()` the text content
8. Validate all 14 required fields are present with correct types
9. Return validated object as 200 JSON
10. Catch all errors → 500 with `{ error: "..." }`

**Response (200):** Full 14-field `AnalysisResult` object  
**Response (400):** `{ error: "jobText is required and must be a non-empty string" }`  
**Response (500):** `{ error: "Claude API call failed: ..." }` or `{ error: "ANTHROPIC_API_KEY is not configured" }`

---

### Color Utility (`lib/colors.js`)

A shared helper used by all cards:

```js
export function getScoreColor(score) {
  if (score >= 70) return '#16a34a'   // green
  if (score >= 40) return '#d97706'   // amber
  return '#dc2626'                    // red
}

export function getRiskColor(risk_level) {
  if (risk_level === 'low') return '#16a34a'
  if (risk_level === 'medium') return '#d97706'
  return '#dc2626'
}

export function getRecommendationColor(recommendation) {
  if (recommendation === 'apply') return '#16a34a'
  if (recommendation === 'upskill') return '#d97706'
  return '#dc2626'
}
```

---

## Data Models

### `AnalysisResult` (the 14-field JSON contract)

```typescript
interface RecommendedProject {
  name: string;
  reason: string;
}

interface AnalysisResult {
  // Trust analysis
  trust_score: number;              // integer 0–100
  risk_level: 'low' | 'medium' | 'high';
  red_flags: string[];
  positive_signals: string[];

  // Fit analysis
  fit_score: number;                // integer 0–100
  student_skills: string[];
  required_skills: string[];
  missing_skills: string[];
  recommended_projects: RecommendedProject[];
  fit_summary: string;

  // Recommendation
  recommendation: 'apply' | 'upskill' | 'avoid';
  success_probability: 'high' | 'moderate' | 'low';
  prep_time: string;
  reasoning: string;
}
```

### Schema Validation Rules

| Field | Validation rule |
|---|---|
| `trust_score` | `typeof n === 'number' && n >= 0 && n <= 100` |
| `fit_score` | `typeof n === 'number' && n >= 0 && n <= 100` |
| `risk_level` | `['low','medium','high'].includes(v)` |
| `recommendation` | `['apply','upskill','avoid'].includes(v)` |
| `success_probability` | `['high','moderate','low'].includes(v)` |
| `red_flags` | `Array.isArray(v)` |
| `positive_signals` | `Array.isArray(v)` |
| `student_skills` | `Array.isArray(v)` |
| `required_skills` | `Array.isArray(v)` |
| `missing_skills` | `Array.isArray(v)` |
| `recommended_projects` | `Array.isArray(v)` (each entry has `name`, `reason` strings) |
| `fit_summary` | `typeof v === 'string'` |
| `prep_time` | `typeof v === 'string'` |
| `reasoning` | `typeof v === 'string'` |

### Demo Preset Data Structure

```js
// lib/presets.js
export const PRESETS = {
  fake: {
    jobText: `Amazon Work From Home Internship — URGENT HIRING

Company: Amazon India
Salary: ₹1,50,000/month + performance bonus
Duration: 3 months (extendable)
Location: Remote

We are hiring talented students for our elite remote internship program.

Requirements:
- Basic computer knowledge
- Smartphone or laptop
- Willingness to learn
- Available immediately

How to apply:
Pay a ₹999 registration and background verification fee via UPI to amazonhrjobs@gmail.com
Contact our HR team on WhatsApp: +91 98765 43210

Hurry! Only 5 seats left. Offer expires in 24 hours.`,
    resumeText: `Name: Rahul Sharma
B.Tech CSE, 3rd Year — VIT Bhopal

Skills: React.js, Java, HTML, CSS, Git

Projects:
- Todo App (React)
- Java console-based bank management system

Certifications: Infosys Springboard Java Basics`
  },
  real: {
    jobText: `Google — Software Engineering Intern (India, Summer 2025)

Location: Bangalore / Hybrid
Duration: 10 weeks
Stipend: ₹80,000/month

About the role:
Join one of Google's engineering teams to work on real infrastructure,
tools, or product features. You will be paired with a full-time engineer
mentor and contribute to production code.

Minimum qualifications:
- Currently pursuing B.Tech/B.E. in CS or related field
- Strong fundamentals in data structures and algorithms
- Proficiency in at least one of: C++, Java, Python, Go
- Experience with SQL and relational databases
- Familiarity with REST APIs and backend development

Apply at: careers.google.com/students
Contact: google-university-recruiting@google.com`,
    resumeText: `Name: Rahul Sharma
B.Tech CSE, 3rd Year — VIT Bhopal

Skills: React.js, Java, HTML, CSS, Git

Projects:
- Todo App (React)
- Java console-based bank management system

Certifications: Infosys Springboard Java Basics`
  }
}
```

### UI State Shape (page.jsx)

```js
{
  jobText: string,          // controlled textarea value
  resumeText: string,       // controlled textarea value
  phase: 'idle' | 'loading' | 'result',
  result: AnalysisResult | null,
  error: string | null
}
```

---

## Correctness Properties

### Property 1: Whitespace-only inputs are rejected

For any string composed entirely of whitespace characters (spaces, tabs, newlines, or any combination), the form validation function SHALL classify it as invalid and prevent form submission. Conversely, for any string containing at least one non-whitespace character, the validation function SHALL classify it as valid.

**Validates:** Requirements 1.5

---

### Property 2: Score color mapping is correct for all values

For any integer score in the range [0, 100], the `getScoreColor` function SHALL return `#16a34a` (green) when the score is ≥ 70, `#d97706` (amber) when the score is between 40 and 69 inclusive, and `#dc2626` (red) when the score is < 40. This property applies uniformly to both `trust_score` and `fit_score`.

**Validates:** Requirements 5.2–5.4, 6.2–6.4, 9.1–9.3

---

### Property 3: Recommendation color mapping is exhaustive and correct

For any valid recommendation value (`"apply"`, `"upskill"`, or `"avoid"`), the `getRecommendationColor` function SHALL return `#16a34a` for `"apply"`, `#d97706` for `"upskill"`, and `#dc2626` for `"avoid"`. No valid recommendation value shall return an incorrect or undefined color.

**Validates:** Requirements 8.2, 9.1–9.3

---

### Property 4: Schema validation correctly accepts and rejects AnalysisResult objects

For any JavaScript object, the schema validation function SHALL return valid if and only if the object contains all 14 required fields with their specified types and enumerated values. For any object missing a required field or containing a field with an incorrect type or out-of-range value, schema validation SHALL return invalid.

**Validates:** Requirements 3.3, 3.4

---

### Property 5: API route returns 400 for any malformed request body

For any request body sent to `POST /api/analyze` that is missing `jobText`, missing `resumeText`, has `jobText` as a non-string type, or has `resumeText` as a non-string type, the route SHALL return HTTP 400 with a JSON body containing an `error` string field.

**Validates:** Requirement 3.6

---

### Property 6: Loading message cycling covers all messages and repeats correctly

For any non-negative integer N representing the number of interval ticks elapsed since the LoadingState component mounted, the currently displayed message SHALL equal `MESSAGES[N % MESSAGES.length]`, where `MESSAGES = ["Scanning job for red flags...", "Reading your resume...", "Comparing skills...", "Generating your report..."]`.

**Validates:** Requirement 4.3

---

### Property 7: Red flags list is always capped at 5 displayed items

For any array of red flag strings passed to TrustCard, the component SHALL render exactly `Math.min(5, red_flags.length)` bullet point items. For any array with more than 5 items, the component SHALL additionally render an overflow indicator (e.g., "+N more"). For any array with 5 or fewer items, no overflow indicator SHALL be rendered.

**Validates:** Requirement 5.5

---

### Property 8: Missing skills are highlighted in red, present skills are not

For any combination of `required_skills` and `missing_skills` arrays (where `missing_skills` is a subset of `required_skills`), every skill that appears in `missing_skills` SHALL be rendered with the red color treatment (`#dc2626`) in the "Job requires" column. For any skill in `required_skills` that does not appear in `missing_skills`, it SHALL not receive the red color treatment. When `missing_skills` is empty, no skills SHALL receive the red color treatment.

**Validates:** Requirement 7.2

---

## Error Handling

### Client-side Errors

| Error condition | UI behavior |
|---|---|
| Empty / whitespace-only field on submit | Inline error message below the offending textarea; no API call made |
| API returns HTTP 400 | Phase → idle; error banner shown with response `error` field |
| API returns HTTP 500 | Phase → idle; error banner shown ("Analysis failed. Please try again.") |
| Network failure / fetch throws | Phase → idle; error banner shown ("Network error. Please check your connection.") |
| API response not valid JSON | Phase → idle; generic error banner |

The submit button is re-enabled in all error states so the user can retry without reloading the page.

### Server-side Errors

| Error condition | HTTP response |
|---|---|
| Missing `jobText` or `resumeText` | 400 `{ error: "jobText is required and must be a non-empty string" }` |
| `ANTHROPIC_API_KEY` not set or empty | 500 `{ error: "ANTHROPIC_API_KEY is not configured" }` |
| Anthropic SDK throws (network, auth, rate limit) | 500 `{ error: "Claude API call failed: <original message>" }` |
| Claude returns non-JSON text | 500 `{ error: "Failed to parse Claude response as JSON" }` |
| Claude JSON missing required fields | 500 `{ error: "Invalid response schema from Claude: missing or invalid field '<field>'" }` |

All server errors are caught in a top-level try/catch inside the route handler.

### Graceful Degradation in Report Cards

All four report card components are written defensively. Null or missing fields render placeholder text rather than crashing. This is a belt-and-suspenders measure given that schema validation should catch malformed responses before they reach the client.

---

## Testing Strategy

### Unit Tests (Example-Based)

**Tool:** Jest + React Testing Library

Unit tests cover:
- InputForm renders with correct attributes (labels, placeholders, maxLength, min-height)
- Demo preset buttons populate textareas with correct content and focus job textarea
- Form submission with empty fields shows inline error messages and makes no API call
- LoadingState renders step messages in correct order
- TrustCard renders score, badge, red flags (normal and overflow), positive signals (normal and empty)
- FitCard renders score, summary, and null-field placeholders
- SkillGap renders two-column layout, missing skill coloring, recommended projects, and empty-list cases
- ActionCard renders recommendation badge, all fields, and null-field placeholders
- API route returns 400 for missing fields
- API route returns 500 when `ANTHROPIC_API_KEY` is not set
- API route returns 500 when Claude returns non-JSON

### Property-Based Tests

**Tool:** [fast-check](https://github.com/dubzzz/fast-check) with Jest

Each property test runs a minimum of **100 iterations**. Tests are tagged:
`// Feature: careershield-ai, Property <N>: <description>`

**Property 1 — Whitespace input rejection**
- Generator: strings composed entirely of whitespace; separately, strings with at least one non-whitespace character
- Assertion: validation returns `false` for all-whitespace, `true` for strings with content

**Property 2 — Score color mapping**
- Generator: `fc.integer({ min: 0, max: 100 })`
- Assertion: `getScoreColor(n)` returns correct hex for each tier boundary

**Property 3 — Recommendation color mapping**
- Generator: `fc.constantFrom('apply', 'upskill', 'avoid')`
- Assertion: correct color returned for each value

**Property 4 — Schema validation**
- Generator: valid 14-field objects and mutated objects with one invalid field
- Assertion: `validateSchema` returns `true` for valid, `false` for any mutation

**Property 5 — API 400 for malformed request**
- Generator: various malformed request body shapes (missing fields, wrong types)
- Assertion: all result in HTTP 400 with `error` field

**Property 6 — Loading message cycling**
- Generator: `fc.nat()` (any non-negative integer N)
- Assertion: after N timer ticks, displayed message equals `MESSAGES[N % 4]`

**Property 7 — Red flags cap**
- Generator: `fc.array(fc.string(), { minLength: 0, maxLength: 20 })`
- Assertion: rendered bullet count = `Math.min(5, arr.length)`; overflow indicator present iff `arr.length > 5`

**Property 8 — Missing skills highlighting**
- Generator: `required_skills` array; `missing_skills` as a subset of it
- Assertion: each missing skill renders with red color; no other skill does
