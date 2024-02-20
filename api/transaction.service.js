import http from "./http-common";

class TransactionService {
  // Updated getAll function
  getAll(page, limit) {
    return http.get(`/transactions?page=${page}&limit=${50}`);
  }

  get(id) {
    return http.get(`/transactions/${id}`);
  }

  create(data) {
    return http.post("/transactions", data);
  }

  update(data) {
    return http.put(`/transactions/${data?.id}`, data);
  }

  delete(id) {
    return http.delete(`/transactions/${id}`);
  }

  deleteAll() {
    return http.delete(`/transactions`);
  }

  findByTitle(title) {
    return http.get(`/transactions?title=${title}`);
  }
}

export default new TransactionService();
