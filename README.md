# StudySphere 🎓

> **A Complete, Real-Time Collaborative Student Learning Platform**  
> Built with React (TypeScript), Node.js, Express, MongoDB Atlas, and Socket.IO WebSockets.

---

## 🚀 Quick Start Guide

### 1. Configure MongoDB Atlas
Open `server/.env` and replace `MONGO_URI` with your MongoDB Atlas connection string:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/studysphere?retryWrites=true&w=majority
JWT_SECRET=studysphere_super_secret_jwt_key_2026_production
CLIENT_URL=http://localhost:5173
```

> **Note:** If you want to run offline or test without Atlas, you can leave the default local MongoDB URI:  
> `MONGO_URI=mongodb://127.0.0.1:27017/studysphere`

---

### 2. Run the Full Stack Application
From the root directory:

```bash
npm run dev
```

This single command starts:
- **Backend API & WebSockets Server** on [http://localhost:5000](http://localhost:5000)
- **Frontend Client** on [http://localhost:5173](http://localhost:5173)

---

## ⚡ Real-Time WebSockets Features

StudySphere uses **Socket.IO** for live, bidirectional communication:

1. **Live Presence & Member Counts:**
   - When students enter or leave a room (`/study-rooms/:id`), active member counts and presence updates broadcast immediately to all peers.
2. **Real-Time Room Chat:**
   - Messages sent inside any focus room appear instantly on all connected screens without refreshing.
3. **Synchronized Pomodoro Timer:**
   - Hosts can Play, Pause, or Skip Pomodoro intervals; the timer state broadcasts to all room members in real-time.
4. **Urgent Doubt Alert Popups:**
   - Raising a doubt inside a room triggers a live alert popup across everyone studying in that session.

### How to Test Real-Time Collaboration:
1. Open [http://localhost:5173/study-rooms](http://localhost:5173/study-rooms) in **Chrome**.
2. Open [http://localhost:5173/study-rooms](http://localhost:5173/study-rooms) in **Edge / Incognito tab**.
3. Join the same room (e.g. *Calculus II Deep Work*).
4. Send a message or toggle the timer in one tab and watch it update live in the second tab!

---

## 📁 Project Architecture

```
StudySphere_miniproject/
├── client/                     # React + Vite + TailwindCSS Frontend
│   ├── src/
│   │   ├── components/         # Exact Figma components
│   │   │   ├── dashboard/      # StatCard, DailyGoals, RecentRooms, LatestDoubts
│   │   │   ├── doubts/         # DoubtCard, SolverLeaderboard, AskDoubtModal
│   │   │   ├── layout/         # Sidebar, Topbar, AppLayout
│   │   │   ├── studyRooms/     # StudyTimer, RoomChat, AmbiancePlayer, ParticipantList
│   │   │   └── ui/             # Buttons, Badges, Modals, Avatars
│   │   ├── context/            # AuthContext (JWT Authentication state)
│   │   ├── pages/              # Landing, Dashboard, StudyRooms, StudyRoom, Doubts, AI Tools, Pricing, Leaderboard, Profile, Settings
│   │   ├── services/           # Axios API connectors & Socket.IO client
│   │   └── types/              # TypeScript Interfaces
│   └── package.json
│
├── server/                     # Node.js + Express + TypeScript Backend
│   ├── src/
│   │   ├── config/             # MongoDB Atlas connection (db.ts)
│   │   ├── controllers/        # Auth, StudyRoom, Doubt, User, AI Controllers
│   │   ├── middleware/         # JWT Auth Verification
│   │   ├── models/             # User, StudyRoom, Doubt (Mongoose Schemas)
│   │   ├── routes/             # REST API endpoints (/api/auth, /api/rooms, /api/doubts, /api/ai)
│   │   ├── sockets/            # Socket.IO Event Handlers (roomSocket.ts)
│   │   ├── utils/              # Database Seeder (seed.ts)
│   │   ├── app.ts              # Express App setup
│   │   └── server.ts           # HTTP & WebSocket Server
│   ├── .env                    # MongoDB URI & Environment Variables
│   └── package.json
│
├── package.json                # Root scripts (dev, dev:client, dev:server, build)
└── README.md
```

---

## 🎨 Visual Design Fidelity
All components and pages strictly mirror the provided Figma screenshots:
- **Typography:** Inter
- **Color Tokens:**
  - Primary Navy / Dark: `#151C2F`
  - Brand Blue: `#0057BE`
  - Light Background: `#F8F9FB`
  - Amber / Bounty: `#F59E0B`
  - Emerald / Success: `#10B981`
  - Urgent Red: `#F26161`
  - Purple / AI: `#8B5CF6`
