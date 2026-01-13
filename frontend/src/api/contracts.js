import apiClient from './axios';
import { getTimeFilterWhereClause } from '@/helpers/timeFilter.js';

const BASE_PATH = "/contracts";

export const getContracts = async (filters = {}) => {
    const { page = 1, perPage = 10, timeRange } = filters;

    const params = {
        page,
        limit: perPage,
    };

    if (timeRange && timeRange !== 'all') {
        if (typeof timeRange === 'object' && timeRange?.from && timeRange?.to) {
            params.startDate = timeRange.from;
            params.endDate = timeRange.to;
        } else {
            const whereClause = getTimeFilterWhereClause(timeRange, 'created_at');
            if (whereClause.created_at) {
                params.startDate = whereClause.created_at.$gte?.toISOString().split('T')[0];
                params.endDate = whereClause.created_at.$lte?.toISOString().split('T')[0];
            }
        }
    }

  const { data } = await apiClient.get(`${BASE_PATH}/`, { params });
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