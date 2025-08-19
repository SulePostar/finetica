import api from "./api";

class ContractService {
  getById(id) {
    return api.get(`/contracts/${id}`);
  }

  approve(id, payload) {
    return api.put(`/contracts/${id}/approve`, payload);
  }


  update(id, payload) {
    return api.put(`/contracts/${id}`, payload);
  }

  list(params) {
    return api.get(`/contracts`, { params });
  }
}

export default new ContractService();

