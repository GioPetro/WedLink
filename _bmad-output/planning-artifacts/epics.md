---
stepsCompleted: []
inputDocuments: []
---

# WedLink - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for WedLink, decomposing the requirements from `prd.md` and `architecture.md` into implementable stories. There is no separate UX specification document for this project; UX intent is captured in the PRD's "User Interface Design Goals" section and summarized below.

## Requirements Inventory

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

### NonFunctional Requirements

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

### Additional Requirements

Per `prd.md` Technical Assumptions: WedLink is a single-repo monorepo (`src/` frontend + `server/` backend), built as a monolith Express backend calling out to managed services (Stripe, Gemini, Cloudinary, SendGrid) — no microservices at this scale. Testing is unit tests on backend business logic (RSVP validation, payment state transitions, AI quota enforcement) plus a manual QA checklist for UI flows pre-launch; a full test pyramid is explicitly deferred post-MVP. The AI Photo Studio starts on the standard Gemini 2.5 Flash Image model only — Nano Banana Pro/4K variants are out of scope unless a specific tier requirement later demands them.

### UX Design Requirements

No separate UX spec exists for this project; see `prd.md` § User Interface Design Goals. Summary: the product should feel warm, editorial, and photo-forward (closer to a boutique stationery brand than a SaaS dashboard), with a live phone-frame preview next to every editor control so changes are reflected instantly rather than via a form-then-submit flow. The editor uses tab-based sections (Cover & AI, Couple & Event, Design, RSVP, Extras) matching the tier structure; the AI Photo Studio pairs a prompt box with curated preset chips and a before/after compare, and always has a non-dead-end fallback. The guest-facing page is mobile-first and renders only the extras the host has enabled — guests never see a disabled feature, not even greyed out. Desktop-first is acceptable for the couple's editor/dashboard; the public page must be mobile-first. Branding uses a warm neutral palette with curated accent colors and fonts only (no raw color picker, no Google Fonts dropdown).

### FR Coverage Map

| Requirement | Epic.Story |
|---|---|
| FR1 | 1.2 |
| FR2 | 1.3, 3.1 |
| FR3 | 1.3 |
| FR4 | 1.4 |
| FR5 | 1.5 |
| FR6 | 4.1, 4.2 |
| FR7 | 4.5 |
| FR8 | 2.1 |
| FR9 | 1.6 |
| FR10 | 2.2 |
| FR11 | 2.3, 2.5 |
| FR12 | 2.4, 2.5 |
| FR13 | 3.1, 3.4 |
| FR14 | 2.6 |
| FR15 | 5.3 |
| FR16 | 6.1, 6.2 |
| FR17 | 6.3 |
| FR18 | 6.4 |
| FR19 | 5.1, 5.2 |
| FR20 | 6.5 |
| FR21 | 6.6 |
| FR22 | 5.4 |
| FR23 | 1.6, 1.7 |
| FR24 | 1.6, 3.3 |
| NFR1 | 1.7, 7.2 |
| NFR2 | 2.2, 7.4 |
| NFR3 | 1.2 |
| NFR4 | 1.1, 3.1, 4.1 |
| NFR5 | 4.4 |
| NFR6 | 4.4 |
| NFR7 | 3.2 |
| NFR8 | 1.4, 4.1, 6.6 |
| NFR9 | 3.3 |
| NFR10 | 7.5 |
| NFR11 | 1.7, 7.2 |
| NFR12 | 7.1 |

## Epic List

1. **Epic 1 — Foundation & Core Invitation Creation:** Project setup, auth, database, basic editor, publish flow, Kite-tier fields
2. **Epic 2 — RSVP & Guest Management:** Public RSVP form, guest dashboard, CSV import/export, email notifications
3. **Epic 3 — Payments & Tier Gating:** Stripe deposit checkout, tier-based feature gating
4. **Epic 4 — AI Photo Studio:** Gemini integration, prompt UX, quota/cost controls, fallback presets
5. **Epic 5 — Balloon Tier Features:** Seating chart, countdown, map, analytics
6. **Epic 6 — Rocket Tier Features:** Seating Pro + QR seat-finder, registry/IBAN, hotels, music, QR photo gallery
7. **Epic 7 — Polish & Launch Readiness:** Error/loading states, mobile QA, security review, soft launch

## Epic 1: Foundation & Core Invitation Creation

A couple can sign up, build a real invitation with core Kite-tier fields, publish it, and a guest can view it on a public URL. This epic delivers the full core-editing-and-viewing loop before any payment, AI, or tier-gated feature exists.

### Story 1.1: Project Scaffolding

As a developer,
I want the repo initialized with CI, environment config, and a working local dev loop,
So that every subsequent story can be built and verified without re-solving setup.

**Acceptance Criteria:**

**Given** the repo is freshly cloned
**When** a developer runs `npm install && npm run dev`
**Then** the frontend serves locally without errors
**And** `npm run server:dev` starts the Express server locally without errors

**Given** `server/schema.sql` defines the initial tables
**When** a developer runs `npm run db:migrate` against a local/dev Postgres instance
**Then** all tables from `server/schema.sql` are created successfully

**Given** `.env.example`
**When** a developer inspects it
**Then** it documents every required variable (DATABASE_URL, JWT_SECRET, STRIPE_SECRET_KEY, GEMINI_API_KEY, SENDGRID_API_KEY, CLOUDINARY_URL) so secrets never need to be hardcoded (NFR4)

**Given** a pull request is opened
**When** CI runs via `.github/workflows/deploy.yml`
**Then** a lint/test job executes and must pass before any deploy step runs

**Given** the README's Setup section
**When** a developer follows it step by step
**Then** the documented steps accurately reflect the real setup process

### Story 1.2: Auth (Signup/Login)

As a couple,
I want to sign up and log in,
So that my invitation data is private to my account.

**Acceptance Criteria:**

**Given** a new email/password
**When** a user calls `POST /api/auth/signup`
**Then** a `users` row is created with a bcrypt-hashed password (NFR3)
**And** a duplicate email is rejected with a clear error

**Given** valid credentials
**When** a user calls `POST /api/auth/login`
**Then** the endpoint verifies them and returns a signed JWT (NFR3)

**Given** a request to `/api/invitations*` or another authenticated route
**When** no valid JWT is present
**Then** the auth middleware returns 401

**Given** the frontend `authStore`
**When** a user signs up or logs in via `Auth.jsx`
**Then** the token is persisted and attached to subsequent authenticated requests, and the user is redirected to the dashboard

**Given** any API response
**When** passwords are involved
**Then** they are never logged or returned in the response body

**Given** a logged-in user
**When** they view Account Settings
**Then** their email is displayed and a logout control is available

### Story 1.3: Core Invitation Fields with Autosave

As a couple,
I want to enter our names, date, venue, and invitation message and have it save automatically,
So that I never lose work and never have to find a "Save" button.

**Acceptance Criteria:**

**Given** a logged-in user
**When** they call `POST /api/invitations`
**Then** a new invitation row is created, owned by that user, with `status: 'draft'` and the selected tier recorded (FR2)

**Given** an existing invitation
**When** the owner calls `PUT /api/invitations/:id` with couple_name_1/2, event_date, event_time, venue, or message
**Then** the fields update
**And** a non-owner request is rejected with 403

**Given** a logged-in user
**When** they call `GET /api/invitations`
**Then** they receive a list of their own invitations only, for the dashboard

**Given** an invitation id
**When** the owner calls `GET /api/invitations/:id`
**Then** the full invitation detail is returned for the editor

**Given** the editor UI (`Editor.jsx`)
**When** a user edits a field
**Then** changes are debounced (~500ms) and sent to the real update endpoint
**And** a subtle "Saved"/"Saving…" indicator confirms persistence with no explicit save button

**Given** saved data
**When** the user reloads the editor page
**Then** the most recently saved values are shown, not stale mock data

### Story 1.4: Photo Upload (Cover + Gallery)

As a couple,
I want to upload a cover photo and gallery photos,
So that our invitation shows real pictures of us, not placeholders.

**Acceptance Criteria:**

**Given** an image file
**When** a user calls `POST /api/invitations/:id/photos`
**Then** the file is validated for size (<10MB) and MIME type (NFR8) and stored via Cloudinary
**And** the invitation record tracks the cover photo URL and an ordered gallery photo URL list

**Given** a tier (Kite/Balloon/Rocket)
**When** a gallery upload would exceed that tier's cap (5/10/unlimited respectively, FR4)
**Then** the server rejects the upload regardless of what the client UI allowed

**Given** an existing gallery photo
**When** the user deletes it or reorders the gallery
**Then** the change persists and is reflected in the ordered list

**Given** an upload in progress or a rejected upload
**When** the editor UI is shown
**Then** upload progress is visible and a clear error explains the rejection (wrong type, too large, over tier cap)

**Given** uploaded photos
**When** rendered in the editor's live preview or the published public page
**Then** they display correctly in both places

### Story 1.5: Color & Font Picker

As a couple,
I want to pick an accent color and font from a curated list,
So that our invitation matches our wedding's style without needing design skills.

**Acceptance Criteria:**

**Given** the editor's design tab
**When** a user opens the color picker
**Then** a fixed palette of accent-color swatches is shown (`#a9673f #c9704d #6b5344 #9b7d6b #7a8b6f #8b6f9b`) with no free-form color input (FR5)

**Given** the editor's design tab
**When** a user opens the font picker
**Then** a curated list of font pairings is shown (starting with Playfair Display, Inter, Georgia)

**Given** a color or font selection
**When** the user picks one
**Then** `PUT /api/invitations/:id` is called, reusing Story 1.3's autosave endpoint, and the live preview updates immediately

**Given** a published invitation
**When** the public page (Story 1.7) renders
**Then** it uses the selected accent color and font

**Given** an active selection
**When** the picker is displayed
**Then** the selected swatch/font shows a clear selected-state style, distinguishing it from the others

### Story 1.6: Publish Flow (Slug + QR Code)

As a couple,
I want to publish my invitation to a unique link with a QR code,
So that I can share it with guests.

**Acceptance Criteria:**

**Given** an invitation with couple names, date, and venue already set
**When** the owner calls `POST /api/invitations/:id/publish`
**Then** a unique, human-readable slug is generated (e.g. `nikos-elena-2026`, with a numeric suffix on collision) and `status` becomes `'published'` with `published_at` set (FR9, FR24)

**Given** an invitation missing couple names, date, or venue
**When** publish is attempted
**Then** the request is rejected with 403 and a clear error, and no state changes

**Given** a published invitation
**When** the dashboard is viewed
**Then** a QR code image encoding the public URL is available alongside the shareable link and the invitation's current status (draft/published/archived)

**Given** a slug
**When** an unauthenticated guest calls `GET /api/public/invitations/:slug`
**Then** only public-safe fields are returned — no internal IDs, no owner email

**Given** an already-published invitation
**When** publish is called again
**Then** it is a no-op that returns the existing slug rather than an error or a duplicate publish

**Given** the host wants to restrict access
**When** they set an optional entry password/PIN on the invitation (FR23)
**Then** the code is stored server-side and enforced by Story 1.7's public page, not merely hidden client-side

### Story 1.7: Public Invitation Page

As a guest,
I want to open the shared invitation link and see the couple's details on my phone,
So that I know when/where the wedding is.

**Acceptance Criteria:**

**Given** a published slug
**When** `PublicInvitation.jsx` loads
**Then** it fetches `GET /api/public/invitations/:slug` and renders real data, not mock data

**Given** a 360px-wide viewport
**When** the page renders
**Then** there is no horizontal scroll (NFR1)
**And** cover photo, couple names, date, venue, and message render correctly with the invitation's chosen accent color and font

**Given** an invalid or unpublished slug
**When** the page loads
**Then** a clear "not found" state is shown, not a crash or blank page

**Given** a throttled mobile connection
**When** the page loads
**Then** it completes in under 2s (NFR11), verified with browser devtools network throttling, not a guess

**Given** an invitation with an access code set (FR23, Story 1.6)
**When** a guest opens the link
**Then** the page prompts for the code and reveals content only after the server confirms a match — the content is never shipped to the client and merely hidden

## Epic 2: RSVP & Guest Management

Guests can RSVP without an account; the host can see and manage all responses through a searchable dashboard, manual entry, bulk CSV import/export, and automatic email notifications.

### Story 2.1: RSVP Field Configuration

As a host,
I want to configure which RSVP fields are enabled,
So that I only collect the information relevant to my wedding.

**Acceptance Criteria:**

**Given** the editor's RSVP tab
**When** the host toggles fields (attending, adult/child count, dietary restrictions, message, song request)
**Then** the enabled/disabled state is saved to the invitation record via `PUT /api/invitations/:id` (FR8)

**Given** a field toggled off
**When** the host views the RSVP tab
**Then** it is clearly marked disabled, and it will not render on the public RSVP form

**Given** a newly created invitation with no configuration yet
**When** the RSVP tab is first opened
**Then** a sensible default set of fields (attending, adult/child count) is enabled

**Given** a saved configuration
**When** the host reloads the editor
**Then** the toggle states persist as previously saved

### Story 2.2: Public RSVP Submission

As a guest,
I want to submit my RSVP without creating an account,
So that responding is quick and frictionless.

**Acceptance Criteria:**

**Given** a published invitation's public page
**When** a guest views the RSVP section
**Then** only the fields the host enabled (Story 2.1) are rendered

**Given** a filled RSVP form
**When** the guest submits it
**Then** `POST /api/public/invitations/:slug/rsvp` creates or updates an `rsvp_responses` row with no authentication required (FR10)

**Given** the public RSVP endpoint
**When** many guests submit concurrently (an invitation sent to 150+ guests)
**Then** the endpoint is rate-limited and handles concurrent writes without data loss (NFR2)

**Given** a required field is missing
**When** the guest submits
**Then** a clear inline validation error is shown and nothing is saved

**Given** a successful submission
**When** it completes
**Then** the guest sees a confirmation state on the page

### Story 2.3: Guest Dashboard

As a host,
I want to see a table of all guests and their RSVP status,
So that I know who's coming.

**Acceptance Criteria:**

**Given** a logged-in host
**When** they open the guest dashboard for an invitation
**Then** `GET /api/invitations/:id/guests` returns all guests with their RSVP status (FR11)

**Given** the dashboard table
**When** the host applies a status filter (attending / declined / no response)
**Then** only matching rows display

**Given** the dashboard table
**When** the host types in the search box
**Then** guests are filtered by name/email in real time

**Given** a non-owner
**When** they attempt to view another user's guest list
**Then** the request is rejected with 403

### Story 2.4: Manual Guest Management

As a host,
I want to manually add and edit guests,
So that I can record phone or in-person RSVPs.

**Acceptance Criteria:**

**Given** the guest dashboard
**When** the host adds a new guest with name/contact details
**Then** a `guests` row is created for that invitation (FR12)

**Given** an existing guest
**When** the host edits their details or RSVP status
**Then** the update is saved and immediately reflected in the dashboard table

**Given** a guest the host wants to remove
**When** they delete it
**Then** the guest and its RSVP response (if any) are removed from the list

**Given** a non-owner
**When** they attempt to add, edit, or delete a guest on an invitation they don't own
**Then** the request is rejected with 403

### Story 2.5: CSV Import & Export

As a host,
I want to bulk-import my guest list and export all responses,
So that I don't have to enter guests one by one or copy data manually.

**Acceptance Criteria:**

**Given** a CSV file of guests
**When** the host uploads it via `POST /api/invitations/:id/guests/import`
**Then** valid rows are created as `guests` records and invalid rows are reported back with a clear per-row error (FR12)

**Given** an import in progress
**When** duplicate guests (matched by name + email) are detected
**Then** duplicates are skipped or flagged, not silently double-created

**Given** the dashboard
**When** the host requests `GET /api/invitations/:id/guests/export`
**Then** a CSV containing all guests and their RSVP responses downloads (FR11)

**Given** a large guest list (150+)
**When** import or export runs
**Then** it completes without timing out or truncating rows

### Story 2.6: RSVP Email Notifications

As a host,
I want to be emailed when a guest RSVPs,
So that I don't have to keep checking the dashboard, and as a guest I want a confirmation email so I know my response was received.

**Acceptance Criteria:**

**Given** a new RSVP submission
**When** it's saved successfully
**Then** SendGrid sends a notification email to the host with the guest's response summary (FR14)

**Given** a new RSVP submission with a guest email address provided
**When** it's saved successfully
**Then** SendGrid sends a confirmation email to the guest

**Given** the email service call fails
**When** an RSVP is submitted
**Then** the RSVP itself is still saved successfully — an email failure must never block or lose the submission

**Given** the host's account settings
**When** they view notification preferences
**Then** they can confirm RSVP email notifications are active for their invitation

## Epic 3: Payments & Tier Gating

Couples pay a 50% deposit to unlock the editor and the remaining 50% to unlock publishing; a single tier-gating utility becomes the source of truth for which features Epics 5 and 6 expose per tier.

### Story 3.1: Deposit Checkout

As a couple,
I want to pay a 50% deposit when I select my tier,
So that I can unlock the editor and start building my invitation.

**Acceptance Criteria:**

**Given** a user selecting a tier (Kite/Balloon/Rocket) for a new or existing invitation
**When** they click "Pay deposit"
**Then** `POST /api/payments/checkout` creates a Stripe Checkout session for 50% of that tier's price (FR2, FR13)

**Given** a created Checkout session
**When** the user completes payment on Stripe's hosted page
**Then** they're redirected back to WedLink with a pending/confirmed state shown

**Given** the Stripe secret key
**When** the checkout endpoint runs
**Then** the key is read only server-side and is never exposed to the client bundle (NFR4)

**Given** a `payments` row
**When** a checkout session is created
**Then** `installment_1_amount` is recorded and `installment_1_paid` starts false

### Story 3.2: Payment Webhook Handling

As the platform,
I want to reliably record successful payments,
So that access unlocks automatically without manual intervention.

**Acceptance Criteria:**

**Given** a Stripe webhook event
**When** `POST /api/payments/webhook` receives it
**Then** the signature is verified before any processing occurs (NFR7); unverified requests are rejected

**Given** a verified `checkout.session.completed` event for the deposit
**When** processed
**Then** the matching `payments` row is updated (`installment_1_paid = true`) and the invitation is marked deposit-confirmed

**Given** a webhook delivered more than once (Stripe retries)
**When** processed
**Then** handling is idempotent — no duplicate payment state changes occur

**Given** a webhook processing failure
**When** it occurs
**Then** the endpoint returns a non-200 response so Stripe retries, and the failure is logged

### Story 3.3: Payment Gating Enforcement

As the platform,
I want to enforce payment state server-side,
So that no one can bypass payment by manipulating the client.

**Acceptance Criteria:**

**Given** an invitation without a confirmed deposit
**When** the owner attempts any editor-mutating call (`PUT /api/invitations/:id`, photo upload, etc.)
**Then** the server rejects the request until the deposit is confirmed

**Given** an invitation without the final payment confirmed
**When** the owner calls `POST /api/invitations/:id/publish`
**Then** the server rejects publishing (NFR9), extending Story 1.6's publish endpoint with a payment check

**Given** both payments confirmed
**When** the owner retries a previously blocked action
**Then** it now succeeds

**Given** the invitation lifecycle (draft → published → archived)
**When** any transition is attempted
**Then** it is validated and enforced server-side, not merely hidden in the UI (FR24)

### Story 3.4: Final Payment Collection

As a couple,
I want to pay the remaining 50% before my invitation goes live,
So that I complete my commitment and can publish.

**Acceptance Criteria:**

**Given** a deposit-confirmed invitation ready to publish
**When** the couple initiates final payment
**Then** a second Stripe PaymentIntent is created for the remaining 50% (FR13)

**Given** the final PaymentIntent succeeds
**When** the webhook (Story 3.2) processes it
**Then** `installment_2_paid` is set true on the `payments` row

**Given** the final payment is still pending
**When** the couple views the dashboard
**Then** it clearly shows the outstanding amount and a "Pay to publish" call to action

**Given** the final payment fails or is abandoned
**When** the couple returns to the dashboard
**Then** they can retry payment without losing their draft content

### Story 3.5: Tier Feature Gating Utility

As the platform,
I want a single source of truth for which features a tier unlocks,
So that Epics 5 and 6 don't each reimplement tier logic inconsistently.

**Acceptance Criteria:**

**Given** an invitation's tier (Kite/Balloon/Rocket)
**When** any feature-gated code path checks availability (e.g. seating chart, registry, analytics)
**Then** it calls one shared utility function/module rather than duplicating tier comparisons

**Given** the utility
**When** a Kite-tier invitation attempts a Balloon+ feature (e.g. seating chart)
**Then** the server rejects the action and the UI reflects it as locked/upsell rather than broken

**Given** the utility exists as a discrete module
**When** unit tests run (per `architecture.md` Testing Strategy)
**Then** each tier returns a consistent, assertable feature list

**Given** this utility is built in Epic 3
**When** Epic 5 and Epic 6 stories are implemented
**Then** they consume this utility rather than hardcoding their own tier checks

## Epic 4: AI Photo Studio

A couple can upload a photo, describe a mood in plain language, and receive a genuinely restyled image — WedLink's core differentiator — with sane quota, cost-logging, fallback, and moderation controls around it.

### Story 4.1: AI Style Generation Endpoint

As a couple,
I want to submit a photo and a style prompt,
So that I get back an AI-restyled version of that photo.

**Acceptance Criteria:**

**Given** an uploaded photo and a plain-language prompt
**When** the user calls `POST /api/ai/style`
**Then** the server calls Gemini 2.5 Flash Image with the image + prompt and returns the generated image URL (FR6)

**Given** the Gemini API key
**When** this endpoint runs
**Then** the key is used server-side only and is never exposed to the client (NFR4), per `docs/AI_IMAGE_EDITING.md`

**Given** an uploaded source image
**When** it's received
**Then** it's validated for size (<10MB) and MIME type before being sent to Gemini (NFR8)

**Given** a successful generation
**When** it completes
**Then** the result is persisted to storage and referenced from the `ai_generations` table

### Story 4.2: AI Photo Studio Editor UI

As a couple,
I want a simple prompt box with style presets and a before/after view,
So that I can explore AI restyling without needing prompt-engineering skill.

**Acceptance Criteria:**

**Given** the editor's AI tab
**When** it loads
**Then** it shows a prompt text box and a row of curated preset chips (e.g. "romantic film", "golden hour") that populate the prompt (FR6)

**Given** a generation in progress
**When** the user waits
**Then** a loading state is shown, not a frozen UI

**Given** a completed generation
**When** shown
**Then** a before/after compare slider lets the user visually compare the original vs. the restyled image

**Given** a result the user likes or dislikes
**When** they click "Keep" or "Retry"
**Then** keeping saves it to the invitation, and retrying re-submits (optionally with an adjusted prompt)

### Story 4.3: AI Multi-Turn Refinement

As a couple,
I want to iteratively refine an AI result ("make it warmer", "less saturated"),
So that I can converge on the exact look I want without starting over each time.

**Acceptance Criteria:**

**Given** a prior AI generation
**When** the user submits a follow-up refinement prompt
**Then** the request reuses the previous image/conversation context rather than restarting from the original upload

**Given** a chain of refinements
**When** the user retries multiple times
**Then** each iteration is logged to `ai_generations` so cost and history are traceable (NFR5)

**Given** the user wants to abandon refinements
**When** they select "start over"
**Then** the flow resets to the original source image

**Given** a refinement chain reaches the invitation's quota limit (Story 4.4)
**When** the user tries another iteration
**Then** they're blocked with a clear "quota reached" message

### Story 4.4: AI Quota & Cost Logging

As the platform,
I want to cap and log AI usage per invitation and per user,
So that AI costs stay predictable and abuse is preventable.

**Acceptance Criteria:**

**Given** every call to `POST /api/ai/style`
**When** it completes, whether success or failure
**Then** a row is written to `ai_generations` with user, invitation, prompt, source/result image URLs, and cost_usd (NFR5)

**Given** a tier's AI-edit cap, defined via Story 3.5's gating utility
**When** an invitation reaches its cap
**Then** further generation requests are rejected with a clear "limit reached" message (NFR6)

**Given** a user or session
**When** they submit generation requests
**Then** requests are rate-limited (e.g. N per minute) independent of the per-invitation tier cap (NFR6)

**Given** the cost log
**When** an admin reviews `ai_generations`
**Then** they can identify per-user and per-invitation spend for cost and abuse monitoring

### Story 4.5: AI Fallback Presets

As a couple,
I want to still get a styled result even if the AI service is down,
So that a Gemini outage never leaves me stuck.

**Acceptance Criteria:**

**Given** a Gemini API call
**When** it fails or times out
**Then** the endpoint falls back to applying a CSS-filter style preset to the photo instead of returning an error (FR7)

**Given** a fallback was used
**When** the result is shown
**Then** the UI indicates a preset was applied rather than silently presenting it as an AI result

**Given** the fallback path
**When** it's used
**Then** it is still logged to `ai_generations` (with cost_usd = 0) for consistency with Story 4.4

**Given** the AI service recovers
**When** the user retries
**Then** a normal AI generation is attempted again — the fallback is not sticky

### Story 4.6: AI Content Moderation

As the platform,
I want to screen uploaded and generated images before they can be saved or published,
So that inappropriate content never reaches a public invitation page.

**Acceptance Criteria:**

**Given** an uploaded source photo
**When** it's received by `POST /api/ai/style`
**Then** it passes a moderation check before being sent to Gemini; flagged images are rejected with a clear message

**Given** a Gemini-generated result
**When** it's returned
**Then** it also passes a moderation check before it can be kept/saved to the invitation

**Given** an image fails moderation
**When** this happens
**Then** it is not stored and the event is logged distinctly from a normal successful generation, for audit purposes

**Given** moderation passes for both upload and result
**When** this happens
**Then** the normal keep/save flow (Story 4.2) proceeds unaffected

## Epic 5: Balloon Tier Features

Balloon+ invitations gain a countdown timer, an embedded venue map, a seating chart builder, visit analytics, and an add-to-calendar button — reaching feature parity with mywedsite.gr's Balloon tier.

### Story 5.1: Countdown Timer

As a guest,
I want to see a live countdown to the wedding,
So that I feel the anticipation and know exactly how much time is left.

**Acceptance Criteria:**

**Given** a Balloon+ invitation with an event date/time already set
**When** the host enables the countdown in the editor
**Then** a live countdown timer component renders on the public page (FR19)

**Given** a Kite-tier invitation
**When** the host views the countdown option
**Then** it's shown as locked/unavailable per Story 3.5's gating utility

**Given** the countdown reaches zero
**When** a guest views the page on or after the wedding date
**Then** it gracefully shows a "today!"/past-event state instead of negative numbers

**Given** the public page at 360px width
**When** the countdown renders
**Then** it fits without causing horizontal scroll (NFR1)

### Story 5.2: Venue Map Embed

As a guest,
I want to see the ceremony and reception locations on a map,
So that I can navigate there easily.

**Acceptance Criteria:**

**Given** a Balloon+ invitation
**When** the host enters ceremony/reception addresses in the editor
**Then** an embedded map with pins for each location is shown on the public page (FR19)

**Given** a map pin
**When** a guest taps it
**Then** they get a navigation link that opens their maps app with the address

**Given** only one location is set (e.g. ceremony only)
**When** the map renders
**Then** it gracefully shows just that pin rather than erroring

**Given** a Kite-tier invitation
**When** the host views the map option
**Then** it's gated per Story 3.5

### Story 5.3: Seating Chart Builder

As a host,
I want to build a seating chart with tables and groups,
So that I can plan where guests will sit.

**Acceptance Criteria:**

**Given** a Balloon+ invitation
**When** the host opens the seating tab
**Then** they can create tables with a seat count and group name via `POST /api/invitations/:id/seating/*` (FR15), persisted to a new `seating_tables` table

**Given** existing guests
**When** the host assigns a guest to a table
**Then** the assignment is saved to the guest's `table_assignment` field and reflected in the seating UI

**Given** a table already at its seat count
**When** the host tries to over-assign it
**Then** the UI warns but does not silently drop the assignment

**Given** a Kite-tier invitation
**When** the host views the seating tab
**Then** it's gated per Story 3.5

### Story 5.4: Visit Analytics

As a host,
I want to see how many people have viewed my invitation over time,
So that I know it's reaching my guests.

**Acceptance Criteria:**

**Given** a published Balloon+ invitation
**When** a guest loads the public page
**Then** a row is recorded in `invitation_visits` (visitor_ip, user_agent, visited_at)

**Given** the dashboard
**When** the host calls `GET /api/invitations/:id/analytics`
**Then** they see view counts over time, e.g. a daily chart (FR22)

**Given** repeated views from the same visitor in a short window
**When** counting visits
**Then** reasonable de-duplication avoids wildly inflated counts (e.g. per-IP per-hour)

**Given** a Kite-tier invitation
**When** the host views the dashboard
**Then** the analytics tab is gated per Story 3.5

### Story 5.5: Add to Calendar

As a guest,
I want to add the wedding to my calendar with one tap,
So that I don't forget the date.

**Acceptance Criteria:**

**Given** a Balloon+ invitation's public page
**When** a guest taps "Add to Calendar"
**Then** they're offered Apple/Google/Outlook/Yahoo options, each producing a correctly formatted event with the right date, time, and venue

**Given** the event's date/time already captured in Story 1.3
**When** the calendar event is generated
**Then** it uses that same date/time as the source of truth

**Given** a guest on iOS Safari
**When** they tap the Apple Calendar option
**Then** a valid `.ics` download/open flow works without error

**Given** a Kite-tier invitation
**When** the public page renders
**Then** the add-to-calendar button is not shown at all — guests never see a disabled feature, per the PRD's UX goals

## Epic 6: Rocket Tier Features

Rocket-tier invitations gain seating auto-sync with a QR seat-finder, a gift registry block, hotel recommendations, background music, and a QR photo gallery — reaching feature parity with mywedsite.gr's Rocket tier.

### Story 6.1: Seating Chart Pro

As a host,
I want RSVP responses to automatically flow into unassigned seats,
So that I don't have to manually re-enter guest counts into the seating chart.

**Acceptance Criteria:**

**Given** a Rocket-tier invitation with open seats
**When** a guest's RSVP is confirmed as attending
**Then** the system attempts to auto-assign them into an unassigned-seat slot via `POST /api/invitations/:id/seating/*` (FR16)

**Given** no open seats match the party size
**When** auto-sync runs
**Then** the guest is left unassigned and flagged for manual placement rather than silently dropped

**Given** the host views the seating chart
**When** auto-assigned guests appear
**Then** they are visually distinguished from manually placed ones and can be moved

**Given** a Balloon-tier invitation
**When** it uses the seating chart
**Then** auto-sync is gated off per Story 3.5, keeping Balloon on manual-only seating (Story 5.3)

### Story 6.2: QR Seat Finder

As a guest,
I want to scan a QR code at the venue and instantly see my assigned table,
So that I don't have to search a printed chart.

**Acceptance Criteria:**

**Given** a Rocket-tier invitation with seating assignments
**When** a guest scans their QR code
**Then** `GET /api/public/invitations/:slug/seat/:guestCode` returns their assigned table with no authentication required (FR16)

**Given** a guest code that doesn't match any guest
**When** the endpoint is called
**Then** it returns a clear "not found" response, not an error page

**Given** the seat-finder page
**When** it loads on a phone at the venue
**Then** it renders in under 2s and at 360px width without horizontal scroll (NFR1, NFR11)

**Given** a guest not yet assigned to a table
**When** they scan their code
**Then** the page shows a friendly "ask the host" message instead of a blank/broken state

### Story 6.3: Gift Registry Display

As a guest,
I want to see the couple's IBAN/IRIS details with a copy button,
So that I can send a gift easily.

**Acceptance Criteria:**

**Given** a Rocket-tier invitation
**When** the host enters IBAN/IRIS bank details in the editor
**Then** the block is saved to the invitation record and shown on the public page (FR17)

**Given** the registry block on the public page
**When** a guest taps "copy"
**Then** the IBAN is copied to their clipboard with a visible confirmation

**Given** the host wants to hide the registry
**When** they toggle it off
**Then** it does not render at all on the public page

**Given** a Kite/Balloon-tier invitation
**When** the host views editor settings
**Then** the registry option is gated per Story 3.5

### Story 6.4: Hotel Recommendations

As a guest,
I want to see recommended nearby hotels,
So that I can book accommodation easily.

**Acceptance Criteria:**

**Given** a Rocket-tier invitation
**When** the host adds a hotel (name, price, map link, notes)
**Then** it's saved to a new `hotels` table linked to the invitation (FR18)

**Given** multiple hotels
**When** the host reorders or removes one
**Then** the change persists and reflects on the public page list

**Given** the public page
**When** a guest taps a hotel's map link
**Then** it opens the map location in a new tab/app

**Given** a Kite/Balloon-tier invitation
**When** the host views editor settings
**Then** hotel recommendations are gated per Story 3.5

### Story 6.5: Background Music

As a guest,
I want ambient music I can choose to play,
So that the invitation feels a little more special without autoplaying sound at me unexpectedly.

**Acceptance Criteria:**

**Given** a Rocket-tier invitation with a music track set
**When** the public page loads
**Then** no audio plays automatically — the page loads muted (FR20)

**Given** the muted state
**When** a guest taps a play control
**Then** music begins playing, guest-initiated

**Given** a guest navigates away or the page unmounts
**When** this happens
**Then** playback stops with no orphaned audio

**Given** a Kite/Balloon-tier invitation
**When** the public page renders
**Then** no music control is shown at all

### Story 6.6: QR Photo Gallery

As a guest,
I want to upload my photos from the wedding via a QR code,
So that the couple gets everyone's candid shots in one place.

**Acceptance Criteria:**

**Given** a Rocket-tier invitation's post-event QR code
**When** a guest scans it and uploads a photo/video
**Then** `POST /api/public/invitations/:slug/gallery` accepts the file, validated for size/MIME type per NFR8, with no authentication required (FR21)

**Given** the public upload endpoint
**When** many guests upload around the same time
**Then** it's rate-limited to prevent abuse without blocking legitimate concurrent uploads

**Given** uploaded guest media
**When** the host opens their dashboard gallery view
**Then** they can view and download all uploads

**Given** a Kite/Balloon-tier invitation
**When** a guest visits its public page
**Then** no QR gallery upload option is shown

## Epic 7: Polish & Launch Readiness

The product is safe, fast, and pleasant enough to hand to real couples — closing gaps in UI states, mobile behavior, accessibility, load resilience, and security, then validating everything with a controlled soft launch.

### Story 7.1: UI State Polish

As a host,
I want clear loading, empty, and error states throughout the editor and dashboard,
So that the product never feels broken or confusing.

**Acceptance Criteria:**

**Given** any editor or dashboard screen that fetches data
**When** the fetch is in flight
**Then** a loading state is shown, not a blank screen

**Given** a screen with no data yet (e.g. no guests, no AI generations)
**When** it renders
**Then** a helpful empty state with a clear next action is shown instead of an empty table

**Given** an API call fails
**When** this happens on any editor/dashboard screen
**Then** a user-facing error message is shown, not just a console-only failure

**Given** guest-facing templates
**When** any UI copy is added or edited during this polish pass
**Then** it avoids hardcoded-English-only strings so future localization is not blocked (NFR12)

### Story 7.2: Mobile QA Pass

As a guest,
I want the invitation page to work flawlessly on my phone,
So that I have a good experience regardless of device.

**Acceptance Criteria:**

**Given** the public invitation page
**When** tested on iOS Safari and Chrome Android at common viewport widths (360px–428px)
**Then** all sections render correctly with no horizontal scroll or layout breakage (NFR1)

**Given** interactive elements (RSVP form, AI compare slider, calendar buttons, music control)
**When** tapped on a real or emulated mobile device
**Then** they respond correctly to touch, with no hover-only interactions

**Given** any bugs found during this pass
**When** identified
**Then** they are fixed and re-verified on both browsers before sign-off

**Given** the page under a throttled mobile connection
**When** measured
**Then** load time stays under 2s (NFR11)

### Story 7.3: Accessibility Pass

As a user with assistive needs,
I want the editor and public page to be usable with a screen reader and keyboard,
So that the product is accessible to everyone.

**Acceptance Criteria:**

**Given** form fields in the editor and public RSVP form
**When** inspected
**Then** every input has an associated label

**Given** the color palette (Story 1.5) and typography
**When** checked against WCAG contrast guidelines
**Then** text meets at least AA contrast against its background

**Given** interactive elements
**When** navigated via keyboard only
**Then** focus states are visible and tab order is logical

**Given** any accessibility issues found during this pass
**When** identified
**Then** they are fixed and re-verified

### Story 7.4: RSVP Load Testing

As the platform,
I want the public RSVP endpoint to survive a traffic spike,
So that no guest's RSVP is lost when 150+ people respond around the same time.

**Acceptance Criteria:**

**Given** the public RSVP endpoint (`POST /api/public/invitations/:slug/rsvp`)
**When** load-tested with 150+ concurrent simulated submissions
**Then** all valid submissions are recorded with no data loss (NFR2)

**Given** the load test
**When** run
**Then** response times and error rates are captured and documented

**Given** failures surfaced by the load test (e.g. connection pool sizing, rate-limit thresholds)
**When** found
**Then** they are fixed and the test is re-run to confirm

**Given** the load test results
**When** complete
**Then** they are recorded against `architecture.md`'s Testing Strategy section for future regression comparison

### Story 7.5: Security Review

As the platform,
I want a documented security review before launch,
So that known risk areas (secrets, payments, uploads, backups) are verified, not assumed.

**Acceptance Criteria:**

**Given** `docs/INFRASTRUCTURE.md`'s checklist
**When** the review is performed
**Then** every item is checked off or has a documented exception

**Given** secrets (Stripe, Gemini, JWT, SendGrid, Cloudinary)
**When** the codebase and deployment config are reviewed
**Then** none are found in client bundles or committed files (NFR4)

**Given** the database
**When** backup configuration is reviewed
**Then** daily backups are confirmed running with a documented retention window (NFR10)

**Given** Stripe webhooks and public endpoints
**When** reviewed
**Then** signature verification (NFR7) and rate limiting are confirmed in place, not just assumed from earlier stories

### Story 7.6: Soft Launch

As the founders,
I want to launch with a small number of real couples before public marketing,
So that we catch real-world issues while the blast radius is small.

**Acceptance Criteria:**

**Given** the product has passed Stories 7.1–7.5
**When** a small cohort of real couples (e.g. 3-5) is onboarded
**Then** they can complete the full flow — signup, pay, build, publish, guests RSVP — without a blocking bug

**Given** feedback from the soft-launch cohort
**When** collected
**Then** it is triaged into must-fix-before-public-launch vs. backlog

**Given** any must-fix issues
**When** found
**Then** they are resolved and re-verified with the affected couple before proceeding to public marketing

**Given** the soft launch completes successfully
**When** the team decides to proceed
**Then** public marketing/launch can begin toward the PRD's goal of 50 paying customers in 6 months
