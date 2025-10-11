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

    // Total Revenue (sum of booking totalPrice)
    const [revenueResult] = await pool.query(`
      SELECT COALESCE(SUM(CAST(b.totalPrice AS DECIMAL(12,2))), 0) as totalRevenue
      FROM bookings b
      WHERE b.status = 'paid'
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
// Handles bookings that either have a townId or a township name inside bookingDetails JSON
router.get('/tickets-by-township', async (req, res, next) => {
  try {
    const [ticketsByTownship] = await pool.query(`
      SELECT
        t.townName as township,
        (
          SELECT COALESCE(SUM(b2.numberOfPeople),0)
          FROM bookings b2
          WHERE (
            b2.townId = t.townId
            OR JSON_SEARCH(b2.bookingDetails, 'one', t.townName) IS NOT NULL
          )
        ) as ticketsSold
      FROM township t
      ORDER BY ticketsSold DESC
    `);
    res.json(ticketsByTownship);
  } catch (error) {
    console.error('Tickets by township error:', error);
    next(error);
  }
});

// GET sales data by township (Total Bookings, Total Tickets, Total Value)
// Uses booking.totalPrice when available and falls back to package pricing if needed
router.get('/sales-by-township', async (req, res, next) => {
  try {
    const [salesByTownship] = await pool.query(`
      SELECT
        t.townName as township,
        (
          SELECT COUNT(*) FROM bookings b2
          WHERE (b2.townId = t.townId OR JSON_SEARCH(b2.bookingDetails, 'one', t.townName) IS NOT NULL)
        ) as totalBookings,
        (
          SELECT COALESCE(SUM(b2.numberOfPeople),0) FROM bookings b2
          WHERE (b2.townId = t.townId OR JSON_SEARCH(b2.bookingDetails, 'one', t.townName) IS NOT NULL)
        ) as totalTickets,
        (
          SELECT COALESCE(SUM(
            CAST(b2.totalPrice AS DECIMAL(12,2)) / GREATEST(JSON_LENGTH(b2.bookingDetails, '$.townships'), 1)
          ),0)
          FROM bookings b2
          WHERE (b2.townId = t.townId OR JSON_SEARCH(b2.bookingDetails, 'one', t.townName) IS NOT NULL)
        ) as totalValue
      FROM township t
      ORDER BY totalValue DESC
    `);
    res.json(salesByTownship);
  } catch (error) {
    console.error('Sales by township error:', error);
    next(error);
  }
});

// GET sales-overview for last 12 months used by frontend chart
router.get('/sales-overview', async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        YEAR(createdAt) as yr,
        MONTH(createdAt) as mo,
        DATE_FORMAT(createdAt, '%b %Y') as label,
        COALESCE(SUM(CAST(totalPrice AS DECIMAL(12,2))),0) as revenue
      FROM bookings
      WHERE status = 'paid'
      GROUP BY YEAR(createdAt), MONTH(createdAt), DATE_FORMAT(createdAt, '%b %Y')
      ORDER BY yr, mo ASC
    `);

    // build last 12 months labels (including months with zero revenue)
    const now = new Date()
    const months = []
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const yr = d.getFullYear()
      const mo = d.getMonth() + 1
      const label = d.toLocaleString('en-US', { month: 'short' }) + ' ' + yr
      months.push({ yr, mo, label })
    }

    // map rows by year-month
    const map = {}
    rows.forEach(r => {
      map[`${r.yr}-${r.mo}`] = Number(r.revenue)
    })

    const labels = months.map(m => m.label)
    const values = months.map(m => map[`${m.yr}-${m.mo}`] || 0)

    res.json({ labels, values })
  } catch (err) {
    console.error('Sales overview error:', err);
    next(err);
  }
});

// GET top packages by bookings and revenue
router.get('/top-packages', async (req, res, next) => {
  try {
    // include bookings that don't have packageId by extracting packageName from bookingDetails
    const [rows] = await pool.query(`
      SELECT x.packageId, x.packageName,
        COUNT(x.bookingId) as bookingsCount,
        COALESCE(SUM(CAST(x.totalPrice AS DECIMAL(12,2))),0) as revenue
      FROM (
        SELECT b.bookingId, b.totalPrice, b.packageId,
          COALESCE(p.packageName, JSON_UNQUOTE(JSON_EXTRACT(b.bookingDetails, '$.packageName'))) as packageName
        FROM bookings b
        LEFT JOIN packages p ON b.packageId = p.packageId
        WHERE b.status = 'paid'
      ) x
      GROUP BY x.packageId, x.packageName
      ORDER BY bookingsCount DESC, revenue DESC
      LIMIT 10
    `);

    const labels = rows.map(r => r.packageName)
    const counts = rows.map(r => Number(r.bookingsCount))
    const revenue = rows.map(r => Number(r.revenue))

    res.json({ labels, counts, revenue })
  } catch (err) {
    console.error('Top packages error:', err)
    next(err)
  }
})

// GET all packages (used by admin frontend PackageList.vue)
router.get('/packages', async (req, res, next) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM packages ORDER BY packageName ASC`);
    res.json(rows);
  } catch (err) {
    console.error('Packages list error:', err);
    next(err);
  }
});

// GET aggregated insights: best month, last 30 days bookings, average booking value
router.get('/insights', async (req, res, next) => {
  try {
    // Best month by revenue
    const [bestMonthRows] = await pool.query(`
      SELECT DATE_FORMAT(createdAt, '%b %Y') as label, COALESCE(SUM(CAST(totalPrice AS DECIMAL(12,2))),0) as revenue
      FROM bookings
      WHERE status = 'paid'
      GROUP BY YEAR(createdAt), MONTH(createdAt), DATE_FORMAT(createdAt, '%b %Y')
      ORDER BY revenue DESC
      LIMIT 1
    `);

    const bestMonth = bestMonthRows[0] || { label: null, revenue: 0 };

    // Last 30 days bookings and revenue
    const [last30Rows] = await pool.query(`
      SELECT COUNT(*) as bookingsCount, COALESCE(SUM(CAST(totalPrice AS DECIMAL(12,2))),0) as revenue
      FROM bookings
      WHERE status = 'paid' AND createdAt >= (NOW() - INTERVAL 30 DAY)
    `);

    const last30 = last30Rows[0] || { bookingsCount: 0, revenue: 0 };

    // Average booking value (paid)
    const [avgRows] = await pool.query(`
      SELECT COALESCE(AVG(CAST(totalPrice AS DECIMAL(12,2))), 0) as avgBookingValue
      FROM bookings
      WHERE status = 'paid'
    `);

    const avgBookingValue = avgRows[0] ? Number(avgRows[0].avgBookingValue) : 0

    res.json({
      bestMonth: { label: bestMonth.label, revenue: Number(bestMonth.revenue) },
      last30: { bookingsCount: Number(last30.bookingsCount), revenue: Number(last30.revenue) },
      avgBookingValue
    })
  } catch (err) {
    console.error('Insights error:', err)
    next(err)
  }
})

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

    // Total sold and revenue for this package (use booking.totalPrice when present)
    const [statsResult] = await pool.query(`
      SELECT
        COUNT(b.bookingId) as totalSold,
        COALESCE(SUM(CAST(b.totalPrice AS DECIMAL(12,2))),0) as totalRevenue,
        COALESCE(SUM(b.numberOfPeople),0) as totalTickets
      FROM bookings b
      WHERE b.packageId = ?
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

// Debug helper: returns sample rows for quick inspection
// GET /api/dashboard/debug
router.get('/debug', async (req, res, next) => {
  try {
    const [bookingsSample] = await pool.query(`SELECT * FROM bookings LIMIT 10`);
    const [packagesSample] = await pool.query(`SELECT * FROM packages LIMIT 10`);
    const [townshipSample] = await pool.query(`SELECT * FROM township LIMIT 10`);
    const [customersSample] = await pool.query(`SELECT * FROM customers LIMIT 10`);

    res.json({
      bookings: bookingsSample,
      packages: packagesSample,
      township: townshipSample,
      customers: customersSample
    });
  } catch (err) {
    console.error('Dashboard debug error:', err);
    next(err);
  }
});

export default router;