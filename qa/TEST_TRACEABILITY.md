# StudySphere — Requirements Traceability Matrix (RTM)

**Author:** Senior QA Automation Engineer & Test Architect  
**Date:** October 2026  
**Status:** 100% Core Requirements Mapped  

---

## 1. Traceability Matrix

| Req ID | Requirement Description | Related Source Files | API / Socket Event | Database Entity | Automated Test Cases | Manual / E2E Verification | Coverage Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **REQ-AUTH-01** | User registration with clean slate (0 pts, 0 streak, Level 1) | `authController.ts`, `Register.tsx`, `AuthContext.tsx` | `POST /api/auth/register` | `User` | `AUTH-001`, `AUTH-002`, `AUTH-003` | Registration flow verification | **100% Covered** |
| **REQ-AUTH-02** | Secure login & JWT issuance | `authController.ts`, `Login.tsx`, `authMiddleware.ts` | `POST /api/auth/login` | `User` | `AUTH-004`, `AUTH-005`, `AUTH-006`, `AUTH-007` | Login & session restore | **100% Covered** |
| **REQ-ROOM-01** | Real-time presence & active scholar count | `roomSocket.ts`, `StudyRoom.tsx`, `ParticipantList.tsx` | Socket: `join_room`, `room_presence_update` | In-memory `activeUsers` | `ROOM-001`, `ROOM-002`, `ROOM-003` | Multi-user presence count | **100% Covered** |
| **REQ-ROOM-02** | Room creation & invite link clipboard copy | `roomController.ts`, `StudyRooms.tsx`, `StudyRoom.tsx` | `POST /api/rooms`, `navigator.clipboard` | `StudyRoom` | `ROOM-005`, `ROOM-006`, `ROOM-007`, `ROOM-008` | Invite copy toast trigger | **100% Covered** |
| **REQ-ROOM-03** | Channel event isolation across study rooms | `roomSocket.ts` | Socket: `send_message`, `socket.to(roomId)` | `StudyRoom.messages` | `ROOM-004` | Cross-room chat isolation | **100% Covered** |
| **REQ-DOUBT-01**| Raise live in-room doubt alert | `roomSocket.ts`, `RoomChat.tsx`, `StudyRoom.tsx` | Socket: `raise_doubt_alert`, `doubt_alert_popup` | `StudyRoom.messages` | `DOUBT-001`, `DOUBT-004` | Live popup banner trigger | **100% Covered** |
| **REQ-DOUBT-02**| Threaded replies to in-room doubt | `roomSocket.ts`, `RoomChat.tsx` | Socket: `reply_room_doubt`, `room_doubt_replied` | `messages.$.doubtReplies`| `DOUBT-002`, `DOUBT-003`, `DOUBT-006` | Threaded reply display | **100% Covered** |
| **REQ-PTS-01**  | In-room doubt resolution awards +50 pts to all solvers | `roomSocket.ts`, `StudyRoom.tsx`, `User.ts` | Socket: `resolve_room_doubt`, `points_awarded` | `User.points`, `messages.$.isResolved` | `POINTS-001`, `POINTS-002`, `POINTS-005` | Confetti & point reflection | **100% Covered** |
| **REQ-PTS-02**  | Single solver with multiple replies gets only +50 pts | `roomSocket.ts` | Socket: `resolve_room_doubt` | `User.points` | `POINTS-003` | Multi-reply single award | **100% Covered** |
| **REQ-PTS-03**  | Idempotent resolution (no duplicate points on retry) | `roomSocket.ts` | Socket: `resolve_room_doubt` | `messages.$.isResolved` | `POINTS-004` | Re-resolve no-op test | **100% Covered** |
| **REQ-TIER-01** | Dynamic tier progression (Novice, Scholar, Senior, Master) | `roomSocket.ts`, `User.ts`, `Sidebar.tsx` | Socket / DB update | `User.tier` | `POINTS-006`, `POINTS-007`, `POINTS-008` | UI tier badge display | **100% Covered** |
| **REQ-GDOUBT-01**| Global doubt marketplace retrieval & filtering | `doubtController.ts`, `Doubts.tsx` | `GET /api/doubts` | `Doubt` | `GDOUBT-001`, `GDOUBT-002` | Filter pills interaction | **100% Covered** |
| **REQ-GDOUBT-02**| Posting global academic doubt with bounty | `doubtController.ts`, `AskDoubtModal.tsx` | `POST /api/doubts` | `Doubt` | `GDOUBT-003`, `GDOUBT-004`, `GDOUBT-008` | Modal doubt submission | **100% Covered** |
| **REQ-GDOUBT-03**| Global answer submission & bounty award | `doubtController.ts`, `DoubtCard.tsx` | `POST /api/doubts/:id/answers` | `Doubt`, `User.points` | `GDOUBT-005`, `GDOUBT-006` | Thread & confetti display | **100% Covered** |
| **REQ-LEAD-01** | Shimmer skeleton loading & smooth fade-in | `Leaderboard.tsx`, `index.css` | `GET /api/users/leaderboard` | `User` | `LEAD-001` | Skeletons to table load | **100% Covered** |
| **REQ-LEAD-02** | Top 3 podium rendering & current user spotlight | `Leaderboard.tsx`, `userController.ts` | `GET /api/users/leaderboard` | `User` | `LEAD-002`, `LEAD-003`, `LEAD-006` | Spotlight rank card | **100% Covered** |
| **REQ-LEAD-03** | Silent background re-validation & scope filtering | `Leaderboard.tsx` | `GET /api/users/leaderboard` | `User` | `LEAD-004`, `LEAD-005` | Tab filter without flicker | **100% Covered** |
| **REQ-TOAST-01**| Centralized Toast system (4 variants, auto-dismiss) | `ToastContext.tsx`, `App.tsx` | Context dispatch | Client State | `TOAST-001`, `TOAST-002`, `TOAST-003`, `TOAST-004` | Floating toast UI | **100% Covered** |
| **REQ-TIMER-01**| Multi-user synchronized Pomodoro timer | `StudyTimer.tsx`, `roomSocket.ts` | Socket: `timer_action`, `timer_sync` | None (Ephemeral) | `TIMER-001`, `TIMER-002`, `TIMER-003` | Shared start/pause sync | **100% Covered** |
| **REQ-TIMER-02**| Mode switching & completion celebration | `StudyTimer.tsx` | Local state & Socket | None | `TIMER-004`, `TIMER-005`, `TIMER-006` | Confetti & completion toast | **100% Covered** |
| **REQ-SEC-01**  | Input sanitization, NoSQL injection, and ReDoS defense | `doubtController.ts`, `rateLimiter.ts`, `jwt.ts` | All routes | None | `SEC-001`, `SEC-002`, `SEC-003`, `SEC-004` | Injection rejection tests | **100% Covered** |
