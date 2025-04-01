import axiosAPI from "../axiosAPI/axiosInstance";
export const chooseOption = async (optionData) => {
    try {
        console.log("Sending option data...");

        const token = localStorage.getItem("token"); // Récupérer dynamiquement le token
        if (!token) {
            throw new Error("User is not authenticated.");
        }

        const response = await axiosAPI.post('/options', optionData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        console.log("Option choice successful:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error choosing option:", error.response?.data || error.message);
        throw error;
    }
};
