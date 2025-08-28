const { listBusinessPartners, getBusinessPartnerById, createBusinessPartner } = require('../services/businessPartner');

/**
 * Get all business partners with pagination
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getAllPartners = async (req, res, next) => {
    try {
        // Prosledi req.query servisu da bi paginacija radila
        const result = await listBusinessPartners(req.query);
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
        const result = await getBusinessPartnerById(parseInt(id, 10));
        res.json(result);
    } catch (error) {
        next(error);
    }
};

/**
 * Create a new business partner
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const createNewBusinessPartner = async (req, res, next) => {
    try {
        const partnerData = req.body;
        const result = await createBusinessPartner(partnerData);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllPartners,
    getPartner,
    createNewBusinessPartner,
};
