import apiClient from "./axios";

export const getFaqs = async () => {
    const { data } = await apiClient.get('/help');
    return data;
};