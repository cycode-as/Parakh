# Requirements Document

## Introduction

CareerShield AI is a job opportunity verification and career readiness platform for engineering students. A student pastes a job description and their resume as plain text, and the system returns a structured analysis report containing a Trust Score (legitimacy of the job posting), a Fit Score (qualification match), a skill gap analysis, recommended upskill projects, and a concrete action recommendation. The platform targets 3rd-year CSE/engineering students who struggle to distinguish legitimate job postings from scams and who lack clarity on which opportunities they are realistically qualified to pursue.

## Glossary

- **CareerShield_AI**: The overall web application being described in this document.
- **Analyzer**: The backend service that processes job and resume inputs and returns a structured analysis JSON.
- **Claude_API**: The Anthropic Claude language model API used by the Analyzer to perform analysis.
- **Trust_Score**: An integer from 0–100 representing the estimated legitimacy of a job posting (≥70 = legitimate, 40–69 = suspicious, <40 = likely scam).
- **Fit_Score**: An integer from 0–100 representing how well the student's stated skills match the job's required skills (≥70 = strong fit, 40–69 = partial fit, <40 = significant gap).
- **Risk_Level**: A categorical label ("low", "medium", "high") derived from the Trust_Score that summarizes job posting risk.
- **Red_Flags**: A list of specific textual signals in the job description that indicate potential fraud or illegitimacy.
- **Positive_Signals**: A list of specific textual signals in the job description that indicate legitimacy.
- **Skill_Gap**: The set of skills present in the job's requirements but absent from the student's resume.
- **Recommended_Projects**: A list of project suggestions that would help the student acquire Missing_Skills.
- **Action_Recommendation**: A categorical outcome ("apply", "upskill", "avoid") advising the student on next steps.
- **Success_Probability**: A categorical label ("high", "moderate", "low") estimating the student's likelihood of getting the job if they apply.
- **Prep_Time**: A human-readable string estimating how long it would take the student to close the Skill_Gap.
- **Demo_Preset**: Pre-loaded job description and resume text that auto-fills the input form to demonstrate the system.
- **Report_Section**: One of the four visual cards displayed after analysis (Trust Card, Fit Card, Skill Gap, Action Card).
- **Loading_State**: The animated UI state shown while the Analyzer is processing a request.

---

## Requirements

### Requirement 1: Job Description and Resume Input

**User Story:** As an engineering student, I want to paste a job description and my resume into a form, so that I can submit them for analysis without needing to upload files.

#### Acceptance Criteria

1. THE CareerShield_AI SHALL display a single-page input form containing a job description textarea and a resume textarea.
2. THE CareerShield_AI SHALL render the job description textarea with a text label rendered above the textarea, a placeholder of at least 5 characters, a minimum height of 200px, and a maximum input length of 20,000 characters.
3. THE CareerShield_AI SHALL render the resume textarea with a text label rendered above the textarea, a placeholder of at least 5 characters, a minimum height of 200px, and a maximum input length of 20,000 characters.
4. THE CareerShield_AI SHALL display a full-width "Analyze →" submit button below both textareas.
5. WHEN the user submits the form, THE CareerShield_AI SHALL require both the job description textarea and the resume textarea to contain non-whitespace text (trimmed length > 0) before initiating analysis.
6. IF the user clicks "Analyze →" with one or both textareas empty or containing only whitespace, THEN THE CareerShield_AI SHALL prevent form submission and display an inline validation message identifying the empty field(s).

---

### Requirement 2: Demo Preset Loading

**User Story:** As a student evaluating the platform, I want to click a demo button that fills the form with sample data, so that I can see the analysis in action without typing anything.

#### Acceptance Criteria

1. THE CareerShield_AI SHALL display two demo preset buttons above the input form: one labeled "Try: Fake job (Amazon scam)" and one labeled "Try: Real job (Google SWE Intern)".
2. WHEN the user clicks "Try: Fake job (Amazon scam)", THE CareerShield_AI SHALL populate the job description textarea with the fake Amazon work-from-home scam job description and the resume textarea with the Rahul Sharma sample resume.
3. WHEN the user clicks "Try: Real job (Google SWE Intern)", THE CareerShield_AI SHALL populate the job description textarea with the Google SWE Intern Bangalore job description and the resume textarea with the Rahul Sharma sample resume.
4. WHEN a demo preset is loaded, THE CareerShield_AI SHALL overwrite any existing content in both textareas with the preset data, and the job description textarea SHALL receive focus.
5. WHEN a demo preset is loaded, THE CareerShield_AI SHALL leave both textareas editable so the user can modify the pre-filled content before submitting.

---

### Requirement 3: Analysis Request Processing

**User Story:** As a student, I want the system to send my job description and resume to an AI model for analysis, so that I receive an objective and structured evaluation.

#### Acceptance Criteria

1. WHEN the user submits valid non-empty job description and resume text, THE Analyzer SHALL send a POST request to `/api/analyze` with a JSON body containing `jobText` (string, max 20,000 characters) and `resumeText` (string, max 20,000 characters) fields.
2. WHEN the `/api/analyze` endpoint receives a valid request, THE Analyzer SHALL construct a prompt using the provided `jobText` and `resumeText` and invoke the Claude_API to produce a structured analysis.
3. WHEN the Claude_API returns a response, THE Analyzer SHALL parse the response body as JSON and validate it conforms to the defined response schema before returning it to the client.
4. THE Analyzer SHALL return a JSON response containing all of the following fields with the specified types: `trust_score` (integer 0–100), `risk_level` (one of: "low", "medium", "high"), `red_flags` (array of strings), `positive_signals` (array of strings), `fit_score` (integer 0–100), `student_skills` (array of strings), `required_skills` (array of strings), `missing_skills` (array of strings), `recommended_projects` (array of objects with `name` and `reason` string fields), `fit_summary` (string), `recommendation` (one of: "apply", "upskill", "avoid"), `success_probability` (one of: "high", "moderate", "low"), `prep_time` (string), and `reasoning` (string).
5. IF the Claude_API call fails or returns a response whose body cannot be parsed as valid JSON conforming to the schema, THEN THE Analyzer SHALL return an HTTP 500 response with a JSON body containing a `error` string field describing the failure.
6. IF the request body is missing `jobText` or `resumeText`, or either field is not a string, THEN THE Analyzer SHALL return an HTTP 400 response with a JSON body containing an `error` string field describing which field is invalid.

---

### Requirement 4: Loading State Display

**User Story:** As a student, I want to see animated progress messages while my analysis is processing, so that I know the system is working and understand what it is doing.

#### Acceptance Criteria

1. WHEN the user submits the form, THE CareerShield_AI SHALL replace the submit button area with a Loading_State component displaying an animated progress indicator.
2. WHILE the Loading_State is active, THE CareerShield_AI SHALL disable the "Analyze →" submit button to prevent duplicate submissions.
3. WHILE the Loading_State is active, THE CareerShield_AI SHALL cycle through the following step messages in order: "Scanning job for red flags...", "Reading your resume...", "Comparing skills...", "Generating your report...", displaying each message for approximately 1.5 seconds, and SHALL continue cycling through the sequence until the Loading_State is hidden.
4. WHEN the analysis response is received, THE CareerShield_AI SHALL hide the Loading_State and render the Report_Section. The submit button SHALL remain disabled until the Report_Section is fully rendered.
5. IF the analysis request returns an error, THE CareerShield_AI SHALL hide the Loading_State, re-enable the submit button, and display an error message to the user.

---

### Requirement 5: Trust Score Report Card

**User Story:** As a student, I want to see a clear Trust Score for the job posting, so that I can immediately assess whether the opportunity is legitimate or a scam.

#### Acceptance Criteria

1. WHEN the analysis response is received, THE CareerShield_AI SHALL display a Trust Card showing the `trust_score` integer (0–100) as the primary numeric element and the `risk_level` label as a color-coded badge.
2. IF `trust_score` ≥ 70, THEN THE CareerShield_AI SHALL render the Trust_Score value and the `risk_level` badge using green (#16a34a).
3. IF `trust_score` is between 40 and 69 inclusive, THEN THE CareerShield_AI SHALL render the Trust_Score value and the `risk_level` badge using amber (#d97706).
4. IF `trust_score` < 40, THEN THE CareerShield_AI SHALL render the Trust_Score value and the `risk_level` badge using red (#dc2626).
5. THE CareerShield_AI SHALL display up to 5 items from the `red_flags` list as bullet points within the Trust Card, in the order they appear in the list. IF the `red_flags` list contains more than 5 items, THEN THE CareerShield_AI SHALL display only the first 5 and indicate that additional items exist.
6. THE CareerShield_AI SHALL display the `positive_signals` list as bullet points within the Trust Card. IF the `positive_signals` list is empty, THEN THE CareerShield_AI SHALL display the section header with a message indicating no positive signals were found.

---

### Requirement 6: Fit Score Report Card

**User Story:** As a student, I want to see a Fit Score comparing my resume to the job requirements, so that I understand how well-matched I am for the role.

#### Acceptance Criteria

1. WHEN the analysis response is received, THE CareerShield_AI SHALL display a Fit Card showing the `fit_score` integer (0–100) as the primary numeric element, visually distinct from other card content.
2. IF `fit_score` ≥ 70, THEN THE CareerShield_AI SHALL render the Fit_Score value using green (#16a34a).
3. IF `fit_score` is between 40 and 69 inclusive, THEN THE CareerShield_AI SHALL render the Fit_Score value using amber (#d97706).
4. IF `fit_score` < 40, THEN THE CareerShield_AI SHALL render the Fit_Score value using red (#dc2626).
5. THE CareerShield_AI SHALL display the `fit_summary` string as a one-line descriptive caption beneath the Fit_Score.
6. IF `fit_score` or `fit_summary` is absent or null in the analysis response, THEN THE CareerShield_AI SHALL still render the Fit Card and display a placeholder text for the missing field.

---

### Requirement 7: Skill Gap Analysis Display

**User Story:** As a student, I want to see a side-by-side comparison of my skills versus the job's required skills, so that I can identify exactly what I am missing.

#### Acceptance Criteria

1. WHEN the analysis response is received, THE CareerShield_AI SHALL display a Skill Gap section presenting `student_skills` and `required_skills` in a two-column layout labeled "You have" and "Job requires" respectively.
2. IF `missing_skills` is non-empty, THEN THE CareerShield_AI SHALL render each skill in the "Job requires" column that appears in `missing_skills` with a red (#dc2626) color treatment to distinguish it from skills the student already has. IF `missing_skills` is empty, THEN THE CareerShield_AI SHALL render all skills in the "Job requires" column without the red treatment.
3. THE CareerShield_AI SHALL display the `recommended_projects` list below the skill comparison, showing each project's `name` and `reason` fields. IF a project entry is missing a `name` or `reason` field, THEN THE CareerShield_AI SHALL render the available field and display a placeholder for the missing one.
4. WHEN the `recommended_projects` list is empty, THE CareerShield_AI SHALL display the recommended projects section header with no project entries beneath it.

---

### Requirement 8: Action Recommendation Card

**User Story:** As a student, I want a clear recommendation on whether to apply, upskill, or avoid the job, so that I can make a confident and well-informed decision.

#### Acceptance Criteria

1. WHEN the analysis response is received, THE CareerShield_AI SHALL display an Action Card showing the `recommendation` value ("apply", "upskill", or "avoid") as a prominently styled pill or badge.
2. THE CareerShield_AI SHALL render the recommendation badge using green (#16a34a) for "apply", amber (#d97706) for "upskill", and red (#dc2626) for "avoid".
3. THE CareerShield_AI SHALL display the `success_probability` label, `prep_time` string, and `reasoning` text within the Action Card. IF any of these fields are absent from the analysis response, THEN THE CareerShield_AI SHALL still render the Action Card and display a placeholder or leave the missing field empty.

---

### Requirement 9: Score Color Coding Consistency

**User Story:** As a student, I want all scores and risk indicators to use a consistent color system, so that I can interpret the report at a glance without reading every detail.

#### Acceptance Criteria

1. THE CareerShield_AI SHALL apply the color #16a34a (green) to all score values ≥ 70, risk badges labeled "low", and recommendation badges labeled "apply".
2. THE CareerShield_AI SHALL apply the color #d97706 (amber) to all score values between 40 and 69 inclusive (where 40 displays as amber), risk badges labeled "medium", and recommendation badges labeled "upskill".
3. THE CareerShield_AI SHALL apply the color #dc2626 (red) to all score values < 40, risk badges labeled "high", and recommendation badges labeled "avoid".
4. WHEN multiple color-coded elements appear together and their implied levels conflict, THE CareerShield_AI SHALL apply coloring based on the most restrictive element, where red overrides amber and amber overrides green.

---

### Requirement 10: Page Layout and Branding

**User Story:** As a student, I want a clean, focused interface, so that I can use the tool without distraction on any device.

#### Acceptance Criteria

1. THE CareerShield_AI SHALL render the home page with a centered single-column layout constrained to a maximum width of 720px.
2. THE CareerShield_AI SHALL display a header containing the logo text "CareerShield AI" and the tagline "Verify opportunities. Measure readiness. Plan your next move."
3. THE CareerShield_AI SHALL stack the four Report_Section cards vertically below the input form after analysis is complete.
4. THE CareerShield_AI SHALL be deployable to Vercel using the Next.js 14 App Router project structure.

---

### Requirement 11: Environment Configuration

**User Story:** As a developer deploying CareerShield AI, I want the Claude API key to be read from an environment variable, so that secrets are not hard-coded in source files.

#### Acceptance Criteria

1. THE Analyzer SHALL read the Anthropic API key exclusively from the `ANTHROPIC_API_KEY` environment variable.
2. IF the `ANTHROPIC_API_KEY` environment variable is not set at runtime, THEN THE Analyzer SHALL return an HTTP 500 response, including an error message indicating the API key is not configured where possible.

---

### Requirement 12: End-to-End Demo Correctness

**User Story:** As a hackathon evaluator, I want the demo to produce results within 30 seconds that clearly differentiate a fake job from a real one, so that the platform's value is immediately obvious.

#### Acceptance Criteria

1. WHEN the fake Amazon scam Demo_Preset is submitted, THE Analyzer SHALL return a `trust_score` less than 40.
2. WHEN the real Google SWE Intern Demo_Preset is submitted, THE Analyzer SHALL return a `trust_score` greater than 90.
3. WHEN the real Google SWE Intern Demo_Preset is submitted, THE Analyzer SHALL return a `fit_score` between 50 and 70 inclusive and a `recommendation` of "upskill".
4. WHEN the user submits any valid analysis request, THE CareerShield_AI SHALL display the completed report within 30 seconds of form submission under normal network conditions.
