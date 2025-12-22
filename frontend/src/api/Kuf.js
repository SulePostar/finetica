import apiClient from './axios';

const BASE_PATH = "/kuf";

export const getAllKufs = async (filters) => {
    const { data } = await apiClient.get(BASE_PATH, { params: filters });
    return data;
};

export const getKufById = async (id) => {
    const { data } = await apiClient.get(`${BASE_PATH}/${id}`);
    return data;
};

export const createKuf = async (payload) => {
    const { data } = await apiClient.post(BASE_PATH, payload);
    return data;
};

export const updateKuf = async ({ id, ...payload }) => {
    const { data } = await apiClient.put(`${BASE_PATH}/${id}`, payload);
    return data;
};

export const deleteKuf = async (id) => {
    await apiClient.delete(`${BASE_PATH}/${id}`);
};