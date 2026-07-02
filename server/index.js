import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

dotenv.config();

const app = express();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const uploadsDir = path.join(process.cwd(), 'server', 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

// NFR8: validate size (<10MB) and MIME type before storage
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => cb(null, `${crypto.randomUUID()}${path.extname(file.originalname)}`),
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    cb(allowed.includes(file.mimetype) ? null : new Error('Unsupported image type'), allowed.includes(file.mimetype));
  },
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// Middleware: Auth verification
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// ============ AUTH ROUTES ============

app.post('/api/auth/signup', async (req, res) => {
  const { email, password, fullName } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, full_name) VALUES ($1, $2, $3) RETURNING id, email',
      [email, hashedPassword, fullName || '']
    );
    const token = jwt.sign({ id: result.rows[0].id, email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Email already exists' });
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    
    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, fullName: user.full_name } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ INVITATIONS ROUTES ============

app.post('/api/invitations', verifyToken, async (req, res) => {
  const { title, tier, coupleName1, coupleName2, eventDate, eventTime, venue } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO invitations (user_id, title, tier, couple_name_1, couple_name_2, event_date, event_time, venue, status, accent_color, font_family)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [req.user.id, title, tier, coupleName1, coupleName2, eventDate, eventTime, venue, 'draft', '#d4a373', 'Playfair Display']
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/invitations', verifyToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM invitations WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/invitations/:id', verifyToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM invitations WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/invitations/:id', verifyToken, async (req, res) => {
  const { coupleName1, coupleName2, eventDate, eventTime, venue, accentColor, fontFamily, status } = req.body;
  try {
    const result = await pool.query(
      `UPDATE invitations SET couple_name_1 = COALESCE($1, couple_name_1), couple_name_2 = COALESCE($2, couple_name_2),
       event_date = COALESCE($3, event_date), event_time = COALESCE($4, event_time), venue = COALESCE($5, venue),
       accent_color = COALESCE($6, accent_color), font_family = COALESCE($7, font_family), status = COALESCE($8, status),
       updated_at = NOW() WHERE id = $9 AND user_id = $10 RETURNING *`,
      [coupleName1, coupleName2, eventDate, eventTime, venue, accentColor, fontFamily, status, req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // strip accents (Greek/Latin diacritics)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'invitation';
}

// Story 1.6: Publish flow — generates a unique slug URL, no payment gate yet (Epic 3 adds that per NFR9)
app.post('/api/invitations/:id/publish', verifyToken, async (req, res) => {
  try {
    const invResult = await pool.query('SELECT * FROM invitations WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    if (invResult.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    const invitation = invResult.rows[0];

    let invitationUrl = invitation.invitation_url;
    if (!invitationUrl) {
      const base = slugify(`${invitation.couple_name_1 || ''}-${invitation.couple_name_2 || ''}`);
      for (let attempt = 0; attempt < 5; attempt++) {
        const candidate = `${base}-${crypto.randomBytes(3).toString('hex')}`;
        const exists = await pool.query('SELECT 1 FROM invitations WHERE invitation_url = $1', [candidate]);
        if (exists.rows.length === 0) {
          invitationUrl = candidate;
          break;
        }
      }
      if (!invitationUrl) return res.status(500).json({ error: 'Could not generate a unique invitation URL, try again' });
    }

    const result = await pool.query(
      `UPDATE invitations SET invitation_url = $1, status = 'published', published_at = NOW(), updated_at = NOW()
       WHERE id = $2 AND user_id = $3 RETURNING *`,
      [invitationUrl, req.params.id, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Story 1.4: Cover + gallery photo upload (local disk in dev; swap for Cloudinary in production, see docs/INFRASTRUCTURE.md)
app.post('/api/invitations/:id/photos', verifyToken, (req, res) => {
  upload.single('photo')(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const type = req.body.type === 'gallery' ? 'gallery' : 'cover';
    const photoUrl = `/uploads/${req.file.filename}`;

    try {
      const invResult = await pool.query('SELECT user_id, gallery_photos FROM invitations WHERE id = $1', [req.params.id]);
      if (invResult.rows.length === 0 || invResult.rows[0].user_id !== req.user.id) {
        fs.unlink(req.file.path, () => {});
        return res.status(404).json({ error: 'Not found' });
      }

      let result;
      if (type === 'gallery') {
        result = await pool.query(
          `UPDATE invitations SET gallery_photos = array_append(gallery_photos, $1), updated_at = NOW() WHERE id = $2 RETURNING *`,
          [photoUrl, req.params.id]
        );
      } else {
        result = await pool.query(
          `UPDATE invitations SET cover_photo_url = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
          [photoUrl, req.params.id]
        );
      }
      res.json(result.rows[0]);
    } catch (dbErr) {
      fs.unlink(req.file.path, () => {});
      res.status(500).json({ error: dbErr.message });
    }
  });
});

// ============ GUESTS ROUTES ============

app.post('/api/invitations/:id/guests', verifyToken, async (req, res) => {
  const { name, email, phone, groupName, numAdults, numChildren } = req.body;
  try {
    const invResult = await pool.query('SELECT user_id FROM invitations WHERE id = $1', [req.params.id]);
    if (invResult.rows.length === 0 || invResult.rows[0].user_id !== req.user.id) {
      return res.status(404).json({ error: 'Not found' });
    }
    
    const result = await pool.query(
      `INSERT INTO guests (invitation_id, name, email, phone, group_name, num_adults, num_children, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [req.params.id, name, email, phone, groupName || null, numAdults || 1, numChildren || 0, 'invited']
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/invitations/:id/guests', verifyToken, async (req, res) => {
  try {
    const invResult = await pool.query('SELECT user_id FROM invitations WHERE id = $1', [req.params.id]);
    if (invResult.rows.length === 0 || invResult.rows[0].user_id !== req.user.id) {
      return res.status(404).json({ error: 'Not found' });
    }
    
    const result = await pool.query('SELECT * FROM guests WHERE invitation_id = $1 ORDER BY created_at DESC', [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ RSVP ROUTES (PUBLIC) ============

app.get('/api/public/invitations/:url', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, couple_name_1, couple_name_2, event_date, event_time, venue, accent_color, cover_photo_url, gallery_photos FROM invitations WHERE invitation_url = $1 AND status = $2', [req.params.url, 'published']);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/public/invitations/:url/rsvp', async (req, res) => {
  const { guestName, guestEmail, attending, numAdults, numChildren, dietaryRestrictions, message } = req.body;
  try {
    const invResult = await pool.query('SELECT id FROM invitations WHERE invitation_url = $1', [req.params.url]);
    if (invResult.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    
    const invId = invResult.rows[0].id;
    const guestResult = await pool.query(
      'INSERT INTO guests (invitation_id, name, email, status, num_adults, num_children, dietary_restrictions, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
      [invId, guestName, guestEmail, attending === 'yes' ? 'accepted' : 'declined', numAdults || 1, numChildren || 0, dietaryRestrictions, message]
    );
    
    res.json({ success: true, guestId: guestResult.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ ANALYTICS ROUTES ============

app.get('/api/invitations/:id/analytics', verifyToken, async (req, res) => {
  try {
    const invResult = await pool.query('SELECT user_id FROM invitations WHERE id = $1', [req.params.id]);
    if (invResult.rows.length === 0 || invResult.rows[0].user_id !== req.user.id) {
      return res.status(404).json({ error: 'Not found' });
    }
    
    const visitsResult = await pool.query('SELECT COUNT(*) FROM invitation_visits WHERE invitation_id = $1', [req.params.id]);
    const guestResult = await pool.query('SELECT COUNT(*), status FROM guests WHERE invitation_id = $1 GROUP BY status', [req.params.id]);
    
    const statsByStatus = {};
    guestResult.rows.forEach(row => {
      statsByStatus[row.status] = parseInt(row.count);
    });
    
    res.json({
      visits: parseInt(visitsResult.rows[0].count),
      guests: statsByStatus,
      responseRate: statsByStatus.accepted ? Math.round((statsByStatus.accepted / (statsByStatus.invited || 1)) * 100) : 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ PAYMENTS ROUTES ============

app.post('/api/payments/checkout', verifyToken, async (req, res) => {
  const { invitationId, amount } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO payments (user_id, invitation_id, amount, currency, status, installment_1_amount)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [req.user.id, invitationId, amount, 'EUR', 'pending', Math.round(amount / 2)]
    );
    res.json({ paymentId: result.rows[0].id, depositAmount: Math.round(amount / 2) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
