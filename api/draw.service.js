import http from "./http-common";

class DrawService {
  getAll() {
    return http.get("/draws");
  }

  get(id) {
    return http.get(`/draws/${id}`);
  }

  create(data) {
    return http.post("/draws", data);
  }

  update(id, data) {
    return http.put(`/draws/${id}`, data);
  }

  delete(id) {
    return http.delete(`/draws/${id}`);
  }

  deleteAll() {
    return http.delete(`/draws`);
  }

  findByTitle(title) {
    return http.get(`/draws?title=${title}`);
  }

  updateDrawOrder(data) {
    return http.put(`/draws/draw/order`, data);
  }
}

export default new DrawService();
