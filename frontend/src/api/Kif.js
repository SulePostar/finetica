import apiClient from './axios';

export const getKifs = async (filters) => {
    const { data } = await apiClient.get("/kif", {
        params: filters
    });
    return data;
};

export const getKifsById = async (id) => {
    const { data } = await apiClient.get(`/kif/${id}`);
    return data;
};

export const approveKif = async ({ id, ...payload }) => {
    const { data } = await apiClient.put(`/kif/${id}/approve`, payload);
    return data;
};