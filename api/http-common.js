import axios from "axios";

const isProduction = true;

export default axios.create({
  baseURL: isProduction
    ? "https://new-coindraw-api.onrender.com/api"
    : "http://localhost:8080/api",
  headers: {
    "Content-type": "application/json",
  },
});
