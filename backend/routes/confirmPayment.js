// Add this route to your main server file or as a separate route file
import express from 'express';
import stripe from '../config/stripe.js';
import models from '../models/index.js';

const router = express.Router();

router.post('/confirm-payment', async (req, res) => {
  try {
    const { session_id } = req.body;
    
    if (!session_id) {
      return res.status(400).json({ error: 'Session ID required' });
    }

    console.log('Confirming payment for session:', session_id);

    // 1. Verify the Stripe session
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ 
        error: 'Payment not completed',
        payment_status: session.payment_status 
      });
    }

    // 2. Find the booking by session ID
    const booking = await models.Booking.findOne({
      where: { stripeSessionId: session_id },
      include: [
        { 
          model: models.Customer, 
          attributes: ['name', 'email', 'cell'] 
        },
        { 
          model: models.Package, 
          attributes: ['packageName', 'price', 'duration'] 
        }
      ]
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // 3. Update booking status to paid (if not already)
    if (booking.status !== 'paid') {
      await booking.update({ status: 'paid' });
      console.log(`✅ Booking ${booking.bookingRef} status updated to paid`);
    }

    // 4. Create or update payment record
    let payment = await models.Payment.findOne({
      where: { 
        bookingId: booking.bookingId,
        stripeSessionId: session_id 
      }
    });

    if (!payment) {
      payment = await models.Payment.create({
        bookingId: booking.bookingId,
        amount: booking.totalPrice,
        currency: 'ZAR',
        status: 'completed',
        paymentMethod: 'stripe',
        stripeSessionId: session_id,
        paymentDate: new Date()
      });
      console.log(`💳 Payment record created for booking ${booking.bookingRef}`);
    }

    // 5. Return the confirmed booking data
    res.json({
      success: true,
      booking: {
        reference: booking.bookingRef,
        customer: {
          name: booking.Customer.name,
          email: booking.Customer.email,
          cell: booking.Customer.cell
        },
        package: {
          packageName: booking.Package.packageName,
          price: booking.Package.price,
          duration: booking.Package.duration
        },
        numberOfPeople: booking.numberOfPeople,
        totalPrice: booking.totalPrice,
        status: booking.status,
        bookingDetails: booking.bookingDetails,
        createdAt: booking.createdAt,
        paymentAmount: payment.amount,
        paymentDate: payment.paymentDate
      },
      payment: {
        paymentId: payment.paymentId,
        amount: payment.amount,
        status: payment.status,
        paymentDate: payment.paymentDate
      }
    });

  } catch (error) {
    console.error('❌ Payment confirmation error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to confirm payment',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});


export default router;