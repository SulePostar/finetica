// Example API file
// This is how we should define ALL API functions in future.
// No React hooks here. Only pure async functions.

import apiClient from './axios';

const BASE_PATH = "/bank-transactions";

// GET - list of items
export const getBankTransactions = async () => {
  const { data } = await apiClient.get(`${BASE_PATH}/`);
  return data;
};

// GET - single item by ID
export const getBankTransactionById = async (id) => {
  const { data } = await apiClient.get(`${BASE_PATH}/${id}`);
  return data;
};

// // CREATE - new item
// export const createItem = async (payload) => {
//     const { data } = await apiClient.post("/example-items", payload);
//     return data;
// };

// // UPDATE - existing item
// export const updateItem = async ({ id, ...payload }) => {
//     const { data } = await apiClient.put(`/example-items/${id}`, payload);
//     return data;
// };

// // DELETE - item by ID
// export const deleteItem = async (id) => {
//     await apiClient.delete(`/example-items/${id}`);
// };