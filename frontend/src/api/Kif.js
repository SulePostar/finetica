import apiClient from './axios';

export const getKifs = async (filters) => {
    const { data } = await apiClient.get("/kif", {
        params: filters
    });
    return data;
};

export const getKifById = async (id) => {
    const { data } = await apiClient.get(`/kif/${id}`);
    return data;
};

/* -------------------- */
/*     Invalid PDFs     */
/* -------------------- */
export const getKifInvalidPdfs = async (page = 1, limit = 10) => {
    const { data } = await apiClient.get(`/kif/logs/invalid`, {
        params: { page, limit },
    });
    return data;
};

export const getKifInvalidPdfById = async (id) => {
    const { data } = await apiClient.get(`/kif/logs/${id}`);
    return data;
};