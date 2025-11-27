import apiClient from './axios';

export const getItems = async () => {
    const { data } = await apiClient.get("/kuf");
    return data;
};

export const getItemById = async (id) => {
    const { data } = await apiClient.get(`/kuf/${id}`);
    return data;
};

export const createItem = async (payload) => {
    const { data } = await apiClient.post("/kuf", payload);
    return data;
};

export const updateItem = async ({ id, ...payload }) => {
    const { data } = await apiClient.put(`/kuf/${id}`, payload);
    return data;
};

export const deleteItem = async (id) => {
    await apiClient.delete(`/kuf/${id}`);
};