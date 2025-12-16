import apiClient from './axios';

const BASE_PATH = "/contracts";

export const getContracts = async () => {
    const { data } = await apiClient.get(`${BASE_PATH}/`);
    return data;
};

export const getContractById = async (id) => {
    const { data } = await apiClient.get(`${BASE_PATH}/${id}`);
    return data;
};

export const approveContract = async ({ id, ...payload }) => {
    const { data } = await apiClient.put(`${BASE_PATH}/${id}/approve`, payload);
    return data;
};
