// backend/controllers/messageController.js
import ContactMessage from '../models/ContactMessage.js';
import sendEmail from '../utils/sendEmail.js';

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
      
      if (!email || !reply) {
        return res.status(400).json({ success: false, message: 'Email and reply message are required' });
      }

      // Compose email HTML
      const html = `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:0 auto;">
          <h3 style="color:#091d35;">Reply from Cape Route Tours</h3>
          <p>Hi ${name || 'there'},</p>
          <div style="background:#f8fafc; padding:15px; border-radius:6px; margin:10px 0;">
            ${reply.replace(/\n/g, '<br/>')}
          </div>
          <p>Best regards,<br/>Cape Route Tours</p>
          <hr style="margin-top:15px;"/>
          <p style="font-size:12px;color:#64748b;">If you did not request this response, please ignore this email.</p>
        </div>
      `;

      try {
        await sendEmail(email, `Re: Your inquiry to Cape Route Tours`, html);
        console.log(`📧 Reply sent to ${email}`);
      } catch (err) {
        console.error('Failed to send reply email:', err);
        // continue to update status even if email send fails
      }

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