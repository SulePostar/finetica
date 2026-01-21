import apiClient from './axios';
import { getTimeFilterWhereClause } from '@/helpers/timeFilter.js';

const BASE_PATH = "/contracts";

export const getContracts = async (page, perPage, timeRange) => {
    const params = {
        page,
        perPage,
        timeRange: typeof timeRange === 'object' ? JSON.stringify(timeRange) : timeRange,
    };
    const { data } = await apiClient.get(`${BASE_PATH}`, { params });
    return data;
};

export const getContractById = async (id) => {
    const { data } = await apiClient.get(`${BASE_PATH}/${id}`);
    return data;
};

export const getActiveContractsCount = async () => {
    const { data } = await apiClient.get(`${BASE_PATH}/count/active`);
    return data;
}

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