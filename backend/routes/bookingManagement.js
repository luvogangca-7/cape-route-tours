import express from 'express';
import crypto from 'crypto';
import models from '../models/index.js';
import stripe from '../config/stripe.js';

const router = express.Router();

// In-memory storage for temporary access tokens (use Redis in production)
const accessTokens = new Map();

// Clean up expired tokens every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [token, data] of accessTokens.entries()) {
    if (data.expiresAt < now) {
      accessTokens.delete(token);
    }
  }
}, 5 * 60 * 1000);

// ================ HELPER FUNCTIONS ================

function generateAccessToken() {
  return crypto.randomBytes(32).toString('hex');
}

function validateBookingReference(reference) {
  return /^CRT-[A-Z0-9]{8}$/.test(reference);
}

function canCancelBooking(booking) {
  if (!booking || !booking.bookingDetails || !booking.bookingDetails.dates) return false;
  
  const dates = booking.bookingDetails.dates;
  const earliestDate = new Date(Math.min(...dates.map(date => new Date(date))));
  
  const now = new Date();
  const hoursUntilTour = (earliestDate - now) / (1000 * 60 * 60);
  return hoursUntilTour > 24;
}

function canModifyBooking(booking) {
  if (!booking || !booking.bookingDetails || !booking.bookingDetails.dates) return false;
  
  const dates = booking.bookingDetails.dates;
  const earliestDate = new Date(Math.min(...dates.map(date => new Date(date))));
  
  const now = new Date();
  const hoursUntilTour = (earliestDate - now) / (1000 * 60 * 60);
  return hoursUntilTour > 48;
}

function canPayNow(booking) {
  if (!booking) return false;
  
  // Can pay if booking is pending and not cancelled
  return booking.status === 'pending';
}

// ================ EXISTING ROUTES ================

// POST /api/booking-management/lookup
router.post('/lookup', async (req, res) => {
  try {
    const { email, bookingRef } = req.body;
    
    console.log('Lookup request:', { email, bookingRef });
    
    if (!email || !bookingRef) {
      return res.status(400).json({
        success: false,
        message: 'Email and Booking ID are required'
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanBookingRef = bookingRef.toUpperCase().trim();
    
    if (!validateBookingReference(cleanBookingRef)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID format. Expected format: CRT-ABC12345'
      });
    }
    
    const booking = await models.Booking.findOne({
      where: { 
        bookingRef: cleanBookingRef 
      },
      include: [
        {
          model: models.Customer,
          where: { 
            email: cleanEmail 
          },
          required: true
        },
        {
          model: models.Package,
          required: true
        }
      ]
    });
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found. Please check your email and booking ID.'
      });
    }
    
    const accessToken = generateAccessToken();
    const expiresAt = Date.now() + (60 * 60 * 1000);
    
    accessTokens.set(accessToken, {
      bookingRef: booking.bookingRef,
      expiresAt
    });
    
    const bookingDetails = booking.bookingDetails || {};
    const dates = bookingDetails.dates || [];
    const townships = bookingDetails.townships || [];
    const bookingType = bookingDetails.bookingType || 'single';
    const primaryDate = dates.length > 0 ? dates[0] : null;
    
    res.json({
      success: true,
      accessToken,
      booking: {
        bookingId: booking.bookingRef,
        packageName: booking.Package.packageName,
        customerName: booking.Customer.name,
        email: booking.Customer.email,
        phone: booking.Customer.cell,
        tourDate: primaryDate ? new Date(primaryDate).toISOString() : null,
        allDates: dates.map(date => new Date(date).toISOString()),
        numberOfPeople: booking.numberOfPeople,
        totalAmount: parseFloat(booking.totalPrice),
        status: booking.status,
        createdAt: booking.createdAt.toISOString(),
        specialRequests: booking.specialRequests,
        townships: townships,
        bookingType: bookingType,
        canCancel: canCancelBooking(booking) && booking.status !== 'cancelled',
        canModify: canModifyBooking(booking) && booking.status !== 'cancelled',
        canPay: canPayNow(booking), // Add payment capability check
        bookingDetails: bookingDetails
      }
    });
    
  } catch (error) {
    console.error('Booking lookup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/booking-management/lookup?email=...&bookingRef=...
router.get('/lookup', async (req, res) => {
  try {
    const { email, bookingRef } = req.query;

    console.log('Lookup request (GET):', { email, bookingRef });

    if (!email || !bookingRef) {
      return res.status(400).json({
        success: false,
        message: 'Email and booking reference are required'
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanBookingRef = bookingRef.toUpperCase().trim();

    if (!validateBookingReference(cleanBookingRef)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking reference format. Expected format: CRT-ABC12345'
      });
    }

    const booking = await models.Booking.findOne({
      where: { bookingRef: cleanBookingRef },
      include: [
        { model: models.Customer, where: { email: cleanEmail }, required: true },
        { model: models.Package, required: true }
      ]
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found. Please check your email and reference.'
      });
    }

    const accessToken = generateAccessToken();
    const expiresAt = Date.now() + (60 * 60 * 1000);

    accessTokens.set(accessToken, {
      bookingRef: booking.bookingRef,
      expiresAt
    });

    const bookingDetails = booking.bookingDetails || {};
    const dates = bookingDetails.dates || [];
    const townships = bookingDetails.townships || [];
    const bookingType = bookingDetails.bookingType || 'single';
    const primaryDate = dates.length > 0 ? dates[0] : null;

    res.json({
      success: true,
      accessToken,
      booking: {
        bookingId: booking.bookingRef,
        packageName: booking.Package.packageName,
        customerName: booking.Customer.name,
        email: booking.Customer.email,
        phone: booking.Customer.cell,
        tourDate: primaryDate ? new Date(primaryDate).toISOString() : null,
        allDates: dates.map(date => new Date(date).toISOString()),
        numberOfPeople: booking.numberOfPeople,
        totalAmount: parseFloat(booking.totalPrice),
        status: booking.status,
        createdAt: booking.createdAt.toISOString(),
        specialRequests: booking.specialRequests,
        townships: townships,
        bookingType: bookingType,
        canCancel: canCancelBooking(booking) && booking.status !== 'cancelled',
        canModify: canModifyBooking(booking) && booking.status !== 'cancelled',
        canPay: canPayNow(booking), // Add payment capability check
        bookingDetails: bookingDetails
      }
    });

  } catch (error) {
    console.error('Booking lookup (GET) error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ================ NEW PAY NOW ROUTE ================

// POST /api/booking-management/pay/:token
router.post('/pay/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    console.log('Pay now request:', { 
      token: token.substring(0, 8) + '...'
    });
    
    // Validate access token
    const tokenData = accessTokens.get(token);
    if (!tokenData || tokenData.expiresAt < Date.now()) {
      return res.status(401).json({
        success: false,
        message: 'Access token expired or invalid. Please look up your booking again.'
      });
    }
    
    // Find booking
    const booking = await models.Booking.findOne({
      where: { bookingRef: tokenData.bookingRef },
      include: [
        { model: models.Customer },
        { model: models.Package }
      ]
    });
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.'
      });
    }
    
    // Check if payment is allowed
    if (!canPayNow(booking)) {
      return res.status(400).json({
        success: false,
        message: 'This booking cannot be paid. It may already be paid or cancelled.'
      });
    }
    
    // Configure frontend URLs
    const frontendBaseUrl = process.env.NODE_ENV === 'development'
      ? 'http://localhost:8080'
      : process.env.FRONTEND_URL;

    if (!frontendBaseUrl.startsWith('http')) {
      throw new Error('Invalid FRONTEND_URL in environment variables');
    }

    // Create Stripe checkout session
  const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  mode: 'payment',
  customer_email: booking.Customer.email,
  line_items: [
    {
      price_data: {
        currency: 'zar',
        product_data: { 
          name: booking.Package.packageName,
          description: `Booking ${booking.bookingRef} for ${booking.numberOfPeople} people`
        },
        unit_amount: Math.round(booking.Package.price * 100),
      },
      quantity: booking.numberOfPeople,
    },
  ],
  metadata: { 
    bookingId: booking.bookingId.toString(), // Make sure to include bookingId
    bookingRef: booking.bookingRef,
    customerId: booking.Customer.customerId.toString()
  },
  success_url: `${frontendBaseUrl}/success?session_id={CHECKOUT_SESSION_ID}&booking_ref=${booking.bookingRef}`,
  cancel_url: `${frontendBaseUrl}/bookings?booking_ref=${booking.bookingRef}`,
});

    // Update booking with Stripe session ID
    await booking.update({ 
      stripeSessionId: session.id 
    });

    console.log(`💳 Stripe session created for booking: ${booking.bookingRef}`);

    // Return checkout URL
    res.json({ 
      success: true,
      checkoutUrl: session.url,
      bookingRef: booking.bookingRef,
      sessionId: session.id,
      message: 'Redirecting to payment...'
    });

  } catch (error) {
    console.error('Payment creation error:', error);
    
    const statusCode = error.type === 'StripeInvalidRequestError' ? 400 : 500;
    
    res.status(statusCode).json({ 
      success: false,
      error: 'Failed to create payment session',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PUT /api/booking-management/modify/:token
router.put('/modify/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { tourDate, numberOfPeople, specialRequests, dates } = req.body;
    
    console.log('Modify request:', { 
      token: token.substring(0, 8) + '...', 
      tourDate, 
      numberOfPeople, 
      specialRequests 
    });
    
    // Validate access token
    const tokenData = accessTokens.get(token);
    if (!tokenData || tokenData.expiresAt < Date.now()) {
      return res.status(401).json({
        success: false,
        message: 'Access token expired or invalid. Please look up your booking again.'
      });
    }
    
    // Find booking
    const booking = await models.Booking.findOne({
      where: { bookingRef: tokenData.bookingRef },
      include: [
        { model: models.Customer },
        { model: models.Package }
      ]
    });
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.'
      });
    }
    
    // Validation checks using bookingDetails
    if (!canModifyBooking(booking)) {
      return res.status(400).json({
        success: false,
        message: 'Booking cannot be modified within 48 hours of tour date'
      });
    }
    
    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot modify a cancelled booking'
      });
    }
    
    // Prepare updates - including bookingDetails updates
    const updates = {};
    const bookingDetailsUpdates = { ...booking.bookingDetails };
    
    if (dates && Array.isArray(dates)) {
      // Validate all dates are in the future
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      for (const dateStr of dates) {
        const date = new Date(dateStr);
        if (date < tomorrow) {
          return res.status(400).json({
            success: false,
            message: 'All tour dates must be at least tomorrow'
          });
        }
      }
      
      bookingDetailsUpdates.dates = dates;
    }
    
    if (numberOfPeople && numberOfPeople !== booking.numberOfPeople) {
      if (numberOfPeople < 1 || numberOfPeople > 20) {
        return res.status(400).json({
          success: false,
          message: 'Number of people must be between 1 and 20'
        });
      }
      updates.numberOfPeople = numberOfPeople;
      updates.totalPrice = booking.Package.price * numberOfPeople;
    }
    
    if (specialRequests !== undefined) {
      updates.specialRequests = specialRequests.trim() || null;
    }
    
    // Update bookingDetails if changes were made
    updates.bookingDetails = bookingDetailsUpdates;
    
    // Update the booking
    await booking.update(updates);
    
    // Reload with fresh associations
    await booking.reload({
      include: [
        { model: models.Customer },
        { model: models.Package }
      ]
    });
    
    // Extract updated details for response
    const updatedDetails = booking.bookingDetails || {};
    const updatedDates = updatedDetails.dates || [];
    const primaryDate = updatedDates.length > 0 ? updatedDates[0] : null;
    
    res.json({
      success: true,
      message: 'Booking updated successfully',
      booking: {
        bookingId: booking.bookingRef,
        packageName: booking.Package.packageName,
        customerName: booking.Customer.name,
        email: booking.Customer.email,
        phone: booking.Customer.cell,
        tourDate: primaryDate ? new Date(primaryDate).toISOString() : null,
        allDates: updatedDates.map(date => new Date(date).toISOString()),
        numberOfPeople: booking.numberOfPeople,
        totalAmount: parseFloat(booking.totalPrice),
        status: booking.status,
        createdAt: booking.createdAt.toISOString(),
        specialRequests: booking.specialRequests,
        townships: updatedDetails.townships || [],
        bookingType: updatedDetails.bookingType || 'single',
        canCancel: canCancelBooking(booking) && booking.status !== 'cancelled',
        canModify: canModifyBooking(booking) && booking.status !== 'cancelled',
        canPay: canPayNow(booking)
      }
    });
    
  } catch (error) {
    console.error('Booking modification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// DELETE /api/booking-management/cancel/:token
router.delete('/cancel/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { reason } = req.body;
    
    console.log('Cancel request:', { 
      token: token.substring(0, 8) + '...', 
      reason 
    });
    
    // Validate access token
    const tokenData = accessTokens.get(token);
    if (!tokenData || tokenData.expiresAt < Date.now()) {
      return res.status(401).json({
        success: false,
        message: 'Access token expired or invalid. Please look up your booking again.'
      });
    }
    
    // Find booking using bookingRef
    const booking = await models.Booking.findOne({
      where: { bookingRef: tokenData.bookingRef },
      include: [
        { model: models.Customer },
        { model: models.Package }
      ]
    });
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.'
      });
    }
    
    // Validation checks
    if (!canCancelBooking(booking)) {
      return res.status(400).json({
        success: false,
        message: 'Booking cannot be cancelled within 24 hours of tour date'
      });
    }
    
    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }
    
    // Update booking to cancelled status
    await booking.update({
      status: 'cancelled',
      cancellationReason: reason || null,
      cancelledAt: new Date()
    });
    
    console.log('Booking cancelled successfully');
    
    // Clean up access token
    accessTokens.delete(token);
    
    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking: {
        bookingId: booking.bookingRef,
        status: 'cancelled'
      }
    });
    
  } catch (error) {
    console.error('Booking cancellation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/booking-management/verify/:token - Optional verification endpoint
router.get('/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    const tokenData = accessTokens.get(token);
    if (!tokenData || tokenData.expiresAt < Date.now()) {
      return res.status(401).json({
        success: false,
        message: 'Access token expired or invalid'
      });
    }
    
    res.json({
      success: true,
      valid: true,
      expiresAt: tokenData.expiresAt,
      bookingRef: tokenData.bookingRef
    });
    
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;