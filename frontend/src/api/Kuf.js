import apiClient from './axios';

export const getAllKufs = async (filters) => {
    const { data } = await apiClient.get("/kuf", { params: filters });
    return data;
};

export const getKufById = async (id) => {
    const { data } = await apiClient.get(`/kuf/${id}`);
    return data;
};

export const createKuf = async (payload) => {
    const { data } = await apiClient.post("/kuf", payload);
    return data;
};

export const updateKuf = async ({ id, ...payload }) => {
    const { data } = await apiClient.put(`/kuf/${id}`, payload);
    return data;
};

export const deleteKuf = async (id) => {
    await apiClient.delete(`/kuf/${id}`);
};

export const approveKuf = async ({ id, ...payload }) => {
    const { data } = await apiClient.put(`/kuf/${id}/approve`, payload);
    return data;
};