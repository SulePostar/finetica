import apiClient from './axios';

const BASE_PATH = "/invalid-pdfs";

export const getInvalidPdfsCount = async () => {
    const { data } = await apiClient.get(`${BASE_PATH}/count`);
    return data;
};