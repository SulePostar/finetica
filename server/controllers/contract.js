const { listContracts, approveContractById, findById, createContract,} = require('../services/contract');

const toSnake = (c) => ({
  id: c.id,
  partner_id: c.partnerId,
  partner: c.BusinessPartner
    ? {
        id: c.BusinessPartner.id,
        name: c.BusinessPartner.name,
        short_name: c.BusinessPartner.short_name,
      }
    : undefined,
  contract_number: c.contractNumber,
  contract_type: c.contractType,
  description: c.description,
  start_date: c.startDate,
  end_date: c.endDate,
  is_active: c.isActive,
  payment_terms: c.paymentTerms,
  currency: c.currency,
  amount: c.amount, 
  signed_at: c.signedAt,
  approved_at: c.approvedAt,
  approved_by: c.approvedBy,
  created_at: c.created_at,
  updated_at: c.updated_at,
  pdfUrl: c.pdfUrl ?? null,
});

const getContractData = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, sortField, sortOrder = 'asc' } = req.query;
    const { data, total } = await listContracts({
      page: Number(page) || 1,
      perPage: Number(perPage) || 10,
      sortField,
      sortOrder,
    });
    res.json({ data: data.map(toSnake), total });
  } catch (err) {
    next(err);
  }
};

const getContract = async (req, res, next) => {
  try {
    const contract = await findById(Number(req.params.id));
    res.json(toSnake(contract));
  } catch (err) {
    next(err);
  }
};

const approveContract = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const result = await approveContractById(Number(req.params.id), req.body, userId);
    res.json(toSnake(result));
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const created = await createContract(req.body);
    res.status(201).json(toSnake(created));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getContractData,
  getContract,
  approveContract,
  create,
};
