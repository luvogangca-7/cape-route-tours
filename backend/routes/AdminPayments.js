// file path: backend/ routes/ payments.js
import express from 'express';
import {pool} from '../config/db.js';

const router = express.Router();

// Record payment
router.post('/', async (req, res, next) => {
  try {
    const { bookingId, stripePaymentId, amount, status } = req.body;
    
    const [result] = await pool.query(
      `INSERT INTO payments (bookingId, stripePaymentId, amount, status)
      VALUES (?, ?, ?, ?)`,
      [bookingId, stripePaymentId, amount, status]
    );
    
    // Update booking status
    await pool.query(
      `UPDATE bookings SET status = 'paid' WHERE bookingId = ?`,
      [bookingId]
    );
    
    res.status(201).json({
      paymentId: result.insertId,
      bookingId,
      status: 'paid'
    });
  } catch (err) {
    next(err);
  }
});

export default router;

