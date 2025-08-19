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
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false,
  }
);

sequelize.authenticate()
  .then(() => console.log(' Database connected successfully.'))
  .catch(err => console.error(' Unable to connect to DB:', err));

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
