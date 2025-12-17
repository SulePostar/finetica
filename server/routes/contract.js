const express = require('express');
const router = express.Router();
const { getContractData, approveContract, getContract } = require('../controllers/contract');
const isAuthenticated = require('../middleware/isAuthenticated');
const validate = require('../middleware/validation');
const approveContractSchema = require('../schemas/approveContract');

const { getInvalidContracts, getContractLog } = require('../controllers/contractProcessingLog');

router.get('/', getContractData);

router.get('/logs/invalid', isAuthenticated, getInvalidContracts);
router.get('/logs/:id', isAuthenticated, getContractLog);

router.put('/:id/approve', isAuthenticated, validate(approveContractSchema), approveContract);
router.get('/:id',
    //isAuthenticated
    getContract);

module.exports = router;
