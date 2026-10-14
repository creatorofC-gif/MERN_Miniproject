# StudySphere — Release Regression Checklist

**Purpose:** Rapid Pre-Deployment Smoke & Regression Testing  
**Frequency:** Execute before every production build or main branch release  
**Estimated Run Time:** 10 minutes  

---

## Pre-Release Verification Steps

### 1. Build & Static Analysis
- [ ] Client builds with zero TypeScript errors: `npm run build --prefix client`
- [ ] Server builds with zero TypeScript errors: `npm run build --prefix server`
- [ ] No compilation warnings or unresolved module paths.

### 2. Automated Test Pass
- [ ] Security test suite passes: `npm test --prefix server`
- [ ] Socket & API integration suite passes: `npx tsx --test server/test/integration.test.ts`
- [ ] Concurrency and invariant tests pass: `npx tsx --test server/test/concurrency.test.ts`

### 3. Authentication & Clean State
- [ ] Register a new test user: account loads with 0 points, 0 streak, Novice Scholar tier, and unchecked daily goals.
- [ ] Avatar fallback displays clean uppercase initials; zero placeholder stock Unsplash images appear.
- [ ] Login with valid credentials succeeds and issues valid 7-day JWT.
- [ ] Login with incorrect credentials fails with generic "Invalid credentials".

### 4. Study Rooms & In-Room Doubts
- [ ] User joins study room: presence count matches active participants.
- [ ] Click "Invite Peers": invite link copies to clipboard; non-blocking toast displays; zero browser `alert()` popups.
- [ ] Student A raises a live room doubt: floating banner alert displays; card added to Room Doubts chat tab.
- [ ] Student B submits threaded reply: answer appears with author name; confirmation toast appears.
- [ ] Student A resolves doubt: doubt marked resolved; Student B awarded +50 points; confetti fires; toast displays points award; reply shows `✓ +50 pts Solution`.
- [ ] Multiple replies from Student B only award +50 points once (no duplicate points).

### 5. Global Academic Doubts
- [ ] Doubts page displays active doubts from Atlas.
- [ ] Filter pills (*All Doubts*, *High Reward*, *Needs Review*, *Unanswered*) filter list without crashing.
- [ ] Post a new academic doubt: doubt appears on board; toast confirms publication.
- [ ] Submit answer on doubt card: answer appends to thread; doubt marked solved; bounty points awarded; confetti triggers.

### 6. Scholars Leaderboard
- [ ] Open `/leaderboard`: shimmering skeleton appears gracefully during load; zero blank layout shifts.
- [ ] Podium displays #1 Gold (Crown), #2 Silver, #3 Bronze correctly sorted by points.
- [ ] Pinned "Your Honor Roll Rank" spotlight banner accurately reflects logged-in user position.
- [ ] Click manual refresh button: refresh icon spins; list updates silently without wiping the view.
- [ ] Switch scope tabs (*Weekly*, *All-Time*, *My Campus*): list re-filters seamlessly.

### 7. Pomodoro Timer & Toast System
- [ ] Start focus timer in study room: timer decrements and synchronizes to peer sockets.
- [ ] Pause / Reset / Skip: timer state updates cleanly across room.
- [ ] Timer reaching 00:00: celebratory confetti fires; completion toast displays.
- [ ] Toasts auto-dismiss after 4 seconds or immediately upon clicking 'X'.
