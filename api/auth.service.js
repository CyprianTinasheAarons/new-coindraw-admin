import http from "./http-common";

class AuthService {
  login(data) {
    return http.post("/auth/admin-login", data);
  }

  login2fa(data) {
    return http.post("/auth/admin-2fa", data);
  }

  register(data) {
    return http.post("/auth/signup", data);
  }

  logout() {
    localStorage.removeItem("admin-token");
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("admin-user"));
  }
}

export default new AuthService();
