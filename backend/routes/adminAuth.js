import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '2h';

// Simple admin credential check (replace with DB lookup in production)
const ADMIN_EMAIL = process.env.ADMIN_EMr70AIL || 'admin@tour.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'tour123';

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password required' });
  }

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin', email }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
    return res.json({ success: true, token, expiresIn: JWT_EXPIRY });
  }

  return res.status(401).json({ success: false, message: 'Invalid credentials' });
});

export default router;
