import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export default function generateInvoice({ id, customerName, customerEmail, packageName, amount }) {
  const invoicesDir = path.join('./invoices');
  if (!fs.existsSync(invoicesDir)) fs.mkdirSync(invoicesDir, { recursive: true });

  const filePath = path.join(invoicesDir, `invoice-${id}.pdf`);
  const doc = new PDFDocument({ size: 'A4', margin: 50 });

  doc.pipe(fs.createWriteStream(filePath));

  // HEADER
  doc
    .fillColor('#333')
    .fontSize(24)
    .text('Cape Route Tours', { align: 'center', underline: true })
    .moveDown(0.5);

  doc
    .fontSize(16)
    .text('INVOICE', { align: 'center', bold: true })
    .moveDown(1);

  // Customer Info
  doc
    .fontSize(12)
    .fillColor('#555')
    .text(`Invoice #: ${id}`, { continued: true })
    .text(`   Date: ${new Date().toLocaleDateString()}`, { align: 'right' })
    .moveDown(0.5);

  doc
    .text(`Customer Name: ${customerName}`)
    .text(`Customer Email: ${customerEmail}`)
    .moveDown(1);

  // Package Info
  doc
    .fontSize(14)
    .fillColor('#000')
    .text('Booking Details', { underline: true })
    .moveDown(0.5);

  doc
    .fontSize(12)
    .text(`Package: ${packageName}`)
    .text(`Amount Paid: R${amount.toFixed(2)}`)
    .text(`Date: ${new Date().toLocaleDateString()}`)
    .moveDown(1);

  // Separator line
  doc
    .moveTo(50, doc.y)
    .lineTo(545, doc.y)
    .strokeColor('#888')
    .stroke()
    .moveDown(1);

  // Footer
  doc
    .fontSize(12)
    .fillColor('#333')
    .text('Thank you for booking with Cape Route Tours!', { align: 'center' })
    .moveDown(0.5);

  doc
    .fontSize(10)
    .fillColor('#555')
    .text('Please bring your Passport or Driving Licence.', { align: 'center' })
    .text('Official emails only: @caperoutetours.co.za', { align: 'center' })
    .moveDown(1);

  doc.end();
  return filePath;
}
