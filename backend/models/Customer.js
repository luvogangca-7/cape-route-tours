// models/Customer.js
export default (sequelize, DataTypes) => {
  return sequelize.define('Customer', {
    customerId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    cell: DataTypes.STRING,
  }, {
    timestamps: true,
    tableName: 'customers',
  });
};
