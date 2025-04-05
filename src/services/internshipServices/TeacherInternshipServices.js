import axiosAPI from "../axiosAPI/axiosInstance";


export const teacherinternshipService = {
  getInternships: async () => {
    try {
      const response = await axiosAPI.get(`internship/stage/assigned-to-me`);
      const internships = response.data?.data;

      if (Array.isArray(internships)) {
        return internships;
      } else {
        console.warn("Unexpected response structure:", response.data);
        return [];
      }
    } catch (error) {
      console.error("Error API (GET internships):", error);
      return [];
    }
  },
};
