// file path: backend/routes/admin-routes.js
import express from 'express';
import adminBookingsRouter from './admin-bookings.js';
import adminBookingsExportRouter from './admin-bookings-export.js';
import jwtAuth from '../middleware/jwtAuth.js'; // ADD THIS IMPORT

const router = express.Router();

// Apply JWT authentication to all admin routes
router.use('/bookings', jwtAuth, adminBookingsRouter); // ADD jwtAuth HERE
router.use('/bookings/export', jwtAuth, adminBookingsExportRouter); // AND HERE

export default router;