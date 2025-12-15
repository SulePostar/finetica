import apiClient from "./axios";

export const getAllPartners = async (filters) => {
    const { data } = await apiClient.get("/partners", { params: filters });
    console.log("Fetched partners data:", data);
    return data;
}