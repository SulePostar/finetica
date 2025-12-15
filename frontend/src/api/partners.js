import apiClient from "./axios";

export const getAllPartners = async (filters) => {
    const { data } = await apiClient.get("/partners", { params: filters });
    return data;
}