import apiClient from './axios';

const BASE_PATH = "/chat";

export const sendMessage = async (payload) => {
    const { data } = await apiClient.post(BASE_PATH, payload);
    return data;
};