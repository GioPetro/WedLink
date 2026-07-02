# Story 1.2: Auth (Signup/Login)

## Status
Ready for Development

## Story
**As a** couple,
**I want** to sign up and log in,
**so that** my invitation data is private to my account.

## Acceptance Criteria
1. `POST /api/auth/signup` creates a `users` row with a bcrypt-hashed password; rejects duplicate emails with a clear error
2. `POST /api/auth/login` verifies credentials and returns a signed JWT
3. JWT is required (via middleware) on all `/api/invitations*` and other authenticated routes; requests without a valid token return 401
4. Frontend `authStore` (already scaffolded in `src/stores/authStore.js`) persists the token and attaches it to authenticated requests; wire it to the real endpoints above (replace any mocked behavior)
5. `Auth.jsx` page (already scaffolded) successfully signs up and logs in against the real backend, then redirects to the dashboard
6. Passwords are never logged or returned in any API response
7. Account settings page shows the logged-in user's email and offers logout (already scaffolded in `Dashboard.jsx` settings tab — verify against real auth state)

## Tasks
- [ ] Implement `POST /api/auth/signup` and `POST /api/auth/login` in `server/index.js` (or split into `server/routes/auth.js` if `index.js` is getting large)
- [ ] Add JWT verification middleware, apply to protected routes
- [ ] Wire `src/stores/authStore.js` to real endpoints (remove any mock/local-only auth)
- [ ] Verify `Auth.jsx` end-to-end against the real backend
- [ ] Add basic input validation (email format, password minimum length) server-side

## Dev Notes
JWT secret comes from `.env` (`JWT_SECRET`) — never hardcode. Reasonable default expiry: 7 days, refresh-on-use is acceptable for v1 (no need for a full refresh-token rotation system yet).

## Testing
Unit test: signup rejects duplicate email, login rejects wrong password, protected route rejects missing/invalid token.
