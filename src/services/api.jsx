import axios from "axios";

// Create an instance of axios
const api = axios.create({
  baseURL: "https://menu-backend-rnpu.onrender.com",
  withCredentials: true,
});

// Add a request interceptor to attach shop_id dynamically in the URL path
api.interceptors.request.use(
  (config) => {
    const shopId = window.location.pathname.split("/")[1]; // Get shop_id from URL path
    if (shopId) {
      // Update the URL to include the shopId in the path
      config.url = `${shopId}`; // Set URL to /shops/3 (or whatever shopId is)
    }
    console.log("Extracted shopId:", shopId);
    console.log("Request config:", config);
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
