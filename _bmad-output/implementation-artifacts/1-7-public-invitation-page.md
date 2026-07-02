# Story 1.7: Public Invitation Page

## Status
Ready for Development

## Story
**As a** guest,
**I want** to open the shared invitation link and see the couple's details on my phone,
**so that** I know when/where the wedding is.

## Acceptance Criteria
1. `PublicInvitation.jsx` (already scaffolded) fetches from `GET /api/public/invitations/:slug` and renders real data, not mock data
2. Page is usable at 360px width with no horizontal scroll (NFR1)
3. Cover photo, couple names, date, venue, and message render correctly with the invitation's chosen accent color and font
4. An invalid/unpublished slug shows a clear "not found" state, not a crash or blank page
5. Page load completes in under 2s on a throttled mobile connection (NFR11) — verify with browser devtools network throttling, not a guess
6. If an optional access code is set on the invitation (FR23), the page prompts for it before revealing content

## Tasks
- [ ] Wire `PublicInvitation.jsx` to the real public endpoint
- [ ] Add a not-found state for invalid/unpublished slugs
- [ ] Verify mobile layout at 360px in devtools
- [ ] Add the access-code gate (simple: check code client-submitted against server, server returns content only on match — don't ship the content and hide it client-side, that leaks data)
- [ ] Performance check with network throttling

## Dev Notes
This story only renders what Epic 1 stories 1.3–1.5 produce (core fields, photos, colors/fonts). RSVP form (Epic 2) and Extras (Epic 5/6) render on this same page but are separate stories — don't scope-creep them in here.

## Testing
Manual: load the page on an actual phone or emulated 360px viewport; try an invalid slug; try an access-code-protected invitation with wrong and right codes.
