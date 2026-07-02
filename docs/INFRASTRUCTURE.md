# Infrastructure & Payments Plan

## Recommended Stack
- **Frontend:** React + Vite, Tailwind CSS, deployed on Vercel
- **Backend:** Node.js/Express (or Next.js API routes if you fold frontend+backend together), deployed on Railway or Fly.io
- **Database:** PostgreSQL (Railway/Supabase/Neon — any managed Postgres)
- **Object storage:** Cloudinary (image hosting + on-the-fly transforms) or S3 + CloudFront
- **Email:** SendGrid or Postmark (RSVP confirmations, host notifications, payment receipts)
- **AI image editing:** Gemini API (Nano Banana / Gemini 2.5 Flash Image) — see AI_IMAGE_EDITING.md
- **Payments:** Stripe (Checkout + PaymentIntents, supports deposit/installment flow)
- **Error tracking:** Sentry
- **Auth:** Your own JWT + bcrypt, or swap in Clerk/Auth0 if you want to skip building this

## Database Schema (core tables)
- `users` — id, email, password_hash, full_name, phone, created_at
- `invitations` — id, user_id, title, tier, couple_name_1/2, event_date/time, venue, accent_color, font_family, status (draft/published/archived), invitation_url (slug), access_code, timestamps
- `guests` — id, invitation_id, name, email, phone, group_name, status, num_adults, num_children, dietary_restrictions, table_assignment
- `rsvp_responses` — id, guest_id, invitation_id, attendance, num_adults, num_children, dietary_restrictions, message, responded_at
- `payments` — id, user_id, invitation_id, amount, currency, status, stripe_payment_intent_id, installment_1/2_amount, installment_1/2_paid
- `ai_generations` — id, invitation_id, user_id, prompt, source_image_url, result_image_url, cost_usd, created_at (for cost tracking per AI_IMAGE_EDITING.md)
- `invitation_visits` — id, invitation_id, visitor_ip, user_agent, visited_at (analytics)

## Payments Flow (deposit model, matches competitor's terms)
1. Couple picks a tier → Stripe Checkout session for **50% of tier price**
2. On success webhook: create the `invitations` row (status: draft) and a `payments` row (installment_1_paid: true)
3. Editor unlocks; couple builds the invitation
4. On publish (or 5 days before, whichever you decide): trigger the second Stripe PaymentIntent for the remaining 50%
5. Only fully-paid invitations can go live at a public URL — enforce this server-side, not just in the UI

Use **Stripe Checkout** for the simplest, PCI-compliant integration — don't build custom card forms.

## Hosting/Env Checklist
- [ ] `.env` — `DATABASE_URL`, `JWT_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `GEMINI_API_KEY`, `SENDGRID_API_KEY`, `CLOUDINARY_URL`
- [ ] Separate staging + production environments (separate Stripe keys, separate DB)
- [ ] Domain + SSL (Vercel handles this automatically for the frontend)
- [ ] Database backups (daily automated snapshot, most managed Postgres providers do this by default — just confirm retention window)
- [ ] Rate limiting on public endpoints (RSVP submission, AI generation) to prevent abuse
- [ ] CORS locked to your own frontend origin in production

## Estimated Monthly Cost (early stage, low volume)
| Service | Est. Cost |
|---|---|
| Vercel (frontend) | €0–20 |
| Railway/Fly.io (backend) | €20–40 |
| Managed Postgres | €0–25 |
| Cloudinary | €0–15 |
| SendGrid | €0–20 |
| Gemini API (AI edits) | Usage-based, ~€0.03–0.07/image — budget per the cap in AI_IMAGE_EDITING.md |
| Stripe fees | 2.9% + €0.30 per transaction |
| **Fixed total** | **~€50–120/mo** at low volume |

## Security Baseline
- Bcrypt-hashed passwords, JWT with reasonable expiry + refresh flow
- Server-side validation on every input (never trust the client, especially on RSVP forms which are public/unauthenticated)
- Signed, expiring URLs for private assets if needed
- Webhook signature verification on all Stripe webhooks
- Never log full card numbers, API keys, or raw uploaded photos in application logs

## Suggested Build Order
See **PROJECT_PLAN.md** for how these infra pieces map to build phases.
