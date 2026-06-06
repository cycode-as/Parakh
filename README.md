 Parakh

> Analyze internships and jobs using your Resume, GitHub, LinkedIn, and Portfolio.

![GitHub stars](https://img.shields.io/github/stars/cycode-as/Parakh?style=for-the-badge&logo=github) ![GitHub forks](https://img.shields.io/github/forks/cycode-as/Parakh?style=for-the-badge&logo=github) ![GitHub issues](https://img.shields.io/github/issues/cycode-as/Parakh?style=for-the-badge&logo=github) ![Last commit](https://img.shields.io/github/last-commit/cycode-as/Parakh?style=for-the-badge&logo=github) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white) ![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

 📑 Table of Contents

- [Deployment link](#link)
- [Description](#description)
- [Key Features](#key-features)
- [Use Cases](#use-cases)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Key Dependencies](#key-dependencies)
- [Available Scripts](#available-scripts)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Development Setup](#development-setup)
- [Testing](#testing)
- [Contributing](#contributing)

**LINK**: parakh-j70rrjdyq-cycode-as-projects.vercel.app

 📝 Description

Parakh is a full-stack web application designed to help job seekers evaluate and identify trustworthy employment and internship opportunities. By analyzing professional profiles including resumes, GitHub accounts, LinkedIn profiles, and portfolios, the application helps users filter and assess listings that align with their background and verified skills.

 Key Features

- 🤖 AI-Powered Profile Analysis** — Utilizes the Anthropic SDK to analyze candidate resumes, portfolios, and professional profiles against career opportunities.
- 🌐 Next.js App Router Architecture** — Organized around a modern Next.js directory layout utilizing separate landing page components and layouts.
- 🎨 Tailwind CSS Interface** — Includes responsive, pre-styled interface elements such as Stats, Features, and Pricing components using Tailwind CSS.
- 🧪 Jest Testing Suite** — Equipped with Jest and Testing Library configuration to execute tests and verify component behavior.

🎯 Use Cases

- Job seekers evaluating whether an internship matches the technical skills displayed in their GitHub and LinkedIn profiles.
- Candidates seeking automated, AI-driven feedback on how well their resume aligns with specific job listings.
- Developers deploying a customizable, Next.js-based career assessment portal integrated with LLM analysis.

🛠️ Tech Stack

 **JavaScript**
  **Next.js**
  **Tailwind CSS**

**Notable libraries:** Anthropic SDK, Jest, Testing Library

⚡ Quick Start

```bash

# 1. Clone the repository
git clone https://github.com/cycode-as/Parakh.git

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

📦 Key Dependencies

```
@anthropic-ai/sdk: ^0.36.3
@google/genai: ^2.8.0
next: 14.2.29
react: ^18
react-dom: ^18
```

🚀 Available Scripts

- **dev** — `npm run dev`
- **build** — `npm run build`
- **start** — `npm run start`
- **lint** — `npm run lint`
- **test** — `npm run test`

🌐 API Endpoints

Detected endpoints (best-effort scan):

```
/api/analyze
```

📁 Project Structure

```
.
├── .kiro
│   └── specs
│       └── careershield-ai
│           ├── design.md
│           ├── requirements.md
│           └── tasks.md
├── __tests__
│   ├── SkillGap.property.test.js
│   ├── TrustCard.property.test.js
│   ├── analyze-route.property.test.js
│   ├── colors.property.test.js
│   ├── loading.property.test.js
│   ├── normalize.property.test.js
│   ├── schema.property.test.js
│   └── validation.property.test.js
├── app
│   ├── api
│   │   └── analyze
│   │       └── route.js
│   ├── dashboard
│   │   ├── analyze
│   │   │   └── page.jsx
│   │   ├── layout.jsx
│   │   ├── page.jsx
│   │   ├── profile
│   │   │   └── page.jsx
│   │   ├── reports
│   │   │   └── page.jsx
│   │   ├── results
│   │   │   └── page.jsx
│   │   └── settings
│   │       └── page.jsx
│   ├── globals.css
│   ├── layout.jsx
│   ├── login
│   │   └── page.jsx
│   ├── page.jsx
│   └── signup
│       └── page.jsx
├── components
│   ├── ActionCard.jsx
│   ├── FitCard.jsx
│   ├── InputForm.jsx
│   ├── LoadingState.jsx
│   ├── SkillGap.jsx
│   ├── TrustCard.jsx
│   ├── dashboard
│   │   ├── Sidebar.jsx
│   │   └── TopNav.jsx
│   ├── landing
│   │   ├── Features.jsx
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx
│   │   ├── HowItWorks.jsx
│   │   ├── Navbar.jsx
│   │   ├── Pricing.jsx
│   │   ├── Stats.jsx
│   │   └── Testimonials.jsx
│   ├── results
│   │   ├── CareerMatchCard.jsx
│   │   ├── CircularScore.jsx
│   │   ├── LearningRoadmapCard.jsx
│   │   ├── RecommendationCard.jsx
│   │   ├── RecommendedProjectsCard.jsx
│   │   ├── SkillGapCard.jsx
│   │   └── TrustScoreCard.jsx
│   └── ui
│       ├── Badge.jsx
│       ├── Button.jsx
│       ├── Card.jsx
│       └── Skeleton.jsx
├── lib
│   ├── colors.js
│   ├── normalize.js
│   ├── presets.js
│   ├── prompt.js
│   ├── schema.js
│   └── validation.js
├── next.config.js
├── package.json
├── postcss.config.js
└── tailwind.config.js
```

🛠️ Development Setup

Node.js / JavaScript
1. Install Node.js (v18+ recommended)
2. Install dependencies: `npm install` (or `yarn` / `pnpm install` / `bun install`)
3. Start the dev server: see the **Quick Start** above

🧪 Testing

This project uses **Jest, Testing Library** for testing.

```bash
npm run test
```

👥 Contributing

Contributions are welcome! Here's the standard flow:

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/cycode-as/Parakh.git`
3. **Branch**: `git checkout -b feature/your-feature`
4. **Commit**: `git commit -m 'feat: add some feature'`
5. **Push**: `git push origin feature/your-feature`
6. **Open** a pull request

Please follow the existing code style and include tests for new behavior where applicable.
