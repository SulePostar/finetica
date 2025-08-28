const express = require('express');
const router = express.Router();
const {
  createNewBusinessPartner,
  getPartner,
  getAllPartners,
  updateBusinessPartner,
} = require('../controllers/businessPartner');
const validate = require('../middleware/validation');
const {
  createBusinessPartnerSchema,
  updateBusinessPartnerSchema,
} = require('../schemas/businessPartnerSchema');

// Get all business partners
router.get('/', getAllPartners);

// Get a business partner by ID
router.get('/:id', getPartner);

// Create a new business partner
router.post('/', validate(createBusinessPartnerSchema), createNewBusinessPartner);
router.patch('/:id', validate(updateBusinessPartnerSchema), updateBusinessPartner);

module.exports = router;
