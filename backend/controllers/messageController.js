// backend/controllers/messageController.js
import ContactMessage from '../models/ContactMessage.js';

class MessageController {
  constructor(dbConfig) {
    this.contactMessage = new ContactMessage(dbConfig);
  }

  async createMessage(req, res) {
    try {
      const { name, email, phone, subject, message } = req.body;
      const messageId = await this.contactMessage.createMessage({
        name,
        email,
        phone,
        subject,
        message
      });
      res.status(201).json({ success: true, data: { id: messageId } });
    } catch (error) {
      console.error('Error creating message:', error);
      res.status(500).json({ success: false, message: 'Failed to create message' });
    }
  }

  async getAllMessages(req, res) {
    try {
      const messages = await this.contactMessage.getAllMessages();
      res.json({ success: true, data: messages });
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch messages' });
    }
  }

  async updateMessageStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      await this.contactMessage.updateMessageStatus(id, status === 'Resolved' ? 1 : 0);
      res.json({ success: true });
    } catch (error) {
      console.error('Error updating message status:', error);
      res.status(500).json({ success: false, message: 'Failed to update status' });
    }
  }

  async sendReply(req, res) {
    try {
      const { id } = req.params;
      const { reply, email, name, status } = req.body;
      
      // Here you would typically send an email with the reply
      // For now, we'll just log it and update the status
      console.log(`Sending reply to ${email} (${name}): ${reply}`);
      
      await this.contactMessage.updateMessageStatus(id, status === 'Resolved' ? 1 : 0);
      res.json({ success: true });
    } catch (error) {
      console.error('Error sending reply:', error);
      res.status(500).json({ success: false, message: 'Failed to send reply' });
    }
  }

  async deleteMessage(req, res) {
    try {
      const { id } = req.params;
      await this.contactMessage.deleteMessage(id);
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting message:', error);
      res.status(500).json({ success: false, message: 'Failed to delete message' });
    }
  }
}

export default MessageController;