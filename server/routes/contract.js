const express = require('express');
const router = express.Router();
const { getContractData } = require('../controllers/contract');
const { addContract } = require('../controllers/contract');

router.get('/', getContractData);
router.post('/', addContract);

module.exports = router;
