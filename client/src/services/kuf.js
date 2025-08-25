import api from "./api";

class KufService {
    getById(id) {
        return api.get(`/kuf/${id}`);
    }

    approve(id, payload) {
        return api.patch(`/kuf/${id}/approve`, payload);
    }

    list(params) {
        return api.get(`/kuf`, { params });
    }

    create(payload) {
        return api.post(`/kuf`, payload);
    }
}

export default new KufService();