import axiosAPI from "../axiosAPI/axiosInstance";
export const chooseOption = async (optionData) => {
    try {
        console.log("Sending option data...");
        const response = await axiosAPI.post('/options', optionData);

        console.log("Option choice successful:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error choosing option:", error.response?.data || error.message);
        throw error;
    }
};
export const getOptions = async () => {
    try {
        console.log("Fetching options list data...");
        const response = await axiosAPI.get('/options/students');

        console.log("Options retrieved successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching option list:", error.response?.data || error.message);
        throw error;
    }
};
export const deleteOption = async () => {
    try {
        console.log("Fetching options list data...");
        const response = await axiosAPI.get('/options/students');

        console.log("Options retrieved successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching option list:", error.response?.data || error.message);
        throw error;
    }
};
export const editOption = async () => {
    try {
        console.log("Fetching options list data...");
        const response = await axiosAPI.get('/options/students');

        console.log("Options retrieved successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching option list:", error.response?.data || error.message);
        throw error;
    }
};
