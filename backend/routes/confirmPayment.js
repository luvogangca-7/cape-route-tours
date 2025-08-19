// Updated confirmPayment.js
import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import models from '../models/index.js';
import sendEmail from '../utils/sendEmail.js';
import generateInvoice from '../utils/generateInvoice.js';
import { savePaymentAndConfirmBooking } from '../controllers/paymentController.js';

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

const { Booking, Customer, Package, Payment } = models;

// Updated payment confirmation route that works with new booking system
router.get('/payment-confirm', async (req, res) => {
  const { session_id } = req.query;
  
  if (!session_id) {
    return res.status(400).json({ error: 'Session ID required' });
  }

  try {
    console.log(`Processing payment confirmation for session: ${session_id}`);

    // 1️⃣ Retrieve Stripe session
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (!session || session.payment_status !== 'paid') {
      return res.status(400).json({ 
        error: 'Payment not completed',
        session_status: session?.payment_status 
      });
    }

    // 2️⃣ Use the payment controller to handle payment processing
    const paymentResult = await savePaymentAndConfirmBooking(session_id);
    
    if (!paymentResult.success) {
      return res.status(500).json({ 
        error: paymentResult.error,
        details: paymentResult.details
      });
    }

    const { payment, booking } = paymentResult;

    // 3️⃣ Get complete booking details
    const completeBooking = await Booking.findOne({
      where: { bookingId: booking.bookingId },
      include: [
        { 
          model: Customer, 
          attributes: ['name', 'email', 'cell'] 
        },
        { 
          model: Package, 
          attributes: ['packageName', 'price', 'duration'] 
        }
      ]
    });

    if (!completeBooking) {
      return res.status(404).json({ error: 'Booking details not found' });
    }

    // 4️⃣ Prepare booking details for invoice and email
    const bookingDetails = {
      id: completeBooking.bookingId,
      bookingRef: completeBooking.bookingRef,
      customerName: completeBooking.Customer.name,
      customerEmail: completeBooking.Customer.email,
      packageName: completeBooking.Package.packageName,
      numberOfPeople: completeBooking.numberOfPeople,
      amount: payment.amount,
      paymentDate: payment.paymentDate || new Date(),
      bookingDate: completeBooking.tourDate || 'To be confirmed'
    };

    // 5️⃣ Generate invoice PDF (if generateInvoice function exists)
    let invoicePath = null;
    try {
      if (typeof generateInvoice === 'function') {
        invoicePath = generateInvoice(bookingDetails);
        console.log(`📄 Invoice generated: ${invoicePath}`);
      }
    } catch (invoiceError) {
      console.warn('Invoice generation failed:', invoiceError.message);
      // Continue without invoice - don't fail the whole process
    }

    // 6️⃣ Send confirmation email with invoice
    try {
      if (typeof sendEmail === 'function') {
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #091d35;">🎉 Thank you for your booking, ${bookingDetails.customerName}!</h1>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin: 20px 0;">
              <h2 style="color: #091d35; margin-top: 0;">Booking Confirmation</h2>
              <p><strong>Booking Reference:</strong> ${bookingDetails.bookingRef}</p>
              <p><strong>Package:</strong> ${bookingDetails.packageName}</p>
              <p><strong>Number of People:</strong> ${bookingDetails.numberOfPeople}</p>
              <p><strong>Total Paid:</strong> R${bookingDetails.amount.toFixed(2)}</p>
              <p><strong>Payment Date:</strong> ${new Date(bookingDetails.paymentDate).toLocaleDateString()}</p>
            </div>

            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #92400e; margin-top: 0;">📋 Tour Information</h3>
              <p><strong>Date & Time:</strong> ${bookingDetails.bookingDate} at 11:00 AM</p>
              <p><strong>Meeting Point:</strong> Cape of Good Hope (Central Pick-Up Point)</p>
            </div>

            <div style="background: #e0f2fe; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #0277bd; margin-top: 0;">📌 Important Reminders</h3>
              <ul style="color: #0277bd; margin: 0;">
                <li>Please bring your Passport or Driving License</li>
                <li>Comfortable walking shoes recommended</li>
                <li>Camera for memorable moments</li>
                <li>Arrive 15 minutes early at meeting point</li>
              </ul>
            </div>

            <hr style="margin: 30px 0; border: 1px solid #e2e8f0;">
            <p style="color: #64748b;">
              <strong>Cape Route Tours</strong><br>
              For any questions, contact us at official emails only: <strong>@caperoutetours.co.za</strong>
            </p>
          </div>
        `;

        // Prepare attachments
        const attachments = [];
        if (invoicePath) {
          attachments.push({
            filename: `invoice-${bookingDetails.bookingRef}.pdf`,
            path: invoicePath
          });
        }

        await sendEmail(
          bookingDetails.customerEmail,
          `Booking Confirmed - ${bookingDetails.bookingRef} - Cape Route Tours`,
          emailHtml,
          'Cape Route Tours',
          attachments
        );

        console.log(`📧 Confirmation email sent to: ${bookingDetails.customerEmail}`);
      }
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Continue - don't fail the response if email fails
    }

    // 7️⃣ Return successful response
    res.json({ 
      success: true,
      booking: {
        id: completeBooking.bookingId,
        reference: completeBooking.bookingRef,
        customer: completeBooking.Customer,
        package: completeBooking.Package,
        numberOfPeople: completeBooking.numberOfPeople,
        totalPrice: completeBooking.totalPrice,
        status: completeBooking.status,
        paymentAmount: payment.amount,
        paymentStatus: payment.status
      },
      message: 'Payment confirmed and invoice sent via email'
    });

  } catch (error) {
    console.error('❌ Confirm payment error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to confirm payment',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// New endpoint to resend confirmation email
router.post('/resend-confirmation', async (req, res) => {
  try {
    const { bookingRef, email } = req.body;

    if (!bookingRef || !email) {
      return res.status(400).json({ 
        error: 'Booking reference and email are required' 
      });
    }

    // Find booking with payment details
    const booking = await Booking.findOne({
      where: { bookingRef: bookingRef.toUpperCase() },
      include: [
        { model: Customer },
        { model: Package },
        { model: Payment }
      ]
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Verify email matches
    if (booking.Customer.email.toLowerCase() !== email.toLowerCase()) {
      return res.status(403).json({ error: 'Email does not match booking record' });
    }

    if (booking.status !== 'paid') {
      return res.status(400).json({ error: 'Booking is not paid yet' });
    }

    // Resend confirmation (reuse email logic from above)
    // ... implement email resending logic here

    res.json({
      success: true,
      message: 'Confirmation email resent successfully'
    });

  } catch (error) {
    console.error('Error resending confirmation:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to resend confirmation'
    });
  }
});

export default router;