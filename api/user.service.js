import http from "./http-common";

class UserService {
  getAll() {
    return http.get("/users");
  }

  get(id) {
    return http.get(`/users/${id}`);
  }

  getByEmail(email) {
    return http.get(`/users/${email}`);
  }

  getByIds(ids) {
    return http.get(`/users/by/all`, ids);
  }

  update(id, data) {
    return http.put(`/users/${id}`, data);
  }

  deleteUser(id) {
    return http.delete(`/users/${id}`);
  }

  deleteAll() {
    return http.delete(`/users`);
  }
}

export default new UserService();
