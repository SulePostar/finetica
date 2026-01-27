const { BusinessPartner } = require('../models');
const AppError = require('../utils/errorHandler');
const { Op } = require('sequelize');

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
 * @param {object} query - Query object containing page, perPage, type, and search.
 * @returns {Promise<{data: Array, total: number}>} - Object with paginated data and total count.
 */
const getAllBusinessPartners = async ({ page = 1, perPage = 10, type = 'all', search = '' } = {}) => {
  try {
    const limit = Math.max(1, Number(perPage) || 10);
    const offset = Math.max(0, (Number(page) || 1) - 1) * limit;

    const whereClause = {};

    // Apply type filter only if not "all"
    if (type && type !== 'all') {
      whereClause.type = type;
    }

    const searchTerm = search?.trim();

    if (searchTerm) {
      whereClause[Op.or] = [
        { email: { [Op.iLike]: `%${searchTerm}%` } },
        { shortName: { [Op.iLike]: `%${searchTerm}%` } },
      ];
    }

    const { rows, count } = await BusinessPartner.findAndCountAll({
      where: whereClause,
      offset,
      limit,
      order: [['id', 'ASC']],
      distinct: true,
    });

    return {
      data: rows.map((row) => row.get({ plain: true })),
      total: count,
    };
  } catch (error) {
    throw new AppError(
      `Failed to get business partners: ${error.message}`,
      500
    );
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
const updateBusinessPartnerStatus = async (id, isActive) => {
  await BusinessPartner.update(
    { isActive },
    { where: { id } }
  );

  return {
    success: true,
    message: 'Business partner status updated successfully',
  };
};

/**
 * Updates a business partner by ID.
 * @param {Number} id - The business partner ID.
 * @param {Object} updates - The data to update.
 * @returns {Promise<Object|null>}
 */

const updateBusinessPartnerById = async (id, updates) => {
  const [updatedCount, updatedPartners] = await BusinessPartner.update(updates, {
    where: { id },
    returning: true,
  });

  if (updatedCount === 0 || updatedPartners.length === 0) {
    throw new AppError(`Business partner with ID ${id} not found`, 404);
  }

  return {
    success: true,
    message: 'Business partner updated successfully',
    data: updatedPartners[0],
  };
};

/**
 * Deletes a business partner by ID.
 * @param {Number} id - The business partner ID.
 * @returns {Promise<Object|null>}
 */
const deleteBusinessPartnerById = async (id) => {
  const deletedCount = await BusinessPartner.destroy({
    where: { id },
  });
  if (deletedCount === 0) {
    throw new AppError(`Business partner with ID ${id} not found`, 404);
  }
  return {
    success: true,
    message: 'Business partner deleted successfully',
  };
};

module.exports = {
  getAllBusinessPartners,
  getBusinessPartnerById,
  createBusinessPartner,
  updateBusinessPartnerStatus,
  updateBusinessPartnerById,
  deleteBusinessPartnerById,
};
