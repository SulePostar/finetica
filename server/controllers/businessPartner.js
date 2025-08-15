const { createBusinessPartner, getBusinessPartnerById, getAllBusinessPartners } = require('../services/businessPartner');

/**
 * Create a new business partner
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const createNewBusinessPartner = async (req, res, next) => {
    try {
        // Partner data is already validated by the validation middleware
        const partnerData = req.body;

        // Create the partner in the database
        const partner = await createBusinessPartner(partnerData);

        // Return the created partner with a 201 status code
        res.status(201).json({
            success: true,
            message: 'Business partner created successfully',
            data: partner
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get all business partners
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getAllPartners = async (req, res, next) => {
    try {
        const partners = await getAllBusinessPartners();

        res.json({
            success: true,
            data: partners
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get a business partner by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getPartner = async (req, res, next) => {
    try {
        const { id } = req.params;

        const partner = await getBusinessPartnerById(parseInt(id));

        res.json({
            success: true,
            data: partner
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createNewBusinessPartner,
    getPartner,
    getAllPartners
};
