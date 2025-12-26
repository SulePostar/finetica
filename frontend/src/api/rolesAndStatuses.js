import apiClient from './axios';

export const getAllRoles = async () => {
    const { data } = await apiClient.get("/user-roles");
    return data;
};

export const getAllStatuses = async () => {
    const { data } = await apiClient.get("/user-statuses");
    return data;
};

export const createRole = async (roleName) => {
    const { data } = await apiClient.post("/user-roles", {
        role: roleName
    });
    return data;
};

export const createUserStatus = async (statusName) => {
    const { data } = await apiClient.post("/user-statuses", { status: statusName });
    return data;
};

export const deleteRole = async (roleId) => {
    const { data } = await apiClient.delete(`/user-roles/${roleId}`);
    return data;
}

export const deleteStatus = async (statusId) => {
    const { data } = await apiClient.delete(`/user-statuses/${statusId}`);
    return data;
}