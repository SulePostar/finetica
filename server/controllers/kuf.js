const {
  listInvoices,
  findById,
  approveInvoiceById,
  createInvoice,
  updateInvoice,
  processUnprocessedFiles,
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
    const result = await approveInvoiceById(Number(req.body.id), req.body, req.user.userId);
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

const processDocuments = async (req, res, next) => {
  try {
    const data = await processUnprocessedFiles();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getInvoiceData,
  getInvoice,
  approveInvoice,
  create,
  processDocuments,
  update
};