# StudySphere — Application Security Assessment & Findings

**Author:** Senior Application Security Tester & SDET  
**Target:** StudySphere Backend REST API & Real-time WebSockets  
**Assessment Standard:** OWASP Top 10 (2021)  
**Date:** October 2026  

---

## 1. Security Posture Summary

| Category | Status | Risk Rating | Summary |
| :--- | :--- | :--- | :--- |
| **A01: Broken Access Control** | **Strong** | Low | Protected routes (`/api/auth/me`, `/api/rooms` POST, `/api/users/profile`) strictly enforce `authenticateUser`. |
| **A02: Cryptographic Failures** | **Strong** | Low | Passwords salted and hashed with `bcryptjs` (salt rounds: 10). Production guard throws on weak/placeholder `JWT_SECRET`. |
| **A03: Injection (NoSQL & ReDoS)**| **Strong** | Low | Search queries sanitized with `escapeRegex` preventing ReDoS; type guards reject object injection payloads. |
| **A04: Insecure Design (Business Logic)**| **Remediated** | Medium | Discovered pre-award vulnerability in `doubtController.ts` (`BUG-01`); fixed by gating point awards behind document resolution checks. |
| **A05: Security Misconfiguration** | **Strong** | Low | CORS headers configured; rate limiters protect auth endpoints from brute force. |
| **A07: Identification & Auth Failures** | **Strong** | Low | Sliding window rate limiter (15 attempts/minute) protects against credential stuffing. |
| **A08: Software & Data Integrity** | **Strong** | Low | Strict type guards on body inputs; ObjectId validation guards against casting crashes. |

---

## 2. Detailed Findings & Verifications

### 2.1 ReDoS (Regular Expression Denial of Service) Protection
- **Status:** **PASS**
- **Verification:** Evaluated in `server/test/security.test.ts`. User-supplied query strings in doubt and room searches pass through `escapeRegex()` before being passed to MongoDB `$regex`.
- **Finding:** Malicious payloads with nested quantifiers (e.g., `(a+)+$`) or unescaped metacharacters cannot trigger catastrophic backtracking.

### 2.2 NoSQL Query Injection Defense
- **Status:** **PASS**
- **Verification:** Evaluated in `server/test/security.test.ts`. Handlers explicitly enforce `typeof field === 'string'`. Payloads containing `{ "$gt": "" }` or `{ "$ne": null }` are rejected with `400 Bad Request` before reaching Mongoose queries.

### 2.3 JWT Production Secret Guard
- **Status:** **PASS**
- **Verification:** Tested in `server/test/security.test.ts`. The server enforces fail-safe startup: if `NODE_ENV === 'production'` and `JWT_SECRET` is missing, empty, or equals known placeholder values, the process refuses to start.

### 2.4 Brute Force & Rate Limiting
- **Status:** **PASS**
- **Verification:** Endpoints `/api/auth/register` and `/api/auth/login` are gated by an in-memory sliding window rate limiter (15 requests per 60 seconds per IP). Sockets enforce a per-socket limit of 10 messages per second.
