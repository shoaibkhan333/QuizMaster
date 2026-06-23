/**
 * Database Setup Script
 * Run this script to create the database and tables
 * Usage: node server/scripts/setup-database.js
 */

require('dotenv').config();
const { sequelize } = require('../models');

async function setupDatabase() {
  try {
    console.log('🔄 Connecting to MySQL...');
    await sequelize.authenticate();
    console.log('✅ Connected to MySQL');

    console.log('🔄 Syncing database tables...');
    await sequelize.sync({ force: false, alter: true }); // Set force: true to drop existing tables
    console.log('✅ Database tables synced successfully');

    console.log('✅ Database setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();

