import apiClient from "./axios";

export const getFaqs = async () => {
    const { data } = await apiClient.get('/help');
    return data;
};

export const createFaq = async (faqData) => {
    const { data } = await apiClient.post('/help', faqData);
    return data;
};

export const deleteFaq = async (faqId) => {
    const { data } = await apiClient.delete(`/help/${faqId}`);
    return data;
}; 
