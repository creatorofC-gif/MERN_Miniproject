# StudySphere — Master QA Test Strategy

**Author:** Senior QA Automation Engineer & Application Security Tester  
**Application:** StudySphere (MERN + Socket.IO Collaborative Peer-Learning Platform)  
**Version:** 1.0.0-rc  
**Date:** October 2026  
**Status:** Approved & Active  

---

## 1. Executive Summary & Quality Mission
The objective of this comprehensive quality strategy is to establish rigorous, repeatable, codebase-driven test engineering across StudySphere. Quality assurance is executed against actual business logic, database transactions in MongoDB Atlas, real-time WebSocket state machines, authentication boundaries, and UI presentation layers.

Testing specifically targets:
1. **Data Integrity & Point Economy:** Guaranteeing that mastery points, streaks, tier thresholds, and doubt statuses remain strictly consistent, atomic, and idempotent across REST APIs, WebSockets, and UI state.
2. **Real-Time Concurrency:** Validating room presence, synchronized Pomodoro timer state, and multi-user doubt resolution under race conditions and rapid event triggers.
3. **Application Security:** Verifying authentication token controls, authorization gates, input sanitization (NoSQL injection, ReDoS, XSS), and rate limiting.
4. **Resilience & State Synchronization:** Ensuring smooth recoveries during network blips, reconnects, optimistic updates, and background tab execution.

---

## 2. Scope of Testing

### 2.1 In-Scope
- **Authentication Lifecycle:** Registration, bcrypt hashing, JWT issuance/validation, token expiration, fresh account defaults.
- **Study Rooms & Presence:** Room joining (`join_room`), real-time peer count broadcasting, presence cleanup on disconnect, and cross-room event isolation.
- **In-Room Live Doubts:** Live doubt alerts (`raise_doubt_alert`), threaded peer answers (`reply_room_doubt`), resolution (`resolve_room_doubt`), and multi-solver +50 mastery point distribution.
- **Global Academic Doubts:** MongoDB Atlas doubt retrieval, multi-criteria filtering (`All Doubts`, `High Reward`, `Needs Review`, `Unanswered`), answer submissions, and accepted solution bounty awarding.
- **Scholars Leaderboard:** Skeleton loading states, graceful transitions, podium rendering (Gold/Silver/Bronze), logged-in user spotlight ranking, and silent background re-validation.
- **Synchronized Pomodoro Timer:** Shared room countdown (`timer_sync`), play/pause/reset/skip controls, completion confetti, and toast triggers.
- **Centralized Toast System:** Global `ToastContext` (`useToast`), dismissal lifecycles, and event completion notifications.
- **Profile & Account Synchronization:** Bio, college, branch editing, daily goals toggling, and global state propagation across Sidebar, Topbar, Dashboard, and Profile.

### 2.2 Out-of-Scope
- Real payment processing gateways (marketplace currently simulated via in-app points and tier tiers).
- External canvas LMS third-party integrations (mocked/reserved for future scope).
- Automated browser-level UI recording (explicitly disabled per user instruction; verified via automated API, socket, unit, and DOM integration tests).

---

## 3. Test Levels & Tooling Architecture

```
┌────────────────────────────────────────────────────────┐
│                   Test Pyramid Levels                  │
├─────────────────────────┬──────────────────────────────┤
│ 1. Invariant & Unit     │ Built-in Node:Test & TSX     │
│ 2. API Integration      │ Fetch / Supertest Integration│
│ 3. WebSocket Integration│ Socket.IO Client Test Harness│
│ 4. Security & Abuse     │ Security Test Suite          │
│ 5. Concurrency & Race   │ Parallel Promise Simulators  │
└─────────────────────────┴──────────────────────────────┘
```

| Level | Framework / Runner | Target Codebase | Execution Command |
| :--- | :--- | :--- | :--- |
| **Security & Unit** | `node:test` + `tsx` | `server/test/security.test.ts` | `npm test --prefix server` |
| **API & Real-time Integration** | `node:test` + `socket.io-client` | `server/test/integration.test.ts` | `npx tsx --test server/test/integration.test.ts` |
| **Idempotency & Concurrency** | `node:test` + `tsx` | `server/test/concurrency.test.ts` | `npx tsx --test server/test/concurrency.test.ts` |
| **Frontend Production Build** | TypeScript Compiler (`tsc`) + Vite | `client/` | `npm run build --prefix client` |

---

## 4. Test Environment & Data Governance

### 4.1 Strict Environment Isolation
- **Rule 1: Zero Production Pollution:** Tests never execute against production user collections. Automated integration tests leverage dynamically generated ephemeral test documents (prefixed with `test_qa_...`) that are explicitly cleaned up in `afterEach` and `after` teardown hooks.
- **Rule 2: Credential & Secret Protection:** No production connection strings, passwords, or secrets are printed to test logs, committed to Git, or exposed in error stack traces.
- **Rule 3: Deterministic Test State:** Every integration test instantiates independent mock/test users and sockets to avoid cross-test state leakage.

---

## 5. Risk Assessment & Priority Matrix

| Risk ID | Feature / Component | Failure Mode | Severity | Mitigation & Verification |
| :--- | :--- | :--- | :--- | :--- |
| **RSK-01** | Doubt Resolution Points | Resolving a doubt awards duplicate points on retry or concurrent clicks. | **Critical** | Database-level atomic conditional update testing (`isResolved: false`). |
| **RSK-02** | Global Doubt Answering | Posting answer to non-existent or resolved doubt increments points infinitely. | **High** | Pre-validation check verifying document existence and open status before awarding points. |
| **RSK-03** | Room Presence Leaks | Disconnected sockets remain in room presence count, causing ghost participants. | **High** | Socket disconnect listener validation and active socket pruning tests. |
| **RSK-04** | Cross-Room Socket Leakage | Event emitted in Room A broadcasts to participants in Room B. | **High** | Room isolation socket tests asserting `socket.to(roomId)` boundaries. |
| **RSK-05** | Leaderboard Flash / Shift | Opening `/leaderboard` flashes empty error state before populating. | **Medium** | Shimmer skeleton validation and non-blocking re-validation testing. |
| **RSK-06** | Browser Alert Intrusiveness | Raw `alert()` blocks UI execution on invite link copying. | **Low** | Codebase audit ensuring all alerts are replaced with non-blocking toast notifications. |

---

## 6. Defect Triage & Severity Criteria
- **P0 / Critical:** Broken access control, unauthorized point creation, infinite point loop, or server crashes.
- **P1 / High:** Duplicate point awarding under concurrency, room presence desynchronization, socket event broadcast leaks.
- **P2 / Medium:** Filter calculation discrepancies, optimistic rollback failures, UI tier desynchronization.
- **P3 / Low:** Cosmetic alignment discrepancies, subtle toast timer inaccuracies.
