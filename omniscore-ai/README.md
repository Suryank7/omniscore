# OmniScore AI — 360° AI-Driven CV & Portfolio Analyzer

> **OmniScore AI** is an enterprise-grade career intelligence platform that evaluates professional profiles across CVs, GitHub repositories, and data portfolios. It moves beyond black-box keyword matching by delivering transparent, explainable scoring, vector-based skill gap analysis, and real-time optimization suggestions.

---

## 🌟 Key Features

- 📄 **Universal Resume Parser**: Ingests PDF, DOCX, and raw text files. Uses local regex NLP entity extraction with optional LLM enhancement.
- 📊 **Explainable Scoring Engine**: Computes a transparent 0-100 composite score based on 4 independent pillars:
  - **ATS Compatibility (20%)**: Section structure, contact details, length, readability.
  - **Skill Match (40%)**: Cosine similarity against target job descriptions using TF-IDF vectorization.
  - **Proof of Work (25%)**: GitHub commit metrics, repository complexity, language diversity, and projects.
  - **Impact & Language (15%)**: Action verb frequency, quantified metrics, and bullet point detail.
- 🎯 **Vector-Based Skill Gap Analysis**: Side-by-side comparison of candidate skills vs. job requirements with category breakdowns and critical gap indicators.
- 💡 **Real-Time Optimization Suggestions**: Line-by-line bullet point rewrites, missing keyword alerts, and actionable structural advice.
- 🐙 **GitHub Portfolio Integration**: Syncs profile data via GitHub REST API with graceful fallback to simulated metrics.
- 🎨 **Enterprise Design System**: Modern dark-mode interface built with Deep Navy and Emerald Green palette, glassmorphism, radar charts, and micro-animations.

---

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router, Server Actions, API Routes)
- **Styling**: Tailwind CSS + Enterprise Design System Tokens
- **Icons**: Lucide React
- **Charts**: Recharts (Radar Chart & Gauge Visualization)
- **Document Parsing**: `pdf-parse` (PDF) + `mammoth` (DOCX)
- **Language & Runtime**: TypeScript / Node.js

---

## 🛠️ Local Setup & Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

### Installation

```bash
# Clone repository
git clone https://github.com/your-org/omniscore-ai.git
cd omniscore-ai

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📐 Scoring Formula

$$\text{OmniScore} = (S_{ats} \times 0.20) + (S_{gap} \times 0.40) + (S_{pow} \times 0.25) + (S_{nlp} \times 0.15)$$

Where:
- $S_{ats}$: ATS formatting & structural compliance score (0-100)
- $S_{gap}$: Cosine similarity match score against target job description (0-100)
- $S_{pow}$: Proof of work score from GitHub repos, commits, & projects (0-100)
- $S_{nlp}$: Impact score evaluated by action verbs and quantified achievements (0-100)

---

## 🌐 API Routes

- `POST /api/analyze`: Main CV analysis endpoint (accepts multipart file or raw text).
- `GET /api/job-descriptions`: List pre-seeded target job descriptions.
- `POST /api/job-descriptions`: Add a new target job description with auto-extracted skills.
- `GET /api/github?username=...`: Fetch live GitHub metrics.
- `GET /api/history`: List all historical analyses.
- `GET /api/history/[id]`: Fetch detailed analysis report by ID.

---

## 🛡️ Data Privacy & Safety

- **PII Protection**: Email, phone numbers, and location details are isolated and masked.
- **Local Fallback**: Full capability operates completely offline without mandatory external API keys.

---

## 📄 License

MIT License. Designed and engineered for high-impact enterprise career intelligence.
