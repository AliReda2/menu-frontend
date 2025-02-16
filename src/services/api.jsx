import axios from "axios";

// Create an instance of axios
const api = axios.create({
  baseURL: "https://menu-backend-rnpu.onrender.com",
  withCredentials: true,
});

export default api;
