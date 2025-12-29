import apiClient from './axios';

export async function getDocumentItems(type, id) {
    const { data } = await apiClient.get(`/${type}/${id}/items`);
    return data?.data ?? data;
}