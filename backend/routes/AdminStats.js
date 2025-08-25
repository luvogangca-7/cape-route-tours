// file path: backend/routes/stats.js

import express from 'express';
import {pool} from '../config/db.js';
import NodeCache from 'node-cache';

const router = express.Router();
const statsCache = new NodeCache({ stdTTL: 3600 }); // 1 hour caching

/**
 * GET /api/stats/people-per-township
 * Returns count of people per township with date filtering
 * Query params:
 * - startDate: filter from date (YYYY-MM-DD)
 * - endDate: filter to date (YYYY-MM-DD)
 * - limit: limit number of results
 */
router.get('/people-per-township', async (req, res) => {
    try {
        const { startDate, endDate, limit } = req.query;
        const cacheKey = `peopleStats-${startDate || 'all'}-${endDate || 'all'}`;
        
        const cached = statsCache.get(cacheKey);
        if (cached) return res.json(cached);

        let sql = `
            SELECT 
                tw.name AS township, 
                tw.image_url AS township_image,
                SUM(b.tickets) AS total_visitors,
                COUNT(DISTINCT b.booking_id) AS total_bookings,
                ROUND(SUM(b.tickets) / COUNT(DISTINCT b.booking_id), 1) AS avg_group_size
            FROM bookings b
            JOIN tours t ON b.tour_id = t.tour_id
            JOIN tour_townships tt ON t.tour_id = tt.tour_id
            JOIN townships tw ON tt.township_id = tw.township_id
        `;

        const params = [];
        
        // Add date filtering if provided
        if (startDate || endDate) {
            sql += ' WHERE ';
            const conditions = [];
            
            if (startDate) {
                conditions.push('t.start_date >= ?');
                params.push(startDate);
            }
            if (endDate) {
                conditions.push('t.start_date <= ?');
                params.push(endDate);
            }
            
            sql += conditions.join(' AND ');
        }

        sql += ' GROUP BY tw.name ORDER BY total_visitors DESC';
        
        if (limit) {
            sql += ' LIMIT ?';
            params.push(parseInt(limit));
        }

        const [results] = await pool.query(sql, params);
        
        // Format the results
        const formattedResults = results.map(item => ({
            ...item,
            township: formatTownshipName(item.township), // Format township names
            percentage: calculatePercentage(results, item.total_visitors)
        }));

        statsCache.set(cacheKey, formattedResults);
        res.json(formattedResults);
    } catch (err) {
        res.status(500).json({ 
            error: 'Failed to fetch township statistics',
            details: err.message 
        });
    }
});

/**
 * GET /api/stats/booking-trends
 * Returns booking trends over time
 */
router.get('/booking-trends', async (req, res) => {
    try {
        const { period = 'month' } = req.query; // month/week/day
        const cacheKey = `bookingTrends-${period}`;
        
        const cached = statsCache.get(cacheKey);
        if (cached) return res.json(cached);

        let dateFormat, groupBy;
        
        switch (period) {
            case 'year':
                dateFormat = '%Y';
                groupBy = 'YEAR(t.start_date)';
                break;
            case 'month':
                dateFormat = '%Y-%m';
                groupBy = 'YEAR(t.start_date), MONTH(t.start_date)';
                break;
            case 'week':
                dateFormat = '%Y-%u';
                groupBy = 'YEAR(t.start_date), WEEK(t.start_date)';
                break;
            default: // day
                dateFormat = '%Y-%m-%d';
                groupBy = 'DATE(t.start_date)';
        }

        const sql = `
            SELECT 
                DATE_FORMAT(t.start_date, ?) AS period,
                COUNT(b.booking_id) AS bookings_count,
                SUM(b.tickets) AS total_visitors,
                SUM(
                    CASE 
                        WHEN b.family_package THEN p.family_price 
                        ELSE p.price * b.tickets 
                    END
                ) AS total_income
            FROM bookings b
            JOIN tours t ON b.tour_id = t.tour_id
            JOIN packages p ON t.package_id = p.package_id
            GROUP BY ${groupBy}
            ORDER BY period ASC
        `;

        const [results] = await pool.query(sql, [dateFormat]);
        
        // Format the results
        const formattedResults = results.map(item => ({
            ...item,
            total_income: parseFloat(item.total_income || 0),
            formatted_income: new Intl.NumberFormat('en-ZA', {
                style: 'currency',
                currency: 'ZAR'
            }).format(item.total_income || 0)
        }));

        statsCache.set(cacheKey, formattedResults);
        res.json(formattedResults);
    } catch (err) {
        res.status(500).json({ 
            error: 'Failed to fetch booking trends',
            details: err.message 
        });
    }
});



export default router;