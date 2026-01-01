const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/sqlite');

const Admin = sequelize.define('Admin', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('SUPER_ADMIN', 'ORG_ADMIN'),
    defaultValue: 'ORG_ADMIN'
  },
  organization_name: {
    type: DataTypes.STRING,
    allowNull: true // Null for Super Admin
  }
});

module.exports = Admin;