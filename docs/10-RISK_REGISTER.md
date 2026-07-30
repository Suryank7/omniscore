# Risk Register & Risk Mitigation Matrix — OmniScore AI

## 1. Risk Assessment Matrix

| Risk ID | Category | Risk Description | Probability | Impact | Mitigation Strategy |
|---|---|---|---|---|---|
| **RSK-01** | Technical | Third-party rate limits on GitHub / Tableau Public APIs | Medium | Medium | Implement local cache + graceful mock fallback data generator |
| **RSK-02** | Operational | PDF parsing failures on non-standard graphical resumes | Low | High | OCR fallback engine + raw text paste alternative option |
| **RSK-03** | Security | Unintended exposure of candidate PII | Low | High | `PIIRedactor` regex guardrail before LLM calls |
| **RSK-04** | Business | Lower conversion on Pro SaaS tier | Medium | Medium | Freemium tier (3 free analyses/mo) to demonstrate value |
| **RSK-05** | Infrastructure | Vector DB memory exhaustion under high volume | Low | Medium | Qdrant vector quantization & storage disk persistence |
