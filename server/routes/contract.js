const express = require('express');
const router = express.Router();
const { getContractData } = require('../controllers/contract');

router.get('/', getContractData);

module.exports = router;