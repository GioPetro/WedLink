# Story 1.4: Photo Upload (Cover + Gallery)

## Status
Ready for Development

## Story
**As a** couple,
**I want** to upload a cover photo and gallery photos,
**so that** our invitation shows real pictures of us, not placeholders.

## Acceptance Criteria
1. `POST /api/invitations/:id/photos` accepts an image upload, validates size (<10MB) and MIME type (NFR8), and stores it via Cloudinary (or S3 — pick one per `architecture.md`)
2. The invitation record tracks a cover photo URL and an ordered list of gallery photo URLs
3. Gallery photo count is capped by tier: Kite 5, Balloon 10, Rocket unlimited (FR4) — enforced server-side, not just in the UI
4. Users can delete a gallery photo and reorder the gallery
5. Editor UI shows upload progress and a clear error if an upload is rejected (wrong type, too large, or over the tier cap)
6. Uploaded photos render correctly in both the editor's live preview and (once published) the public page

## Tasks
- [ ] Set up Cloudinary (or S3) credentials and a small upload helper module
- [ ] Implement the upload endpoint with validation + tier-cap enforcement
- [ ] Add delete/reorder endpoints for gallery photos
- [ ] Wire Editor.jsx's photo UI to real upload/delete/reorder instead of the `image-slot` design-tool placeholder
- [ ] Surface upload errors clearly in the UI

## Dev Notes
The original HTML prototype used a design-tool-specific `<image-slot>` component for placeholder purposes only — that component does not exist outside the design tool. Build a normal file-input + drag-and-drop uploader here.

## Testing
Unit test: upload rejects oversized/wrong-type files; upload rejects a request over the tier's photo cap.
