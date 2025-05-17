import axiosAPI from "../axiosAPI/axiosInstance";

const internshipService = {
  getInternships: async () => {
    try {
      const response = await axiosAPI.get(`/internship/stage/getList`);
      return response.data;
    } catch (error) {
      console.error("Erreur API (GET internships) :", error);
      return null;
    }
  },

  updateInternshipTeacher: async (internshipId, teacherId) => {
    try {
      const response = await axiosAPI.patch(
        `internship/stage/planning/update`,
        {
          internshipId,
          idTeacher: teacherId,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erreur API (PUT updateInternshipTeacher) :", error);
      return null;
    }
  },
};

export default internshipService;
