import axiosAPI from "../axiosAPI/axiosInstance";
export const getOptionsList = async () => {
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
export const ListIsPublished = async () => {
    try {
        // Use GET request since we're retrieving data, not creating/updating
        const response = await axiosAPI.get(`/options/listoptionStudent`);
        console.log("Option list publication status:", response.data);
        return response.data;
    } catch (error) {
        console.error(
            "Error checking publication status:",
            error.response?.data || error.message
        );
        throw error;
    }
};
//  

export const MyOption = async (id) => {
    try {
        // Use GET request since we're retrieving data, not creating/updating
        const response = await axiosAPI.get(`/options/myoption/${id}`);
        console.log("My Option:", response.data);
        return response.data;
    } catch (error) {
        console.error(
            "Error checking my Option:",
            error.response?.data || error.message
        );
        throw error;
    }
};