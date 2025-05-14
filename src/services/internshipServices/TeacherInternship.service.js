import axiosAPI from "../axiosAPI/axiosInstance";

export const teacherinternshipService = {
  getInternships: async () => {
    try {
      const response = await axiosAPI.get("internship/stage/assigned-to-me");
      const internships = response.data?.data;
      
      if (Array.isArray(internships)) {
        return internships.map(internship => ({
          ...internship,
          id: internship.id || internship._id 
        }));
      } else {
        console.warn("Unexpected response structure:", response.data);
        return [];
      }
    } catch (error) {
      console.error("Error API (GET internships):", error);
      return [];
    }
  },

  scheduleDefense: async (internshipId, defenseData) => {
    try {
      if (!internshipId) {
        throw new Error("Internship ID is required");
      }
      
      const internships = await teacherinternshipService.getInternships();
      const internship = internships.find(i => i.id === internshipId || i._id === internshipId);
      
      let response;
      if (internship && internship.defenseDate) {
        response = await axiosAPI.patch(
          `internship/stage/${internshipId}`,
          defenseData
        );
      } else {
        response = await axiosAPI.post(
          `internship/stage/${internshipId}`,
          defenseData
        );
      }
      
      return response.data;
    } catch (error) {
      console.error("Error scheduling defense:", error);
      if (error.response?.status === 409) {
        throw new Error("Another appointment is already scheduled for this date and time.");
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Failed to schedule defense. Please try again.");
      }
    }
  },
};