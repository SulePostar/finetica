import api from "./api";

class BankTransactionsService {
    getById(id) {
        return api.get(`/transactions/bank-transaction-data/${id}`);
    }
    approve(id, payload) {
        return api.patch(`/transactions/${id}/approve`, payload);
    }
    list(params) {
        return api.get(`/transactions/bank-transaction-data`, { params });
    }
    create(payload) {
        return api.post(`/transactions/bank-transaction-data`, payload);
    }
}

export default new BankTransactionsService();