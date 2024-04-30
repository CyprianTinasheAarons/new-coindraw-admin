import http from "./http-common";

class WinnerService {
  getAll() {
    return http.get("/winners");
  }

  get(id) {
    return http.get(`/winners/${id}`);
  }

  create(data) {
    return http.post("/winners", data);
  }

  update(id, data) {
    return http.put(`/winners/${id}`, data);
  }

  delete(id) {
    return http.delete(`/winners/${id}`);
  }

  deleteAll() {
    return http.delete(`/winners`);
  }

  findByTitle(title) {
    return http.get(`/winners?title=${title}`);
  }

  sendEmail(data) {
    return http.post(`/winners/sendEmail`, data);
  }

  sendEmailMatic(data) {
    return http.post(`/winners/sendEmail/matic`, data);
  }
}

export default new WinnerService();
