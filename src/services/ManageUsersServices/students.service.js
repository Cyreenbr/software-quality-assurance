import axiosAPI from "../axiosAPI/axiosInstance";

export const getStudents = async () => {
    try {
        const response = await axiosAPI.get(`/students/`);
        console.log("List of students recupered:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error adding user:", error.response?.data || error.message);
        throw error;
    }

};