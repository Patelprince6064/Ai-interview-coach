# AI Interview Coach — MERN Stack

A full-stack AI-powered interview preparation app built with **MongoDB, Express, React, Node.js**

---

## 🗂 Project Structure

```
ai-interview-coach-mern/
├── server/                  # Express + MongoDB backend
│   ├── config/db.js         # Mongoose connection
│   ├── controllers/         # authController, sessionController
│   ├── middleware/          # auth.js (JWT), errorHandler.js
│   ├── models/              # User.js, Session.js
│   ├── routes/              # auth.js, sessions.js
│   └── index.js             # Entry point
│
└── client/                  # React + Vite + Tailwind frontend
    └── src/
        ├── components/      # Navbar, ProtectedRoute, ScoreRing, Timer, QuestionCard
        ├── context/         # AuthContext (JWT + user state)
        ├── hooks/           # useTimer
        ├── lib/             # api.ts (axios), interviewData.ts
        └── pages/           # Landing, Login, Register, RoleSelection,
                             # Interview, Results, Dashboard, Analytics
```

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18
- MongoDB running locally OR a MongoDB Atlas URI
- npm or bun

### 2. Clone & Install

```bash
# Install root dev dependencies (concurrently)
npm install

# Install server dependencies
cd server && npm install && cd ..

# Install client dependencies
cd client && npm install && cd ..
```

### 3. Configure Environment

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ai-interview-coach
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRE=7d
NODE_ENV=development
```

### 4. Run in Development

```bash
# From project root — starts both server (5000) and client (5173)
npm run dev
```

Open **http://localhost:5173**

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT |
| GET  | `/api/auth/me` | Get current user (protected) |

### Sessions (all protected — require `Authorization: Bearer <token>`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET  | `/api/sessions` | Get all completed sessions |
| POST | `/api/sessions` | Create a new session |
| GET  | `/api/sessions/:id` | Get a single session |
| POST | `/api/sessions/:id/answers` | Submit an answer |
| PUT  | `/api/sessions/:id/complete` | Mark session as complete |
| GET  | `/api/sessions/analytics` | Get score trends & skill data |

---

## 🛠 Tech Stack

### Backend
- **Node.js** + **Express** — REST API
- **MongoDB** + **Mongoose** — Database & ODM
- **JWT** (`jsonwebtoken`) — Authentication
- **bcryptjs** — Password hashing

### Frontend
- **React 18** + **TypeScript**
- **Vite** — Dev server & bundler
- **Tailwind CSS** — Styling
- **React Router v6** — Client-side routing
- **Axios** — HTTP client with interceptors
- **Recharts** — Analytics charts
- **Lucide React** — Icons

---

## 🌐 Production Build

```bash
# Build the React client
npm run build

# Serve with Express (add static serving to server/index.js)
cd server && node index.js
```

To serve the React build from Express in production, add to `server/index.js`:
```js
import path from 'path';
const __dirname = path.dirname(new URL(import.meta.url).pathname);
app.use(express.static(path.join(__dirname, '../client/dist')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../client/dist/index.html')));
```

---

## ✨ Features

- 🔐 JWT Authentication (register, login, protected routes)
- 🎯 6 roles × 5 questions each (Software Engineer, PM, Data Scientist, UX, Marketing, Sales)
- 🤖 AI scoring & feedback per answer (rule-based, ready to replace with Claude API)
- ⏱️ Live countdown timer per interview
- 📊 Dashboard with session history and stats
- 📈 Analytics: score trends, skill breakdown by question type, performance by role
- 💾 All sessions persisted to MongoDB
- 🔓 Works as guest too (scoring done client-side without auth)
