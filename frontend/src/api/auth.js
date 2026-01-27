import apiClient from './axios';

export const loginUser = async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
};
export const requestPasswordReset = async (email) => {
    const response = await apiClient.post('/auth/forgot-password', {
        email
    });
    return response.data;
}
export const resetPassword = async ({ token, newPassword }) => {
    const response = await apiClient.post('/auth/reset-password', {
        token,
        new_password: newPassword
    });
    return response.data;
}
/**
 * Register a new user
 * @param {Object} payload - { firstName, lastName, email, password, profileImage? }
 */
export const registerUser = async (payload) => {
    const { data } = await apiClient.post('/auth/register', payload);
    return data;
};

/**
 * Logout the current user
 */
export const logoutUser = async () => {
    const { data } = await apiClient.post('/auth/logout');
    return data;
};
