import axios from "axios";

const isProduction = false;

export default axios.create({
  baseURL: isProduction
    ? "https://api.coindraw.io/api"
    : "http://localhost:8080/api",
  headers: {
    "Content-type": "application/json",
  },
});
