# 🎵 Sonique — AI-Powered Music Streaming Platform

A full-stack, production-style music streaming platform built with the MERN stack, featuring a persistent global audio player, AI-powered recommendations via Groq, and a complete admin dashboard — built end-to-end as a portfolio project demonstrating real-world engineering decisions rather than tutorial-level implementation.

**Live Demo:** _[add deployed link here after Phase 14]_
**Video Walkthrough:** _[optional — add a Loom/YouTube link here]_

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Key Architectural Decisions](#key-architectural-decisions)
- [Features](#features)
- [Screenshots](#screenshots)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [Known Limitations & Future Improvements](#known-limitations--future-improvements)
- [What I Learned](#what-i-learned)

---

## Overview

Sonique is a Spotify-inspired streaming platform that goes beyond basic playback — it includes JWT authentication with refresh-token rotation, a persistent audio player that survives client-side navigation, AI-generated mood playlists and recommendations (Groq/Llama), a full admin analytics dashboard, and a hardened, rate-limited backend.

This project was built in structured phases, with each phase adding a complete, tested vertical slice of functionality (backend + frontend + testing) rather than building all of one layer before starting the next.

---

## Tech Stack

**Frontend**
- React 18 (Vite) — component architecture, Context API for global state
- Tailwind CSS v4 (CSS-first `@theme` config, no `tailwind.config.js`)
- Framer Motion — animations, staggered lists, fullscreen transitions
- Recharts — admin analytics charts
- React Router v6 — client-side routing, lazy-loaded route chunks

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose — normalized schema design (referenced relationships, not embedded duplication)
- JWT (access + refresh token pattern) with DB-backed session revocation
- Cloudinary — audio/image storage and CDN delivery
- Groq API (Llama/GPT-OSS models) — AI recommendations, mood playlists, conversational chat

**Security & Infra**
- Helmet, custom NoSQL-injection sanitization (Express 5–compatible), tiered rate limiting
- express-validator for input validation
- bcrypt password hashing

---

## Key Architectural Decisions

A few decisions worth highlighting (the "why," not just the "what"):

- **Persistent global audio player** — a single `Audio()` object and Web Audio API graph are created exactly once via `useRef`/Context, living outside the React Router tree entirely. This is what allows music to keep playing uninterrupted while navigating between pages — the single hardest architectural problem in the whole build.
- **Normalized MongoDB schema** — Songs reference Artists/Albums by ID rather than embedding duplicated data, so a single artist name correction propagates everywhere automatically.
- **JWT access + refresh tokens, stored server-side** — refresh tokens are persisted in the database (not just verified by signature), enabling real session revocation on logout — not just token expiry.
- **Tiered rate limiting** — auth routes, AI routes, and general routes each have different limits matched to their actual risk/cost profile, not one blanket rule.
- **AI suggestions grounded against the real catalog** — Groq's recommendations are matched against the actual song database before being presented as playable; ungrounded suggestions are shown transparently as "not yet in your library" rather than silently discarded or falsely presented as playable.
- **Code-split, lazy-loaded routes** — the Admin Dashboard (and its Recharts dependency) is isolated into its own JS chunk, so regular listeners never download admin-only code.

---

## Features

- 🔐 JWT auth with persistent login, protected & role-based routes
- 🎧 Global music player — queue, shuffle, repeat (off/all/one), seek, volume (persisted across reloads)
- 📀 Playlists — create, delete, add/remove songs, Liked Songs, Recently Played, Most Played
- 🔍 Debounced multi-entity search (songs/artists/albums) + Trending
- 🤖 AI mood playlists, personalized recommendations, and conversational music chatbot (Groq)
- 🛠️ Admin dashboard — song/artist/album CRUD, user role management, streaming analytics (Recharts)
- 🎨 Audio visualizer (Web Audio API + Canvas), dynamic dominant-color backgrounds, skeleton loaders, staggered animations
- ⌨️ Keyboard shortcuts (Space, arrow-key seek, Ctrl+K search)
- 🛡️ Rate limiting, NoSQL injection sanitization, React Error Boundary

---

## Screenshots

_Add screenshots or a GIF walkthrough here before publishing — e.g. Home page, Fullscreen Player, Admin Dashboard charts._

---

## Project Structure

```
music-streaming-platform/
├── server/
│   ├── config/          # DB, Cloudinary, Groq client config
│   ├── controllers/      # Request handlers
│   ├── middleware/        # Auth, error handling, rate limiting, sanitization
│   ├── models/             # Mongoose schemas
│   ├── routes/              # Express routers
│   ├── services/              # Cloudinary/Groq business logic
│   ├── validators/             # express-validator schemas
│   └── server.js / app.js
│
├── client/
│   ├── src/
│   │   ├── api/           # Centralized Axios calls per resource
│   │   ├── context/         # Auth & Player global state
│   │   ├── hooks/            # useAuth, usePlayer, useDebounce, etc.
│   │   ├── player/             # Global player UI (mini + fullscreen)
│   │   ├── pages/                # Route-level pages (incl. admin/)
│   │   ├── components/            # Reusable UI, organized by domain
│   │   └── routes/                 # Route definitions, guards
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier is sufficient)
- Cloudinary account (free tier)
- Groq API key (free tier available at [console.groq.com](https://console.groq.com))

### Backend Setup
```bash
cd server
npm install
cp .env.example .env   # then fill in your actual values
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
cp .env.example .env   # then fill in your actual values
npm run dev
```

The app will be available at `http://localhost:5173`, with the API running at `http://localhost:5000`.

---

## Environment Variables

**server/.env**
```
PORT=5000
NODE_ENV=development
MONGO_URI=
CLIENT_URL=http://localhost:5173
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
GROQ_API_KEY=
```

**client/.env**
```
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

---

## API Overview

| Resource | Base Route | Notes |
|---|---|---|
| Auth | `/api/v1/auth` | register, login, refresh, logout, me |
| Songs | `/api/v1/songs` | public reads, admin-only writes |
| Artists | `/api/v1/artists` | public reads, admin-only writes |
| Albums | `/api/v1/albums` | public reads, admin-only writes |
| Playlists | `/api/v1/playlists` | owner-authorized CRUD, liked songs |
| Search | `/api/v1/search` | multi-entity search + trending |
| AI | `/api/v1/ai` | recommendations, mood playlists, chat |
| History | `/api/v1/history` | recently played, most played |
| Admin | `/api/v1/admin` | stats, analytics, user management |

All admin-mutating routes require both a valid JWT and `role: "admin"`.

---

## Known Limitations & Future Improvements

Documenting these honestly rather than hiding them:

- **No cascade-delete on Artists/Albums** — deleting an Artist that songs still reference leaves those songs' `artist` field pointing at a non-existent document. A production version would either block deletion while references exist or cascade appropriately.
- **Content Security Policy is disabled** — Helmet's CSP was turned off to avoid silently blocking Cloudinary/Groq requests; a tuned CSP is a reasonable next hardening step before a真real production launch.
- **AI model names require occasional updates** — Groq deprecates models on its own schedule; the model strings in `groqService.js` may need periodic updates (see [Groq's models page](https://console.groq.com/docs/models)).
- **Album pages fetch-and-filter rather than using a dedicated backend query** — acceptable at current scale; would warrant its own indexed endpoint (mirroring the Artist-songs endpoint) if album traffic grows.
- **`SongCard`'s `React.memo` isn't fully optimized** — parent-passed inline callback props still cause re-renders on unrelated state changes; wrapping those handlers in `useCallback` would complete the optimization.
- Rate limiting values are currently tuned for active development; should be revisited for expected real-world traffic before scaling.

---

## What I Learned

A few of the genuinely hard problems solved in this build:

- Architecting a persistent audio player that survives React Router navigation by decoupling the `Audio()` object entirely from the component tree
- Debugging the Web Audio API's one-time-only `MediaElementSourceNode` constraint, and its interaction with React 18 StrictMode's intentional double-invoke behavior in development
- Handling Express 5's breaking change making `req.query` read-only, which broke a popular sanitization middleware, and writing a compatible replacement
- Designing normalized MongoDB relationships and knowing when a simple array reference (Liked Songs) is sufficient versus when a full separate collection (Listening History) is warranted
- Grounding AI-generated suggestions against a real, evolving database rather than presenting ungrounded model output as fact

---

## License

This project was built for educational/portfolio purposes.