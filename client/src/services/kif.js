import api from "./api";

class KifService {
    getById(id) {
        return api.get(`/kif/${id}`);
    }

    approve(id, payload) {
        return api.patch(`/kif/${id}/approve`, payload);
    }

    update(id, payload) {
        return api.patch(`/kif/${id}/edit`, payload);
    }

    list(params) {
        return api.get(`/kif`, { params });
    }

    create(payload) {
        return api.post(`/kif`, payload);
    }

    processDocument(formData) {
        return api.post(`/kif/process`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }
}

export default new KifService();