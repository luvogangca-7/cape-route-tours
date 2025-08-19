// routes/bookingManagement.js - Complete booking management system
import express from 'express';
import crypto from 'crypto';
import models from '../models/index.js';

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

function generateBookingReference(bookingId) {
  const year = new Date().getFullYear();
  const paddedId = String(bookingId).padStart(6, '0');
  return `CRT-${year}-${paddedId}`;
}

function parseBookingReference(reference) {
  const match = reference.match(/^CRT-\d{4}-(\d{6})$/);
  return match ? parseInt(match[1]) : null;
}

function canCancelBooking(tourDate) {
  if (!tourDate) return true;
  const now = new Date();
  const tour = new Date(tourDate);
  const hoursUntilTour = (tour - now) / (1000 * 60 * 60);
  return hoursUntilTour > 24;
}

function canModifyBooking(tourDate) {
  if (!tourDate) return true;
  const now = new Date();
  const tour = new Date(tourDate);
  const hoursUntilTour = (tour - now) / (1000 * 60 * 60);
  return hoursUntilTour > 48;
}

// ================ ROUTES ================

// POST /api/booking-management/lookup
router.post('/lookup', async (req, res) => {
  try {
    const { email, bookingId } = req.body;
    
    console.log('Lookup request:', { email, bookingId });
    
    if (!email || !bookingId) {
      return res.status(400).json({
        success: false,
        message: 'Email and Booking ID are required'
      });
    }

    // Parse booking reference to get actual database ID
    const actualBookingId = parseBookingReference(bookingId.toUpperCase().trim());
    if (!actualBookingId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID format. Expected format: CRT-YYYY-XXXXXX'
      });
    }
    
    console.log('Looking for booking ID:', actualBookingId);
    
    // Find booking with all related data
    const booking = await models.Booking.findOne({
      where: { bookingId: actualBookingId },
      include: [
        {
          model: models.Customer,
          where: { email: email.toLowerCase().trim() },
          required: true
        },
        {
          model: models.Package,
          required: true
        },
        {
          model: models.Township,
          required: false
        }
      ]
    });
    
    console.log('Found booking:', booking ? 'Yes' : 'No');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found. Please check your email and booking ID.'
      });
    }
    
    // Generate temporary access token
    const accessToken = generateAccessToken();
    const expiresAt = Date.now() + (60 * 60 * 1000); // 1 hour
    
    accessTokens.set(accessToken, {
      bookingId: booking.bookingId,
      expiresAt
    });
    
    console.log('Generated access token for booking:', booking.bookingId);
    
    res.json({
      success: true,
      accessToken,
      booking: {
        bookingId: generateBookingReference(booking.bookingId),
        packageName: booking.Package.packageName,
        customerName: booking.Customer.name,
        email: booking.Customer.email,
        phone: booking.Customer.cell,
        tourDate: booking.tourDate,
        numberOfPeople: booking.numberOfPeople,
        totalAmount: parseFloat(booking.totalPrice),
        status: booking.status,
        createdAt: booking.createdAt,
        specialRequests: booking.specialRequests,
        township: booking.Township ? booking.Township.name : null,
        canCancel: canCancelBooking(booking.tourDate) && booking.status !== 'cancelled',
        canModify: canModifyBooking(booking.tourDate) && booking.status !== 'cancelled'
      }
    });
    
  } catch (error) {
    console.error('Booking lookup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

// PUT /api/booking-management/modify/:token
router.put('/modify/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { tourDate, numberOfPeople, specialRequests } = req.body;
    
    console.log('Modify request:', { token: token.substring(0, 8) + '...', tourDate, numberOfPeople, specialRequests });
    
    // Validate access token
    const tokenData = accessTokens.get(token);
    if (!tokenData || tokenData.expiresAt < Date.now()) {
      return res.status(401).json({
        success: false,
        message: 'Access token expired or invalid. Please look up your booking again.'
      });
    }
    
    // Find booking with associations
    const booking = await models.Booking.findOne({
      where: { bookingId: tokenData.bookingId },
      include: [
        { model: models.Customer },
        { model: models.Package },
        { model: models.Township, required: false }
      ]
    });
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.'
      });
    }
    
    // Validation checks
    if (!canModifyBooking(booking.tourDate)) {
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
    
    // Prepare updates
    const updates = {};
    
    if (tourDate) {
      const newTourDate = new Date(tourDate);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      if (newTourDate < tomorrow) {
        return res.status(400).json({
          success: false,
          message: 'Tour date must be at least tomorrow'
        });
      }
      updates.tourDate = newTourDate;
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
    
    console.log('Updating booking with:', updates);
    
    // Update the booking
    await booking.update(updates);
    
    // Reload with fresh associations
    await booking.reload({
      include: [
        { model: models.Customer },
        { model: models.Package },
        { model: models.Township, required: false }
      ]
    });
    
    console.log('Booking updated successfully');
    
    res.json({
      success: true,
      message: 'Booking updated successfully',
      booking: {
        bookingId: generateBookingReference(booking.bookingId),
        packageName: booking.Package.packageName,
        customerName: booking.Customer.name,
        email: booking.Customer.email,
        phone: booking.Customer.cell,
        tourDate: booking.tourDate,
        numberOfPeople: booking.numberOfPeople,
        totalAmount: parseFloat(booking.totalPrice),
        status: booking.status,
        createdAt: booking.createdAt,
        specialRequests: booking.specialRequests,
        township: booking.Township ? booking.Township.name : null,
        canCancel: canCancelBooking(booking.tourDate),
        canModify: canModifyBooking(booking.tourDate)
      }
    });
    
  } catch (error) {
    console.error('Booking modification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

// DELETE /api/booking-management/cancel/:token
router.delete('/cancel/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { reason } = req.body;
    
    console.log('Cancel request:', { token: token.substring(0, 8) + '...', reason });
    
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
      where: { bookingId: tokenData.bookingId },
      include: [
        { model: models.Customer },
        { model: models.Package },
        { model: models.Township, required: false }
      ]
    });
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.'
      });
    }
    
    // Validation checks
    if (!canCancelBooking(booking.tourDate)) {
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
      message: 'Booking cancelled successfully'
    });
    
  } catch (error) {
    console.error('Booking cancellation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

export default router;