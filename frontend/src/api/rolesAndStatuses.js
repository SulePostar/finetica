import apiClient from './axios';

export const getAllRoles = async () => {
    const { data } = await apiClient.get("/user-roles");
    return data;
};

export const getAllStatuses = async () => {
    const { data } = await apiClient.get("/user-statuses");
    return data;
};