const { BusinessPartner } = require('../models');
const AppError = require('../utils/errorHandler');

/**
 * Creates a new business partner.
 * @param {Object} partnerData - Data for the new partner.
 * @returns {Promise<Object>}
 */
const createBusinessPartner = async (partnerData) => {
  try {
    const partner = await BusinessPartner.create(partnerData);
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
 * Get all business partners with pagination support.
 * @param {object} query - Query object containing page and perPage.
 * @returns {Promise<{data: Array, total: number}>} - Object with paginated data and total count.
 */
const getAllBusinessPartners = async ({ page = 1, perPage = 10 } = {}) => {
  try {
    const limit = Math.max(1, Number(perPage) || 10);
    const offset = Math.max(0, (Number(page) || 1) - 1) * limit;

    const { rows, count } = await BusinessPartner.findAndCountAll({
      offset,
      limit,
      order: [['id', 'ASC']],
    });

    const data = rows.map((row) => row.get({ plain: true }));

    return { data, total: count };
  } catch (error) {
    throw new AppError(`Failed to get business partners: ${error.message}`, 500);
  }
};

/**
 * Get a business partner by ID.
 * @param {Number} id - The business partner ID.
 * @returns {Promise<Object>}
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
};

/**
 * Deactivates a business partner (soft delete).
 * @param {Number} id - The business partner ID.
 * @returns {Promise<Object>}
 */
const deleteBusinessPartner = async (id) => {
  const partner = await BusinessPartner.findByPk(id);

  if (!partner) {
    throw new AppError(`Business partner with ID ${id} not found`, 404);
  }

  await partner.destroy();

  return {
    success: true,
    message: 'Business partner deleted successfully',
  };
};

/**
 * Updates a business partner by ID.
 * @param {Number} id - The business partner ID.
 * @param {Object} updates - The data to update.
 * @returns {Promise<Object|null>}
 */
const updateBusinessPartnerById = async (id, updates) => {
  const partner = await BusinessPartner.findByPk(id);

  if (!partner) {
    throw new AppError(`Business partner with ID ${id} not found`, 404);
  }

  await partner.update(updates);
  await partner.reload();
  return {
    success: true,
    message: 'Business partner updated successfully',
    data: partner,
  };
};

module.exports = {
  getAllBusinessPartners,
  getBusinessPartnerById,
  createBusinessPartner,
  deleteBusinessPartner,
  updateBusinessPartnerById,
};
