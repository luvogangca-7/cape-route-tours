// file path: backend/ routes/ townships.js
import express from 'express';
import {pool} from '../config/db.js';

const router = express.Router();

// GET specific township
export const getBoKaapBookings = async (req, res) => {
    try {
        const [township] = await pool.query(
            `SELECT b.bookingId, c.name AS customerName, t.townName, p.packageName,
                b.numberOfPeople, b.totalPrice, b.status, b.createdAt
                FROM bookings b
                LEFT JOIN customers c ON b.customerId = c.customerId
                LEFT JOIN township t ON b.townId = t.townId
                LEFT JOIN packages p ON b.packageId = p.packageId WHERE b.townId = 1`
        );
        res.json(township);
    } catch (err) {
        next(err);
    }
}

export const getKhayelitshaBookings = async (req, res) => {
    try {
        const [township] = await pool.query(
            `SELECT b.bookingId, c.name AS customerName, t.townName, p.packageName,
                b.numberOfPeople, b.totalPrice, b.status, b.createdAt
                FROM bookings b
                LEFT JOIN customers c ON b.customerId = c.customerId
                LEFT JOIN township t ON b.townId = t.townId
                LEFT JOIN packages p ON b.packageId = p.packageId WHERE b.townId = 2`
        );
        res.json(township);
    } catch (err) {
        next(err);
    }
}

export const getMitchellsPlainBookings = async (req, res) => {
    try {
        const [township] = await pool.query(
            `SELECT b.bookingId, c.name AS customerName, t.townName, p.packageName,
                b.numberOfPeople, b.totalPrice, b.status, b.createdAt
                FROM bookings b
                LEFT JOIN customers c ON b.customerId = c.customerId
                LEFT JOIN township t ON b.townId = t.townId
                LEFT JOIN packages p ON b.packageId = p.packageId WHERE b.townId = 3`
        );
        res.json(township);
    } catch (err) {
        next(err);
    }
}

export const getLangaBookings = async (req, res) => {
    try {
        const [township] = await pool.query(
            `SELECT b.bookingId, c.name AS customerName, t.townName, p.packageName,
                b.numberOfPeople, b.totalPrice, b.status, b.createdAt
                FROM bookings b
                LEFT JOIN customers c ON b.customerId = c.customerId
                LEFT JOIN township t ON b.townId = t.townId
                LEFT JOIN packages p ON b.packageId = p.packageId WHERE b.townId = 4`
        );
        res.json(township);
    } catch (err) {
        next(err);
    }
}
