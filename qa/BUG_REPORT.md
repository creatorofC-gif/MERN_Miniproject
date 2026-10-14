# StudySphere — Comprehensive Bug & Defect Report

**Author:** Senior QA Automation Engineer & Security Tester  
**Date:** October 2026  
**Status:** Open / Documented  

---

## Defect Summary

| Defect ID | Title | Severity | Priority | Component / Location | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **BUG-01** | Premature & Unconditional Points Increment in Global Doubts | **High** | **P0** | `server/src/controllers/doubtController.ts` | **Confirmed Defect** |
| **BUG-02** | User Tier Not Recalculated During Global Doubt Point Awards | **Medium** | **P1** | `server/src/controllers/doubtController.ts` | **Confirmed Defect** |
| **BUG-03** | Potential Race Condition on Simultaneous Room Doubt Resolves | **High** | **P1** | `server/src/sockets/roomSocket.ts` | **Confirmed Vulnerability** |
| **BUG-04** | Client Pomodoro Timer Drift on Inactive / Backgrounded Tabs | **Medium** | **P2** | `client/src/components/studyRooms/StudyTimer.tsx`| **Known Limitation** |
| **BUG-05** | Hardcoded Author Tier `'Master Tier'` on Answer Creation | **Low** | **P3** | `server/src/controllers/doubtController.ts` | **Cosmetic Defect** |

---

## Detailed Defect Specifications

### BUG-01: Premature & Unconditional Points Increment in Global Doubts
- **Defect ID:** `BUG-01`
- **Severity:** High  
- **Priority:** P0  
- **Affected Module:** Global Doubts / Answer Submission (`doubtController.addAnswer`)
- **Source Location:** `server/src/controllers/doubtController.ts:169-183`
- **Preconditions:** Authenticated user with valid JWT.
- **Reproduction Steps:**
  1. Send a POST request to `/api/doubts/600000000000000000000000/answers` (a non-existent or invalid ObjectId) with payload `{ "content": "test answer" }`.
  2. Observe the user's persisted points balance in MongoDB Atlas.
- **Expected Result:**
  The server should first verify that the doubt document exists, verify that `doubt.isResolved === false`, and only award points after confirming answer validity.
- **Actual Result:**
  Lines 169-178 execute `dbUser.points = (dbUser.points || 0) + 50; await dbUser.save();` *before* querying `Doubt.findById(id)`. If the doubt does not exist or was already solved, points are still permanently added to the user.
- **Root Cause:**
  Point awarding logic was placed before document validation.
- **Recommended Fix:**
  Move the `User.findByIdAndUpdate` inside the block where `doubt` is successfully found and `doubt.isResolved` is confirmed to be `false`.

---

### BUG-02: User Tier Not Recalculated During Global Doubt Point Awards
- **Defect ID:** `BUG-02`
- **Severity:** Medium  
- **Priority:** P1  
- **Affected Module:** Progression / Tier Upgrade Engine
- **Source Location:** `server/src/controllers/doubtController.ts:176`
- **Preconditions:** User has 180 points (`Novice Scholar`).
- **Reproduction Steps:**
  1. User answers a global academic doubt on `/doubts`.
  2. Points increase to 230 points.
  3. Inspect `dbUser.tier` in MongoDB Atlas.
- **Expected Result:**
  `dbUser.tier` should automatically promote to `'Scholar Tier'` (threshold: 200 pts), identical to the logic in `roomSocket.ts`.
- **Actual Result:**
  `dbUser.points` becomes 230, but `dbUser.tier` remains `'Novice Scholar'`.
- **Root Cause:**
  Tier recalculation logic was implemented in `roomSocket.ts` but omitted in `doubtController.ts`.
- **Recommended Fix:**
  Add tier threshold promotion checks (`calculateTier(dbUser.points)`) in `doubtController.addAnswer`.

---

### BUG-03: Potential Race Condition on Simultaneous Room Doubt Resolves
- **Defect ID:** `BUG-03`
- **Severity:** High  
- **Priority:** P1  
- **Affected Module:** Study Room Sockets (`resolve_room_doubt`)
- **Source Location:** `server/src/sockets/roomSocket.ts:230-285`
- **Preconditions:** Multiple participants in the same study room.
- **Reproduction Steps:**
  1. Two clients concurrently emit `resolve_room_doubt` for the exact same `doubtId` at the same millisecond.
  2. Both event handlers read `room = await StudyRoom.findById(roomId)` before either has saved `isResolved = true`.
- **Expected Result:**
  Only the first execution resolves the doubt and awards +50 mastery points; the second execution is discarded as a no-op.
- **Actual Result:**
  Under high concurrency, both threads see `targetMsg.isResolved === false` and award points twice to the solvers.
- **Recommended Fix:**
  Use atomic conditional update `StudyRoom.findOneAndUpdate({ _id: roomId, 'messages._id': doubtId, 'messages.isResolved': false }, { $set: { 'messages.$.isResolved': true } })` to ensure strict single-award idempotency.

---

### BUG-04: Client Pomodoro Timer Drift on Inactive / Backgrounded Tabs
- **Defect ID:** `BUG-04`
- **Severity:** Medium  
- **Priority:** P2  
- **Affected Module:** Pomodoro Focus Timer (`StudyTimer.tsx`)
- **Source Location:** `client/src/components/studyRooms/StudyTimer.tsx:40-50`
- **Reproduction Steps:**
  1. Start Pomodoro focus timer in a study room.
  2. Switch to another browser tab or minimize window for 10 minutes.
  3. Return to the study room tab.
- **Expected Result:**
  Remaining time matches elapsed wall-clock time accurately.
- **Actual Result:**
  Browser background throttling delays `setInterval`, leading to 1-3 minutes of timer lag until the next peer `timer_sync` event triggers.
- **Recommended Fix:**
  Store `targetEndTime = Date.now() + secondsLeft * 1000` and compute `remaining = Math.max(0, Math.round((targetEndTime - Date.now()) / 1000))` on each tick.
