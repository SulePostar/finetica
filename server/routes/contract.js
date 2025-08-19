const express = require('express');
const router = express.Router();
const { getContractData, createNewContract } = require('../controllers/contract');
const validate = require('../middleware/validation');
const { createContractSchema } = require('../schemas/contractSchema');

// Get all contracts with pagination
router.get('/', getContractData);

// Create a new contract
router.post('/', validate(createContractSchema), createNewContract);

module.exports = router;