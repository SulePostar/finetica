const axios = require('axios');
const { ExchangeRate } = require('../models');

const syncLatestRates = async () => {
    const response = await axios.get(
        'https://api.frankfurter.dev/v1/latest?base=USD'
    );

    const data = response.data;

    await ExchangeRate.upsert({
        date: data.date,
        base: data.base,
        rates: data.rates,
    });

    return true;
};

module.exports = {
    syncLatestRates,
};
