// Updated checkoutSession.js
import express from 'express';
import stripe from '../config/stripe.js';
import nodemailer from 'nodemailer';
import models from '../models/index.js';
import { savePaymentAndConfirmBooking } from '../controllers/paymentController.js';

const router = express.Router();

// Configure nodemailer (keep your existing config)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Updated confirm payment route to work with new booking system
router.post('/confirm-payment', async (req, res) => {
  const { session_id } = req.body;

  if (!session_id) {
    return res.status(400).json({ error: 'Session ID required' });
  }

  try {
    console.log(`Confirming payment for session: ${session_id}`);

    // Use the updated payment controller
    const result = await savePaymentAndConfirmBooking(session_id);

    if (!result.success) {
      return res.status(500).json({ 
        error: result.error,
        details: result.details
      });
    }

    const { payment, booking } = result;

    // Get session details for email
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['line_items.data.price.product'],
    });

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Payment not completed in Stripe' });
    }

    // Extract email details
    const customerEmail = booking.Customer?.email || session.customer_details?.email;
    const customerName = booking.Customer?.name || session.customer_details?.name || 'Valued Customer';
    const packageName = booking.Package?.packageName || 'Tour Package';
    const bookingRef = booking.bookingRef;
    const numberOfPeople = booking.numberOfPeople;
    const totalAmount = payment.amount;

    // Send confirmation email
    if (customerEmail) {
      try {
        await transporter.sendMail({
          from: `"Cape Culture Tours" <${process.env.EMAIL_USER}>`,
          to: customerEmail,
          subject: `Booking Confirmed - ${bookingRef}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #091d35;">🎉 Booking Confirmation</h2>
              <p>Dear ${customerName},</p>
              <p>Thank you for your booking! Your payment has been successfully processed.</p>
              
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #091d35; margin-top: 0;">Booking Details:</h3>
                <p><strong>Booking Reference:</strong> ${bookingRef}</p>
                <p><strong>Package:</strong> ${packageName}</p>
                <p><strong>Number of People:</strong> ${numberOfPeople}</p>
                <p><strong>Total Paid:</strong> R${totalAmount.toFixed(2)}</p>
                <p><strong>Status:</strong> <span style="color: #059669; font-weight: bold;">CONFIRMED</span></p>
              </div>

              <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h4 style="color: #92400e; margin-top: 0;">📋 Important Information:</h4>
                <ul style="color: #92400e; margin: 0;">
                  <li>Please bring valid ID (passport or driving license)</li>
                  <li>Tour starts at 11:00 AM sharp</li>
                  <li>Meeting point details will be sent 24 hours before your tour</li>
                </ul>
              </div>

              <p>If you have any questions, please don't hesitate to contact us.</p>
              <p>We look forward to showing you the beautiful townships of Cape Town!</p>
              
              <hr style="margin: 30px 0;">
              <p style="color: #64748b; font-size: 12px;">
                Cape Culture Tours<br>
                Official emails only: @caperoutetours.co.za
              </p>
            </div>
          `,
        });
        console.log(`📧 Confirmation email sent to: ${customerEmail}`);
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        // Don't fail the entire request if email fails
      }
    }

    res.json({ 
      success: true,
      bookingRef: bookingRef,
      paymentId: payment.paymentId,
      status: 'confirmed',
      message: 'Payment confirmed and booking updated'
    });

  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to confirm payment',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// New route to get payment status by booking reference
router.get('/payment-status/:bookingRef', async (req, res) => {
  try {
    const { bookingRef } = req.params;

    const booking = await models.Booking.findOne({
      where: { bookingRef: bookingRef.toUpperCase() },
      include: [
        {
          model: models.Payment,
          attributes: ['paymentId', 'amount', 'currency', 'status', 'paymentDate']
        },
        {
          model: models.Package,
          attributes: ['packageName']
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
        status: booking.status,
        totalPrice: booking.totalPrice,
        packageName: booking.Package?.packageName,
        payments: booking.Payments || []
      }
    });

  } catch (error) {
    console.error('Error getting payment status:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to get payment status'
    });
  }
});

export default router;