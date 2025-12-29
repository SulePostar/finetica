import apiClient from './axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getDocumentItems = async (type, id) => {
    const { data } = await apiClient.get(`/${type}/${id}/items`, {
        withCredentials: true,
    });

    return data?.data ?? data;
};