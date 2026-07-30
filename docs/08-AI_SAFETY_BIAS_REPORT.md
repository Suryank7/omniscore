# AI Safety & Bias Mitigation Report — OmniScore AI

## 1. Executive Summary
OmniScore AI prioritizes objective, bias-free candidate evaluation. Human hiring processes frequently suffer from unconscious bias related to candidate names, gender, age, university prestige, or geographic location. OmniScore AI mitigates these biases by enforcing strict PII stripping, blind scoring algorithms, and explainable scoring models.

---

## 2. Bias Mitigation Mechanisms

### 2.1 Blind Candidate Evaluation
- Candidate full names, gender pronouns, personal emails, phone numbers, and physical addresses are automatically stripped or masked prior to evaluation.
- Scores are computed solely on technical skill overlap, proof-of-work metrics (code repositories, data models), and bullet point structure.

### 2.2 Explainable AI (XAI) Model
- OmniScore AI rejects "black-box" scoring neural networks.
- Scores are calculated via a transparent composite formula where every point is mapped to empirical findings:
  $$\text{OmniScore} = (S_{\text{ATS}} \cdot 0.20) + (S_{\text{SkillMatch}} \cdot 0.40) + (S_{\text{ProofOfWork}} \cdot 0.25) + (S_{\text{Impact}} \cdot 0.15)$$

---

## 3. PII Safety & Data Privacy Architecture
- **In-Memory Processing**: CV text processing is executed in transient memory.
- **No Training on Candidate Data**: Candidate CVs are never used to fine-tune public LLM models.
- **Local Fallback**: Full parsing and scoring capability operates completely offline without external network calls.
