# WedLink

Digital wedding invitation platform — React + Express + PostgreSQL, with an AI-assisted photo styling feature (Nano Banana / Gemini 2.5 Flash Image).

## Start here
Read `docs/PROJECT_PLAN.md` for the phased build order. It sequences:
- `docs/FEATURES.md` — full tier-by-tier feature backlog
- `docs/AI_IMAGE_EDITING.md` — Nano Banana/Gemini integration spec
- `docs/INFRASTRUCTURE.md` — stack, schema, payments, hosting
- `docs/ARCHITECTURE.md` — original system design notes
- `docs/design-reference.dc.html` — UX/flow reference only (open in a browser to click through the intended screens; it's not source code to port — it uses a proprietary templating runtime).

## Current state of this codebase
This is a **scaffold**, not a finished app:
- `src/` — React pages (Landing, Auth, Dashboard, Editor, Checkout, PublicInvitation) and Zustand stores wired to call a backend API, using mock/local state where a real API isn't wired up yet
- `server/` — Express API skeleton (`server/index.js`) + Postgres schema (`server/schema.sql`) + migration runner (`server/migrate.js`)
- Payments, email, image storage, and the real AI image-editing call are **not implemented yet** — see docs for the spec to build against

## Setup
```bash
npm install
cp .env.example .env   # fill in DATABASE_URL, JWT_SECRET, STRIPE_SECRET_KEY, GEMINI_API_KEY, etc.
createdb wedlink        # or use docker-compose up -d for local Postgres
npm run db:migrate

# Terminal 1
npm run server:dev
# Terminal 2
npm run dev
```
Visit `http://localhost:5173`.

## Deploy
Frontend → Vercel. Backend → Railway/Fly.io. See `docs/INFRASTRUCTURE.md` for the full checklist and estimated costs.
