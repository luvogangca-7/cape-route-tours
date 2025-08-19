// server.js - Fixed version
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
import bookingManagementRoutes from './routes/bookingManagement.js';
import webhookRoutes from './routes/webhookRoutes.js';

// Import your routes (MySQL2-based)
import messageRoutes from './routes/messageRoutes.js';
import blogRoutes from './routes/blogRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080'
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Combined Tours API is running',
    timestamp: new Date().toISOString()
  });
});

// Mount team routes (Sequelize) - keeping their existing structure
app.use('/api', bookingRoutes);
app.use('/api', checkoutSessionRoutes);
app.use('/api', paymentRoutes);
app.use('/api', confirmPaymentRoutes);
app.use('/api/booking-management', bookingManagementRoutes);
app.use('/api', webhookRoutes);

// Mount your routes (MySQL2) - keeping your existing structure
app.use('/api/messages', messageRoutes(dbConfig));
app.use('/api/blogs', blogRoutes(dbConfig));

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
  
  // Handle MySQL2 errors
  if (err.code && err.code.startsWith('ER_')) {
    return res.status(400).json({
      success: false,
      message: 'Database error',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Invalid request'
    });
  }
  
  // Default error response
  res.status(err.status || 500).json({ 
    success: false, 
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something broke!'
  });
});

// Initialize database and start server
initializeDatabase()
  .then(async () => {
    // Sync Sequelize models (for team's tables)
    await models.sequelize.sync({ alter: true });
    console.log('✅ Database synced successfully');
    
    app.listen(PORT, () => {
      console.log(`🚀 Combined server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔍 Health check: http://localhost:${PORT}/health`);
      console.log(`📋 Available routes:`);
      console.log(`   Team routes: /api/bookings, /api/payments, /api/checkout-session`);
      console.log(`   Booking management: /api/booking-management`);
      console.log(`   Your routes: /api/messages, /api/blogs`);
    });
  })
  .catch(err => {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  });