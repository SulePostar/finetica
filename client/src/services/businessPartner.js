import api from "./api";

class PartnerService {
    // Fetch all partners with pagination
    list(params) {
        return api.get(`/partners`, { params });
    }

    // Fetch single partner by ID
    getById(id) {
        return api.get(`/partners/${id}`);
    }

    // Create a new partner
    create(payload) {
        return api.post(`/partners`, payload);
    }

    // Update partner by ID
    update(id, payload) {
        return api.put(`/partners/${id}`, payload);
    }

    // Deactivate (soft delete) partner by ID
    deactivate(id) {
        return api.delete(`/partners/${id}`, {
            data: { isActive: false }
        });
    }
}

export default new PartnerService();
