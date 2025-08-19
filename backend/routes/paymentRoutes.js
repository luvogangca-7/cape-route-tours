import express from 'express';
import { savePaymentAndConfirmBooking } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/payment-confirm', async (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId) return res.status(400).json({ error: 'Session ID required' });

  const result = await savePaymentAndConfirmBooking(sessionId);
  if (result.success) {
    return res.json({ message: 'Payment saved and booking confirmed', payment: result.payment, booking: result.booking });
  } else {
    return res.status(500).json({ error: result.error });
  }
});

export default router;
