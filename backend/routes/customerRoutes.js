import express from 'express';
import { getCustomers, createCustomer, getCustomerById, updateCustomer, deleteCustomer } from '../controllers/customerController.js';

const router = express.Router();

// GET all customers
router.get('/', getCustomers);

// POST a new customer
router.post('/', createCustomer);

// GET a single customer by ID
router.get('/:id', getCustomerById);

// PUT update a customer by ID
router.put('/:id', updateCustomer);

// DELETE a customer by ID
router.delete('/:id', deleteCustomer);

export default router;
