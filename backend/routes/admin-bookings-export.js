// file path: backend/routes/admin-bookings-export.js
import express from 'express';
import models from '../models/index.js';
import { Op } from 'sequelize';

const router = express.Router();

// Helper function to extract township name from booking details
function getTownshipName(bookingDetails) {
    if (!bookingDetails) return '';
    
    if (bookingDetails.townships && bookingDetails.townships.length > 0) {
        return bookingDetails.townships.join(';');
    }
    
    if (bookingDetails.bookingType === 'full') {
        return 'Full Cape Culture (All Townships)';
    }
    
    return '';
}

// CSV Export functionality
const exportBookings = async (req, res, next) => {
    try {
        console.log('Exporting bookings to CSV...');
        
        const bookings = await models.Booking.findAll({
            include: [
                {
                    model: models.Customer,
                    attributes: ['name', 'email', 'cell'],
                    required: false
                },
                {
                    model: models.Package,
                    attributes: ['packageName', 'price'],
                    required: false
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        
        // Generate CSV content
        const csvHeaders = [
            'Booking Reference',
            'Booking Date',
            'Customer Name',
            'Customer Email', 
            'Customer Phone',
            'Package',
            'Townships/Destinations',
            'Number of People',
            'Total Price (R)',
            'Status',
            'Special Requests',
            'Cancellation Reason',
            'Cancelled Date',
            'Tour Dates'
        ];
        
        let csvContent = csvHeaders.join(',') + '\n';
        
        bookings.forEach(booking => {
            const bookingData = booking.toJSON();
            const townships = getTownshipName(bookingData.bookingDetails);
            const tourDates = bookingData.bookingDetails?.dates ? 
                bookingData.bookingDetails.dates.join(';') : '';
            
            const row = [
                `"${bookingData.bookingRef || ''}"`,
                `"${bookingData.createdAt ? new Date(bookingData.createdAt).toISOString().split('T')[0] : ''}"`,
                `"${bookingData.Customer?.name || ''}"`,
                `"${bookingData.Customer?.email || ''}"`,
                `"${bookingData.Customer?.cell || ''}"`,
                `"${bookingData.Package?.packageName || ''}"`,
                `"${townships}"`,
                bookingData.numberOfPeople || 0,
                bookingData.totalPrice || 0,
                `"${bookingData.status || ''}"`,
                `"${bookingData.specialRequests || ''}"`,
                `"${bookingData.cancellationReason || ''}"`,
                `"${bookingData.cancelledAt ? new Date(bookingData.cancelledAt).toISOString().split('T')[0] : ''}"`,
                `"${tourDates}"`
            ];
            
            csvContent += row.join(',') + '\n';
        });
        
        // Set headers for file download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="bookings-${new Date().toISOString().split('T')[0]}.csv"`);
        
        res.send(csvContent);
        console.log('CSV export completed successfully');
        
    } catch (err) {
        console.error('Error exporting bookings:', err);
        res.status(500).json({ error: 'Failed to export bookings', details: err.message });
    }
};

// Define route
router.get('/', exportBookings);

export default router;