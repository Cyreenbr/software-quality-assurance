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
