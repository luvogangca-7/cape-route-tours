import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

/**
 * Send an email with HTML and optional attachments
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML content
 * @param {string} [fromName='Cape Route Tours'] - Sender display name
 * @param {Array} [attachments=[]] - Array of attachment objects
 */
export default async function sendEmail(to, subject, html, fromName = 'Cape Route Tours', attachments = []) {
  try {
    const mailOptions = {
      from: `"${fromName}" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      text: html.replace(/<[^>]*>?/gm, ''), // plain text fallback
      html,
      attachments
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error);
    throw new Error('Email sending failed');
  }
}

