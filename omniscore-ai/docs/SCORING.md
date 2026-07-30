# OmniScore AI — Scoring Engine Technical Specification

This document details the mathematical models, entity extraction algorithms, and scoring heuristics utilized by OmniScore AI.

---

## 1. Mathematical Scoring Model

OmniScore AI avoids black-box evaluation by computing a composite weighted score out of 100 points across four discrete pillars:

$$\text{OmniScore} = \sum_{p \in P} (W_p \cdot S_p)$$

Where:
- $P = \{ \text{ATS}, \text{SkillMatch}, \text{ProofOfWork}, \text{Impact} \}$
- $W_{\text{ATS}} = 0.20$
- $W_{\text{SkillMatch}} = 0.40$
- $W_{\text{ProofOfWork}} = 0.25$
- $W_{\text{Impact}} = 0.15$

---

## 2. Pillar Breakdown

### Pillar 1: ATS Compatibility ($S_{\text{ATS}}$ — Weight: 20%)
Evaluates mechanical and structural readability by automated scanners:
- **Contact Details (30 pts)**: Presence of valid email, phone, location, LinkedIn URL.
- **Section Headers (25 pts)**: Standard section titles (`Summary`, `Experience`, `Skills`, `Education`).
- **Document Length (20 pts)**: Word count between 300 and 900 words.
- **Entity Density (15 pts)**: Ratio of technical keywords to total word count.
- **Online Presence (10 pts)**: GitHub and personal portfolio links.

### Pillar 2: Skill Match ($S_{\text{SkillMatch}}$ — Weight: 40%)
Uses TF-IDF term vectorization and Cosine Similarity:

$$\text{CosineSimilarity}(A, B) = \frac{\mathbf{A} \cdot \mathbf{B}}{\|\mathbf{A}\| \|\mathbf{B}\|} = \frac{\sum_{i=1}^{n} A_i B_i}{\sqrt{\sum_{i=1}^{n} A_i^2} \sqrt{\sum_{i=1}^{n} B_i^2}}$$

- **Direct Matches**: Exact string matches against job requirements.
- **Semantic Matches**: Equivalence rules (e.g., `React.js` $\equiv$ `React`, `K8s` $\equiv$ `Kubernetes`).
- **Skill Implications**: Hierarchical inference (e.g., `FastAPI` implies `Python`).
- **Critical Penalty**: Deduction of 5 points for each missing critical requirement.

### Pillar 3: Proof of Work ($S_{\text{ProofOfWork}}$ — Weight: 25%)
Quantifies demonstrated technical proof:
- **Projects Section (30 pts)**: Projects listed on resume.
- **GitHub Repositories (15 pts)**: Public repositories count and activity.
- **Star Recognition (10 pts)**: Community validation stars.
- **Commit Frequency (15 pts)**: Contribution activity density.
- **Polyglot Score (10 pts)**: Diversity of programming languages.
- **Certifications (10 pts)**: Verified professional certifications.

### Pillar 4: Impact & Language ($S_{\text{Impact}}$ — Weight: 15%)
Evaluates achievement orientation and linguistic quality:
- **Action Verbs (30 pts)**: Bullet points starting with strong past-tense action verbs (e.g., `Architected`, `Optimized`, `Engineered`).
- **Quantified Metrics (30 pts)**: Bullet points containing numerical metrics, percentages, or financial figures.
- **Bullet Density (20 pts)**: Optimal bullet count per role (3–6 bullets).
- **Summary Quality (10 pts)**: Presence of a 2–3 sentence professional value summary.
- **Readability & Length (10 pts)**: Average bullet length between 8 and 25 words.

---

## 3. Grade Scale & Classification

| Score Range | Grade | Classification |
|---|---|---|
| 90 – 100 | A+ | Outstanding |
| 80 – 89 | A | Excellent |
| 70 – 79 | B+ | Strong |
| 60 – 69 | B | Good |
| 50 – 59 | C | Average |
| 40 – 49 | D | Below Average |
| 0 – 39 | F | Needs Improvement |
