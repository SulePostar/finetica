import api from "./api";

class BankTransactionsService {
    getById(id) {
        return api.get(`/bank-transactions/${id}`);
    }

    approve(id, payload) {
        return api.patch(`/bank-transactions/${id}/approve`, payload);
    }
    list(params) {
        return api.get(`/bank- transactions/`, { params });
    }
    createBankTransaction(payload) {
        return api.post(`/bank-transactions/`, payload);
    }
}

export default new BankTransactionsService();