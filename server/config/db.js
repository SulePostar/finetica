const { Sequelize } = require('sequelize');
const environment = process.env.NODE_ENV || 'development';
const config = require('./config.js')[environment];

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: config.logging,
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging' ? {
      require: true,
      rejectUnauthorized: false
    } : false
  }
});

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to the database successfully.');
  } catch (error) {
    console.error('❌ Failed to connect to the database:', error);
  }
};

module.exports = {
  sequelize,
  connectToDatabase,
};
