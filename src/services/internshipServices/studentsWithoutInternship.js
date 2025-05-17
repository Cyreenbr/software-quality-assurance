import axiosAPI from "../axiosAPI/axiosInstance";

const studentInternshipService = {
  getStudentsWithoutInternship: async (type = "any") => {
    try {
      console.log("Service: requesting students without internship type:", type);
      const typeParam = type.trim().toLowerCase();
      const response = await axiosAPI.get(`/internship/getStudentsWithoutInternship`, {
        params: { type: typeParam }
      });
      
      console.log("Service: response received:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error API (GET students without internship):", error);
      console.error("Full error:", error.response || error);
      return { 
        students: [], 
        count: 0,
        message: error.response?.data?.message || "error" 
      };
    }
  },
};

export default studentInternshipService;