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
