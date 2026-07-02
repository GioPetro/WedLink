# Story 1.5: Color & Font Picker

## Status
Ready for Development

## Story
**As a** couple,
**I want** to pick an accent color and font from a curated list,
**so that** our invitation matches our wedding's style without needing design skills.

## Acceptance Criteria
1. Editor exposes a fixed palette of accent color swatches (reuse the palette from the design reference: `#a9673f #c9704d #6b5344 #9b7d6b #7a8b6f #8b6f9b`) — no free-form color picker (per design guidance in `prd.md` UI Design Goals)
2. Editor exposes a fixed list of curated font pairings (start with Playfair Display, Inter, Georgia — expand later if desired)
3. Selecting a color/font updates `PUT /api/invitations/:id` (reuses Story 1.3's autosave endpoint) and reflects immediately in the live preview
4. The selected color/font are the ones rendered on the public invitation page (Story 1.7)
5. Active selection is visually indicated in the picker (clear selected-state styling)

## Tasks
- [ ] Add accent_color/font_family to the editor's autosave payload (reuses Story 1.3 plumbing — no new endpoint needed)
- [ ] Build the color swatch picker UI with a clear active state
- [ ] Build the font picker UI with a clear active state
- [ ] Confirm color/font propagate to the public page renderer

## Dev Notes
This is a small story deliberately kept separate from 1.3 because it has real design-system implications (curated tokens) worth its own review — don't let it silently expand scope into a general theming system.

## Testing
Manual: select each color/font option, confirm live preview and public page both reflect the choice after publish.
