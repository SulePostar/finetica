import apiClient from './axios';

const BASE_PATH = "/bank-transactions";

// GET - list of bank transactions
export const getBankTransactions = async () => {
  const { data } = await apiClient.get(`${BASE_PATH}/`);
  return data;
};

// GET - single bank transaction by ID
export const getBankTransactionById = async (id) => {
  const { data } = await apiClient.get(`${BASE_PATH}/${id}`);
  return data;
};