# Story 1.3: Core Invitation Fields with Autosave

## Status
Ready for Development

## Story
**As a** couple,
**I want** to enter our names, date, venue, and invitation message and have it save automatically,
**so that** I never lose work and never have to find a "Save" button.

## Acceptance Criteria
1. `POST /api/invitations` creates a new invitation row owned by the logged-in user, with a default `status: 'draft'`
2. `PUT /api/invitations/:id` updates couple_name_1/2, event_date, event_time, venue, and message fields; rejects requests from non-owners with 403
3. `GET /api/invitations` lists the logged-in user's invitations (for the dashboard)
4. `GET /api/invitations/:id` returns one invitation's full detail (for the editor)
5. Editor UI (`src/pages/Editor.jsx`, already scaffolded) debounces field changes (~500ms) and calls the real update endpoint instead of only local state
6. A visible (subtle) "Saved" indicator confirms each autosave — no explicit save button required
7. Reloading the editor page shows the most recently saved values (not stale mock data)

## Tasks
- [ ] Implement invitation CRUD endpoints in `server/index.js`/`server/routes/invitations.js`
- [ ] Add ownership check (invitation.user_id === req.user.id) to every mutating endpoint
- [ ] Wire `src/stores/invitationStore.js` to real endpoints with debounced autosave
- [ ] Add the "Saved"/"Saving…" indicator to `Editor.jsx`
- [ ] Manual test: edit a field, reload the page, confirm persistence

## Dev Notes
Keep the debounce logic in the store, not scattered across component handlers, so Story 1.4/1.5 (photos, colors/fonts) can reuse the same autosave pattern.

## Testing
Unit test: PUT rejects a non-owner; PUT with valid owner+data updates the row and GET reflects it.
