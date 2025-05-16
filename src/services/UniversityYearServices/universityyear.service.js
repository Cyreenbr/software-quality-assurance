import axiosAPI from "../axiosAPI/axiosInstance";
export const OpenNewYear = async (yearData) => {
    try {
        console.log("Sending option data...");
        const response = await axiosAPI.post('/universityyear/openNewYear', yearData);

        console.log("Year Opened Successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error Opening New Year:", error.response?.data || error.message);
        throw error;
    }
};
export const SwitchYear = async (yearData) => {
    try {
        console.log("Sending option data...");
        const response = await axiosAPI.post('/universityyear/SwitchUniversityYear', yearData);

        console.log("Year Switched Successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error Switching Year:", error.response?.data || error.message);
        throw error;
    }
};
export const GetAllYears = async () => {
    try {
        console.log("Fetching years list data...");
        const response = await axiosAPI.get('/universityyear/getAllYears');
        console.log("Years retrieved successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching years list:", error.response?.data || error.message);
        throw error;
    }
}