// config/database.js - Combined database configuration
import { Sequelize } from 'sequelize';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Shared database configuration object
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'umvubo-7',
  database: process.env.DB_NAME || 'crt_db',
  port: process.env.DB_PORT || 21546,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // SSL configuration for Aiven
  ssl: {
    rejectUnauthorized: false
  }
};

// Sequelize instance (for your team's Sequelize-based routes)
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 21546,
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false  // Aiven uses self-signed certs
      },
      connectTimeout: 60000
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 10000
    },
    logging: false  // Set to console.log if you want to see SQL queries
  }
);

// MySQL2 pool (for your MySQL2-based routes)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 21546,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // SSL configuration for Aiven - THIS WAS MISSING!
  ssl: {
    rejectUnauthorized: false
  },
  connectTimeout: 60000
});

// Function to test both database connections
const initializeDatabase = async () => {
  try {
    console.log('🔄 Testing database connections...');
    
    // Test Sequelize connection
    await sequelize.authenticate();
    console.log('✅ Sequelize connection established');
    
    // Test MySQL2 pool connection
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    console.log('✅ MySQL2 pool connection established');
    
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};

export { sequelize, pool, dbConfig, initializeDatabase };