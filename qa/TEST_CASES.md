# StudySphere — Master Test Case Repository

**Total Test Cases:** 62  
**Automation Ready:** Yes  
**Author:** Senior QA Automation Engineer & SDET  

---

## Suite Summary
- **Authentication & Account Lifecycle (`AUTH`):** 8 Tests
- **Study Room Presence & Isolation (`ROOM`):** 8 Tests
- **Live Room Doubts (`DOUBT`):** 6 Tests
- **Room Doubt Resolution & Point Economics (`POINTS`):** 8 Tests
- **Global Doubts Marketplace (`GDOUBT`):** 8 Tests
- **Tiers, Streaks & Progression (`TIER`):** 6 Tests
- **Scholars Leaderboard (`LEAD`):** 6 Tests
- **Centralized Toast System (`TOAST`):** 6 Tests
- **Pomodoro Timer Synchronization (`TIMER`):** 6 Tests
- **Application Security & Abuse Resistance (`SEC`):** 6 Tests

---

### A. Authentication and Account Lifecycle (`AUTH`)

#### `AUTH-001`
- **Feature/Module:** Auth / Registration
- **Test Title:** Successful new student registration with clean slate
- **Objective:** Verify new user registration persists in MongoDB with initial 0 points, 0 streak, Novice Scholar tier, and default daily goals.
- **Priority:** P0 (Critical)
- **Test Type:** Functional / Integration
- **Preconditions:** Server is running; email `student_fresh@campus.edu` is not registered.
- **Test Data:** `{ "name": "Fresh Student", "email": "student_fresh@campus.edu", "password": "Password123!" }`
- **Execution Steps:**
  1. Send `POST /api/auth/register` with test payload.
  2. Inspect response status code, token, and user payload.
  3. Query `User` document in MongoDB Atlas.
- **Expected Result:** Status 201; JWT token returned; user document created with `points: 0`, `streak: 0`, `tier: "Novice Scholar"`, 3 uncompleted daily goals; no mock avatar assigned.
- **Actual Result:** Status 201; user created with `points: 0`, `streak: 0`, `tier: 'Novice Scholar'`.
- **Status:** PASS
- **Automation Status:** Automated (`server/test/security.test.ts`)
- **Related Code:** `server/src/controllers/authController.ts:8-88`

#### `AUTH-002`
- **Feature/Module:** Auth / Registration Validation
- **Test Title:** Duplicate email registration rejection
- **Objective:** Verify server rejects duplicate registration with 400 Bad Request.
- **Priority:** P0
- **Test Type:** Negative / Integration
- **Preconditions:** User `student_fresh@campus.edu` already exists.
- **Test Data:** Same email with different password.
- **Execution Steps:**
  1. Send `POST /api/auth/register` with already registered email.
- **Expected Result:** Status 400; `{ "message": "User already exists with this email" }`.
- **Actual Result:** Status 400 with expected error message.
- **Status:** PASS
- **Automation Status:** Automated
- **Related Code:** `server/src/controllers/authController.ts:34-38`

#### `AUTH-003`
- **Feature/Module:** Auth / Password Security
- **Test Title:** Minimum password length enforcement
- **Objective:** Ensure passwords shorter than 6 characters are rejected.
- **Priority:** P1
- **Test Type:** Negative / Unit
- **Preconditions:** None.
- **Test Data:** `{ "name": "Alice", "email": "alice@test.edu", "password": "123" }`
- **Execution Steps:**
  1. Send registration request with 3-character password.
- **Expected Result:** Status 400; message indicates password must be at least 6 characters.
- **Actual Result:** Status 400; rejected safely.
- **Status:** PASS
- **Automation Status:** Automated
- **Related Code:** `server/src/controllers/authController.ts:29-32`

#### `AUTH-004`
- **Feature/Module:** Auth / Login
- **Test Title:** User login with valid credentials
- **Objective:** Verify valid credentials return signed JWT and sanitized user profile.
- **Priority:** P0
- **Test Type:** Functional / Integration
- **Preconditions:** Registered user in database.
- **Test Data:** Correct email and password.
- **Execution Steps:**
  1. Send `POST /api/auth/login`.
- **Expected Result:** Status 200; valid JWT token returned; `passwordHash` excluded from response.
- **Actual Result:** Status 200; token received; user profile returned without hash.
- **Status:** PASS
- **Automation Status:** Automated
- **Related Code:** `server/src/controllers/authController.ts:90-138`

#### `AUTH-005`
- **Feature/Module:** Auth / Login
- **Test Title:** Login rejection on incorrect password
- **Objective:** Verify invalid password fails with 400 without revealing account existence.
- **Priority:** P1
- **Test Type:** Security / Integration
- **Preconditions:** User exists.
- **Test Data:** Registered email with incorrect password.
- **Execution Steps:**
  1. Send `POST /api/auth/login` with wrong password.
- **Expected Result:** Status 400; generic "Invalid credentials" message.
- **Actual Result:** Status 400; "Invalid credentials".
- **Status:** PASS
- **Automation Status:** Automated
- **Related Code:** `server/src/controllers/authController.ts:105-108`

#### `AUTH-006`
- **Feature/Module:** Auth / Protected Routes
- **Test Title:** Rejection of unauthenticated requests to protected endpoints
- **Objective:** Verify access is blocked without valid Bearer token.
- **Priority:** P0
- **Test Type:** Security
- **Preconditions:** None.
- **Test Data:** No Authorization header.
- **Execution Steps:**
  1. Send `GET /api/auth/me`.
  2. Send `PATCH /api/users/profile`.
- **Expected Result:** Status 401; `{ "message": "Authorization token required" }`.
- **Actual Result:** Status 401 returned.
- **Status:** PASS
- **Automation Status:** Automated
- **Related Code:** `server/src/middleware/authMiddleware.ts:13-18`

#### `AUTH-007`
- **Feature/Module:** Auth / Token Verification
- **Test Title:** Rejection of tampered or expired JWT tokens
- **Objective:** Ensure modified token signatures fail verification.
- **Priority:** P0
- **Test Type:** Security
- **Preconditions:** None.
- **Test Data:** Token with corrupted signature part.
- **Execution Steps:**
  1. Send request with header `Authorization: Bearer <tampered-token>`.
- **Expected Result:** Status 401; `{ "message": "Invalid or expired token" }`.
- **Actual Result:** Status 401 returned.
- **Status:** PASS
- **Automation Status:** Automated
- **Related Code:** `server/src/middleware/authMiddleware.ts:25-27`

#### `AUTH-008`
- **Feature/Module:** Auth / Profile Loading
- **Test Title:** Authenticated profile retrieval (`GET /api/auth/me`)
- **Objective:** Verify `/api/auth/me` returns current user record matching JWT id.
- **Priority:** P1
- **Test Type:** Functional
- **Preconditions:** Valid token.
- **Execution Steps:**
  1. Send `GET /api/auth/me` with valid token.
- **Expected Result:** Status 200; current user profile returned.
- **Actual Result:** Status 200; accurate user object returned.
- **Status:** PASS
- **Automation Status:** Automated
- **Related Code:** `server/src/controllers/authController.ts:140-157`

---

### B. Study Room Joining and Presence (`ROOM`)

#### `ROOM-001`
- **Feature/Module:** Study Rooms / Sockets
- **Test Title:** User joins room via `join_room` socket event
- **Objective:** Verify socket joins room channel and triggers presence update.
- **Priority:** P0
- **Test Type:** Real-time Integration
- **Preconditions:** Study room exists; socket connected.
- **Test Data:** `{ roomId: "room-cs-101", userName: "Alice", userId: "<valid-id>" }`
- **Execution Steps:**
  1. Socket emits `join_room`.
  2. Listen for `room_presence_update`.
- **Expected Result:** `room_presence_update` emits `count: 1` and members array containing Alice.
- **Actual Result:** Active presence count increments to 1; member present.
- **Status:** PASS
- **Automation Status:** Automated (`server/test/integration.test.ts`)
- **Related Code:** `server/src/sockets/roomSocket.ts:53-115`

#### `ROOM-002`
- **Feature/Module:** Study Rooms / Presence
- **Test Title:** Accurate multi-user active scholar count
- **Objective:** Verify 3 distinct sockets joining the same room result in `count: 3`.
- **Priority:** P1
- **Test Type:** Real-time Concurrency
- **Preconditions:** Three separate socket clients.
- **Test Data:** Clients A, B, C joining `room-math-202`.
- **Execution Steps:**
  1. Sockets A, B, C sequentially emit `join_room`.
- **Expected Result:** Broadcasted `count` increments from 1 to 2 to 3.
- **Actual Result:** Final presence count equals 3.
- **Status:** PASS
- **Automation Status:** Automated
- **Related Code:** `server/src/sockets/roomSocket.ts:95-103`

#### `ROOM-003`
- **Feature/Module:** Study Rooms / Presence Cleanup
- **Test Title:** Presence count decrements upon socket disconnection
- **Objective:** Ensure disconnected sockets are immediately pruned from active users.
- **Priority:** P1
- **Test Type:** Real-time Resilience
- **Preconditions:** Two users in room.
- **Test Data:** User A disconnects.
- **Execution Steps:**
  1. Disconnect socket A.
  2. Inspect `room_presence_update` received by socket B.
- **Expected Result:** Count decrements to 1; socket A removed from room members.
- **Actual Result:** Presence cleaned up cleanly.
- **Status:** PASS
- **Automation Status:** Automated
- **Related Code:** `server/src/sockets/roomSocket.ts:285-305`

#### `ROOM-004`
- **Feature/Module:** Study Rooms / Isolation
- **Test Title:** Cross-room message and event isolation
- **Objective:** Ensure chat messages and alerts in Room A never bleed into Room B.
- **Priority:** P0
- **Test Type:** Security / Isolation
- **Preconditions:** Socket 1 in Room A, Socket 2 in Room B.
- **Test Data:** Chat message sent in Room A.
- **Execution Steps:**
  1. Socket 1 emits `send_message` in Room A.
  2. Monitor incoming messages on Socket 2 in Room B.
- **Expected Result:** Socket 2 receives 0 messages from Room A.
- **Actual Result:** Strict channel isolation verified.
- **Status:** PASS
- **Automation Status:** Automated
- **Related Code:** `server/src/sockets/roomSocket.ts:130-145`

#### `ROOM-005`
- **Feature/Module:** Study Rooms / REST API
- **Test Title:** Fetch active study rooms list (`GET /api/rooms`)
- **Objective:** Verify rooms are fetched with subjects and participant counts.
- **Priority:** P1
- **Test Type:** Functional
- **Preconditions:** None.
- **Execution Steps:**
  1. Send `GET /api/rooms`.
- **Expected Result:** Status 200; array of study rooms returned.
- **Actual Result:** Status 200 with rooms array.
- **Status:** PASS
- **Automation Status:** Automated
- **Related Code:** `server/src/controllers/roomController.ts:11-37`

#### `ROOM-006`
- **Feature/Module:** Study Rooms / REST API
- **Test Title:** Create new study room (`POST /api/rooms`)
- **Objective:** Verify authenticated user can create a study room.
- **Priority:** P1
- **Test Type:** Functional
- **Preconditions:** Valid auth token.
- **Test Data:** `{ "name": "Organic Chemistry Hub", "subject": "Chemistry", "description": "Group focus" }`
- **Execution Steps:**
  1. Send `POST /api/rooms` with auth token.
- **Expected Result:** Status 201; room document returned with owner ID.
- **Actual Result:** Status 201; room created.
- **Status:** PASS
- **Automation Status:** Automated
- **Related Code:** `server/src/controllers/roomController.ts:65-125`

#### `ROOM-007`
- **Feature/Module:** Study Rooms / Validation
- **Test Title:** Room creation rejects missing fields
- **Objective:** Verify name, subject, and description are required.
- **Priority:** P2
- **Test Type:** Negative
- **Preconditions:** Valid auth token.
- **Test Data:** `{ "name": "" }`
- **Execution Steps:**
  1. Send `POST /api/rooms` with empty payload.
- **Expected Result:** Status 400; validation error message.
- **Actual Result:** Status 400 returned.
- **Status:** PASS
- **Automation Status:** Automated
- **Related Code:** `server/src/controllers/roomController.ts:68-78`

#### `ROOM-008`
- **Feature/Module:** Study Rooms / Invite Copy
- **Test Title:** Room invite link copy triggers non-blocking toast
- **Objective:** Ensure copying invite link does not invoke native browser `alert()`.
- **Priority:** P2
- **Test Type:** UI / Functional
- **Preconditions:** User in `/study-rooms/:id`.
- **Execution Steps:**
  1. Click "Invite Peers".
- **Expected Result:** Link copied to clipboard; `toast.success` triggered; zero native alerts.
- **Actual Result:** Toast displays: *"Room invite link copied to clipboard!"*.
- **Status:** PASS
- **Automation Status:** Verified
- **Related Code:** `client/src/pages/StudyRoom.tsx:325-335`

---

### C. Live Room Doubts (`DOUBT`)

#### `DOUBT-001`
- **Feature/Module:** Room Doubts / Raising Doubt
- **Test Title:** Raise live room doubt alert
- **Objective:** Verify emitting `raise_doubt_alert` broadcasts popup alert and chat card.
- **Priority:** P0
- **Test Type:** Real-time Integration
- **Preconditions:** Sockets in room.
- **Test Data:** `{ roomId: "room-1", title: "How to calculate derivative of sin(x^2)?" }`
- **Execution Steps:**
  1. Socket 1 emits `raise_doubt_alert`.
  2. Inspect incoming events on Socket 2.
- **Expected Result:** Socket 2 receives `doubt_alert_popup` and `new_message` with `type: 'doubt_alert'`.
- **Actual Result:** Events received; alert banner displayed.
- **Status:** PASS
- **Automation Status:** Automated (`server/test/integration.test.ts:67-85`)
- **Related Code:** `server/src/sockets/roomSocket.ts:160-205`

#### `DOUBT-002`
- **Feature/Module:** Room Doubts / Answering
- **Test Title:** Peer replies to in-room live doubt
- **Objective:** Verify peer reply is appended to threaded doubt replies in room.
- **Priority:** P0
- **Test Type:** Real-time Integration
- **Preconditions:** Live doubt exists in room.
- **Test Data:** `{ roomId: "room-1", doubtId: "<id>", text: "Use chain rule: 2x*cos(x^2)" }`
- **Execution Steps:**
  1. Peer emits `reply_room_doubt`.
- **Expected Result:** `room_doubt_replied` emitted to room; reply object contains text and sender.
- **Actual Result:** Reply appended to threaded list.
- **Status:** PASS
- **Automation Status:** Automated (`server/test/integration.test.ts:86-103`)
- **Related Code:** `server/src/sockets/roomSocket.ts:208-235`

#### `DOUBT-003`
- **Feature/Module:** Room Doubts / Persistence
- **Test Title:** Doubt replies persist in MongoDB room document
- **Objective:** Ensure threaded replies are saved under `StudyRoom.messages.$.doubtReplies`.
- **Priority:** P1
- **Test Type:** Database Integration
- **Preconditions:** Valid room in database.
- **Execution Steps:**
  1. Emit `reply_room_doubt` for persisted room doubt.
  2. Query `StudyRoom.findById(roomId)` in MongoDB Atlas.
- **Expected Result:** `messages.$.doubtReplies` contains reply subdocument with sender details.
- **Actual Result:** Subdocument persisted.
- **Status:** PASS
- **Automation Status:** Automated
- **Related Code:** `server/src/sockets/roomSocket.ts:230-235`

#### `DOUBT-004`
- **Feature/Module:** Room Doubts / Input Validation
- **Test Title:** Empty or whitespace doubt reply rejection
- **Objective:** Ensure server discards empty reply strings.
- **Priority:** P2
- **Test Type:** Negative
- **Test Data:** `{ text: "   " }`
- **Execution Steps:**
  1. Emit `reply_room_doubt` with whitespace string.
- **Expected Result:** Server discards event without broadcast.
- **Actual Result:** Discarded cleanly.
- **Status:** PASS
- **Automation Status:** Automated
- **Related Code:** `server/src/sockets/roomSocket.ts:215`

#### `DOUBT-005`
- **Feature/Module:** Room Doubts / UI Badges
- **Test Title:** Resolved doubt displays solution badge on replies
- **Objective:** Verify answers to resolved doubts show `✓ +50 pts Solution` badge.
- **Priority:** P2
- **Test Type:** UI Presentation
- **Preconditions:** Doubt with answers is marked resolved.
- **Execution Steps:**
  1. Inspect reply items in `RoomChat.tsx`.
- **Expected Result:** Green badge `✓ +50 pts Solution` renders beside author name.
- **Actual Result:** Badge displayed correctly.
- **Status:** PASS
- **Automation Status:** Verified
- **Related Code:** `client/src/components/studyRooms/RoomChat.tsx:243-250`

#### `DOUBT-006`
- **Feature/Module:** Room Doubts / Toast Feedback
- **Test Title:** Submitting doubt reply triggers confirmation toast
- **Objective:** Verify student receives toast upon submitting an answer.
- **Priority:** P2
- **Test Type:** UI / Functional
- **Execution Steps:**
  1. Submit answer in room chat doubt thread.
- **Expected Result:** `toast.success('Your answer has been submitted to the room doubt thread!')` appears.
- **Actual Result:** Toast triggered.
- **Status:** PASS
- **Automation Status:** Verified
- **Related Code:** `client/src/pages/StudyRoom.tsx:238`

---

### D. Room Doubt Resolution and Point Awarding (`POINTS`)

#### `POINTS-001`
- **Feature/Module:** Points Engine / Room Doubt Resolution
- **Test Title:** Resolving doubt awards +50 points to answering student
- **Objective:** Verify student who replied receives exactly +50 points in MongoDB Atlas.
- **Priority:** P0 (Critical)
- **Test Type:** Business Logic / Integration
- **Preconditions:** Peer B answered doubt posted by Peer A. Initial points = 0.
- **Execution Steps:**
  1. Peer A emits `resolve_room_doubt`.
  2. Inspect Peer B's `points` field in MongoDB Atlas.
- **Expected Result:** Peer B points equal 50; `room_doubt_resolved` emitted with `pointsAwarded: 50`.
- **Actual Result:** Peer B points updated from 0 to 50 in database.
- **Status:** PASS
- **Automation Status:** Automated
- **Related Code:** `server/src/sockets/roomSocket.ts:250-295`

#### `POINTS-002`
- **Feature/Module:** Points Engine / Multi-Solver Award
- **Test Title:** Multiple distinct solvers each receive +50 points
- **Objective:** Verify when 2 distinct students answered, BOTH receive +50 points.
- **Priority:** P0
- **Test Type:** Concurrency / Business Logic
- **Preconditions:** User B and User C both replied to Doubt 1.
- **Execution Steps:**
  1. User A resolves Doubt 1.
  2. Query User B and User C points in database.
- **Expected Result:** User B receives +50; User C receives +50.
- **Actual Result:** Both users awarded +50 points independently.
- **Status:** PASS
- **Automation Status:** Automated
- **Related Code:** `server/src/sockets/roomSocket.ts:265-285`

#### `POINTS-003`
- **Feature/Module:** Points Engine / Multiple Replies Deduplication
- **Test Title:** Single solver posting multiple replies receives only ONE +50 award
- **Objective:** Ensure posting 3 replies to the same doubt does NOT yield 150 points.
- **Priority:** P0 (Critical)
- **Test Type:** Idempotency / Business Logic
- **Preconditions:** User B posted 3 separate replies in the same doubt thread.
- **Execution Steps:**
  1. Resolve doubt.
  2. Check User B points increment.
- **Expected Result:** User B points increment by exactly +50 (Set deduplication).
- **Actual Result:** Distinct solver set guarantees exactly +50 points.
- **Status:** PASS
- **Automation Status:** Automated
- **Related Code:** `server/src/sockets/roomSocket.ts:258-268`

#### `POINTS-004`
- **Feature/Module:** Points Engine / Idempotent Resolution
- **Test Title:** Duplicate resolution calls do not award duplicate points
- **Objective:** Verify resolving an already resolved doubt awards 0 additional points.
- **Priority:** P0 (Critical)
- **Test Type:** Idempotency
- **Preconditions:** Doubt already resolved.
- **Execution Steps:**
  1. Emit `resolve_room_doubt` a second time for same `doubtId`.
- **Expected Result:** Database checks `targetMsg.isResolved === true`; returns `pointsAwarded: 0`; user points unchanged.
- **Actual Result:** Duplicate award blocked; points remain unchanged.
- **Status:** PASS
- **Automation Status:** Automated
- **Related Code:** `server/src/sockets/roomSocket.ts:248-256`

#### `POINTS-005`
- **Feature/Module:** Points Engine / Frontend State
- **Test Title:** Solver receives confetti, toast, and AuthContext points update
- **Objective:** Verify client UI updates live score without needing a browser reload.
- **Priority:** P1
- **Test Type:** UI / Real-time
- **Preconditions:** Solver socket connected in room.
- **Execution Steps:**
  1. Doubt resolved by peer.
  2. Inspect solver's browser state.
- **Expected Result:** `AuthContext.awardPoints(50)` updates local user; celebratory confetti triggers; success toast appears.
- **Actual Result:** Real-time state updated and toast displayed.
- **Status:** PASS
- **Automation Status:** Verified
- **Related Code:** `client/src/pages/StudyRoom.tsx:165-185`

#### `POINTS-006`
- **Feature/Module:** Points Engine / Tier Auto-Upgrade
- **Test Title:** Point award crossing 200 points promotes user to Scholar Tier
- **Objective:** Verify user tier upgrades from 'Novice Scholar' to 'Scholar Tier' upon hitting 200 pts.
- **Priority:** P1
- **Test Type:** Business Logic
- **Preconditions:** Solver points = 160.
- **Execution Steps:**
  1. Award 50 points via room doubt resolution.
  2. Query user document in MongoDB.
- **Expected Result:** Points = 210; `tier` = 'Scholar Tier'.
- **Actual Result:** Promoted to 'Scholar Tier'.
- **Status:** PASS
- **Automation Status:** Automated
- **Related Code:** `server/src/sockets/roomSocket.ts:280-285`

#### `POINTS-007`
- **Feature/Module:** Points Engine / Senior Scholar Promotion
- **Test Title:** Point award crossing 500 points promotes user to Senior Scholar
- **Objective:** Verify user tier upgrades to 'Senior Scholar' upon hitting 500 pts.
- **Priority:** P1
- **Test Type:** Business Logic
- **Preconditions:** User points = 470.
- **Execution Steps:**
  1. Award 50 points.
- **Expected Result:** Points = 520; `tier` = 'Senior Scholar'.
- **Actual Result:** Promoted to 'Senior Scholar'.
- **Status:** PASS
- **Automation Status:** Automated
- **Related Code:** `server/src/sockets/roomSocket.ts:281`

#### `POINTS-008`
- **Feature/Module:** Points Engine / Master Tier Promotion
- **Test Title:** Point award crossing 1,000 points promotes user to Master Tier
- **Objective:** Verify user tier upgrades to 'Master Tier' upon reaching 1,000 pts.
- **Priority:** P1
- **Test Type:** Business Logic
- **Preconditions:** User points = 960.
- **Execution Steps:**
  1. Award 50 points.
- **Expected Result:** Points = 1,010; `tier` = 'Master Tier'.
- **Actual Result:** Promoted to 'Master Tier'.
- **Status:** PASS
- **Automation Status:** Automated
- **Related Code:** `server/src/sockets/roomSocket.ts:280`

---

### E. Global Academic Doubts Marketplace (`GDOUBT`)

#### `GDOUBT-001`
- **Feature/Module:** Global Doubts / List Retrieval
- **Test Title:** Fetch active academic doubts (`GET /api/doubts`)
- **Objective:** Verify doubts are returned sorted by creation date descending.
- **Priority:** P0
- **Test Type:** Functional
- **Execution Steps:**
  1. Send `GET /api/doubts`.
- **Expected Result:** Status 200; array of doubts.
- **Actual Result:** Status 200; doubts array returned.
- **Status:** PASS
- **Automation Status:** Automated (`server/test/integration.test.ts:8-14`)
- **Related Code:** `server/src/controllers/doubtController.ts:12-38`

#### `GDOUBT-002`
- **Feature/Module:** Global Doubts / Search & Filter
- **Test Title:** Subject filter query validation
- **Objective:** Verify `GET /api/doubts?subject=Mathematics` returns only Math doubts.
- **Priority:** P1
- **Test Type:** Functional
- **Test Data:** `subject=Mathematics`
- **Execution Steps:**
  1. Send `GET /api/doubts?subject=Mathematics`.
- **Expected Result:** All returned doubt records have `subject === 'Mathematics'`.
- **Actual Result:** Filtered accurately.
- **Status:** PASS
- **Automation Status:** Automated
- **Related Code:** `server/src/controllers/doubtController.ts:17-19`

#### `GDOUBT-003`
- **Feature/Module:** Global Doubts / Creation
- **Test Title:** Authenticated student posts new academic doubt
- **Objective:** Verify doubt is created with bounty points and tags.
- **Priority:** P0
- **Test Type:** Functional / Integration
- **Test Data:** `{ "title": "Explain quicksort pivot", "description": "Lomuto vs Hoare", "subject": "Computer Science" }`
- **Execution Steps:**
  1. Send `POST /api/doubts` with Bearer token.
- **Expected Result:** Status 201; doubt created with `pointsReward: 50`, `isResolved: false`.
- **Actual Result:** Status 201; doubt created.
- **Status:** PASS
- **Automation Status:** Automated
- **Related Code:** `server/src/controllers/doubtController.ts:64-117`

#### `GDOUBT-004`
- **Feature/Module:** Global Doubts / Creation Validation
- **Test Title:** Rejection of doubt without title or description
- **Objective:** Verify 400 Bad Request on missing fields.
- **Priority:** P1
- **Test Type:** Negative
- **Test Data:** `{ "title": "" }`
- **Execution Steps:**
  1. Send `POST /api/doubts` with empty title.
- **Expected Result:** Status 400; validation message.
- **Actual Result:** Status 400 returned.
- **Status:** PASS
- **Automation Status:** Automated
- **Related Code:** `server/src/controllers/doubtController.ts:68-71`

#### `GDOUBT-005`
- **Feature/Module:** Global Doubts / Answer Submission
- **Test Title:** Submit answer to global doubt marks doubt solved and awards bounty
- **Objective:** Verify answer is appended to `doubt.answers`, `doubt.status = 'solved'`, and solver receives +50 pts.
- **Priority:** P0
- **Test Type:** Business Logic / Integration
- **Test Data:** `{ "content": "Pivot partitions array into two halves" }`
- **Execution Steps:**
  1. Send `POST /api/doubts/:id/answers`.
- **Expected Result:** Status 201; doubt status marked `solved`; `isResolved: true`; answer present.
- **Actual Result:** Status 201; answer added; status solved.
- **Status:** PASS
- **Automation Status:** Automated (`server/test/integration.test.ts:16-44`)
- **Related Code:** `server/src/controllers/doubtController.ts:156-228`

#### `GDOUBT-006`
- **Feature/Module:** Global Doubts / Security
- **Test Title:** Rejection of empty answer content
- **Objective:** Ensure empty string answers are rejected with 400.
- **Priority:** P1
- **Test Type:** Negative
- **Test Data:** `{ "content": "   " }`
- **Execution Steps:**
  1. Send `POST /api/doubts/:id/answers` with whitespace.
- **Expected Result:** Status 400; "Answer content is required string".
- **Actual Result:** Status 400 returned.
- **Status:** PASS
- **Automation Status:** Automated
- **Related Code:** `server/src/controllers/doubtController.ts:161-164`

#### `GDOUBT-007`
- **Feature/Module:** Global Doubts / Upvoting
- **Test Title:** Upvote toggle mechanics on academic doubt
- **Objective:** Verify upvote increments count and clicking again toggles off.
- **Priority:** P2
- **Test Type:** Functional
- **Preconditions:** Authenticated user.
- **Execution Steps:**
  1. Send `POST /api/doubts/:id/vote` (first click).
  2. Send `POST /api/doubts/:id/vote` (second click).
- **Expected Result:** First click increments upvotes by 1; second click toggles off.
- **Actual Result:** Upvote toggles correctly.
- **Status:** PASS
- **Automation Status:** Automated
- **Related Code:** `server/src/controllers/doubtController.ts:230-268`

#### `GDOUBT-008`
- **Feature/Module:** Global Doubts / Toast Feedback
- **Test Title:** Success toast shown upon posting global doubt and answering
- **Objective:** Ensure toasts appear for doubt creation and answer submission.
- **Priority:** P2
- **Test Type:** UI / Functional
- **Execution Steps:**
  1. Create doubt via modal.
  2. Answer doubt card.
- **Expected Result:** Toasts confirm: *"Your doubt has been published"* and *"Solution accepted!"*.
- **Actual Result:** Toasts displayed.
- **Status:** PASS
- **Automation Status:** Verified
- **Related Code:** `client/src/pages/Doubts.tsx:274`, `client/src/components/doubts/DoubtCard.tsx:123`

---

### F. Scholars Leaderboard (`LEAD`)

#### `LEAD-001`
- **Feature/Module:** Leaderboard / Initial Load
- **Test Title:** Shimmer skeleton renders gracefully before data arrives
- **Objective:** Verify opening `/leaderboard` shows animated skeleton cards without blank layout jumps or premature "No scholars" text.
- **Priority:** P1
- **Test Type:** UI / UX
- **Execution Steps:**
  1. Navigate to `/leaderboard`.
  2. Observe initial DOM during API loading state.
- **Expected Result:** 3 shimmering podium cards and 4 shimmering table rows render smoothly.
- **Actual Result:** Shimmer skeleton renders; zero layout shift.
- **Status:** PASS
- **Automation Status:** Verified
- **Related Code:** `client/src/pages/Leaderboard.tsx:180-220`

#### `LEAD-002`
- **Feature/Module:** Leaderboard / Podium
- **Test Title:** Top 3 scholars correctly placed on Gold, Silver, Bronze podiums
- **Objective:** Verify highest points is #1 (Gold/Crown), 2nd is #2, 3rd is #3.
- **Priority:** P0
- **Test Type:** Functional
- **Preconditions:** Users with 500, 300, 150 points in database.
- **Execution Steps:**
  1. Load `/leaderboard`.
- **Expected Result:** 500 pts is #1 Crown; 300 pts is #2 Silver; 150 pts is #3 Bronze.
- **Actual Result:** Podium hierarchy renders correctly.
- **Status:** PASS
- **Automation Status:** Automated
- **Related Code:** `client/src/pages/Leaderboard.tsx:220-330`

#### `LEAD-003`
- **Feature/Module:** Leaderboard / User Spotlight
- **Test Title:** Pinned "Your Honor Roll Rank" banner highlights current user
- **Objective:** Verify current user's exact position, streak, and tier are highlighted.
- **Priority:** P1
- **Test Type:** UI / Functional
- **Preconditions:** Logged-in user has rank #2.
- **Execution Steps:**
  1. View `/leaderboard`.
- **Expected Result:** Blue spotlight card displays `#2`, user streak, and total points.
- **Actual Result:** Spotlight banner displayed.
- **Status:** PASS
- **Automation Status:** Verified
- **Related Code:** `client/src/pages/Leaderboard.tsx:150-180`

#### `LEAD-004`
- **Feature/Module:** Leaderboard / Silent Re-validation
- **Test Title:** Manual refresh button spins without unmounting existing table
- **Objective:** Verify clicking refresh updates data silently (`isRefreshing`) with spinning indicator.
- **Priority:** P2
- **Test Type:** UI / Functional
- **Execution Steps:**
  1. Click header refresh button.
- **Expected Result:** Refresh icon spins; *"Syncing Atlas..."* displays; existing rows remain intact.
- **Actual Result:** Non-blocking background sync confirmed.
- **Status:** PASS
- **Automation Status:** Verified
- **Related Code:** `client/src/pages/Leaderboard.tsx:115-125`

#### `LEAD-005`
- **Feature/Module:** Leaderboard / Scope Filtering
- **Test Title:** Scope tabs switch between Weekly, All-Time, and My Campus
- **Objective:** Verify clicking "My Campus" filters table by user's institution.
- **Priority:** P2
- **Test Type:** Functional
- **Execution Steps:**
  1. Click "My Campus" tab.
- **Expected Result:** Scholars list re-filters without page reload.
- **Actual Result:** Tab filtering functions cleanly.
- **Status:** PASS
- **Automation Status:** Verified
- **Related Code:** `client/src/pages/Leaderboard.tsx:90-100`

#### `LEAD-006`
- **Feature/Module:** Leaderboard / REST API
- **Test Title:** `GET /api/users/leaderboard` returns sorted list
- **Objective:** Ensure backend returns scholars ordered by `points: -1`.
- **Priority:** P0
- **Test Type:** API Integration
- **Execution Steps:**
  1. Send `GET /api/users/leaderboard`.
- **Expected Result:** Status 200; descending array.
- **Actual Result:** Status 200; correctly sorted.
- **Status:** PASS
- **Automation Status:** Automated
- **Related Code:** `server/src/controllers/userController.ts:5-15`

---

### G. Centralized Toast System (`TOAST`)

#### `TOAST-001`
- **Feature/Module:** Toasts / Variants
- **Test Title:** Render success, info, warning, and error toast variants
- **Objective:** Verify appropriate icon, colored border, and styling for all 4 types.
- **Priority:** P1
- **Test Type:** UI / Component
- **Execution Steps:**
  1. Trigger `toast.success`, `toast.info`, `toast.warning`, `toast.error`.
- **Expected Result:** Success has green border; error red; warning amber; info blue.
- **Actual Result:** Rendered with designated styles.
- **Status:** PASS
- **Automation Status:** Verified
- **Related Code:** `client/src/context/ToastContext.tsx:55-80`

#### `TOAST-002`
- **Feature/Module:** Toasts / Auto-Dismissal
- **Test Title:** Toast automatically dismisses after 4,000ms
- **Objective:** Verify toast cleans up from DOM after duration expires.
- **Priority:** P1
- **Test Type:** Functional
- **Execution Steps:**
  1. Trigger toast.
  2. Wait 4,200ms.
- **Expected Result:** Toast is removed from DOM.
- **Actual Result:** Toast auto-dismisses.
- **Status:** PASS
- **Automation Status:** Verified
- **Related Code:** `client/src/context/ToastContext.tsx:35-42`

#### `TOAST-003`
- **Feature/Module:** Toasts / Manual Dismissal
- **Test Title:** Clicking close button immediately dismisses toast
- **Objective:** Verify clicking 'X' icon removes the specific toast immediately.
- **Priority:** P2
- **Test Type:** UI Interaction
- **Execution Steps:**
  1. Trigger toast.
  2. Click 'X' close button.
- **Expected Result:** Toast removed immediately without waiting for timer.
- **Actual Result:** Immediate dismissal.
- **Status:** PASS
- **Automation Status:** Verified
- **Related Code:** `client/src/context/ToastContext.tsx:110-118`

#### `TOAST-004`
- **Feature/Module:** Toasts / Stacking
- **Test Title:** Multiple toasts stack vertically in fixed top-right viewport
- **Objective:** Verify simultaneous toasts do not overlap or break layout.
- **Priority:** P2
- **Test Type:** UI Layout
- **Execution Steps:**
  1. Trigger 3 toasts rapidly.
- **Expected Result:** 3 toasts stack neatly with `gap-2.5` in top-right container.
- **Actual Result:** Clean vertical stack.
- **Status:** PASS
- **Automation Status:** Verified
- **Related Code:** `client/src/context/ToastContext.tsx:90-100`

#### `TOAST-005`
- **Feature/Module:** Toasts / Navigation Persistence
- **Test Title:** Toasts persist across route transitions
- **Objective:** Verify navigating from `/doubts` to `/dashboard` does not destroy active toast.
- **Priority:** P2
- **Test Type:** Functional
- **Execution Steps:**
  1. Trigger toast on `/doubts`.
  2. Navigate to `/dashboard`.
- **Expected Result:** Toast remains visible in top-right until its timer expires.
- **Actual Result:** Global context preserves toast across routes.
- **Status:** PASS
- **Automation Status:** Verified
- **Related Code:** `client/src/App.tsx:25`

#### `TOAST-006`
- **Feature/Module:** Toasts / Zero Native Alerts
- **Test Title:** Codebase audit confirms zero browser `alert()` calls in core flows
- **Objective:** Ensure no blocking native alerts remain in application.
- **Priority:** P1
- **Test Type:** Code Audit / Regression
- **Execution Steps:**
  1. Search for `alert(` in `client/src`.
- **Expected Result:** Zero unhandled blocking alerts.
- **Actual Result:** All invite, reset, and action alerts replaced with toasts.
- **Status:** PASS
- **Automation Status:** Automated
- **Related Code:** `StudyRoom.tsx`, `ParticipantList.tsx`, `Login.tsx`, `Pricing.tsx`

---

### H. Synchronized Pomodoro Timer (`TIMER`)

#### `TIMER-001`
- **Feature/Module:** Study Timer / Countdown
- **Test Title:** Timer countdown decrements each second when running
- **Objective:** Verify circular timer ticks down from 25:00.
- **Priority:** P0
- **Test Type:** Functional
- **Execution Steps:**
  1. Start timer in study room.
  2. Wait 3 seconds.
- **Expected Result:** Time reads 24:57; SVG ring progress updates.
- **Actual Result:** Decrements cleanly.
- **Status:** PASS
- **Automation Status:** Verified
- **Related Code:** `client/src/components/studyRooms/StudyTimer.tsx:40-50`

#### `TIMER-002`
- **Feature/Module:** Study Timer / Real-time Sync
- **Test Title:** Starting timer synchronizes to peer sockets
- **Objective:** Verify clicking Start emits `timer_action` and starts timer on peer clients.
- **Priority:** P1
- **Test Type:** Real-time Integration
- **Execution Steps:**
  1. Peer A clicks Start.
  2. Monitor timer state on Peer B.
- **Expected Result:** Peer B timer starts running synchronously.
- **Actual Result:** State synchronized over `timer_sync` event.
- **Status:** PASS
- **Automation Status:** Automated
- **Related Code:** `server/src/sockets/roomSocket.ts:310-330`

#### `TIMER-003`
- **Feature/Module:** Study Timer / Pause & Reset
- **Test Title:** Pausing and resetting timer broadcasts to room
- **Objective:** Verify Pause freezes timer and Reset returns to active mode initial duration.
- **Priority:** P1
- **Test Type:** Real-time Integration
- **Execution Steps:**
  1. Click Pause; click Reset.
- **Expected Result:** Time resets to 25:00 (focus) or 05:00 (break) across all room participants.
- **Actual Result:** Synchronized reset confirmed.
- **Status:** PASS
- **Automation Status:** Automated
- **Related Code:** `client/src/components/studyRooms/StudyTimer.tsx:60-65`

#### `TIMER-004`
- **Feature/Module:** Study Timer / Mode Switching
- **Test Title:** Skip mode switches between Focus (25m) and Break (5m)
- **Objective:** Verify skipping focus mode loads short break duration.
- **Priority:** P2
- **Test Type:** Functional
- **Execution Steps:**
  1. Click Skip button while in focus mode.
- **Expected Result:** Mode changes to `short_break`; countdown sets to 05:00.
- **Actual Result:** Mode changes to break.
- **Status:** PASS
- **Automation Status:** Verified
- **Related Code:** `client/src/components/studyRooms/StudyTimer.tsx:67-75`

#### `TIMER-005`
- **Feature/Module:** Study Timer / Completion Celebration
- **Test Title:** Timer reaching 00:00 triggers confetti and completion toast
- **Objective:** Verify completion triggers visual celebration and toast notification.
- **Priority:** P1
- **Test Type:** UI / Functional
- **Preconditions:** Timer set to 00:01.
- **Execution Steps:**
  1. Let timer reach 00:00.
- **Expected Result:** Confetti fires; `toast.success('Focus session completed! Time to take a well-deserved break.')` appears.
- **Actual Result:** Confetti and toast triggered.
- **Status:** PASS
- **Automation Status:** Verified
- **Related Code:** `client/src/components/studyRooms/StudyTimer.tsx:47-55`

#### `TIMER-006`
- **Feature/Module:** Study Timer / Zero Negative Values
- **Test Title:** Countdown halts at 00:00 without displaying negative numbers
- **Objective:** Verify timer never displays `-00:01`.
- **Priority:** P2
- **Test Type:** Boundary
- **Execution Steps:**
  1. Allow countdown to expire and remain on screen.
- **Expected Result:** Display freezes at `00:00`.
- **Actual Result:** Display stops at 00:00 cleanly.
- **Status:** PASS
- **Automation Status:** Verified
- **Related Code:** `client/src/components/studyRooms/StudyTimer.tsx:45`

---

### I. Application Security & Abuse Resistance (`SEC`)

#### `SEC-001`
- **Feature/Module:** Security / ReDoS Prevention
- **Test Title:** Regex escaping prevents ReDoS and escapes query special characters
- **Objective:** Verify dangerous user regex inputs (e.g. `.*+?^${}()|[]\`) do not cause catastrophic backtracking or query injection.
- **Priority:** P0 (Critical)
- **Test Type:** Security / Unit
- **Test Data:** `.*+?^${}()|[]\`
- **Execution Steps:**
  1. Pass special character string to `escapeRegex`.
  2. Evaluate safe regular expression against test string.
- **Expected Result:** Special characters escaped safely; regex tests without throwing.
- **Actual Result:** Escaped to `\.\*\+\?\^\$\{\}\(\)\|\[\]\\`.
- **Status:** PASS
- **Automation Status:** Automated (`server/test/security.test.ts:9-21`)
- **Related Code:** `server/src/controllers/doubtController.ts:8-10`

#### `SEC-002`
- **Feature/Module:** Security / Production Secrets
- **Test Title:** JWT Secret fails safely in production when missing or placeholder
- **Objective:** Ensure application throws fatal startup error if `JWT_SECRET` is insecure placeholder.
- **Priority:** P0 (Critical)
- **Test Type:** Security / Unit
- **Test Data:** `dev_insecure_jwt_secret_for_local_testing_only`
- **Execution Steps:**
  1. Test production secret validator with placeholder strings.
- **Expected Result:** Throws fatal error; rejects placeholder.
- **Actual Result:** Throws: `FATAL: JWT_SECRET environment variable is missing...`.
- **Status:** PASS
- **Automation Status:** Automated (`server/test/security.test.ts:23-59`)
- **Related Code:** `server/src/config/jwt.ts`

#### `SEC-003`
- **Feature/Module:** Security / Rate Limiting
- **Test Title:** Rate limiter blocks excess requests exceeding threshold
- **Objective:** Ensure IP sending more than allowed requests in time window is blocked with 429.
- **Priority:** P1
- **Test Type:** Security / Unit
- **Test Data:** 4 requests from same IP where max = 3.
- **Execution Steps:**
  1. Execute 4 requests through sliding rate limiter.
- **Expected Result:** 1st, 2nd, 3rd allowed; 4th blocked (returns false).
- **Actual Result:** 4th request blocked cleanly.
- **Status:** PASS
- **Automation Status:** Automated (`server/test/security.test.ts:61-90`)
- **Related Code:** `server/src/middleware/rateLimiter.ts`

#### `SEC-004`
- **Feature/Module:** Security / NoSQL Injection
- **Test Title:** Input type guards reject NoSQL query injection objects
- **Objective:** Ensure object injection payloads (e.g. `{ $gt: '' }`) are rejected by auth type guards.
- **Priority:** P0 (Critical)
- **Test Type:** Security / Unit
- **Test Data:** `{ email: { "$gt": "" }, password: { "$gt": "" } }`
- **Execution Steps:**
  1. Pass object inputs to `validateAuthInput`.
- **Expected Result:** Returns false; rejects non-string types.
- **Actual Result:** Rejected.
- **Status:** PASS
- **Automation Status:** Automated (`server/test/security.test.ts:92-109`)
- **Related Code:** `server/src/controllers/authController.ts:11-20`

#### `SEC-005`
- **Feature/Module:** Security / Socket Rate Limiting
- **Test Title:** Socket chat flooding rate limiter throttles rapid messages
- **Objective:** Verify socket emitting more than 10 messages/sec receives `error_message`.
- **Priority:** P1
- **Test Type:** Security / Real-time
- **Execution Steps:**
  1. Rapidly emit 15 `send_message` events in 500ms.
- **Expected Result:** Excess messages dropped; `error_message` returned to socket.
- **Actual Result:** Rate limit enforced by `checkRateLimit`.
- **Status:** PASS
- **Automation Status:** Automated
- **Related Code:** `server/src/sockets/roomSocket.ts:23-32`

#### `SEC-006`
- **Feature/Module:** Security / Credential Storage
- **Test Title:** Passwords hashed with bcrypt and never exposed in responses or logs
- **Objective:** Verify password hash is irreversibly salted and never leaked in `/api/auth/me` or `/api/users`.
- **Priority:** P0 (Critical)
- **Test Type:** Security / Integration
- **Execution Steps:**
  1. Register user.
  2. Inspect database `passwordHash` field.
  3. Inspect `/api/auth/me` response JSON.
- **Expected Result:** Database stores `$2a$10$...` hash; API responses omit `passwordHash`.
- **Actual Result:** Plaintext password never stored or transmitted in responses.
- **Status:** PASS
- **Automation Status:** Automated
- **Related Code:** `server/src/controllers/authController.ts:40-83`
