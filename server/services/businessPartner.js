const db = require('../models');
const AppError = require('../utils/errorHandler');

/**
 * Create a new business partner in the database
 * @param {Object} partnerData - The business partner data
 * @returns {Promise<Object>} - Response object with success status, message and partner data
 */
const createBusinessPartner = async (partnerData) => {
    try {
        // Get the BusinessPartner model
        const BusinessPartner = db.BusinessPartner;

        // Create the business partner in the database
        const partner = await BusinessPartner.create(partnerData);

        // Return formatted response
        return {
            success: true,
            message: 'Business partner created successfully',
            data: partner
        };
    } catch (error) {
        throw new AppError(`Failed to create business partner: ${error.message}`, 500);
    }
};

/**
 * Get a business partner by ID
 * @param {Number} id - The business partner ID
 * @returns {Promise<Object>} - Response object with success status and partner data
 */
const getBusinessPartnerById = async (id) => {
    try {
        const BusinessPartner = db.BusinessPartner;

        const partner = await BusinessPartner.findByPk(id);

        if (!partner) {
            throw new AppError(`Business partner with ID ${id} not found`, 404);
        }

        return {
            success: true,
            data: partner
        };
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(`Failed to get business partner: ${error.message}`, 500);
    }
};/**
 * Get all business partners
 * @returns {Promise<Object>} - Response object with success status and partners data
 */
const getAllBusinessPartners = async () => {
    try {
        const BusinessPartner = db.BusinessPartner;

        const partners = await BusinessPartner.findAll({
            order: [['id', 'ASC']]
        });

        return {
            success: true,
            data: partners
        };
    } catch (error) {
        throw new AppError(`Failed to get business partners: ${error.message}`, 500);
    }
};

module.exports = {
    createBusinessPartner,
    getBusinessPartnerById,
    getAllBusinessPartners
};
