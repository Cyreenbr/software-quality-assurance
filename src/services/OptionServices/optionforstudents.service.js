import axiosAPI from "../axiosAPI/axiosInstance";
export const getOptionsList = async () => {
    try {
        console.log("Fetching options list data...");
        const response = await axiosAPI.get('/options/listoption');

        console.log("Options retrieved successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching option list:", error.response?.data || error.message);
        throw error;
    }
};