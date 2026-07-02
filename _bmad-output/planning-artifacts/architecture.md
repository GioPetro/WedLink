# WedLink Fullstack Architecture

Companion to `prd.md`. Read that first for *what* to build; this document is *how*.

## High-Level Architecture
Monolith web app: React SPA frontend, Express REST API backend, PostgreSQL database, three external services (Stripe, Gemini, Cloudinary/S3) called server-side only. No microservices, no message queue — this scale doesn't need them yet.

```
Browser (React SPA)
   │  fetch /api/*
   ▼
Express API  ──────►  PostgreSQL
   │   │   │
   │   │   └────────►  Cloudinary/S3 (photo storage)
   │   └────────────►  Gemini API (AI Photo Studio)
   └────────────────►  Stripe (payments) + SendGrid (email)
```

## Tech Stack
| Layer | Choice | Notes |
|---|---|---|
| Frontend | React 18 + Vite | Fast dev server, small bundle |
| Styling | Tailwind CSS | Utility-first, matches curated-token approach |
| Routing | react-router-dom | Standard SPA routing |
| State | Zustand | Lighter than Redux for this scope |
| Backend | Express (Node 18+) | Simple REST API, ESM modules |
| Database | PostgreSQL | Managed (Railway/Supabase/Neon) |
| Auth | JWT + bcrypt | Roll-your-own is fine at this scale; revisit if SSO is ever needed |
| Payments | Stripe Checkout + PaymentIntents | Deposit model per FR13 |
| AI Image Editing | Gemini 2.5 Flash Image ("Nano Banana") | Server-side only, see `AI_IMAGE_EDITING.md` |
| Image storage | Cloudinary | Handles transforms/CDN; swap for S3+CloudFront if cost dictates |
| Email | SendGrid | RSVP notifications, receipts |
| Error tracking | Sentry | Add in Epic 7 |
| Frontend hosting | Vercel | |
| Backend hosting | Railway or Fly.io | |

## Data Models
Full DDL lives in `server/schema.sql` — summarized here:

- **users** — id, email, password_hash, full_name, phone, created_at
- **invitations** — id, user_id, title, tier, couple_name_1/2, event_date/time, venue, accent_color, font_family, status (draft/published/archived), invitation_url (slug), access_code, timestamps
- **guests** — id, invitation_id, name, email, phone, group_name, status, num_adults, num_children, dietary_restrictions, table_assignment
- **rsvp_responses** — id, guest_id, invitation_id, attendance, num_adults, num_children, dietary_restrictions, message, responded_at
- **payments** — id, user_id, invitation_id, amount, currency, status, stripe_payment_intent_id, installment_1/2_amount, installment_1/2_paid
- **ai_generations** — id, invitation_id, user_id, prompt, source_image_url, result_image_url, cost_usd, created_at (NFR5)
- **invitation_visits** — id, invitation_id, visitor_ip, user_agent, visited_at

Add in Epic 5/6: `seating_tables`, `hotels`, `gallery_uploads` (schema to be added when those epics start — don't pre-build unused tables).

## API Surface (by Epic)
| Endpoint | Epic | Notes |
|---|---|---|
| `POST /api/auth/signup`, `POST /api/auth/login` | 1 | JWT issuance |
| `POST/GET/PUT /api/invitations` | 1 | CRUD, ownership-checked |
| `POST /api/invitations/:id/photos` | 1 | Upload to Cloudinary, tier-limited count |
| `POST /api/invitations/:id/publish` | 1, 3 | Gated by payment status (NFR9) |
| `GET /api/public/invitations/:slug` | 1 | No auth, public read |
| `POST /api/public/invitations/:slug/rsvp` | 2 | No auth, public write, rate-limited |
| `GET /api/invitations/:id/guests`, guest CRUD | 2 | |
| `POST /api/invitations/:id/guests/import` | 2 | CSV import |
| `GET /api/invitations/:id/guests/export` | 2 | CSV export |
| `POST /api/payments/checkout` | 3 | Stripe Checkout session |
| `POST /api/payments/webhook` | 3 | Signature-verified (NFR7) |
| `POST /api/ai/style` | 4 | Server-side Gemini call, quota-checked |
| `GET /api/invitations/:id/analytics` | 5 | View counts |
| `POST /api/invitations/:id/seating/*` | 5, 6 | Tables/assignments |
| `GET /api/public/invitations/:slug/seat/:guestCode` | 6 | QR seat-finder, no auth |
| `POST /api/public/invitations/:slug/gallery` | 6 | Guest photo upload, no auth |

## Source Tree
```
wedlink-app/
├── src/
│   ├── pages/            # Landing, Auth, Dashboard, Editor, Checkout, PublicInvitation
│   ├── components/        # (add as shared UI emerges — don't pre-build)
│   └── stores/            # Zustand: authStore, invitationStore
├── server/
│   ├── index.js           # Express app + route mounting
│   ├── routes/             # (split by resource as Epic 2+ grows index.js)
│   ├── schema.sql
│   └── migrate.js
├── docs/                  # this BMAD doc set
└── .github/workflows/      # CI/CD
```

## Security Requirements (maps to NFR3–NFR9)
- Bcrypt password hashing, JWT with expiry + refresh
- Gemini/Stripe secrets server-side only, never in client bundle
- Stripe webhook signature verification
- Upload validation (size/MIME) before storage or AI processing
- Rate limiting on public endpoints (`/rsvp`, `/ai/style`, `/gallery`)
- Publish gated server-side on payment status, not just hidden in the UI

## Coding Standards
- ESM modules throughout (`"type": "module"` already set in `package.json`)
- No secrets in committed files — `.env` only, `.env.example` documents required keys
- Every new table gets a migration in `server/schema.sql` + a note in this doc's Data Models section
- New API routes are added to the table above when Epic work adds them, so this doc stays the single source of truth

## Testing Strategy
- Unit tests (Vitest) on: RSVP validation logic, payment state transitions, AI quota enforcement, tier-gating utility (Story 3.5)
- Manual QA checklist (Epic 7) for full UI flows pre-launch
- Load test the public RSVP endpoint before launch (NFR2, Story 7.4)

## Deployment
Frontend auto-deploys to Vercel on push to `main`. Backend auto-deploys to Railway/Fly.io on push to `main` (see `.github/workflows/deploy.yml`). Separate staging + production environments with separate Stripe keys and separate databases — do not share a DB between staging and prod.
