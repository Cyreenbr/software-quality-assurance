import axios from "axios";

const axiosAPI = axios.create({
    baseURL: "localhost:3000/api/internship/stage/getList", // Remplace par ton URL
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosAPI;
