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

/* -------------------- */
/*     Invalid PDFs     */
/* -------------------- */
export const getContractsInvalidPdfs = async (page = 1, limit = 10) => {
    const { data } = await apiClient.get(`${BASE_PATH}/logs/invalid`, {
        params: { page, limit },
    });
    return data;
};

export const getContractInvalidPdfById = async (id) => {
    const { data } = await apiClient.get(`${BASE_PATH}/logs/${id}`);
    return data;
};