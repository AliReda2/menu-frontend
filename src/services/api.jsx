import axios from "axios";

// Create an instance of axios
const api = axios.create({
  baseURL: "https://menu-backend-rnpu.onrender.com",
  withCredentials: true,
});

// Add a request interceptor to attach shop_id dynamically in the URL path
api.interceptors.request.use(
  (config) => {
    // Split the pathname, filter empty segments, and take the last one
    const segments = window.location.pathname.split('/').filter(Boolean);
    const shopId = segments[segments.length - 1]; // Get the last section as shopId
    if (shopId) {
      config.url = `${shopId}`;
    }
    console.log("Extracted shopId:", shopId);
    // console.log("Request config:", config);
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
