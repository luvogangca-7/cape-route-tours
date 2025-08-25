// file path: backend/routes/bookings.js
import express from 'express';
import {pool} from '../config/db.js';

const router = express.Router();

// GET bookings (optionally filtered by township name, case-insensitive)
router.get('/', async (req, res, next) => {
  try {
    const townshipName = req.query.township || null;

    let query = `
      SELECT b.bookingId, c.name AS customerName, t.townName, p.packageName,
          b.numberOfPeople, b.totalPrice, b.status, b.createdAt
      FROM bookings b
      LEFT JOIN customers c ON b.customerId = c.customerId
      LEFT JOIN township t ON b.townId = t.townId
      LEFT JOIN packages p ON b.packageId = p.packageId
    `;

    const params = [];

    if (townshipName) {
      // Case-insensitive filter
      query += ` WHERE LOWER(t.townName) = LOWER(?)`;
      params.push(townshipName);
    }

    query += ` ORDER BY b.createdAt DESC`;

    console.log('Executing query:', query, 'Params:', params); // Debug log

    const [bookings] = await pool.query(query, params);

    res.json(bookings);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

export default router;
