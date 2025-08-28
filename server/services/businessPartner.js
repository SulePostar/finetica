const { BusinessPartner } = require('../models');
const AppError = require('../utils/errorHandler');

/**
 * Create a new business partner in the database
 * @param {Object} partnerData - The business partner data
 * @returns {Promise<Object>} - Response object with success status, message and partner data
 */
const createBusinessPartner = async (partnerData) => {
  try {
    // Create the business partner in the database
    const partner = await BusinessPartner.create(partnerData);

    // Return formatted response
    return {
      success: true,
      message: 'Business partner created successfully',
      data: partner,
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
    const partner = await BusinessPartner.findByPk(id);

    if (!partner) {
      throw new AppError(`Business partner with ID ${id} not found`, 404);
    }

    return {
      success: true,
      data: partner,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(`Failed to get business partner: ${error.message}`, 500);
  }
}; /**
 * Get all business partners
 * @returns {Promise<Object>} - Response object with success status and partners data
 */
const getAllBusinessPartners = async () => {
  try {
    const partners = await BusinessPartner.findAll({
      order: [['id', 'ASC']],
    });

    return {
      success: true,
      data: partners,
    };
  } catch (error) {
    throw new AppError(`Failed to get business partners: ${error.message}`, 500);
  }
};

const deactivateBusinessPartner = async (id) => {
  const partner = await BusinessPartner.findByPk(id);

  if (!partner) {
    throw new AppError(`Business partner with ID ${id} not found`, 404);
  }

  if (partner.isActive === false) {
    throw new AppError(`Business partner with ID ${id} is already inactive`, 400);
  }

  await partner.update({ isActive: false }, { where: { id } });

  return {
    success: true,
    message: 'Business partner deleted successfully',
  };
};

const updateBusinessPartnerById = async (id, updates) => {
  const BusinessPartner = db.BusinessPartner;

  const partner = await BusinessPartner.findByPk(id);

  if (!partner) {
    return null;
  }

  await partner.update(updates);

  return partner;
};

module.exports = {
  createBusinessPartner,
  getBusinessPartnerById,
  getAllBusinessPartners,
  deactivateBusinessPartner,
  updateBusinessPartnerById,
};
