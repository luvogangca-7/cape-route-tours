// file path: backend/routes/ customers.js
import express from 'express';
import {pool} from '../config/db.js';

const router = express.Router();

// GET all customers
router.get('/', async (req, res, next) => {
  try {
    const [customers] = await pool.query('SELECT * FROM customers');
    res.json(customers);
  } catch (err) {
    next(err);
  }
});

// GET a single customer by ID
router.get('/:id', async (req, res, next) => {
  try {
    const [customer] = await pool.query(
      'SELECT * FROM customers WHERE customerId = ?',
      [req.params.id]
    );
    res.json(customer[0] || { error: 'Customer not found' });
  } catch (err) {
    next(err);
  }
});

export default router;