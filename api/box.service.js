import http from "./http-common";

class BoxService {
  createCoinbox(data) {
    return http.post("/coinboxes", data);
  }

  getAllCoinboxes() {
    return http.get("/coinboxes");
  }

  getCoinbox(id) {
    return http.get(`/coinboxes/${id}`);
  }

  updateCoinbox(id, data) {
    return http.put(`/coinboxes/${id}`, data);
  }

  // Updated getAll function
  getAll(page, limit) {
    return http.get(`/boxes?page=${page}&limit=${limit}`);
  }

  redistributeBoxes(data) {
    return http.post("/boxes/redistribute", data);
  }

  update(id, data) {
    return http.put(`/boxes/${id}`, data);
  }

  delete(id) {
    return http.delete(`/boxes/${id}`);
  }

  deleteAll() {
    return http.delete("/boxes");
  }
}

export default new BoxService();
