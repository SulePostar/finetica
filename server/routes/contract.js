const express = require('express');
const router = express.Router();
const { getContractData, approveContract } = require('../controllers/contract');
const isAuthenticated = require('../middleware/isAuthenticated');
const validate = require('../middleware/validation');

const approveContractSchema = require('../schemas/approveContract');
const { addContract } = require('../controllers/contract');

router.get('/', getContractData);
router.put('/:id/approve', isAuthenticated, validate(approveContractSchema), approveContract);

module.exports = router;
