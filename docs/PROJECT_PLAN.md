# Project Plan — Build Phases

Read this first. It sequences FEATURES.md, AI_IMAGE_EDITING.md, and INFRASTRUCTURE.md into shippable phases. Each phase should be independently demoable.

## Phase 0 — Setup (few days)
- Init repo, CI (lint/test on PR)
- Provision: Postgres, Vercel project, Railway/Fly project, Stripe test account, Cloudinary, SendGrid, Gemini API key
- Scaffold: React+Vite frontend, Express backend, run DB migrations from INFRASTRUCTURE.md schema

## Phase 1 — Core Invitation Flow (Kite-tier feature set)
- Auth (signup/login/JWT)
- Invitation editor: couple/event info, cover photo upload (real storage, not mock), color/font pickers, invitation text
- Publish flow → public invitation page at a slug URL
- RSVP form (attending, adult/child count, dietary notes) writing to `rsvp_responses`
- Dashboard: list invitations, view guest/RSVP table, CSV export
- **Demo milestone:** a couple can sign up, build a real invitation, publish it, and a guest can RSVP for real.

## Phase 2 — Payments
- Stripe Checkout integration, 50/50 deposit flow (INFRASTRUCTURE.md)
- Gate publish behind "at least deposit paid"
- Email receipts (SendGrid)
- **Demo milestone:** end-to-end paid signup → invitation → publish, in Stripe test mode.

## Phase 3 — AI Photo Studio
- Backend endpoint that calls Gemini 2.5 Flash Image (AI_IMAGE_EDITING.md) with an uploaded photo + prompt
- Editor UI: prompt box + preset chips + before/after compare + "keep/retry"
- Per-invitation AI-edit quota by tier, cost logging in `ai_generations`
- Fallback to CSS filter presets if the API call fails
- **Demo milestone:** upload a real photo, type a mood, get back a genuinely restyled image.

## Phase 4 — Balloon/Rocket Feature Set
- Countdown timer, venue map embed, visit analytics
- Seating chart builder + RSVP auto-sync (Rocket: + QR seat-finder)
- Gift registry/IBAN display, hotel list, background music toggle
- Guest photo gallery (QR upload)
- **Demo milestone:** full tier parity with FEATURES.md checklist.

## Phase 5 — Polish & Launch
- Empty/loading/error states across all screens
- Mobile QA pass (this is a guest-facing product — most guests will open the link on a phone)
- Accessibility pass (form labels, color contrast, focus states)
- Load test the public RSVP endpoint (this is the one endpoint that gets a traffic spike when an invitation goes out)
- Security review against the INFRASTRUCTURE.md checklist
- Soft launch to a handful of real couples before public marketing

## What to explicitly punt on for v1
- Multi-language invitations
- Live chat/guestbook
- Guest voting/quiz features
- Second invitation version (different info subset)

These are real features from FEATURES.md but add complexity without being core to proving the product — revisit after Phase 5 ships and you have real user feedback.
