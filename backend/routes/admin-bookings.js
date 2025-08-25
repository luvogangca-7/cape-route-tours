// file path: backend/routes/admin-bookings.js
import express from 'express';
import models from '../models/index.js';
import { Op } from 'sequelize';

const router = express.Router();

// GET all bookings with optional filters
const getAllBookings = async (req, res, next) => {
    try {
        console.log('Fetching all bookings...');
        
        const bookings = await models.Booking.findAll({
            include: [
                {
                    model: models.Customer,
                    attributes: ['name', 'email', 'cell'],
                    required: false
                },
                {
                    model: models.Package,
                    attributes: ['packageName', 'price'], // REMOVED 'duration' from here
                    required: false
                },
                {
                    model: models.Township,
                    attributes: ['townName'],
                    required: false
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        
        // Format response
        const formattedBookings = bookings.map(booking => {
            const bookingData = booking.toJSON();
            
            return {
                bookingId: bookingData.bookingId,
                bookingRef: bookingData.bookingRef,
                customerName: bookingData.Customer?.name || 'N/A',
                customerEmail: bookingData.Customer?.email || 'N/A',
                customerPhone: bookingData.Customer?.cell || 'N/A',
                townName: bookingData.Township?.townName || getTownshipName(bookingData.bookingDetails),
                packageName: bookingData.Package?.packageName || 'N/A',
                numberOfPeople: bookingData.numberOfPeople,
                totalPrice: bookingData.totalPrice,
                status: bookingData.status,
                createdAt: bookingData.createdAt,
                updatedAt: bookingData.updatedAt,
                specialRequests: bookingData.specialRequests,
                cancellationReason: bookingData.cancellationReason,
                cancelledAt: bookingData.cancelledAt,
                bookingDetails: bookingData.bookingDetails
            };
        });
        
        console.log(`Successfully fetched ${formattedBookings.length} bookings`);
        res.json(formattedBookings);
        
    } catch (err) {
        console.error('Error fetching bookings:', err);
        console.error('Error stack:', err.stack);
        res.status(500).json({ error: 'Failed to fetch bookings', details: err.message });
    }
};

// Helper function to extract township name from booking details
function getTownshipName(bookingDetails) {
    if (!bookingDetails) return 'N/A';
    
    if (bookingDetails.townships && bookingDetails.townships.length > 0) {
        return bookingDetails.townships.join(', ');
    }
    
    if (bookingDetails.bookingType === 'full') {
        return 'Full Cape Culture (All Townships)';
    }
    
    return 'N/A';
}

// UPDATE booking status
const updateBookingStatus = async (req, res, next) => {
    try {
        const { bookingId } = req.params;
        const { status, cancellationReason } = req.body;
        
        console.log(`Updating booking ${bookingId} status to:`, status);
        
        const booking = await models.Booking.findByPk(bookingId);
        
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        
        const updateData = { status };
        
        // If cancelling, add cancellation details
        if (status === 'cancelled') {
            updateData.cancellationReason = cancellationReason || null;
            updateData.cancelledAt = new Date();
        }
        
        await booking.update(updateData);
        
        res.json({ message: 'Booking status updated successfully' });
    } catch (err) {
        console.error('Error updating booking status:', err);
        res.status(500).json({ error: 'Failed to update booking status', details: err.message });
    }
};

// DELETE booking (soft delete by setting status to cancelled)
const deleteBooking = async (req, res, next) => {
    try {
        const { bookingId } = req.params;
        const { reason } = req.body;
        
        console.log(`Cancelling booking ${bookingId} with reason:`, reason);
        
        const booking = await models.Booking.findByPk(bookingId);
        
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        
        await booking.update({
            status: 'cancelled',
            cancellationReason: reason || 'Cancelled by admin',
            cancelledAt: new Date()
        });
        
        console.log(`Booking ${bookingId} cancelled successfully`);
        res.json({ message: 'Booking cancelled successfully' });
        
    } catch (err) {
        console.error('Error cancelling booking:', err);
        res.status(500).json({ error: 'Failed to cancel booking', details: err.message });
    }
};

// GET booking statistics
const getBookingStats = async (req, res, next) => {
    try {
        // Get total bookings count
        const totalBookings = await models.Booking.count();
        
        // Get bookings by status
        const statusStats = await models.Booking.findAll({
            attributes: [
                'status',
                [models.sequelize.fn('COUNT', '*'), 'count']
            ],
            group: ['status'],
            raw: true
        });
        
        // Get total revenue from paid bookings
        const totalRevenue = await models.Booking.sum('totalPrice', {
            where: { status: 'paid' }
        });
        
        res.json({
            statusStats,
            totalBookings,
            totalRevenue: totalRevenue || 0
        });
        
    } catch (err) {
        console.error('Error fetching booking stats:', err);
        res.status(500).json({ error: 'Failed to fetch statistics', details: err.message });
    }
};

// GET filter options
const getFilterOptions = async (req, res, next) => {
    try {
        const packages = await models.Package.findAll({
            attributes: ['packageId', 'packageName'],
            order: [['packageName', 'ASC']]
        });
        
        const townships = await models.Township.findAll({
            attributes: ['townId', 'townName'],
            order: [['townName', 'ASC']]
        });
        
        res.json({
            townships: townships.map(t => ({
                townId: t.townId,
                townName: t.townName
            })),
            packages: packages.map(p => ({
                packageId: p.packageId,
                packageName: p.packageName
            })),
            statuses: ['pending', 'confirmed', 'paid', 'cancelled']
        });
        
    } catch (err) {
        console.error('Error fetching filter options:', err);
        res.status(500).json({ error: 'Failed to fetch filter options', details: err.message });
    }
};

// Add these to your admin-bookings.js

// DELETE booking permanently
router.delete('/:bookingId/permanent', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { confirmation } = req.body;
    
    if (confirmation !== 'DELETE') {
      return res.status(400).json({ error: 'Confirmation required' });
    }
    
    const booking = await models.Booking.findByPk(bookingId);
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    if (booking.status !== 'cancelled') {
      return res.status(400).json({ error: 'Only cancelled bookings can be permanently deleted' });
    }
    
    await booking.destroy();
    res.json({ message: 'Booking permanently deleted' });
    
  } catch (err) {
    console.error('Error deleting booking:', err);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

// DELETE all cancelled bookings
router.delete('/cancelled/all', async (req, res) => {
  try {
    const { confirmation } = req.body;
    
    if (confirmation !== 'DELETE ALL') {
      return res.status(400).json({ error: 'Confirmation required' });
    }
    
    const result = await models.Booking.destroy({
      where: { status: 'cancelled' }
    });
    
    res.json({ message: `Deleted ${result} cancelled bookings` });
    
  } catch (err) {
    console.error('Error deleting cancelled bookings:', err);
    res.status(500).json({ error: 'Failed to delete cancelled bookings' });
  }
});



// Define routes
router.get('/', getAllBookings);
router.put('/:bookingId/status', updateBookingStatus);
router.delete('/:bookingId', deleteBooking);
router.get('/stats', getBookingStats);
router.get('/filter-options', getFilterOptions);

export default router;