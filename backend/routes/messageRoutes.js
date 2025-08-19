// backend/routes/messageRoutes.js
import express from 'express';
import MessageController from '../controllers/messageController.js';

const router = express.Router();

export default (dbConfig) => {
  const messageController = new MessageController(dbConfig);

  // Public routes
  router.post('/', messageController.createMessage.bind(messageController));

  // Admin routes
  router.get('/', messageController.getAllMessages.bind(messageController));
  router.patch('/:id/status', messageController.updateMessageStatus.bind(messageController));
  router.post('/:id/reply', messageController.sendReply.bind(messageController));
  router.delete('/:id', messageController.deleteMessage.bind(messageController));

  return router;
};