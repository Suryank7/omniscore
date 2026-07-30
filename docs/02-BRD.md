# Business Requirements Document (BRD) — OmniScore AI

## 1. Objectives & Scope
The objective of OmniScore AI is to deliver an enterprise-grade SaaS application providing automated profile scoring, skill gap identification, and real-time optimization recommendations across individual candidates and enterprise recruiting teams.

---

## 2. Key Business Requirements

### BRD-01: Multi-Format Document Ingestion
- Must accept PDF, DOCX, and raw text files up to 10MB.
- Must extract text with >= 95% section recognition accuracy.

### BRD-02: Transparent 4-Pillar Scoring
- Must compute composite scores (0–100) using the weighted formula:
  $$\text{OmniScore} = (\text{ATS} \times 0.20) + (\text{SkillMatch} \times 0.40) + (\text{ProofOfWork} \times 0.25) + (\text{Impact} \times 0.15)$$

### BRD-03: Multi-Platform Portfolio Integration
- Must harvest proof-of-work metrics from GitHub (repos, commits, languages), LinkedIn (completeness), Tableau Public (workbooks, views), and Power BI (DAX measures).

### BRD-04: Enterprise Workspaces & Multi-Tenancy
- Must support multi-tenant recruiter candidate candidate pools with RBAC roles (`Owner`, `Admin`, `Recruiter`, `Viewer`).

### BRD-05: Executive Report Export
- Must generate 1-click printable PDF executive scorecards for candidates and hiring managers.

### BRD-06: Monetization & Billing
- Must support Freemium ($0), Pro Candidate ($19/mo), and Enterprise Recruiter ($99/mo) billing via Stripe.
