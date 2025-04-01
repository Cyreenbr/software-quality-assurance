import axios from "axios";

const API_URL = "http://localhost:3000/api/internship";

export const createInternship = async (formData) => {
  try {
    let t = "";
    const token = localStorage.getItem("token");
    if (token) {
      t = `Bearer ${token}`;
    }

    const response = await axios.post(`${API_URL}/post`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": t,
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "ERROR" };
  }
};
