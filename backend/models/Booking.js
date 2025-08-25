// Updated Booking.js model - Remove tourDate column
export default (sequelize, DataTypes) => {
  return sequelize.define('Booking', {
    bookingId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    bookingRef: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      index: true
    },
    // REMOVED: tourDate column - now stored in bookingDetails
    customerId: DataTypes.INTEGER,
    townId: DataTypes.INTEGER, // Keep for simple bookings if needed
    packageId: DataTypes.INTEGER,
    numberOfPeople: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    totalPrice: DataTypes.DECIMAL(10, 2),
    status: {
      type: DataTypes.ENUM('pending','confirmed','paid','cancelled'),
      defaultValue: 'pending',
    },
    // Store booking details as JSON for complex packages
    bookingDetails: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Stores complex booking data like multiple townships, dates, etc.'
    },
    // Store Stripe session ID for payment tracking
    stripeSessionId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    // New fields for booking management
    specialRequests: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cancellationReason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cancelledAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    timestamps: true,
    tableName: 'bookings',
  });
};