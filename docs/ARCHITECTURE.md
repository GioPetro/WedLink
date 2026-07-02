# WedLink Platform Architecture & Deployment Guide

## Executive Summary

**WedLink** is a full-stack SaaS platform for digital wedding & baptism invitations. This MVP includes the core user journey: landing → checkout → invitation editor → admin dashboard → public invitation page → RSVP tracking.

**Timeline:** 3–6 months to launch (small team)  
**Estimated Cost:** €15k–30k (outsourced development)  
**Revenue Model:** Freemium or paid-only (3 tiers: €150–370)

---

## Tech Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Styling:** Tailwind CSS (move from inline styles)
- **State:** Zustand or Redux Toolkit
- **Build:** Vite
- **Hosting:** Vercel (auto-deploy from GitHub)

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js or Fastify
- **Database:** PostgreSQL (Supabase or self-hosted)
- **Auth:** JWT + bcrypt, or Supabase Auth
- **File Storage:** AWS S3 or Cloudinary (for invitation templates & guest photos)
- **Email:** SendGrid or Mailgun (RSVP confirmations, reminders)
- **Payments:** Stripe API (production) or test mode for MVP
- **Hosting:** Railway, Fly.io, or Heroku

### DevOps
- **Version Control:** GitHub
- **CI/CD:** GitHub Actions (auto-deploy on push)
- **Monitoring:** Sentry (error tracking), LogRocket (user analytics)
- **Database Backups:** Daily automated backups

---

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Frontend (Vercel)                  │
│  Landing → Auth → Editor → Dashboard → Public Page  │
└──────────────────┬──────────────────────────────────┘
                   │ REST API / WebSocket
┌──────────────────▼──────────────────────────────────┐
│              Backend (Railway/Fly.io)               │
│  ┌─────────────┐  ┌─────────────┐  ┌────────────┐  │
│  │  Auth API   │  │  Invitations│  │  RSVPs     │  │
│  └─────────────┘  └─────────────┘  └────────────┘  │
│  ┌─────────────┐  ┌─────────────┐  ┌────────────┐  │
│  │  Payments   │  │  Guests     │  │  Analytics │  │
│  └─────────────┘  └─────────────┘  └────────────┘  │
└──────────────────┬──────────────────────────────────┘
                   │
        ┌──────────┼──────────┐
        │          │          │
   PostgreSQL   S3/Images   SendGrid
  (Supabase)   (Cloudinary) (Email)
```

---

## Database Schema (MVP)

### Core Tables

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  full_name VARCHAR,
  phone VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Invitations (per user)
CREATE TABLE invitations (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  tier VARCHAR (kite, balloon, rocket),
  template_design VARCHAR,
  couple_name_1 VARCHAR,
  couple_name_2 VARCHAR,
  event_date DATE,
  event_time TIME,
  venue TEXT,
  accent_color VARCHAR,
  font_family VARCHAR,
  status VARCHAR (draft, published, archived),
  invitation_url VARCHAR UNIQUE,
  access_code VARCHAR (optional),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  published_at TIMESTAMP
);

-- Guests (per invitation)
CREATE TABLE guests (
  id UUID PRIMARY KEY,
  invitation_id UUID REFERENCES invitations(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  email VARCHAR,
  phone VARCHAR,
  group_name VARCHAR,
  status VARCHAR (invited, accepted, declined, no_response),
  num_adults INT DEFAULT 1,
  num_children INT DEFAULT 0,
  dietary_restrictions VARCHAR,
  notes TEXT,
  rsvp_date TIMESTAMP,
  table_assignment VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);

-- RSVP Responses
CREATE TABLE rsvp_responses (
  id UUID PRIMARY KEY,
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
  invitation_id UUID REFERENCES invitations(id) ON DELETE CASCADE,
  attendance VARCHAR (attending, not_attending),
  num_adults INT,
  num_children INT,
  dietary_restrictions VARCHAR,
  message TEXT,
  responded_at TIMESTAMP DEFAULT NOW()
);

-- Payments
CREATE TABLE payments (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  invitation_id UUID REFERENCES invitations(id),
  amount DECIMAL(10, 2),
  currency VARCHAR (EUR, USD),
  status VARCHAR (pending, completed, failed, refunded),
  stripe_payment_intent_id VARCHAR,
  installment_1_amount DECIMAL(10, 2),
  installment_2_amount DECIMAL(10, 2),
  installment_1_paid BOOLEAN DEFAULT FALSE,
  installment_2_paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Analytics
CREATE TABLE invitation_visits (
  id UUID PRIMARY KEY,
  invitation_id UUID REFERENCES invitations(id) ON DELETE CASCADE,
  visitor_ip VARCHAR,
  user_agent TEXT,
  visited_at TIMESTAMP DEFAULT NOW()
);
```

---

## API Endpoints (MVP)

### Auth
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh token

### Invitations
- `POST /api/invitations` - Create invitation
- `GET /api/invitations/:id` - Get invitation details
- `PUT /api/invitations/:id` - Update invitation
- `GET /api/invitations` - List user's invitations
- `DELETE /api/invitations/:id` - Delete invitation
- `GET /api/invitations/:id/preview` - Preview public page

### Guests
- `POST /api/invitations/:id/guests` - Add guest
- `PUT /api/guests/:id` - Update guest
- `DELETE /api/guests/:id` - Remove guest
- `GET /api/invitations/:id/guests` - List guests
- `POST /api/invitations/:id/guests/import` - Bulk import (CSV)

### RSVP (Public)
- `GET /api/public/invitations/:url` - Get public invitation
- `POST /api/public/invitations/:url/rsvp` - Submit RSVP

### Dashboard
- `GET /api/invitations/:id/analytics` - Visit stats
- `GET /api/invitations/:id/rsvp-summary` - RSVP count by status
- `GET /api/invitations/:id/seating` - Seating chart data

### Payments
- `POST /api/payments/checkout` - Create checkout session
- `POST /api/payments/webhook` - Stripe webhook handler

---

## Feature Rollout (Phased)

### Phase 1: MVP (Launch, Weeks 1–12)
- ✅ Landing page & pricing
- ✅ User auth (signup/login)
- ✅ Invitation editor (Kite template only)
- ✅ Admin dashboard (guest list, RSVP tracking)
- ✅ Public invitation page
- ✅ RSVP form with email notifications
- ✅ Stripe payment (deposit model)
- ✅ Basic analytics (visit count, RSVP stats)

### Phase 2: Core Features (Weeks 13–20)
- Balloon & Rocket templates
- Seating chart (manual & auto-assign)
- Gift registry integration
- Photo gallery with QR codes
- Guest quiz feature
- SMS reminders (SendGrid)

### Phase 3: Advanced Features (Weeks 21–26)
- Multiple languages
- Custom color/font packs
- Pre-wedding video uploads
- Instagram hashtag feed
- Wish wall feature
- Export invitations as PDF

### Phase 4: Monetization & Scale (Week 27+)
- Add-on marketplace (€15–50 each)
- White-label option for agencies
- API for partners
- Mobile app (React Native)

---

## Deployment Checklist

### Pre-Launch
- [ ] Database migrations tested on staging
- [ ] Environment variables (.env.local) secured
- [ ] Stripe keys (test + production) configured
- [ ] SendGrid email templates set up
- [ ] S3/Cloudinary buckets created
- [ ] GitHub Actions CI/CD pipeline working
- [ ] Sentry/LogRocket accounts activated
- [ ] SSL certificates installed
- [ ] GDPR/privacy policy reviewed by lawyer

### Launch Day
- [ ] Domain DNS pointed to Vercel (frontend)
- [ ] Backend deployed to production
- [ ] Database backups enabled
- [ ] Monitoring alerts configured
- [ ] CDN cache cleared
- [ ] Smoke tests run (sample payment, RSVP, etc.)

### Post-Launch
- [ ] Monitor error logs & performance
- [ ] Respond to user feedback
- [ ] Track conversion rates & churn
- [ ] Schedule weekly team sync-ups

---

## Security Considerations

1. **Authentication:** JWT tokens (short-lived, refresh tokens stored in httpOnly cookies)
2. **Authorization:** Row-level security (users can only access their invitations)
3. **Data Encryption:** All passwords hashed with bcrypt; sensitive data at-rest encrypted
4. **Payment Security:** PCI DSS compliance via Stripe (never store card numbers)
5. **Rate Limiting:** 100 requests/min per IP to prevent abuse
6. **CORS:** Whitelist specific domains
7. **HTTPS:** Required for all endpoints
8. **Input Validation:** Sanitize all user inputs on backend

---

## Scalability & Performance

- **CDN:** Vercel edge caching for static assets
- **Database:** Connection pooling with PgBouncer; index on `user_id`, `invitation_id`
- **Backend:** Horizontal scaling via container orchestration (Kubernetes or Docker Swarm)
- **Analytics:** Offload to async queues (Bull/BullMQ)
- **Images:** Compress & resize via Cloudinary transformations
- **Load Testing:** Use Artillery or k6 to test 1000 concurrent users

---

## Cost Estimate (Monthly)

| Service | Tier | Cost |
|---------|------|------|
| Vercel (Frontend) | Pro | €20 |
| Railway/Fly.io (Backend) | Starter | €40 |
| Supabase (PostgreSQL) | Pro | €25 |
| Stripe | % per transaction | Varies (2.9% + €0.30) |
| SendGrid | 100k emails/month | €20 |
| Cloudinary | 15GB storage | €15 |
| Domain & SSL | Annual | €15/year |
| **Total Monthly** | | **~€120** |
| **+ Variable Costs** | (Stripe, outbound data) | **~€50–200** |

---

## Success Metrics (KPIs)

- **Signups:** 10+ per week by month 3
- **Conversion:** 5–10% of free signups → paid
- **Churn:** <5% monthly (target: <2%)
- **RSVP Response Rate:** 60%+ for customer invitations
- **NPS Score:** >40 (target: >50)
- **Page Load Time:** <2s (core web vitals)

---

## Next Steps

1. **Week 1:** Set up GitHub, Vercel, Railway, Supabase projects
2. **Week 2–4:** Refactor frontend to React + Tailwind (move from DC)
3. **Week 4–8:** Build backend API (auth, invitations, RSVP)
4. **Week 8–10:** Integrate Stripe payments
5. **Week 10–12:** QA, bug fixes, launch prep
6. **Week 12+:** Monitor, iterate, roll out Phase 2

---

## Contact & Support

**Maintainers:** [Your Team]  
**Email:** support@wedlink.com  
**Docs:** https://docs.wedlink.com  
**Status:** https://status.wedlink.com
