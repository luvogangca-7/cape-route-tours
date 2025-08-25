import express from 'express';
import {pool} from '../config/db.js';

const router = express.Router();

// GET income progress data 

router.get('income', async (req,res) => {
    try {
        // Calculating total income from the bookings table
        const [rows] = await pool.query('SELECT SUM(totalPrice) AS totalIncome FROM bookings');

        const targetIncome = 200000; //target income amount 
        const percentage = Math.min ((rows[0].totalIncome  / targetIncome) *100, 100); // Calculate percentage of target income achieved

        res.json({
            percentage: Math.round(percentage)
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
})

export default router;