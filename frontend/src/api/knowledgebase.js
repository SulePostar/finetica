import apiClient from './axios';

const BASE_PATH = "/knowledge-base";
export const fetchPendingEntries = async () => {
    const { data } = await apiClient.get(`${BASE_PATH}/pending`);
    return data;
};

export const approveEntry = async ({ id, answer }) => {
    const { data } = await apiClient.put(`${BASE_PATH}/${id}/approve`, { answer });
    return data;
};

export const rejectEntry = async (id) => {
    const { data } = await apiClient.delete(`${BASE_PATH}/${id}`);
    return data;
};