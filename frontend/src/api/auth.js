import apiClient from './axios';

export const loginUser = async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
};

/**
 * Register a new user
 * @param {Object} payload - { firstName, lastName, email, password, profileImage? }
 */
export const registerUser = async (payload) => {
    const { data } = await apiClient.post('/auth/register', payload);
    return data;
};

export const logoutUser = async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
}
