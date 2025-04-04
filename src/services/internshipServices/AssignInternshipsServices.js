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

  publishPlanning: async (action) => {
    try {
      const response = await axiosAPI.post(`/internship/stage/planning/publish/${action}`);
      return response.data;
    } catch (error) {
      console.error("Error publishing planning:", error.response?.data?.message || error);
      throw error;
    }
  },

  sendPlanning: async (sendType) => {
    try {
      const response = await axiosAPI.post("/internship/stage/planning/send", { sendType });
      return response.data;
    } catch (error) {
      console.error("Error sending planning:", error.response?.data?.message || error);
      throw error;
    }
  },
};
