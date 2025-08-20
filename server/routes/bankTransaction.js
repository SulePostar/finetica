const express = require('express');
const router = express.Router();
const { getBankTransactionData, getBankTransactionDocument } = require('../controllers/bankTransaction');

router.get('/bank-transaction-data', getBankTransactionData);

router.get('/bank-transaction-data/:id', getBankTransactionDocument);

module.exports = router;
