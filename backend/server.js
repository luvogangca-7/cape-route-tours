// server.js - Updated version
import express from 'express';
import cors from 'cors';

// Import database configurations
import { sequelize, dbConfig, initializeDatabase } from './config/db.js';
import models from './models/index.js';

// Import team routes (Sequelize-based)
import confirmPaymentRoutes from './routes/confirmPayment.js';
import bookingRoutes from './routes/bookingRoutes.js';
import checkoutSessionRoutes from './routes/checkoutSession.js';
import paymentRoutes from './routes/paymentRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';
import bookingManagementRoutes from './routes/bookingManagement.js';
import adminRoutes from './routes/admin-routes.js';

// Import your routes (MySQL2-based)
import messageRoutes from './routes/messageRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import townshipsRoute from './routes/AdminTownships.js';
import { getBoKaapBookings, getKhayelitshaBookings, getMitchellsPlainBookings, getLangaBookings } from './routes/AdminSpecific_bookings.js';
import adminBookingsRoute from './routes/adminBookings.js';
import adminCustomersRoute from './routes/AdminCustomers.js';
import AdminPaymentsRoute from './routes/AdminPayments.js';
import dashboardRoute from './routes/AdminDashboard.js';


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));

// For webhook routes, we need raw body for Stripe signature verification
app.use((req, res, next) => {
  if (req.originalUrl === '/api/webhook') {
    next(); // webhookRoutes will handle raw body
  } else {
    express.json()(req, res, next);
  }
});

app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Combined Tours API is running',
    timestamp: new Date().toISOString(),
    database: 'Connected',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Cape Route Tours API',
    version: '1.0.0',
    endpoints: {
      bookings: '/api/bookings',
      payments: '/api/payments',
      bookingManagement: '/api/booking-management',
      messages: '/api/messages',
      blogs: '/api/blogs',
      webhook: '/api/webhook'
    }
  });
});

// Mount team routes (Sequelize) - keeping their existing structure
app.use('/api', bookingRoutes);
app.use('/api', checkoutSessionRoutes);
app.use('/api', paymentRoutes);
app.use('/api', confirmPaymentRoutes);
app.use('/api/booking-management', bookingManagementRoutes);
app.use('/api', webhookRoutes); // This should handle /api/webhook
app.use('/api/admin', adminRoutes);


//Mount your routes (MySQL2) - keeping your existing structure
app.use('/api/messages', messageRoutes(dbConfig));
app.use('/api/blogs', blogRoutes(dbConfig));

app.use('/api/gettownships/:id', townshipsRoute);
app.use('/api/townships', townshipsRoute);
app.use('/api/bookings', adminBookingsRoute);
app.use('/api/customers', adminCustomersRoute);
app.use('/api/payments', AdminPaymentsRoute);

// Admin Booking Routes
app.use('/api/bokaap', getBoKaapBookings);
app.use('/api/khayelitsha', getKhayelitshaBookings);
app.use('/api/mitchellsplain', getMitchellsPlainBookings);
app.use('/api/langa', getLangaBookings);
app.use('/api/dashboard', dashboardRoute);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableEndpoints: [
      'GET    /health',
      'GET    /api',
      'POST   /api/bookings',
      'POST   /api/bookings/:bookingRef/checkout',
      'GET    /api/booking-management/lookup',
      'PUT    /api/booking-management/modify/:token',
      'DELETE /api/booking-management/cancel/:token',
      'POST   /api/messages',
      'GET    /api/blogs'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error stack:', err.stack);
  
  // Handle Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: err.errors.map(e => e.message)
    });
  }
  
  // Handle Sequelize unique constraint errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      success: false,
      message: 'Duplicate entry',
      error: 'A record with this information already exists'
    });
  }
  
  // Handle MySQL2 errors
  if (err.code && err.code.startsWith('ER_')) {
    return res.status(400).json({
      success: false,
      message: 'Database error',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Invalid request'
    });
  }
  
  // Handle Stripe errors
  if (err.type === 'StripeInvalidRequestError') {
    return res.status(400).json({
      success: false,
      message: 'Payment processing error',
      error: err.message
    });
  }
  
  // Default error response
  res.status(err.status || 500).json({ 
    success: false, 
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server gracefully...');
  try {
    await sequelize.close();
    console.log('✅ Database connections closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

// Initialize database and start server
initializeDatabase()
  .then(async () => {
    // Sync Sequelize models (for team's tables)
    try {
      await models.sequelize.sync({ alter: true });
      console.log('✅ Database synced successfully');
    } catch (syncError) {
      console.error('❌ Database sync failed:', syncError);
      // Don't exit - the server might still work with existing tables
    }
    
    app.listen(PORT, () => {
      console.log(`🚀 Combined server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔍 Health check: http://localhost:${PORT}/health`);
      console.log(`📋 Available routes:`);
      console.log(`   - Booking routes: /api/bookings`);
      console.log(`   - Payment routes: /api/payments`);
      console.log(`   - Booking management: /api/booking-management`);
      console.log(`   - Message routes: /api/messages`);
      console.log(`   - Blog routes: /api/blogs`);
      console.log(`   - Webhook: /api/webhook`);
    });
  })
  .catch(err => {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  });