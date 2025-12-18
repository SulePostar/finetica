import apiClient from './axios';

export const getUsers = async (filters) => {
    const { data } = await apiClient.get("/users", { params: filters });
    return data;
};

export const getUserById = async (id) => {
    const { data } = await apiClient.get(`/users/${id}`);
    return data;
}

export const getMe = async () => {
    const response = await apiClient.get('/users/me');
    return response.data;
};