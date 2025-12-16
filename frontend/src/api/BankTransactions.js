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

// PUT - approve bank transaction
export const approveBankTransaction = async ({ id, ...payload }) => {
  const { data } = await apiClient.put(`${BASE_PATH}/${id}/approve`, payload);
  return data;
};