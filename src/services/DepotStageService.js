import axios from "axios";

const API_URL = "http://localhost:3000/api/internship";

export const createInternship = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/post`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};