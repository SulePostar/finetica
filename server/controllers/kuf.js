const {
  listInvoices,
  findById,
  approveInvoiceById,
  createInvoice,
  extractData,
  updateInvoice,
} = require('../services/kuf');

// Rename to match contract naming
const getInvoiceData = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, sortField, sortOrder = 'asc' } = req.query;
    const result = await listInvoices({
      page: Number(page) || 1,
      perPage: Number(perPage) || 10,
      sortField,
      sortOrder,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const getInvoice = async (req, res, next) => {
  try {
    const invoice = await findById(Number(req.params.id));
    res.json(invoice);
  } catch (err) {
    next(err);
  }
};

const approveInvoice = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const result = await approveInvoiceById(Number(req.params.id), userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const created = await createInvoice(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

// Add missing controller function
const update = async (req, res, next) => {
  try {
    const updated = await updateInvoice(Number(req.params.id), req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

const processDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new Error('No file provided');
    }
    const data = await extractData(req.file.buffer, req.file.mimetype);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getInvoiceData, // Updated name to match contract pattern
  getInvoice,
  approveInvoice,
  create,
  processDocument,
  update // Added missing export
};