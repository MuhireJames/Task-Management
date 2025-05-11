import axios from "axios";

const baseURL =
  import.meta.env.NODE_ENV === "development"
    ? "http://localhost:5100/api"
    : "/api";

const api = axios.create({
  baseURL,
  credentials: true,
});

export default api;
