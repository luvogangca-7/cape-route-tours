// file path: backend/routes/income.js

import express from 'express';
import {pool} from '../config/db.js';

const router = express.Router();

/**
 * GET /api/income/so-far
 * Returns total income so far
 */
router.get('/so-far', (req, res) => {
    const sql = `
        SELECT SUM(p.price * b.tickets) AS income
        FROM bookings b
        JOIN tours t ON b.tour_id = t.tour_id
        JOIN packages p ON t.package_id = p.package_id
    `;
    pool.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ income: results[0].income || 0 });
    });
});

export default router;