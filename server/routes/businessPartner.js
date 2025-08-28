const express = require('express');
const router = express.Router();
const { createNewBusinessPartner, getPartner, getAllPartners, softDeletePartner } = require('../controllers/businessPartner');
const validate = require('../middleware/validation');
const { createBusinessPartnerSchema } = require('../schemas/businessPartnerSchema');
const isAuthenticated = require('../middleware/isAuthenticated');

// Get all business partners
router.get('/', getAllPartners);

// Get a business partner by ID
router.get('/:id', getPartner);

// Create a new business partner
router.post('/', validate(createBusinessPartnerSchema), createNewBusinessPartner);
router.delete('/:id', isAuthenticated, softDeletePartner);

module.exports = router;
