require('dotenv').config(); // Učitava varijable iz .env fajla

module.exports = {
  development: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: console.log,
  },
  staging: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: console.log,
  },
  test: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: false,
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: false,
  },
};
