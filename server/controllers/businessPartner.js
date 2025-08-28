const { createBusinessPartner, getBusinessPartnerById, getAllBusinessPartners, deactivateBusinessPartner } = require('../services/businessPartner');

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

        // Create the partner in the database and get formatted response
        const result = await createBusinessPartner(partnerData);

        // Return the result with a 201 status code
        res.status(201).json(result);
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
        const result = await getAllBusinessPartners();
        res.json(result);
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

        const result = await getBusinessPartnerById(parseInt(id));

        res.json(result);
    } catch (error) {
        next(error);
    }
};

const softDeletePartner = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await deactivateBusinessPartner(parseInt(id));
        res.json(result);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createNewBusinessPartner,
    getPartner,
    getAllPartners,
    softDeletePartner
};
