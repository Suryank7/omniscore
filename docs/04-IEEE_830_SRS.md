# IEEE 830 Software Requirements Specification (SRS) — OmniScore AI

## 1. Introduction
This document specifies the software requirements for OmniScore AI in accordance with the IEEE 830-1998 standard for Software Requirements Specifications.

---

## 2. External Interface Requirements

### 2.1 User Interfaces
- Modern web dashboard built with Next.js, React, and Tailwind CSS.
- Color Palette: Deep Navy (`#0A1628`), Emerald Green (`#10B981`), Cyan (`#06B6D4`), Purple (`#8B5CF6`).
- Interactive elements: Recharts Radar Charts, SVG Score Gauges, Glassmorphic Cards.

### 2.2 API Interfaces
- RESTful HTTP APIs over TLS 1.3 (`/api/analyze`, `/api/connectors/*`, `/api/workspaces`, `/api/export-pdf/[id]`).

---

## 3. Non-Functional Requirements

### 3.1 Performance Requirements
- **NFR-PERF-01**: Resume parsing and scoring must complete within 15 seconds.
- **NFR-PERF-02**: Page load time for dashboard views must be < 1.5 seconds.
- **NFR-PERF-03**: PDF generation must execute within 2 seconds.

### 3.2 Reliability & Availability
- **NFR-REL-01**: System uptime SLA of 99.9%.
- **NFR-REL-02**: Microservices must implement graceful degradation (mock fallback) when third-party APIs are unreachable.

### 3.3 Security & Compliance
- **NFR-SEC-01**: PII redaction must mask email, phone, and SSN prior to external LLM calls.
- **NFR-SEC-02**: All data in transit encrypted via HTTPS/TLS 1.3.
- **NFR-SEC-03**: Support Role-Based Access Control (RBAC) across workspace members.
