import apiClient from './axios';

export const loginUser = async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
};

export const logoutUser = async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
};
