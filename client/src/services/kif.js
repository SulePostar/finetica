import api from "./api";

class KifService {
    getById(id) {
        return api.get(`/kif/${id}`);
    }

    approve(id, payload) {
        return api.patch(`/kif/${id}/approve`, payload);
    }

    list(params) {
        return api.get(`/kif`, { params });
    }

    createKif(payload) {
        return api.post(`/kif`, payload);
    }
}

export default new KifService();