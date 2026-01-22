const exchangeRateService = require('../services/exchangeRate');

const syncLatestRates = async (req, res) => {
    try {
        await exchangeRateService.syncLatestRates();

        return res.status(200).json({
            message: 'Latest exchange rates synchronized successfully.',
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
};

module.exports = {
    syncLatestRates,
};
