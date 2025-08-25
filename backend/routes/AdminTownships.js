// file path: backend/ routes/ townships.js
import express from 'express';
import {pool} from '../config/db.js';

const router = express.Router();

// GET all townships
router.get('/', async (req, res, next) => {
  try {
    const [townships] = await pool.query(`
      SELECT townId, townName, description 
      FROM township
      ORDER BY townName ASC
    `);
    res.json(townships);
  } catch (err) {
    next(err);
  }
});

// GET single township
router.get('/:id', async (req, res, next) => {
  try {
    const [township] = await pool.query(
      'SELECT * FROM township WHERE townId = ?',
      [req.params.id]
    );
    res.json(township[0] || {});
  } catch (err) {
    next(err);
  }
});

export default router;