import apiClient from './axios';

const BASE_PATH = "/invalid-pdfs";

export const getInvalidPdfsCount = async () => {
    try {
        const { data } = await apiClient.get(`${BASE_PATH}/count`);
        return data;
    } catch (error) {
        console.error("API Error while fetching invalid PDF count:", error);
        throw error;
    }
};