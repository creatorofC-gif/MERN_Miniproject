# StudySphere 🎓

> **A Complete, Real-Time Collaborative Student Learning Platform**  
> Built with React 19 (TypeScript), Vite, TailwindCSS, Node.js, Express, Socket.IO WebSockets, and Mongoose (MongoDB).

---

## 📋 Architecture & Current Status

- **Frontend (`client/`)**: Fully functional React 19 application with real-time Socket.IO synchronization, Pomodoro timer coordination, and Figma design fidelity.
- **Backend (`server/`)**: Express API with JWT authentication middleware, rate limiting, and Socket.IO real-time event broadcasting.
- **Database (`server/src/config/db.ts`)**: Mongoose scaffolding is in place. Live database connection is deferred to the database administrator/teammate.

---

## 🛠️ Teammate MongoDB Integration Guide (TODO)

The project includes all required Mongoose schemas, controllers, and service functions. Follow these steps to connect and initialize MongoDB:

### 1. Configure Server Environment Variables
Create a file named `.env` inside the `server/` directory (refer to `server/.env.example`):

```env
PORT=5000
# Replace with your real MongoDB Atlas connection string or local MongoDB instance:
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/studysphere?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
CLIENT_URL=http://localhost:5173
```

> [!IMPORTANT]
> Never commit `.env` to Git. The `.gitignore` file is already configured to exclude all `.env` files.

### 2. Verify Database Connection
Start the server:
```bash
npm run dev --prefix server
```
- If `MONGO_URI` is correctly set, the console will print:
  `[Database] Successfully connected to MongoDB Atlas` (or `Local MongoDB`).
- If unconfigured, the server boots safely without crashing, logging:
  `[Database] Status: Disconnected / Not configured`.

### 3. Seed Initial Demo Data (Explicit Command)
To populate sample users, active study rooms, and doubts into your newly connected MongoDB database, run:
```bash
npm run seed --prefix server
```
*(Seeding is not executed automatically on startup to prevent accidental data overwrites).*

---

## 🚀 Running the Application

### Install Dependencies
```bash
npm ci
npm ci --prefix client
npm ci --prefix server
```

### Run Client & Server Concurrently
```bash
npm run dev
```
- **Backend API & WebSockets Server**: [http://localhost:5000](http://localhost:5000)
- **Frontend Client**: [http://localhost:5173](http://localhost:5173)

### Production Build, Lint, & Test Checks
```bash
npm run build --prefix client    # Type-check & Vite build
npm run build --prefix server    # TypeScript build (tsc)
npm run lint --prefix client     # oxlint verification (0 errors)
npm run test --prefix server     # Lightweight security unit tests (Node native test runner)
```

---

## ⚡ Real-Time WebSockets Architecture (Socket.IO)

The WebSocket implementation in `server/src/sockets/roomSocket.ts` and `client/src/pages/StudyRoom.tsx` coordinates live study rooms:

### Client-to-Server Events
| Event | Payload | Purpose |
|---|---|---|
| `join_room` | `{ roomId: string, userName?: string, userAvatar?: string }` | Joins a room socket room and registers participant |
| `send_message` | `{ roomId: string, text: string, type?: 'message' \| 'doubt_alert' }` | Broadcasts chat message with per-socket rate limiting |
| `raise_doubt_alert` | `{ roomId: string, title: string }` | Sends doubt banner popup to all room members |
| `timer_action` | `{ roomId: string, action: 'start' \| 'pause' \| 'reset' \| 'skip', timeRemaining: number, isRunning: boolean, mode: string }` | Syncs Pomodoro timer state across all participants |

### Server-to-Client Events
| Event | Payload | Purpose |
|---|---|---|
| `room_presence_update` | `{ count: number, members: RoomUser[] }` | Real participant count and presence list |
| `new_message` | `ChatMessage` | Live incoming chat or doubt message |
| `doubt_alert_popup` | `{ senderName: string, title: string, timestamp: string }` | Triggers alert banner for peer assistance |
| `timer_sync` | `{ action: string, timeRemaining: number, isRunning: boolean, mode: string, triggeredBy: string }` | Synchronizes Pomodoro timer in real time |
| `socket_error` | `{ message: string }` | Rate limit or validation warning |

---

## 🔒 Security Hardening

1. **ReDoS Protection**: User search queries in study room search and academic doubts search pass through regex sanitization (`escapeRegex`).
2. **Restricted CORS & Security Headers**: Configured strictly in `server/src/app.ts` with `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection`, and origin checking.
3. **Identity Verification & Anti-Impersonation**:
   - Room creation, doubt posting, and chat author IDs use verified `req.user.id` from JWT authentication rather than trusting client-provided body fields.
   - Socket.IO connection accepts `socket.handshake.auth.token` and validates JWT claims.
4. **Duplicate Vote Prevention**: Doubts track an `upvotedBy` array of user ObjectIds. Authenticated voting toggles votes cleanly and prevents bot duplication.
5. **NoSQL Injection & Input Type Guards**: Strict type and length validations are enforced on emails, passwords, names, and JSON bodies.
6. **Rate Limiting**: In-memory rate limiting shields authentication (`/api/auth/register`, `/api/auth/login`), room creation, and doubt voting against automated abuse.
7. **Production Secrets Protection**: Fallback secret keys generate explicit warnings in production environments.

---

## 📊 Implemented Functionality vs. Demonstration Content

- **Fully Implemented & Dynamic**:
  - **Study Rooms**: Creation, listing, retrieval, joining, leaving, empty/loading/error states.
  - **Socket.IO Real-Time Sync**: Real participant presence, live chat, doubt alert popups, synchronized Pomodoro timer (`timer_action` & `timer_sync`).
  - **Authentication & Security**: Local registration, login, logout, token verification, route guards, ReDoS prevention, rate limiting, and vote deduplication.
- **Demonstration / UI Showcases**:
  - **AI Study Suite (`client/src/pages/AITools.tsx`)**: Labeled as Demo Preview; demonstrates lecture notes synthesis and flashcard generation templates.
  - **Scholars Leaderboard (`client/src/pages/Leaderboard.tsx`)**: Labeled as Demo Showcase; demonstrates the Honor Roll rankings table.
  - **Third-Party OAuth Buttons**: Google and GitHub sign-in buttons inform the user that OAuth client credentials are not yet configured.

---

## ⚠️ Known Limitations & Untested Behavior

1. **Live Database Persistence**: MongoDB operations have not been executed against a live database instance. Persistent CRUD operations remain unverified until your teammate connects MongoDB Atlas or local MongoDB.
2. **End-to-End Multi-Client Sessions**: Socket.IO event structures and listeners are verified and type-checked; automated multi-browser session testing (e.g. Cypress/Playwright) is not included in this repository.

---

## 🎨 Design Tokens

- **Primary Navy / Dark**: `#151C2F`
- **Brand Blue**: `#0057BE`
- **Light Background**: `#F8F9FB`
- **Amber / Bounty**: `#F59E0B`
- **Emerald / Success**: `#10B981`
- **Urgent Red**: `#F26161`
- **Purple / AI**: `#8B5CF6`
