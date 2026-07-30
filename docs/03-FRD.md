# Functional Requirements Document (FRD) — OmniScore AI

## 1. User Journeys & Functional Modules

```
[Candidate / Recruiter]
       │
       ▼
┌──────────────┐      ┌─────────────────┐      ┌──────────────────┐
│  Upload CV   │ ───► │   NLP Parsing   │ ───► │ Vector Matching  │
└──────────────┘      └─────────────────┘      └──────────────────┘
                                                        │
       ┌────────────────────────────────────────────────┘
       ▼
┌──────────────┐      ┌─────────────────┐      ┌──────────────────┐
│  Scorecard   │ ───► │  Skill Matrix   │ ───► │ Bullet Rewrites  │
└──────────────┘      └─────────────────┘      └──────────────────┘
```

---

## 2. Functional Requirements Details

### FR-101: Resume NLP Entity Parsing
- **Inputs**: File upload (PDF/DOCX) or plain text.
- **Process**: Regex NLP & spaCy NER extracts contact details, skills, bullets, action verbs, and quantified metrics.
- **Outputs**: Structured JSON object containing extracted entities and section metadata.

### FR-102: Vector Skill Gap Matching
- **Inputs**: Candidate skill list + target job description.
- **Process**: Computes TF-IDF vector representations and Cosine Similarity:
  $$\text{CosineSimilarity}(A, B) = \frac{\mathbf{A} \cdot \mathbf{B}}{\|\mathbf{A}\| \|\mathbf{B}\|}$$
- **Outputs**: Similarity percentage, matched skills, missing critical gaps, category breakdowns.

### FR-103: Optimization Engine & Bullet Rewrites
- **Inputs**: Experience bullet points.
- **Process**: Identifies weak opener verbs and missing metrics, suggesting action verb rewrites (e.g., `Developed`, `Architected`, `Optimized`).
- **Outputs**: Side-by-side diff card with 1-click copy functionality.

### FR-104: Multi-Tab Portfolio Dashboard
- **Inputs**: Handles or URLs for GitHub, LinkedIn, Tableau Public, and Power BI.
- **Process**: Fetches REST API metrics or applies parsing heuristics.
- **Outputs**: Visual metric cards (stars, commits, views, DAX score, completeness).

### FR-105: Recruiter Candidate Candidate Pool Matrix
- **Inputs**: Evaluated candidates in a workspace.
- **Process**: Sorts and ranks candidates across all 4 pillar scores.
- **Outputs**: Interactive comparative table with PDF export buttons.
