import axios from "axios";

// Create an instance of axios
const api = axios.create({
  baseURL: "https://menu-backend-rnpu.onrender.com",
  withCredentials: true,
});

// Add a request interceptor to attach shop_id dynamically
api.interceptors.request.use(
  (config) => {
    const shopId = window.location.pathname.split("/")[1]; // Get shop_id from URL
    if (shopId) {
      config.params = { shopId };
    }
    console.log("Extracted shopId:", shopId);
    console.log("Request config:", config);
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
