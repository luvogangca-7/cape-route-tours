// Updated Payment.js model
export default (sequelize, DataTypes) => {
  return sequelize.define('Payment', {
    paymentId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    bookingId: { 
      type: DataTypes.INTEGER, 
      allowNull: false,
      references: {
        model: 'bookings',
        key: 'bookingId'
      }
    },
    stripePaymentId: { 
      type: DataTypes.STRING(255), 
      allowNull: true,
      unique: true // Prevent duplicate payment records
    },
    stripeSessionId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true
    },
    amount: { 
      type: DataTypes.DECIMAL(10, 2), 
      allowNull: false 
    },
    currency: { 
      type: DataTypes.STRING(10), 
      defaultValue: 'zar' 
    },
    status: { 
      type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
      defaultValue: 'pending'
    },
    paymentMethod: {
      type: DataTypes.STRING(50),
      defaultValue: 'stripe'
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    // Additional fields for payment tracking
    refundAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00
    },
    refundReason: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'payments',
    timestamps: true // This will add createdAt and updatedAt automatically
  });
};
