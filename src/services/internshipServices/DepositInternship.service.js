import axiosAPI from "../axiosAPI/axiosInstance";

export const createInternship = async (formData) => {
  try {
    const response = await axiosAPI.post(`/internship/post`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error API (POST createInternship):", error);
    return error.response?.data || { message: "ERROR" };
  }
};

export const getStudentInternship = async () => {
  try {
    const response = await axiosAPI.get(`/internship/me`);
    return response.data;
  } catch (error) {
    console.error("Error API (GET getStudentInternship):", error);
    throw error.response?.data || { message: "Failed to fetch internship details" };
  }
};
