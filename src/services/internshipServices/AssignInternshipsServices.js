import axiosAPI from "../axiosAPI/axiosInstance";


const teacherService = {
  getTeachers: async () => {
    try {
      const response = await axiosAPI.get(`/internship/teachers`);
      return response.data; 
    } catch (error) {
      console.error("Erreur API teachers :", error);
      return [];
    }
  },
};

const internshipService = {
  assignInternships: async (assignmentData) => {
    try {
      const response = await axiosAPI.post(
        `/internship/stage/planning/assign`,
        assignmentData
      );
      return response.data;
    } catch (error) {
      console.error("Erreur while assigning internships:", error.response?.status, error.response?.data);
      throw error;
    }
  },
};

export { internshipService, teacherService };

