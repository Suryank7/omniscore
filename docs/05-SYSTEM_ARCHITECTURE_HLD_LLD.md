# System Architecture Document (HLD & LLD) — OmniScore AI

## 1. High-Level Architecture (HLD)

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Next.js 15 Web Frontend                         │
│   Dashboard • Scorecard • Skill Matrix • Optimizations • Portfolio UI   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP REST / JSON
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      Next.js API Gateway Routes                        │
│     /api/analyze • /api/connectors/* • /api/workspaces • /api/stripe   │
└───────────────────┬────────────────────────────────┬───────────────────┘
                    │                                │
                    ▼                                ▼
┌───────────────────────────────────────┐  ┌─────────────────────────────┐
│  Python FastAPI AI Engine (Port 8000) │  │  Qdrant Vector DB (6333)    │
│  spaCy NER • PII Redactor • Scoring   │  │  384-dim Skill Embeddings   │
└───────────────────────────────────────┘  └─────────────────────────────┘
```

---

## 2. Low-Level Module Architecture (LLD)

### 2.1 Next.js Gateway Layer (`omniscore-ai/app/api/`)
- `POST /api/analyze`: Multipart file parsing, skill matching, and database persistence.
- `GET /api/connectors/tableau`: Tableau Public API connector.
- `GET /api/export-pdf/[id]`: HTML-to-PDF scorecard template renderer.

### 2.2 Python AI Engine Layer (`apps/ai-engine/`)
- `services/pii_redactor.py`: Regex pattern masking (`[REDACTED_EMAIL]`, `[REDACTED_PHONE]`).
- `services/parser_service.py`: spaCy entity extraction and bullet action verb density calculator.
- `services/vector_service.py`: TF-IDF vector builder and cosine similarity calculator:
  $$\text{Similarity} = \frac{\mathbf{A} \cdot \mathbf{B}}{\|\mathbf{A}\| \|\mathbf{B}\|}$$
- `services/scoring_service.py`: Python implementation of 4-pillar composite scoring algorithm.

---

## 3. Data Models & Schemas

### Analysis Entity Schema
```json
{
  "id": "uuid-string",
  "createdAt": "ISO-timestamp",
  "fileName": "resume.pdf",
  "scoreBreakdown": {
    "overall": 88,
    "grade": "A",
    "pillars": {
      "ats": { "score": 92, "weight": 0.20 },
      "skillMatch": { "score": 85, "weight": 0.40 },
      "proofOfWork": { "score": 90, "weight": 0.25 },
      "impact": { "score": 84, "weight": 0.15 }
    }
  }
}
```
