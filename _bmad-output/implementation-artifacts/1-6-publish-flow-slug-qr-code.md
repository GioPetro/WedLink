# Story 1.6: Publish Flow (Slug + QR Code)

## Status
Ready for Development

## Story
**As a** couple,
**I want** to publish my invitation to a unique link with a QR code,
**so that** I can share it with guests.

## Acceptance Criteria
1. `POST /api/invitations/:id/publish` generates a unique, human-readable slug (e.g. `nikos-elena-2026`, with a numeric suffix on collision) and sets `status: 'published'`, `published_at: now()`
2. Publishing is blocked (403 with a clear error) if the invitation has no couple names, date, or venue set yet
3. A QR code image encoding the public URL is generated and available in the dashboard (generate on-demand or cache — implementer's choice; don't over-engineer)
4. Dashboard shows the invitation's status (draft/published/archived) and, once published, the shareable link + QR code
5. `GET /api/public/invitations/:slug` returns the invitation's public-safe fields (no internal IDs, no owner email) for an unauthenticated guest
6. Attempting to publish twice (already published) is a no-op that returns the existing slug, not an error and not a duplicate

## Tasks
- [ ] Implement slug generation (slugify couple names + collision suffix)
- [ ] Implement `POST /api/invitations/:id/publish` with the validation in AC2
- [ ] Implement `GET /api/public/invitations/:slug` returning only public-safe fields
- [ ] Add QR code generation (a small server-side library is fine; don't add a paid service for this)
- [ ] Update Dashboard UI to show link/QR once published

## Dev Notes
This story deliberately does NOT include payment gating — that's Story 3.3, which adds the "deposit paid" check on top of this endpoint once Epic 3 exists. Build this story assuming payment gating will wrap it later; don't hardcode "always allowed."

## Testing
Unit test: publish fails validation with missing required fields; publish succeeds and produces a resolvable public slug; double-publish is idempotent.
