import axiosAPI from "../axiosAPI/axiosInstance";
export const upgradeStudentById = async (studentId, situation) => {
    try {
        const response = await axiosAPI.put(`/students/years/${studentId}`, {
            situation,
        });

        console.log("Mise à jour réussie :", response.data);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la mise à jour :", error.response?.data || error.message);
        throw error;
    }
};