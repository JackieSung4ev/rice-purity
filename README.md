# Rice Purity Test

[English](README.md) | [简体中文](README.zh-CN.md)

> A modern, responsive, client-only, bilingual (EN / ZH / Bilingual) web application for the Rice Purity Test. Presents one question at a time, computes scores entirely locally, and generates clean, privacy-respecting 1-page A4 PDF summary reports.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.3-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178c6.svg)
![Vite](https://img.shields.io/badge/Vite-5.2-646cff.svg)

---

## Key Features

- **Modern Clean Aesthetic**: Professional blue-white design system, subtle border radii, crisp typography, generous breathing room, and prominent score visualization without fake browser frames.
- **Single-Question Step Flow**: Displays one question at a time. Built-in transition locks (200ms debounce/sync lock) prevent rapid misclicks.
- **Keyboard Navigation & 3D Keycap Badges**:
  - `←` or `Y`: Answer **Yes**
  - `→` or `N`: Answer **No**
  - `↑`: Go to **Previous** question
  - `↓` or `S`: **Skip / Next**
  - Tactile 3D physical keycaps (`KeyBadge`) and high-contrast shortcut dock provide instant clarity.
- **Collapsible Question Navigation Sidebar**:
  - Jump instantly to any question number.
  - **Expanded Mode**: Full question titles with real-time status badges (Answered / Skipped / Remaining).
  - **Collapsed Mini Rail**: Crisp rounded rectangle squircle tiles (`1`, `2`, ..., `100`), free of `#` noise, featuring comfortable vertical row spacing (`12px`) and generous bottom whitespace.
- **Strict Scoring Contract**:
  - `score = 100 - YesCount` after completing all 100 questions.
  - `0` and `100` are valid scores; Skipped is strictly separated from No.
  - Incomplete tests do not produce a premature score (`score = null`).
  - Score represents solely the count of unchecked experiences, with zero moral judgment or rank-shaming.
- **Adaptive Bilingual Support**:
  - Automatically detects browser preference (English or Chinese), with seamless runtime toggle: `English`, `中文`, `Bilingual`.
  - Language switching preserves active quiz state and answers.
- **Privacy-Preserving Local PDF Export**:
  - Powered by `@react-pdf/renderer` dynamically loaded on demand (never bloats the initial quiz bundle).
  - Exports a clean, 1-page A4 summary (score, answered counts, philosophy statement, timestamp, and timezone).
  - **Strictly excludes individual question answers** from the PDF and print outputs, ensuring total personal privacy even if answers are revealed on screen.
  - Ships with self-hosted `NotoSansSC-Regular.ttf` for pristine Chinese rendering without missing glyphs.
- **Zero Tracking & Full Privacy**:
  - 100% client-side computation. No analytics, no remote database, no tracking scripts, no ads.
  - Quiz session stored in `sessionStorage` (`rpt:session:v1`) with graceful in-memory fallback.
- **Fully Responsive & Fluid Typography**:
  - Tested and optimized across 27" desktop monitors (`1920px` fluid width), 14" laptops, and mobile viewports (`390px` iPhone).

---

## Question Bank & Review Status

- **Default Question Bank**: Official 100-question Rice Purity Test (`src/content/official100Questions.ts`) with `reviewStatus: 'approved'`.
- **Question #69**: Verified and authorized with bilingual localization:
  - English: `Have you ever done a 69?`
  - Chinese: `曾进行过69式（互相口交）？`
- **Illustration-Ready**: The `Question` schema includes an optional `imageUrl?: string` field, ready for custom artwork per question in future iterations.

---

## Getting Started

### Prerequisites

- Node.js >= 18.0.0 (Node 20+ recommended)
- npm >= 9.0.0

### Installation & Run

```bash
# 1. Clone the repository
git clone https://github.com/JackieSung4ev/rice-purity.git
cd rice-purity

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Run unit tests (D01 - D10 scoring & validation suite)
npm run test

# 5. Type-check and production build
npm run build

# 6. Preview static build locally
npm run preview
```

---

## Verification & Acceptance Checklist

| Category        | ID  | Check Item                                          | Verification Result                       |
| --------------- | --- | --------------------------------------------------- | ----------------------------------------- |
| **Scoring**     | D01 | 100 No answers = 100 score                          | Passed (Vitest test suite)                |
| **Scoring**     | D02 | 100 Yes answers = 0 score                           | Passed (Vitest test suite, valid 0 score) |
| **Scoring**     | D03 | 28 Yes + 72 No = 72 score                           | Passed (Vitest test suite)                |
| **Scoring**     | D04 | Changing Yes to No increments score by 1            | Passed (Vitest test suite)                |
| **Scoring**     | D05 | 28 Yes + 71 No + 1 Skip = Incomplete                | Passed (`score = null`)                   |
| **Scoring**     | D07 | Unvisited distinguished from Skipped                | Passed (Distinct tracking)                |
| **Scoring**     | D08 | Invalid / corrupted session intercepted             | Passed (`validateSession` guard)          |
| **Scoring**     | D10 | Draft demo bank does not produce official score     | Passed (`reviewStatus: draft`)            |
| **Interaction** | I01 | Single-question view                                | Passed (Puppeteer desktop & mobile)       |
| **Interaction** | I02 | Rapid double-click protection                       | Passed (200ms transition lock)            |
| **Interaction** | I07 | Answer details collapsed by default                 | Passed (Protected by user disclosure)     |
| **Interaction** | I08 | Edit individual answer from results                 | Passed (Save & Return flow)               |
| **PDF**         | P01 | Chinese, English, Bilingual export                  | Passed (1-page A4 summary)                |
| **PDF**         | P02 | Chinese font and punctuation                        | Passed (Noto Sans SC, zero glyph errors)  |
| **PDF**         | P03 | PDF excludes question-by-question breakdown         | Passed (Privacy guaranteed)               |
| **Privacy**     | S01 | No server uploads, zero external telemetry          | Passed (Pure client-side static)          |
| **Visual**      | V01 | Responsive scaling (1920px desktop to 390px mobile) | Passed (Fluid clamp typography)           |

---

## Project Structure

```text
rice-purity/
├── docs/rice-purity-handoff/       # Archived handoff specifications & reference UI
│   ├── Rice_Purity_Test_Codex_Handoff_v1.0.md
│   ├── rice.txt
│   └── references/
│       ├── home-ui.png
│       └── result-ui.png
├── public/
│   ├── favicon.svg
│   └── fonts/                      # Self-hosted Noto Sans SC / SimHei fonts for PDF
├── src/
│   ├── app/
│   │   ├── App.tsx                 # App root, layout, printable summary
│   │   └── router.tsx              # Application routing
│   ├── components/
│   │   ├── Navbar.tsx              # Top navigation & language switcher
│   │   ├── Footer.tsx              # Footer & privacy statements
│   │   ├── ConfirmDialog.tsx       # Retake / reset confirmation modal
│   │   └── QuestionNavSidebar.tsx  # Collapsible question jump sidebar
│   ├── content/
│   │   ├── official100Questions.ts # Official 100 questions (approved, default)
│   │   ├── demoQuestions.ts        # 10-item demo questionnaire (draft)
│   │   └── draft100Questions.ts    # 100-item questionnaire draft
│   ├── features/quiz/
│   │   ├── types.ts                # TypeScript domain types & contracts
│   │   ├── scoring.ts              # Pure function scoring engine
│   │   ├── validation.ts           # Question bank & session validator
│   │   ├── storage.ts              # sessionStorage with in-memory fallback
│   │   ├── quizContext.tsx         # Quiz state machine & action dispatchers
│   │   └── __tests__/scoring.test.ts # Vitest unit test suite
│   ├── i18n/
│   │   ├── messages.ts             # English & Chinese translation dictionaries
│   │   └── LanguageContext.tsx     # Language auto-detection & provider
│   ├── pages/
│   │   ├── HomePage.tsx            # Landing page & FAQ
│   │   ├── TestPage.tsx            # Single question quiz flow & keyboard controls
│   │   ├── ResultPage.tsx          # Score display & collapsible answer breakdown
│   │   ├── PrivacyPage.tsx         # Zero-data privacy statement & local reset
│   │   └── NotFoundPage.tsx        # 404 handler
│   ├── pdf/
│   │   ├── ResultPdfDocument.tsx   # React-pdf A4 summary document
│   │   └── exportPdf.ts            # Dynamic importer & PDF download controller
│   └── styles/
│       ├── tokens.css              # Design tokens (colors, radii, fluid widths)
│       └── main.css                # Global & print stylesheets
├── scripts/                        # Verification & screenshot capture utilities
├── package.json
└── tsconfig.json
```

---

## License

MIT © [JackieSung4ev](https://github.com/JackieSung4ev)
