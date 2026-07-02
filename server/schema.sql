CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  full_name VARCHAR,
  phone VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  tier VARCHAR CHECK (tier IN ('kite', 'balloon', 'rocket')),
  couple_name_1 VARCHAR,
  couple_name_2 VARCHAR,
  event_date DATE,
  event_time TIME,
  venue TEXT,
  accent_color VARCHAR DEFAULT '#d4a373',
  font_family VARCHAR DEFAULT 'Playfair Display',
  status VARCHAR DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  invitation_url VARCHAR UNIQUE,
  access_code VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP
);

CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID REFERENCES invitations(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  email VARCHAR,
  phone VARCHAR,
  group_name VARCHAR,
  status VARCHAR DEFAULT 'invited' CHECK (status IN ('invited', 'accepted', 'declined', 'no_response')),
  num_adults INT DEFAULT 1,
  num_children INT DEFAULT 0,
  dietary_restrictions VARCHAR,
  notes TEXT,
  rsvp_date TIMESTAMP,
  table_assignment VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE rsvp_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
  invitation_id UUID REFERENCES invitations(id) ON DELETE CASCADE,
  attendance VARCHAR CHECK (attendance IN ('attending', 'not_attending')),
  num_adults INT,
  num_children INT,
  dietary_restrictions VARCHAR,
  message TEXT,
  responded_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  invitation_id UUID REFERENCES invitations(id),
  amount DECIMAL(10, 2),
  currency VARCHAR DEFAULT 'EUR',
  status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  stripe_payment_intent_id VARCHAR,
  installment_1_amount DECIMAL(10, 2),
  installment_2_amount DECIMAL(10, 2),
  installment_1_paid BOOLEAN DEFAULT FALSE,
  installment_2_paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE invitation_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID REFERENCES invitations(id) ON DELETE CASCADE,
  visitor_ip VARCHAR,
  user_agent TEXT,
  visited_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_invitations_user_id ON invitations(user_id);
CREATE INDEX idx_guests_invitation_id ON guests(invitation_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
