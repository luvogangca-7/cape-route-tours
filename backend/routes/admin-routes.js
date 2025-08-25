// file path: backend/routes/admin-routes.js
import express from 'express';
import adminBookingsRouter from './admin-bookings.js';
import adminBookingsExportRouter from './admin-bookings-export.js';

const router = express.Router();

// Mount the routers
router.use('/bookings', adminBookingsRouter);
router.use('/bookings/export', adminBookingsExportRouter);

export default router;

// Integration instructions:
// 1. Add this to your main app.js or server.js file:
//    import adminRoutes from './routes/admin-routes.js';
//    app.use('/api/admin', adminRoutes);
//
// 2. The admin interface will be available at:
//    - GET /api/admin/bookings (list all bookings)
//    - PUT /api/admin/bookings/:bookingId/status (update booking status)
//    - DELETE /api/admin/bookings/:bookingId (cancel booking)
//    - GET /api/admin/bookings/stats (dashboard statistics)
//    - GET /api/admin/bookings/filter-options (filter dropdown options)
//    - GET /api/admin/bookings/export (CSV export)