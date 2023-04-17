import axios from "axios";

// const isProduction = process.env.NODE_ENV === "production";
const isProduction = true;

export default axios.create({
  baseURL: isProduction
    ? "https://dev-coindraw-api.onrender.com/api"
    : "http://localhost:8080/api",
  headers: {
    "Content-type": "application/json",
  },
});
