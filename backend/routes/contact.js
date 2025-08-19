import express from 'express';
import { submitMessage, getAllMessages } from '../controllers/contact.js';

const router = express.Router();

// Customer submits a message
router.post('/messages', submitMessage);

// Admin gets all messages
router.get('/messages', getAllMessages);

export default router;