import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:5100/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
