// controllers/contract.js
const {
  getPaginatedContractData,
  approveContractById,
  findById,
  addContract,
} = require('../services/contract');

// helper: mapiraj camelCase/snakeCase input u snake_case izlaz za FE
const toSnake = (c) => ({
  id: c.id,
  partner_id: c.partnerId ?? c.partner_id,
  contract_number: c.contractNumber ?? c.contract_number,
  contract_type: c.contractType ?? c.contract_type,
  description: c.description,
  start_date: c.startDate ?? c.start_date,
  end_date: c.endDate ?? c.end_date,
  is_active: c.isActive ?? c.is_active,
  payment_terms: c.paymentTerms ?? c.payment_terms,
  currency: c.currency,
  amount: c.amount,
  signed_at: c.signedAt ?? c.signed_at,
  approved_at: c.approvedAt ?? c.approved_at,
  approved_by: c.approvedBy ?? c.approved_by,
  pdfUrl: c.pdfUrl ?? c.pdf_url ?? null,
});

const getContractData = (req, res, next) => {
  try {
    const {
      page = 1,
      perPage = 10,
      sortField,
      sortOrder = 'asc',
    } = req.query;

    const { data, total } = getPaginatedContractData({
      page: Number(page) || 1,
      perPage: Number(perPage) || 10,
      sortField,
      sortOrder,
    });

    // mock generator već vraća snake_case; ostavljamo kako jeste
    res.json({ data, total });
  } catch (err) {
    next(err);
  }
};

const getContract = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contract = await findById(Number(id)); // service vraća camelCase polja
    res.json(toSnake(contract));
  } catch (err) {
    next(err);
  }
};

const approveContract = async (req, res, next) => {
  try {
    const { id } = req.params;
    // isAuthenticated middleware treba da postavi req.user.userId
    const userId = req.user?.userId;
    const result = await approveContractById(Number(id), req.body, userId);
    res.json(toSnake(result));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getContractData,
  getContract,
  approveContract,
};
