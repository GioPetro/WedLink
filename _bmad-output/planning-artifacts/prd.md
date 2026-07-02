# WedLink Product Requirements Document (PRD)

## Goals and Background Context

### Goals
- Launch a full-service digital wedding invitation platform reaching feature parity with mywedsite.gr's Balloon tier
- Differentiate via an AI Photo Studio (Gemini 2.5 Flash Image / "Nano Banana") no competitor offers
- Support the deposit-based payment model (50% now / 50% on delivery) standard in this market
- Acquire 50 paying customers in the first 6 months post-launch

### Background Context
See `brief.md` for the full problem statement and `competitive-analysis.md` for the competitor landscape. In short: Greek full-service providers (mywedsite.gr and peers) have deep, table-stakes feature sets (RSVP, seating, maps, IBAN gifts, galleries) but zero real photo customization. Global builders (Zola, WithJoy, etc.) have great RSVP/registry UX but don't serve this market. WedLink combines the former's completeness with a genuine AI-driven differentiator.

### Change Log
| Date | Version | Description | Author |
|---|---|---|---|
| 2026-07-03 | 1.0 | Initial PRD from brief + competitive analysis | PM (BMAD) |

## Requirements

### Functional Requirements
1. **FR1:** Users can sign up and log in with email/password (JWT-based sessions)
2. **FR2:** Users can create an invitation by selecting a tier (Kite / Balloon / Rocket)
3. **FR3:** Users can edit couple names, event date/time, venue text, and a custom invitation message
4. **FR4:** Users can upload a cover photo and up to N gallery photos (N varies by tier: 5/10/unlimited)
5. **FR5:** Users can select an accent color from a curated palette and a font from a curated list
6. **FR6:** Users can submit a photo + a plain-language style prompt and receive an AI-restyled version of that photo (AI Photo Studio)
7. **FR7:** The AI Photo Studio falls back to CSS-filter style presets if the AI service call fails or times out
8. **FR8:** Users can enable/disable individual RSVP form fields (attending, adult/child count, dietary restrictions, message, song request)
9. **FR9:** Users can publish an invitation, generating a unique public URL and QR code
10. **FR10:** Guests can open the public invitation URL and submit an RSVP without an account
11. **FR11:** Users can view all RSVP responses in a dashboard table and export them as CSV
12. **FR12:** Users can manually add/edit guests (for phone/in-person RSVPs) and bulk-import via CSV
13. **FR13:** Users can pay a 50% deposit via Stripe Checkout to unlock the editor, and the remaining 50% to unlock publishing
14. **FR14:** The system emails the host on each new RSVP and sends the guest a confirmation
15. **FR15:** Users can build a seating chart (tables, seat counts, group names) and assign guests to tables (Balloon+)
16. **FR16:** (Rocket) RSVP responses can auto-sync into unassigned-seat slots; guests can scan a QR code at the venue to find their assigned table
17. **FR17:** Users can display a gift registry / IBAN-IRIS bank detail block with a copy-to-clipboard control (Rocket)
18. **FR18:** Users can add a list of recommended hotels (name, price, map link, notes) (Rocket)
19. **FR19:** Users can enable a countdown timer and an embedded venue map on the public page (Balloon+)
20. **FR20:** Users can enable background music that starts muted and requires a guest tap to play (Rocket)
21. **FR21:** Guests can upload photos/videos to a QR-accessible gallery post-event; the host can view/download all uploads (Rocket)
22. **FR22:** Users can view visit analytics (view count over time) for their published invitation (Balloon+)
23. **FR23:** Users can set an optional entry password/PIN on their public invitation
24. **FR24:** Invitations have a lifecycle: draft → published → archived, enforced server-side

### Non-Functional Requirements
1. **NFR1:** The public invitation page must be mobile-first and usable on a 360px-wide screen without horizontal scrolling
2. **NFR2:** The public RSVP endpoint must handle traffic spikes (an invitation sent to 150+ guests can see concurrent submissions) without data loss
3. **NFR3:** All passwords are bcrypt-hashed; all sessions use JWT with reasonable expiry + refresh
4. **NFR4:** The Gemini API key and Stripe secret key are never exposed to client-side code
5. **NFR5:** Every AI Photo Studio generation is logged (user, invitation, prompt, cost) for cost and abuse monitoring
6. **NFR6:** AI Photo Studio usage is rate-limited per user/session and capped per invitation by tier
7. **NFR7:** All Stripe webhooks are signature-verified before processing
8. **NFR8:** Uploaded images are validated for size (<10MB) and MIME type before storage or AI processing
9. **NFR9:** The system enforces "invitation cannot be published unless at least the deposit payment is confirmed"
10. **NFR10:** Database backups run daily with a documented retention window
11. **NFR11:** Page load time for the public invitation page should be under 2s on a typical mobile connection
12. **NFR12:** The system supports Greek and English UI copy at the template level (not full i18n — just no hardcoded-English-only strings in guest-facing templates)

## User Interface Design Goals

### Overall UX Vision
Warm, editorial, photo-forward — closer to a boutique stationery brand than a SaaS dashboard. The editor should feel like a live preview tool (change → see it reflected instantly), not a form-then-submit flow.

### Key Interaction Paradigms
- Live phone-frame preview alongside every editor control
- Tab-based editor sections (Cover & AI, Couple & Event, Design, RSVP, Extras) matching the feature tiers
- AI Photo Studio: prompt box + curated preset chips + before/after compare, never a dead end (always a fallback)
- Guest-facing page: single-scroll or tab-based sections driven entirely by which "extras" the host enabled — guests never see a disabled feature, not even a greyed-out one

### Target Platforms
Responsive web, mobile-first for the guest-facing page (majority of guests open the link on a phone); desktop-first for the couple's editor/dashboard (more comfortable for detailed editing).

### Branding
Warm neutral palette (see `architecture.md` Design Tokens), serif display type for couple names (Playfair Display default), sans-serif for UI (Inter). Curated accent-color and font pickers — never a raw color picker or Google Fonts dropdown (matches competitor UX expectations and avoids off-brand combinations).

## Technical Assumptions
- **Repository Structure:** Monorepo (single repo, `src/` frontend + `server/` backend) — see `architecture.md`
- **Service Architecture:** Monolith backend (Express) calling out to managed services (Stripe, Gemini, Cloudinary, SendGrid) — no need for microservices at this scale
- **Testing Requirements:** Unit tests on backend business logic (RSVP validation, payment state transitions, AI quota enforcement) + manual QA checklist for UI flows pre-launch; full test pyramid is a post-MVP investment
- **Additional Assumption:** AI Photo Studio starts on the standard Gemini 2.5 Flash Image model (cheapest); do not integrate Nano Banana Pro/4K variants unless a specific tier requirement demands it later

## Epic List
1. **Epic 1 — Foundation & Core Invitation Creation:** Project setup, auth, database, basic editor, publish flow, Kite-tier fields
2. **Epic 2 — RSVP & Guest Management:** Public RSVP form, guest dashboard, CSV import/export, email notifications
3. **Epic 3 — Payments & Tier Gating:** Stripe deposit checkout, tier-based feature gating
4. **Epic 4 — AI Photo Studio:** Gemini integration, prompt UX, quota/cost controls, fallback presets
5. **Epic 5 — Balloon Tier Features:** Seating chart, countdown, map, analytics
6. **Epic 6 — Rocket Tier Features:** Seating Pro + QR seat-finder, registry/IBAN, hotels, music, QR photo gallery
7. **Epic 7 — Polish & Launch Readiness:** Error/loading states, mobile QA, security review, soft launch

## Epic Details

### Epic 1 — Foundation & Core Invitation Creation
**Goal:** A couple can sign up, build a real invitation with core Kite-tier fields, publish it, and a guest can view it on a public URL.

- **Story 1.1:** Project scaffolding — repo, CI lint/test, env config, DB migration runner (see `architecture.md`)
- **Story 1.2:** User signup/login (JWT + bcrypt), account settings page
- **Story 1.3:** Create/edit invitation core fields (couple names, date/time, venue, message) with autosave
- **Story 1.4:** Cover + gallery photo upload to object storage, tier-based photo count limits
- **Story 1.5:** Accent color + font picker (curated options only)
- **Story 1.6:** Publish flow generating a unique slug URL + QR code; draft/published/archived state machine
- **Story 1.7:** Public invitation page rendering all Story 1.3–1.5 content, mobile-first

### Epic 2 — RSVP & Guest Management
**Goal:** Guests can RSVP without an account; the host can see and manage all responses.

- **Story 2.1:** Host configures which RSVP fields are enabled (toggle list)
- **Story 2.2:** Public RSVP form renders only enabled fields and submits without auth
- **Story 2.3:** Guest dashboard: table of all guests/RSVPs, status filter, search
- **Story 2.4:** Manual guest add/edit (for phone/in-person RSVPs)
- **Story 2.5:** CSV import (bulk guest list) and CSV export (all responses)
- **Story 2.6:** Email notification to host on new RSVP; confirmation email to guest

### Epic 3 — Payments & Tier Gating
**Goal:** Couples pay a deposit to unlock the editor and the remainder to unlock publishing; tier determines available features.

- **Story 3.1:** Stripe Checkout session for the 50% deposit at tier selection
- **Story 3.2:** Webhook handling: mark invitation + payment record on successful deposit
- **Story 3.3:** Server-side enforcement: editor locked until deposit confirmed; publish locked until final payment confirmed
- **Story 3.4:** Second Stripe PaymentIntent flow for the remaining 50%
- **Story 3.5:** Tier-based feature gating utility used across Epics 5–6 (single source of truth for "is this feature available on this invitation's tier")

### Epic 4 — AI Photo Studio
**Goal:** A couple can upload a photo, describe a mood in plain language, and get back a genuinely restyled image — this is WedLink's core differentiator.

- **Story 4.1:** Backend endpoint calling Gemini 2.5 Flash Image with an uploaded photo + prompt (server-side key only, per `docs/AI_IMAGE_EDITING.md`)
- **Story 4.2:** Editor UI: prompt box, curated preset chips, before/after compare slider, keep/retry actions
- **Story 4.3:** Multi-turn refinement (reuse conversation/image context across "try again" iterations)
- **Story 4.4:** Per-invitation AI-edit quota by tier + cost logging (`ai_generations` table)
- **Story 4.5:** Graceful fallback to CSS-filter presets on API failure/timeout
- **Story 4.6:** Content moderation pass on uploaded and generated images before they can be saved/published

### Epic 5 — Balloon Tier Features
**Goal:** Reach feature parity with mywedsite.gr's Balloon tier.

- **Story 5.1:** Countdown timer component on the public page
- **Story 5.2:** Venue map embed (ceremony + reception pins, navigation link)
- **Story 5.3:** Seating chart builder (tables, seat counts, group names) in the dashboard
- **Story 5.4:** Visit analytics (view count over time) in the dashboard
- **Story 5.5:** Add-to-calendar button (Apple/Google/Outlook/Yahoo) on the public page

### Epic 6 — Rocket Tier Features
**Goal:** Reach feature parity with mywedsite.gr's Rocket tier.

- **Story 6.1:** Seating Chart Pro — RSVP responses auto-sync into table assignments
- **Story 6.2:** Guest-facing QR seat-finder page (scan → see assigned table)
- **Story 6.3:** Gift registry / IBAN-IRIS display block with copy-to-clipboard
- **Story 6.4:** Hotel recommendations list (name, price, map link, notes) management + display
- **Story 6.5:** Background music toggle (opt-in autoplay-muted, guest-initiated play)
- **Story 6.6:** QR photo gallery — guest upload endpoint + host gallery view/download

### Epic 7 — Polish & Launch Readiness
**Goal:** The product is safe, fast, and pleasant enough to hand to real couples.

- **Story 7.1:** Empty/loading/error states across all editor and dashboard screens
- **Story 7.2:** Mobile QA pass on the public invitation page (iOS Safari, Chrome Android)
- **Story 7.3:** Accessibility pass (labels, contrast, focus states) on the editor and public page
- **Story 7.4:** Load test on the public RSVP endpoint
- **Story 7.5:** Security review against `docs/INFRASTRUCTURE.md` checklist
- **Story 7.6:** Soft launch with a small number of real couples before public marketing

## Explicitly Deferred (Post-v1)
Multi-language invitations, live chat/guestbook wall, guest quiz/voting, second invitation version, native mobile app, print fulfillment. Re-evaluate after Epic 7 ships with real user feedback (see `brief.md`).
