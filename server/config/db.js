const { Sequelize } = require('sequelize');
const config = require('./config.js')['development'];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: config.logging,
  }
);

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
