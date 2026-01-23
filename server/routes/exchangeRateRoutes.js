const express = require('express');
const router = express.Router();
const exchangeRateController = require('../controllers/exchangeRateController');

router.post('/sync', (req, res) =>
    exchangeRateController.syncLatestRates(req, res)
);
module.exports = router;
