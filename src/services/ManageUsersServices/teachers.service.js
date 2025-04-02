import axiosAPI from "../axiosAPI/axiosInstance";

export const getTeachers = async () => {
    try {
        const response = await axiosAPI.get(`/teachers/`);
        console.log("List of teachers recupered:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error geting teachers:", error.response?.data || error.message);
        throw error;
    }

};