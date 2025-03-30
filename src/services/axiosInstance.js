import axios from "axios";

const axiosAPI = axios.create({
    baseURL: "http://localhost:8080/api", // Base URL for all API calls
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
