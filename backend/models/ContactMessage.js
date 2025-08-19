// backend/model/ContactMessage.js
import mysql from 'mysql2/promise';

class ContactMessage {
  constructor(dbConfig) {
    this.pool = mysql.createPool(dbConfig);
  }

  async createMessage({ name, email, phone, subject, message }) {
    const [result] = await this.pool.execute(
      'INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone, subject, message]
    );
    return result.insertId;
  }

  async getAllMessages() {
    const [rows] = await this.pool.query(
      'SELECT * FROM contact_messages ORDER BY created_at DESC'
    );
    return rows;
  }

  async getMessageById(id) {
    const [rows] = await this.pool.execute(
      'SELECT * FROM contact_messages WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  async updateMessageStatus(id, is_read) {
    await this.pool.execute(
      'UPDATE contact_messages SET is_read = ? WHERE id = ?',
      [is_read, id]
    );
  }

  async deleteMessage(id) {
    await this.pool.execute(
      'DELETE FROM contact_messages WHERE id = ?',
      [id]
    );
  }
}

export default ContactMessage;