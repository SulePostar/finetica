import apiClient from './axios';

const BASE_PATH = "/bank-transactions";

// GET - list of bank transactions
export const getBankTransactions = async (filters) => {
  const { data } = await apiClient.get(`${BASE_PATH}/`, { params: filters });
  return data;
};

// GET - single bank transaction by ID
export const getBankTransactionById = async (id) => {
  const { data } = await apiClient.get(`${BASE_PATH}/${id}`);
  return data;
};

/* -------------------- */
/*     Invalid PDFs     */
/* -------------------- */
export const getBankStatementsInvalidPdfs = async (page = 1, limit = 10) => {
  const { data } = await apiClient.get(`${BASE_PATH}/logs/invalid`, {
    params: { page, limit },
  });
  return data;
};

export const getBankStatementInvalidPdfById = async (id) => {
  const { data } = await apiClient.get(`${BASE_PATH}/logs/${id}`);
  return data;
};