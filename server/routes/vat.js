const express = require('express');
const router = express.Router();
const { getVatData, getVatDocument } = require('../controllers/vat');

router.get('/vat-data', getVatData);

router.get('/vat-data/:id', getVatDocument);

module.exports = router;
