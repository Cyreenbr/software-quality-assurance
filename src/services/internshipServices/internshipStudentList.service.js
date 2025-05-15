import axiosAPI from "../axiosAPI/axiosInstance";

const internshipService = {
  getInternships: async () => {
    try {
      const response = await axiosAPI.get(`/internship/stage/getList`);
      return response.data;
    } catch (error) {
      console.error("Error API (GET internships):", error);
      return [];
    }
  },

  publishPlanning: async (action) => {
    try {
      const response = await axiosAPI.post(`/internship/stage/planning/publish/${action}`);
      return response.data;
    } catch (error) {
      console.error("Error publishing planning:", error.response?.data?.message || error);
      throw error;
    }
  },


};

export default internshipService;
