const express = require('express');
const router = express.Router();
const {
    createNewBusinessPartner,
    getPartner,
    getAllPartners,
    updatePartnerStatus,
    updateBusinessPartner,
    deleteBusinessPartner,
} = require('../controllers/businessPartner');
const validate = require('../middleware/validation');
const {
    createBusinessPartnerSchema,
    updateBusinessPartnerSchema,
} = require('../schemas/businessPartnerSchema');
const isAuthenticated = require('../middleware/isAuthenticated');

// Get all business partners
router.get('/', getAllPartners);

// Get a business partner by ID
router.get('/:id', getPartner);

// Create a new business partner
router.post('/', validate(createBusinessPartnerSchema), createNewBusinessPartner);
router.patch('/:id', isAuthenticated, updatePartnerStatus);
router.put('/:id', validate(updateBusinessPartnerSchema), updateBusinessPartner);

router.delete('/:id',
    isAuthenticated,
    deleteBusinessPartner);

module.exports = router;
