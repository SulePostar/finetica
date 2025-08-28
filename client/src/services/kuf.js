import api from "./api";

class KufService {
    getKufById(id) {
        return api.get(`/kuf/${id}`);
    }

    approveKuf(id, payload) {
        return api.put(`/kuf/${id}/approve`, payload);
    }

    listKuf(params) {
        return api.get(`/kuf`, { params });
    }

    createKuf(payload) {
        return api.post(`/kuf`, payload);
    }
}

export default new KufService();