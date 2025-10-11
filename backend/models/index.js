import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';

import CustomerModel from './Customer.js';
import TownshipModel from './Township.js';
import PackageModel from './Package.js';
import BookingModel from './Booking.js';
import PaymentModel from './Payment.js';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 21546,
    dialect: process.env.DB_DIALECT || 'mysql',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false  // Aiven uses self-signed certs
      },
      connectTimeout: 60000
    },
    pool: {
      max: 10,
      min: 2,
      acquire: 120000,
      idle: 30000,
      evict: 30000
    },
    logging: false,
  }
);

// Remove the authenticate call - it's handled in db.js
// sequelize.authenticate()
//   .then(() => console.log(' Database connected successfully.'))
//   .catch(err => console.error(' Unable to connect to DB:', err));

const Customer = CustomerModel(sequelize, DataTypes);
const Township = TownshipModel(sequelize, DataTypes);
const Package = PackageModel(sequelize, DataTypes);
const Booking = BookingModel(sequelize, DataTypes);
const Payment = PaymentModel(sequelize, DataTypes);

Customer.hasMany(Booking, { foreignKey: 'customerId' });
Booking.belongsTo(Customer, { foreignKey: 'customerId' });

Township.hasMany(Booking, { foreignKey: 'townId' });
Booking.belongsTo(Township, { foreignKey: 'townId' });

Package.hasMany(Booking, { foreignKey: 'packageId' });
Booking.belongsTo(Package, { foreignKey: 'packageId' });

Booking.hasMany(Payment, { foreignKey: 'bookingId' });
Payment.belongsTo(Booking, { foreignKey: 'bookingId' });

export default {
  sequelize,
  Customer,
  Township,
  Package,
  Booking,
  Payment,
};