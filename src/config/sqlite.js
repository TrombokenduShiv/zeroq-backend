const { Sequelize } = require('sequelize');
const path = require('path');

// Initialize SQLite for Admin/Org Credentials
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../database/admin.sqlite'),
  logging: false // Keep console clean
});

const connectSQLite = async () => {
  try {
    await sequelize.authenticate();
    console.log('SQLite Connection (Admin Layer): Connected');
    // Sync models (create tables if missing)
    await sequelize.sync(); 
  } catch (error) {
    console.error('SQLite Connection Error:', error);
  }
};

module.exports = { sequelize, connectSQLite };