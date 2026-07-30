# Security Threat Model & Compliance Spec — OmniScore AI

## 1. Threat Matrix (OWASP Top 10 Mitigation)

| Threat Vector | Risk Level | OmniScore AI Control & Safeguard |
|---|---|---|
| **Injection Attacks (SQLi / Command)** | High | Use of parameterized ORM models & Pydantic strict type validation |
| **Sensitive Data Exposure (PII)** | High | Client-side and server-side PII stripping middleware (`PIIRedactor`) |
| **Broken Authorization (BFLA)** | High | Role-Based Access Control (RBAC) enforced across workspace endpoints |
| **Cross-Site Scripting (XSS)** | Medium | React automatic JSX escaping + Content Security Policy (CSP) headers |
| **Unauthenticated API Access** | Medium | JWT bearer tokens & Stripe webhook signature verification |

---

## 2. Data Protection & Encryption Rules
- **Data in Transit**: Enforced TLS 1.3 encryption across all client-to-server and inter-microservice communication.
- **Data at Rest**: Vector embeddings stored in Qdrant with volume encryption.
- **API Keys**: Stored securely in server environment variables (`.env`).
