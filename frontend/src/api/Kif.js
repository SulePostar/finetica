import apiClient from './axios';

export const getKifItems = async (filters = {}) => {
    const { data } = await apiClient.get("/kif", {
        params: {
            page: 1,
            perPage: 10,
            ...filters
        }
    });
    return data;
};

export const getKifItemById = async (id) => {
    const { data } = await apiClient.get(`/kif/${id}`);
    return data;
};