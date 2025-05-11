import axiosAPI from "../axiosAPI/axiosInstance";

export const teacherService = {
  getTeachers: async () => {
    try {
      const response = await axiosAPI.get("/internship/teachers");
      return response.data;
    } catch (error) {
      console.error("Error fetching teachers:", error.response?.data?.message || error);
      return [];
    }
  },
};

export const internshipService = {
  assignInternships: async (assignmentData) => {
    try {
      const response = await axiosAPI.post(
        "/internship/stage/planning/assign",
        assignmentData
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error assigning internships:",
        error.response?.status,
        error.response?.data?.message || error
      );
      throw error;
    }
  },

sendPlanning: async () => {
    try {
      const response = await axiosAPI.post("/internship/stage/planning/send");
      return response.data;
    } catch (error) {
      console.error("Error sending planning:", error.response?.data?.message || error);
      throw error;
    }
  },
};