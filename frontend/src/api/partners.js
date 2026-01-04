import apiClient from "./axios";

export const deletePartner = (id) => {
    return apiClient.delete(`/partners/${id}`);
};

export const getAllPartners = async (filters) => {
    const { data } = await apiClient.get("/partners", { params: filters });
    return data;
}

export const getPartnerById = async (id) => {
    const { data } = await apiClient.get(`/partners/${id}`);
    return data;
}  