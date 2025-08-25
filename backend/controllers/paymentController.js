import stripe from '../config/stripe.js';
import models from '../models/index.js';

export async function savePaymentAndConfirmBooking(sessionId) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent']
    });
    
    if (!session) throw new Error('Stripe session not found');

    // Get bookingId from session metadata
    const bookingId = session.metadata?.bookingId;
    const bookingRef = session.metadata?.bookingRef;
    
    if (!bookingId && !bookingRef) {
      throw new Error('Booking ID or reference missing in session metadata');
    }

    let booking;
    if (bookingId) {
      // Find by bookingId
      booking = await models.Booking.findByPk(bookingId);
    } else if (bookingRef) {
      // Find by bookingRef
      booking = await models.Booking.findOne({
        where: { bookingRef: bookingRef }
      });
    }

    if (!booking) {
      throw new Error(`Booking not found: ${bookingId || bookingRef}`);
    }

    // Get payment intent details
    const paymentIntent = session.payment_intent;
    if (!paymentIntent) {
      throw new Error('Payment intent not found in session');
    }

    // Save payment record in DB
    const paymentRecord = await models.Payment.create({
      bookingId: booking.bookingId,
      stripePaymentId: paymentIntent.id,
      stripeSessionId: sessionId,
      amount: paymentIntent.amount_received / 100,
      currency: paymentIntent.currency,
      status: paymentIntent.status === 'succeeded' ? 'completed' : 'pending',
      paymentMethod: 'stripe',
      paymentDate: new Date()
    });

    // Update booking status to 'paid'
    await booking.update({ status: 'paid' });

    // Fetch booking with customer details for response
    const bookingWithCustomer = await models.Booking.findOne({
      where: { bookingId: booking.bookingId },
      include: [
        { 
          model: models.Customer,
          attributes: ['name', 'email', 'cell']
        },
        {
          model: models.Package,
          attributes: ['packageName', 'price']
        }
      ],
    });

    return { 
      success: true, 
      payment: paymentRecord, 
      booking: bookingWithCustomer 
    };
  } catch (error) {
    console.error('Error in savePaymentAndConfirmBooking:', error);
    return { 
      success: false, 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };
  }
}