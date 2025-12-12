import apiClient from './axios';

export const getUsers = async () => {
    const { data } = await apiClient.get("/users");
    return data;
};
