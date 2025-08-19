import express from 'express';
import stripe from '../config/stripe.js';
import models from '../models/index.js';

const router = express.Router();

// Helper function to generate booking reference
function generateBookingReference() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'CRT-';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Validate email format
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Create initial booking (from registration form)
router.post('/bookings', async (req, res) => {
  try {
    const { full_name, email, phone, packageId, number_of_people, townships, dates, totalPrice, bookingType } = req.body;

    // Enhanced validation
    if (!full_name?.trim()) {
      return res.status(400).json({ error: 'Full name is required' });
    }
    if (!email?.trim()) {
      return res.status(400).json({ error: 'Email is required' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    if (!packageId) {
      return res.status(400).json({ error: 'Package selection is required' });
    }
    if (isNaN(number_of_people) || number_of_people < 1) {
      return res.status(400).json({ error: 'Number of people must be at least 1' });
    }

    // Get package details
    const packageData = await models.Package.findByPk(packageId);
    if (!packageData) {
      return res.status(404).json({ error: 'Package not found' });
    }

    // Find or create customer
    let customer = await models.Customer.findOne({ where: { email: email.trim().toLowerCase() } });
    if (!customer) {
      customer = await models.Customer.create({ 
        name: full_name.trim(), 
        email: email.trim().toLowerCase(), 
        cell: phone?.trim() || null 
      });
    } else {
      // Update customer info if provided
      if (phone?.trim()) {
        await customer.update({ 
          name: full_name.trim(),
          cell: phone.trim() 
        });
      }
    }

    // Generate unique booking reference
    let bookingRef;
    let isUnique = false;
    let attempts = 0;
    
    while (!isUnique && attempts < 10) {
      bookingRef = generateBookingReference();
      const existingBooking = await models.Booking.findOne({ where: { bookingRef } });
      if (!existingBooking) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      throw new Error('Failed to generate unique booking reference');
    }

    // Prepare booking details for complex bookings
    const bookingDetails = {
      bookingType: bookingType || 'single',
      townships: townships || [],
      dates: dates || [],
      packageName: packageData.packageName
    };

    // Create booking with pending status
    const booking = await models.Booking.create({
      bookingRef,
      customerId: customer.customerId,
      packageId,
      numberOfPeople: number_of_people,
      totalPrice: totalPrice || (packageData.price * number_of_people),
      status: 'pending',
      bookingDetails: bookingDetails
    });

    console.log(`✅ Booking created: ${bookingRef} for ${email}`);

    // Return success response with booking reference
    res.json({ 
      success: true,
      bookingRef: bookingRef,
      bookingId: booking.bookingId,
      message: 'Booking created successfully. You can pay now or later using your booking reference.',
      totalPrice: booking.totalPrice,
      customerEmail: email.trim().toLowerCase()
    });

  } catch (error) {
    console.error('Booking creation error:', error);
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to create booking',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Create Stripe checkout session for existing booking
router.post('/bookings/:bookingRef/checkout', async (req, res) => {
  try {
    const { bookingRef } = req.params;
    const { email } = req.body;

    if (!email?.trim()) {
      return res.status(400).json({ error: 'Email is required' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Find the booking
    const booking = await models.Booking.findOne({
      where: { 
        bookingRef: bookingRef.toUpperCase() 
      },
      include: [
        { model: models.Package },
        { model: models.Customer }
      ]
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Verify email matches customer
    if (booking.Customer.email.toLowerCase() !== email.trim().toLowerCase()) {
      return res.status(403).json({ error: 'Email does not match booking record' });
    }

    // Check if already paid
    if (booking.status === 'paid') {
      return res.status(400).json({ error: 'Booking is already paid' });
    }

    // Check if cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({ error: 'Booking has been cancelled' });
    }

    // Configure frontend URLs
    const frontendBaseUrl = process.env.NODE_ENV === 'development'
      ? 'http://localhost:8080'
      : process.env.FRONTEND_URL || 'https://yourdomain.com';

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
              description: `Booking ${bookingRef} for ${booking.numberOfPeople} people`
            },
            unit_amount: Math.round(booking.Package.price * 100),
          },
          quantity: booking.numberOfPeople,
        },
      ],
      metadata: { 
        bookingId: booking.bookingId.toString(),
        bookingRef: bookingRef,
        customerId: booking.Customer.customerId.toString()
      },
      success_url: `${frontendBaseUrl}/success?session_id={CHECKOUT_SESSION_ID}&booking_ref=${bookingRef}`,
      cancel_url: `${frontendBaseUrl}/cancel?booking_ref=${bookingRef}`,
    });

    // Update booking with Stripe session ID
    await booking.update({ 
      stripeSessionId: session.id 
    });

    console.log(`💳 Stripe session created for booking: ${bookingRef}`);

    // Return checkout URL
    res.json({ 
      success: true,
      checkoutUrl: session.url,
      bookingRef: bookingRef,
      sessionId: session.id
    });

  } catch (error) {
    console.error('Checkout creation error:', error);
    
    const statusCode = error.type === 'StripeInvalidRequestError' ? 400 : 500;
    
    res.status(statusCode).json({ 
      success: false,
      error: 'Failed to create checkout session',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get booking by reference and email
router.get('/bookings/:reference', async (req, res) => {
  try {
    const { reference } = req.params;
    const { email } = req.query;

    let whereClause = { bookingRef: reference.toUpperCase() };
    
    // If email is provided, verify it matches
    if (email) {
      const customer = await models.Customer.findOne({ 
        where: { email: email.trim().toLowerCase() } 
      });
      if (customer) {
        whereClause.customerId = customer.customerId;
      } else {
        return res.status(404).json({ 
          success: false,
          error: 'Booking not found' 
        });
      }
    }

    const booking = await models.Booking.findOne({
      where: whereClause,
      include: [
        { 
          model: models.Package,
          attributes: ['packageName', 'price', 'duration'] 
        },
        { 
          model: models.Customer,
          attributes: ['name', 'email', 'cell'] 
        }
      ]
    });

    if (!booking) {
      return res.status(404).json({ 
        success: false,
        error: 'Booking not found' 
      });
    }

    res.json({
      success: true,
      booking: {
        reference: booking.bookingRef,
        package: booking.Package,
        customer: booking.Customer,
        numberOfPeople: booking.numberOfPeople,
        totalPrice: booking.totalPrice,
        status: booking.status,
        bookingDetails: booking.bookingDetails,
        createdAt: booking.createdAt
      }
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to retrieve booking'
    });
  }
});

// Update booking status after successful payment
router.patch('/bookings/:bookingRef/complete-payment', async (req, res) => {
  try {
    const { bookingRef } = req.params;
    const { sessionId } = req.body;

    // Find booking
    const booking = await models.Booking.findOne({
      where: { bookingRef: bookingRef.toUpperCase() }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Verify Stripe session if provided
    if (sessionId && booking.stripeSessionId !== sessionId) {
      return res.status(400).json({ error: 'Invalid session' });
    }

    // Update status to paid
    await booking.update({ status: 'paid' });

    console.log(`✅ Payment completed for booking: ${bookingRef}`);

    res.json({
      success: true,
      message: 'Payment completed successfully',
      bookingRef: bookingRef,
      status: 'paid'
    });

  } catch (error) {
    console.error('Payment completion error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to complete payment'
    });
  }
});

export default router;