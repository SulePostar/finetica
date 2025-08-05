const express = require('express');
const router = express.Router();
const { getVatData } = require('../controllers/vat');

router.get('/vat-data', getVatData);

module.exports = router;
