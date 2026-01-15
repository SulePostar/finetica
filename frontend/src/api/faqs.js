import apiClient from "./axios"; // Adjust path if needed (e.g. '@/api/client')

export const getFaqs = async () => {
    const { data } = await apiClient.get('/help');
    return data;
};