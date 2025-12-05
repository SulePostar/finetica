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
