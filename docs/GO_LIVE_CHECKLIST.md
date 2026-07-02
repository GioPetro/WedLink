# WedLink — What You Need To Provide To Go Live

This is the founder-facing checklist: everything that needs an account, a key, or a decision from you before WedLink can run in production. Written against the actual state of the repo as of 2026-07-03 — not a generic launch checklist.

## 1. Where the app actually stands right now

**Working today (verified live, locally):** signup/login, create & edit an invitation, upload a cover photo, publish it to a public link + QR code, and a guest can open that link and submit an RSVP. That's it end-to-end, for real, against a real Postgres database.

**Not built yet** (exists only as a UI mockup, or not at all — see `_bmad-output/planning-artifacts/epics.md` and `_bmad-output/implementation-artifacts/sprint-status.yaml` for the full backlog):
- **Payments** — Checkout page is a non-functional mock ("Pay €X Now" just creates the invitation and shows a fake order ID; no Stripe integration exists in the code). Nothing charges a card today.
- **AI Photo Studio** — the product's core differentiator. No Gemini integration exists yet.
- **Email notifications** — no SendGrid integration; hosts/guests get no emails.
- **Guest dashboard / CSV import-export** — hosts can't yet see or manage their RSVP list from the UI.
- Seating charts, gift registry, hotels, background music, guest photo gallery, analytics — all Balloon/Rocket-tier features, entirely unbuilt.

**Bottom line:** you can demo the core "build and share an invitation" loop today. You cannot take a real customer's money or use the AI feature yet — those need both API keys (below) and more development work.

## 2. Accounts and keys you need to create

I can't create accounts or enter payment/API credentials on your behalf — these are things only you can do. For each one, sign up yourself, then hand me the resulting key/secret (paste it, or better, put it directly into your production environment's secret manager) and I'll wire it in.

| # | What | Where to get it | Needed for |
|---|---|---|---|
| 1 | **Domain name** | Any registrar (Namecheap, Google Domains, etc.) | Your public URL, e.g. `wedlink.gr` |
| 2 | **Vercel account** | vercel.com | Hosting the frontend (free tier is fine to start) |
| 3 | **Railway or Fly.io account** | railway.app / fly.io | Hosting the Express backend |
| 4 | **Managed Postgres** | Railway/Supabase/Neon (Railway can host both app + DB in one account) | The database — do not use the local `docker-compose.yml` setup in production, that's dev-only |
| 5 | **Stripe account** | stripe.com | Taking real payments (50% deposit / 50% on delivery, per your pricing model) — needs business verification (bank account, VAT number) before it can accept live payments |
| 6 | **Google AI Studio / Gemini API key** | aistudio.google.com | The AI Photo Studio feature — get an API key, put it on a billing-enabled Google Cloud project (Gemini image generation is usage-based, ~$0.03–0.07/image, see cost table below) |
| 7 | **Cloudinary account** | cloudinary.com | Photo storage in production — the app currently stores uploaded photos on local disk, which does **not** survive redeploys on Railway/Fly.io/Vercel. This must be swapped before launch, not optional. |
| 8 | **SendGrid (or Postmark) account** | sendgrid.com | RSVP confirmation emails, host notifications, payment receipts |
| 9 | **Sentry account** (optional but recommended) | sentry.io | Error tracking once real users hit the site |
| 10 | **A Greek accountant/legal review** | — | Deposit payments + VAT handling — flagged as a compliance risk in `brief.md`; this is not something I can advise on, get a real accountant to confirm the payment/invoicing setup before taking money |

## 3. Environment variables — what goes where

This is `.env.example` in the repo, mapped to which of the accounts above fills each value:

| Variable | Source | Notes |
|---|---|---|
| `DATABASE_URL` | Your managed Postgres provider (#4) | Connection string they give you after creating the DB |
| `JWT_SECRET` | Generate yourself | Any long random string — e.g. run `openssl rand -hex 32`. **Do not reuse** the placeholder value from `.env.example` |
| `STRIPE_SECRET_KEY` | Stripe dashboard (#5) | Use the **test** key until Stripe integration is actually built and tested, then switch to the **live** key |
| `SENDGRID_API_KEY` | SendGrid dashboard (#8) | |
| `CLOUDINARY_NAME` / `CLOUDINARY_KEY` / `CLOUDINARY_SECRET` | Cloudinary dashboard (#7) | |
| `NODE_ENV` | Set to `production` | |
| `PORT` | Usually set automatically by Railway/Fly.io | |
| `VITE_API_URL` | Your backend's public URL, e.g. `https://api.wedlink.gr/api` | Must be set at frontend **build** time on Vercel |

Not yet in `.env.example` but will be needed once those features are built:
- `GEMINI_API_KEY` (#6) — for the AI Photo Studio
- `STRIPE_WEBHOOK_SECRET` — Stripe gives you this when you register the webhook endpoint (needed once the real payment flow is built)

## 4. Suggested order of operations

1. **Now:** get accounts #1–4 (domain, Vercel, Railway/Fly.io, Postgres) — enough to deploy the current working core loop (signup → create → publish → guest RSVP) to a real URL people can visit.
2. **Before any real customer uses it:** get Cloudinary (#7) — swap the photo upload code from local disk to Cloudinary (currently a known dev-only shortcut, see `server/index.js`'s upload handler).
3. **Before taking money:** get Stripe (#5) + the accountant review (#10), then the actual Stripe Checkout + webhook integration needs to be built (currently just a UI mock) — that's Epic 3 in the sprint backlog.
4. **Before marketing the AI differentiator:** get the Gemini key (#6), then Epic 4 (AI Photo Studio) needs to be built.
5. **Before any real guest list goes out:** get SendGrid (#8) so hosts/guests actually get confirmation emails (Epic 2).

## 5. Estimated monthly cost (early stage, low volume)

| Service | Est. Cost |
|---|---|
| Vercel (frontend) | €0–20 |
| Railway/Fly.io (backend) | €20–40 |
| Managed Postgres | €0–25 |
| Cloudinary | €0–15 |
| SendGrid | €0–20 |
| Gemini API (AI edits) | Usage-based, ~€0.03–0.07/image — cap per invitation by tier to control cost |
| Stripe fees | 2.9% + €0.30 per transaction |
| **Fixed total** | **~€50–120/mo** at low volume |

## 6. Security checklist before flipping this live

- [ ] `JWT_SECRET` is a real random value, not the `.env.example` placeholder
- [ ] Separate Stripe keys and separate databases for staging vs. production
- [ ] CORS locked to your actual frontend domain (currently wide open — `app.use(cors())` with no origin restriction, fine for dev, not for production)
- [ ] Rate limiting added to public endpoints (`/api/public/invitations/:url/rsvp`, and later the AI generation endpoint) — not yet implemented
- [ ] Photo storage moved off local disk to Cloudinary (see §4.2)
- [ ] Database backups confirmed with your Postgres provider (daily snapshot, check their retention window)
- [ ] Publishing gated on payment confirmation server-side, once payments exist (NFR9 — not enforced yet since payments aren't built)

## 7. What I need from you to keep going

Once you've created the accounts above, give me:
1. The keys/secrets (or set them directly as environment variables in Railway/Vercel's dashboards, which is actually the safer way — I don't need to see them, I just need to know they're set)
2. Confirmation on which epic to build next — I'd suggest either finishing Epic 2 (RSVP dashboard + email) since it's the smallest gap, or jumping to Epic 4 (AI Photo Studio) since that's the actual product differentiator, depending on what you want to demo first.
