import api from "./api";

class BankTransactionsService {
    getById(id) {
        return api.get(`/transactions/bank-transaction-data/${id}`);
    }

    approve(id, payload) {
        return api.patch(`/transactions/bank-transaction-data/${id}/approve`, payload);
    }

    update(id, payload) {
        return api.patch(`/transactions/bank-transaction-data/${id}/edit`, payload);
    }

    list(params) {
        return api.get(`/transactions/bank-transaction-data`, { params });
    }

    create(payload) {
        return api.post(`/transactions/bank-transaction-data`, payload);
    }

    processDocument(formData) {
        return api.post(`/transactions/kif/process`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }
}

export default new BankTransactionsService();