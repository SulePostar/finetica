const {
  createBusinessPartner,
  getBusinessPartnerById,
  getAllBusinessPartners,
  updateBusinessPartnerById,
} = require('../services/businessPartner');

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

const updateBusinessPartner = async (req, res, next) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No data provided for update' });
    }

    const updatedPartner = await updateBusinessPartnerById(id, updates);

    if (!updatedPartner) {
      return res.status(404).json({ message: 'Business partner not found' });
    }

    res.status(200).json(updatedPartner);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createNewBusinessPartner,
  getPartner,
  getAllPartners,
  updateBusinessPartner,
};
