require('dotenv').config();

const { sequelize } = require('../models');

const { syncLatestRates } = require('../services/exchangeRate');

async function run() {
    console.log('Currency conversion begins...');

    try {
        await sequelize.authenticate();
        console.log('Db connection successful.');

        await syncLatestRates();

        console.log('Currency update completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('There was an error:', error.message);

        if (error.response) {
            console.error('API Response:', error.response.data);
        }

        process.exit(1);
    } finally {
        await sequelize.close();
        console.log('Connection closed.');
    }
}

run();