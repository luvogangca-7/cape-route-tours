import stripe from '../config/stripe.js';
import models from '../models/index.js';

export async function savePaymentAndConfirmBooking(sessionId) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session) throw new Error('Stripe session not found');

    // Get payment intent details
    const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);

    // Get bookingId from session metadata
    const bookingId = session.metadata.bookingId;
    if (!bookingId) throw new Error('Booking ID missing in session metadata');

    // Save payment record in DB
    const paymentRecord = await models.Payment.create({
      bookingId: bookingId,
      stripePaymentId: paymentIntent.id,
      amount: paymentIntent.amount_received / 100,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
    });

    // Update booking status to 'paid'
    await models.Booking.update(
      { status: 'paid' },
      { where: { bookingId } }
    );

    // Optionally fetch booking with customer details
    const bookingWithCustomer = await models.Booking.findOne({
      where: { bookingId },
      include: [{ model: models.Customer }],
    });

    return { success: true, payment: paymentRecord, booking: bookingWithCustomer };
  } catch (error) {
    console.error('Error in savePaymentAndConfirmBooking:', error);
    return { success: false, error: error.message };
  }
}
