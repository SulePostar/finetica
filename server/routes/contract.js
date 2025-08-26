const express = require('express');
const router = express.Router();
const { getContractData, approveContract, getContract, processUnprocessed } = require('../controllers/contract');
const isAuthenticated = require('../middleware/isAuthenticated');
const validate = require('../middleware/validation');

const approveContractSchema = require('../schemas/approveContract');

router.get('/', getContractData);
router.put('/:id/approve', isAuthenticated, validate(approveContractSchema), approveContract);
router.get('/:id', isAuthenticated, getContract);
router.post('/process', processUnprocessed);

module.exports = router;
