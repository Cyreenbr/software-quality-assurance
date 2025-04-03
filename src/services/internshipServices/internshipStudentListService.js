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
};

export default internshipService;
