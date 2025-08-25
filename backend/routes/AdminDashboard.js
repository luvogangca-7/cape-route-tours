import express from 'express';
import {pool} from '../config/db.js';

const router = express.Router();

// GET dashboard summary data (Total Clients, Total Revenue)
router.get('/summary', async (req, res, next) => {
  try {
    // Total Clients (Count of unique customer emails)
    const [clientResult] = await pool.query(`
      SELECT COUNT(DISTINCT c.email) as totalClients
      FROM bookings b
      JOIN customers c ON b.customerId = c.customerId
    `);

    // Total Revenue (calculated from bookings and packages)
    const [revenueResult] = await pool.query(`
      SELECT SUM(
        CASE
          WHEN b.packageId THEN p.price * 4
          ELSE p.price * b.numberOfPeople
        END
      ) as totalRevenue
      FROM bookings b
      JOIN packages p ON b.packageId = p.packageId
    `);

    res.json({
      totalClients: clientResult[0].totalClients || 0,
      totalRevenue: revenueResult[0].totalRevenue || 0,
    });
  } catch (error) {
    console.error('Dashboard summary error:', error);
    next(error);
  }
});

// GET total tickets sold per township
router.get('/tickets-by-township', async (req, res, next) => {
  try {
    const [ticketsByTownship] = await pool.query(`
      SELECT
        t.townName as township,
        SUM(b.numberOfPeople) as ticketsSold
      FROM bookings b
      JOIN township t ON b.townId = t.townId
      GROUP BY t.townId, t.townName
      ORDER BY ticketsSold DESC
    `);
    res.json(ticketsByTownship);
  } catch (error) {
    console.error('Tickets by township error:', error);
    next(error);
  }
});

// GET sales data by township (Total Bookings, Total Tickets, Total Value)
router.get('/sales-by-township', async (req, res, next) => {
  try {
    const [salesByTownship] = await pool.query(`
      SELECT
        t.townName as township,
        COUNT(DISTINCT b.bookingId) as totalBookings,
        SUM(b.numberOfPeople) as totalTickets,
        SUM(
          CASE
            WHEN b.packageId THEN p.price * 4
            ELSE p.price * b.numberOfPeople
          END
        ) as totalValue
      FROM bookings b
      JOIN township t ON b.townId = t.townId
      JOIN packages p ON b.packageId = p.packageId
      GROUP BY t.townId, t.townName
      ORDER BY totalValue DESC
    `);
    res.json(salesByTownship);
  } catch (error) {
    console.error('Sales by township error:', error);
    next(error);
  }
});

// GET sales data for a specific package
router.get('/package/:packageId', async (req, res, next) => {
  const { packageId } = req.params;
  try {
    const [packageResult] = await pool.query(`
      SELECT *
      FROM packages
      WHERE packageId = ?
    `, [packageId]);

    if (packageResult.length === 0) {
      return res.status(404).json({ error: 'Package not found' });
    }

    // Total sold and revenue for this package
    const [statsResult] = await pool.query(`
      SELECT
        COUNT(b.bookingId) as totalSold,
        SUM(
          CASE
            WHEN b.packageId THEN p.price * 4
            ELSE p.price * b.numberOfPeople
          END
        ) as totalRevenue,
        SUM(b.numberOfPeople) as totalTickets
      FROM bookings b
      JOIN packages p ON b.packageId = p.packageId
      WHERE p.packageId = ?
    `, [packageId]);

    res.json({
      package: packageResult[0],
      stats: statsResult[0],
    });
  } catch (error) {
    console.error('Package stats error:', error);
    next(error);
  }
});

export default router;