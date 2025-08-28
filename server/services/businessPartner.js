const { BusinessPartner } = require('../models');
const AppError = require('../utils/errorHandler');

/**
 * Lista sve poslovne partnere sa paginacijom.
 * @param {object} query - Query parametri iz URL-a (npr. page, perPage).
 * @returns {Promise<{data: Array, total: number}>}
 */
const listBusinessPartners = async ({ page = 1, perPage = 10 }) => {
    const limit = Math.max(1, Number(perPage) || 10);
    const offset = Math.max(0, (Number(page) || 1) - 1) * limit;

    // Koristimo findAndCountAll za paginaciju
    const { rows, count } = await BusinessPartner.findAndCountAll({
        offset,
        limit,
        order: [['created_at', 'DESC']],
    });

    // Vraćamo čiste objekte, a ne Sequelize instance
    const data = rows.map((row) => row.get({ plain: true }));

    return { data, total: count };
};

/**
 * Pronalazi partnera po ID-u.
 * @param {Number} id - ID poslovnog partnera.
 * @returns {Promise<Object>}
 */
const getBusinessPartnerById = async (id) => {
    const partner = await BusinessPartner.findByPk(id);

    if (!partner) {
        throw new AppError(`Business partner with ID ${id} not found`, 404);
    }

    // Vraćamo čist objekat
    return partner.get({ plain: true });
};

/**
 * Kreira novog poslovnog partnera.
 * @param {Object} partnerData - Podaci za novog partnera.
 * @returns {Promise<Object>}
 */
const createBusinessPartner = async (partnerData) => {
    const partner = await BusinessPartner.create(partnerData);
    return partner.get({ plain: true });
};

module.exports = {
    listBusinessPartners,
    getBusinessPartnerById,
    createBusinessPartner,
};
