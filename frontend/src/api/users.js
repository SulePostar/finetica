import apiClient from './axios';

export const getUsers = async (filters) => {
    const { data } = await apiClient.get("/users", { params: filters });
    return data;
};

export const getUserByRole = async (role) => {
    const { data } = await apiClient.get("/users", { params: { role } });
    return data;
}
export const getUserById = async (id) => {
    const { data } = await apiClient.get(`/users/${id}`);
    return data;
};

export const updateUser = async ({ id, ...payload }) => {
    const { data } = await apiClient.put(`/users/${id}`, payload);
    return data;
};

export const getMe = async () => {
    const response = await apiClient.get('/users/me');
    return response.data;
};
