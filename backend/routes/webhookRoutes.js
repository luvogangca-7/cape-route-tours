// routes/webhookRoutes.js
import express from 'express';
import stripe from '../config/stripe.js';
import models from '../models/index.js';

const router = express.Router();

// Webhook endpoint for Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event.data.object);
      break;
    case 'checkout.session.expired':
      await handleCheckoutExpired(event.data.object);
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

async function handleCheckoutCompleted(session) {
  try {
    console.log('Processing completed checkout session:', session.id);
    
    const bookingRef = session.metadata.bookingRef;
    const bookingId = session.metadata.bookingId;

    if (!bookingRef) {
      console.error('No booking reference in session metadata');
      return;
    }

    // Find the booking
    const booking = await models.Booking.findOne({
      where: { bookingRef: bookingRef }
    });

    if (!booking) {
      console.error(`Booking not found: ${bookingRef}`);
      return;
    }

    // Update booking status to paid
    await booking.update({
      status: 'paid',
      stripeSessionId: session.id
    });

    // Create payment record
    await models.Payment.create({
      bookingId: booking.bookingId,
      amount: session.amount_total / 100, // Convert from cents
      paymentMethod: 'stripe',
      stripeSessionId: session.id,
      status: 'completed',
      paymentDate: new Date()
    });

    console.log(`✅ Payment completed for booking: ${bookingRef}`);

  } catch (error) {
    console.error('Error processing completed checkout:', error);
  }
}

async function handleCheckoutExpired(session) {
  try {
    console.log('Processing expired checkout session:', session.id);
    
    const bookingRef = session.metadata.bookingRef;

    if (!bookingRef) {
      console.error('No booking reference in session metadata');
      return;
    }

    // Find the booking
    const booking = await models.Booking.findOne({
      where: { bookingRef: bookingRef }
    });

    if (booking && booking.status === 'pending') {
      // Optionally handle expired sessions
      // You might want to send a reminder email or mark as expired
      console.log(`⏰ Checkout session expired for booking: ${bookingRef}`);
    }

  } catch (error) {
    console.error('Error processing expired checkout:', error);
  }
}

export default router;