# Story 1.1: Project Scaffolding

## Status
Ready for Development

## Story
**As a** developer,
**I want** the repo initialized with CI, environment config, and a working local dev loop,
**so that** every subsequent story can be built and verified without re-solving setup.

## Acceptance Criteria
1. Repo has `package.json` with working `dev`, `build`, `server:dev`, `db:migrate` scripts (already present — verify they run)
2. `.env.example` documents every required variable (DATABASE_URL, JWT_SECRET, STRIPE_SECRET_KEY, GEMINI_API_KEY, SENDGRID_API_KEY, CLOUDINARY_URL) — already present, verify completeness against later epics
3. `npm install && npm run dev` serves the frontend locally without errors
4. `npm run server:dev` starts the Express server locally without errors
5. `npm run db:migrate` successfully creates all tables from `server/schema.sql` against a local/dev Postgres instance
6. CI (`.github/workflows/deploy.yml`) runs lint + test on every PR before any deploy step (add a lint/test job if missing — currently the workflow only deploys)
7. README's Setup section accurately reflects the real steps needed (update if any step above required a fix)

## Tasks
- [ ] Verify/fix `npm install`, `npm run dev`, `npm run server:dev` against the scaffolded code in `src/` and `server/`
- [ ] Provision a local or dev Postgres instance (docker-compose.yml is already scaffolded — verify it works)
- [ ] Run `npm run db:migrate`, confirm all tables from `server/schema.sql` exist
- [ ] Add a `lint`/`test` CI job ahead of the existing deploy jobs in `.github/workflows/deploy.yml`
- [ ] Fix `.env.example` if any variable is missing once later stories reveal a need

## Dev Notes
This scaffold already exists in the repo from initial design-phase work — treat this story as **verification + fix-up**, not greenfield setup. Do not re-architect what's already there unless it's actually broken.

## Testing
Manual: run every script above locally and confirm no errors.
