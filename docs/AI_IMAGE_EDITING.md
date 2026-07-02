# AI Photo Styling — "Nano Banana" (Gemini Image) Integration Spec

## What "Nano Banana" actually is
Nano Banana is not a separate product — it's <cite index="8-13,8-14,8-15">Google's nickname (and now official short name) for the Gemini 2.5 Flash Image model, which generates new images from a prompt, edits existing images using natural language, and blends multiple reference images into a single composition</cite>. <cite index="8-1">It became generally available in October 2025 through the Gemini API, AI Studio, and Vertex AI.</cite>

Newer variants exist as of mid-2026: <cite index="7-1,7-2,7-3">Nano Banana 2 (Gemini 3.1 Flash Image), a generalist model balancing speed with state-of-the-art 4K generation and reliable text rendering, excelling at multi-reference consistency</cite>, and <cite index="7-4">Nano Banana Pro (Gemini 3 Pro Image), the premium choice for the most complex visual tasks with the highest world knowledge and precision creative control</cite>. For this product, **start with the standard Gemini 2.5 Flash Image ("Nano Banana") model** — it's cheapest and sufficient for cover-photo restyling; only escalate to Pro if a couple needs 4K print output or heavy in-image text.

## Why this needs a real backend (can't run in a static prototype)
- Requires a **server-side API key** (Gemini API key or Vertex AI service account) — must never ship in client JS
- Handles file upload, storage, and moderation before sending user photos to a third-party model
- Needs rate limiting / cost control per user (each edit costs money — see Pricing below)

## Capabilities to build against
- <cite index="8-5,8-6">Generates and edits images with character consistency, ten aspect ratios, and up to 20 reference images</cite> — useful for keeping the couple recognizable across edits, and for blending a couple's photo with a decorative reference (e.g. floral frame) in one call.
- <cite index="8-20,8-21">Prompt-based editing: change specific parts of an image using natural-language instructions</cite> — e.g. "make the lighting golden-hour", "remove the trash can in the background", "add soft bokeh".
- <cite index="8-27,8-28">Conversational editing — phrases like "change the background to a sunset beach" or "give the person a winter coat" work as a one-shot edit, not a long prompt-engineering session</cite> — this is what powers multi-turn refinement ("now make it warmer").
- <cite index="8-41,8-42,8-43">An invisible SynthID watermark is always embedded in output — keep it intact through your pipeline for AI-provenance compliance</cite>; don't strip metadata on save.

## Suggested UX (matches the prototype's "AI Photo Studio" panel)
1. Couple uploads a cover/gallery photo (stored in object storage, e.g. S3/Cloudinary — see INFRASTRUCTURE.md)
2. They type a free-text mood/prompt ("warm golden-hour, romantic") or tap a curated preset chip
3. Backend calls Gemini 2.5 Flash Image with: the uploaded image + the prompt (+ up to a few reference images if using a preset style)
4. Show a before/after compare slider; "Keep" writes the result back as the invitation's photo, "Try again" re-prompts (multi-turn — reuse the same conversation/image context so edits compound instead of restarting)
5. Log every generation (user id, invitation id, prompt, cost) for cost tracking and abuse review

## API shape (Gemini API, server-side only)
```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent
Headers: x-goog-api-key: <server-side secret>
Body: {
  contents: [{
    parts: [
      { text: "<user's styling prompt>" },
      { inline_data: { mime_type: "image/jpeg", data: "<base64 photo>" } }
    ]
  }]
}
```
Response contains the generated/edited image as inline base64 data — upload that to your own storage immediately (don't keep relying on Google's response URL).

## Cost model (build a budget into pricing)
<cite index="2-2">Gemini 2.5 Flash Image is priced at $30.00 per 1 million output tokens with each image being 1290 output tokens ($0.039 per image)</cite>. <cite index="11-1">Batch/Flex processing brings that down to roughly $0.0195 per image; Priority tier costs about $0.0702 per image</cite>, before input-token costs (the uploaded photo + prompt).

**Recommendation:** cap free AI edits per invitation (e.g. 5 included in Balloon, 15 in Rocket, pay-per-edit beyond that at a small markup over the ~$0.04/image cost) so a viral invitation with heavy AI use doesn't blow the margin.

## Guardrails to implement
- Client-side + server-side file size/type limits on uploads (reject >10MB, non-image mime types)
- Content moderation pass before sending to the model (basic NSFW/face-count checks) and on the returned image
- Never expose the Gemini API key to the browser — all calls go through your backend
- Rate-limit per user/session (e.g. 10 generations/hour) to control cost and abuse
- Store the original photo untouched; store each AI edit as a new version so the couple can revert

## Fallback
If the Gemini call fails or times out, fall back to the simple CSS-filter presets already prototyped (Golden Hour / Romantic Soft / Editorial B&W / Vibrant Garden) so the editor never dead-ends.
