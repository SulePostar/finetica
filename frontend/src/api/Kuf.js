// Example API file
// This is how we should define ALL API functions in future.
// No React hooks here. Only pure async functions.

import apiClient from './axios';

// GET - list of items
export const getItems = async () => {
    const { data } = await apiClient.get("/kuf");
    return data;
};

// GET - single item by ID
export const getItemById = async (id) => {
    const { data } = await apiClient.get(`/kuf/${id}`);
    return data;
};

// CREATE - new item
export const createItem = async (payload) => {
    const { data } = await apiClient.post("/kuf", payload);
    return data;
};

// UPDATE - existing item
export const updateItem = async ({ id, ...payload }) => {
    const { data } = await apiClient.put(`/kuf/${id}`, payload);
    return data;
};

// DELETE - item by ID
export const deleteItem = async (id) => {
    await apiClient.delete(`/kuf/${id}`);
};