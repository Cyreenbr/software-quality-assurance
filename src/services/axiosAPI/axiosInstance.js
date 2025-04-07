import axios from "axios";

const baseURL = `http://localhost:${
  import.meta.env.VITE_PORT_BACKEND || 3000
}/api`; // Base URL for all BACKEND API calls
// console.log(baseURL);
// console.log(import.meta.env.VITE_PORT_BACKEND);

const axiosAPI = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add Authorization header if token exists
axiosAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosAPI;
