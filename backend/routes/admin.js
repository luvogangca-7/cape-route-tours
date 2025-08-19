import express from 'express';
import { replyToMessage } from '../controllers/admin.js';

const router = express.Router();

// Admin replies to a message
router.post('/messages/:id/reply', replyToMessage);

export default router;