# Project Brief: WedLink

## Executive Summary
WedLink is a digital wedding (and christening/birthday) invitation platform: couples buy a tiered package, customize a hosted invitation page (photos, RSVP, seating, extras), publish a shareable link/QR, and manage guest responses from a dashboard. The core differentiator is an **AI Photo Studio** powered by Google's Gemini 2.5 Flash Image ("Nano Banana") model, which restyles a couple's uploaded photos from a plain-language prompt — a capability no direct competitor currently offers.

## Problem Statement
Couples need to communicate event logistics (date, venue, RSVP, dietary needs, seating, gifts, accommodation) to often 100+ guests. Paper invitations are expensive and static. Existing alternatives split into two unsatisfying camps:

1. **Free, DIY, US-centric website builders** (Zola, The Knot, WithJoy, Minted) — assume USD registries, English-only copy, self-service design. Poor fit outside the US, and for couples who want a "just build it for me" service rather than a drag-and-drop builder.
2. **Local full-service providers** (mywedsite.gr and similar Greek services) — done-for-you and locally relevant (Greek RSVP norms, IBAN/IRIS gift accounts, local venue map conventions), but visually template-bound: customization tops out at picking from ~27 preset colors and 17 fonts. No competitor lets a couple actually transform their own photography.

## Proposed Solution
A tiered, full-service digital invitation platform matching or exceeding the local incumbents (mywedsite.gr) on feature completeness (RSVP, seating, galleries, registry/IBAN, hotels, guest quiz, photo gallery) while adding a genuinely novel capability: **AI-assisted photo restyling** — a couple's own photo transformed to match their wedding's mood via a text prompt, instead of being limited to swapping a color swatch.

## Target Users
- **Primary:** Engaged couples (25–40) in Greece planning a wedding, willing to pay €150–400 for a done-for-you digital invitation, who want their invitation to feel personal rather than templated.
- **Secondary:** Couples planning a christening (βάπτιση) or milestone birthday — same platform, adapted copy/content sections.

## Goals & Success Metrics
- Ship an MVP (Kite-tier equivalent) usable for a real wedding within the first build phase
- Reach feature parity with mywedsite.gr's Balloon tier by v1.0
- 50 paying customers in the first 6 months post-launch
- AI Photo Studio used in ≥40% of published invitations (validates the differentiator)
- <5% support-ticket rate per published invitation

## MVP Scope
### Must Have (v1)
- Tiered pricing (Kite / Balloon / Rocket) with Stripe deposit checkout (50% now / 50% on delivery)
- Invitation editor: couple/event info, cover + gallery photos, color/font picker, custom message
- AI Photo Studio (Gemini 2.5 Flash Image) with CSS-preset fallback if the API call fails
- RSVP form (host-configurable fields) + guest dashboard + CSV export/import
- Public invitation page (mobile-first), unique slug URL, QR code
- Countdown timer, venue map embed

### Should Have (v1.x)
- Seating chart (+ Pro: auto-sync from RSVP responses, guest QR seat-finder)
- Gift registry / IBAN-IRIS display with copy-to-clipboard
- Hotel recommendations list
- Guest photo gallery (QR upload, post-event)
- Background music toggle (opt-in, starts muted)

### Explicitly Out of Scope (v1)
- Multi-language invitations
- Live chat / guestbook wall
- Guest quiz / voting features
- Native mobile app
- Print invitation design & fulfillment

## Key Risks
- **Cost risk:** Gemini API usage must be capped per tier or a viral invitation erodes margin (~$0.03–0.07/image edit)
- **Competitive risk:** Local incumbents (mywedsite.gr, i-do.gr, invitation.gr, easywedding.gr, myweb.events) have years of SEO and word-of-mouth in the Greek market
- **Compliance risk:** Deposit payments + Greek VAT handling needs local accounting/legal review — not a dev-team decision, flag to the founder before launch

## Next Steps
1. Read `competitive-analysis.md` for the full competitor breakdown
2. Read `prd.md` for requirements and the epic/story breakdown
3. Read `architecture.md` for the technical design
4. Start implementation at `stories/1.1.story.md` (Epic 1, Story 1)
