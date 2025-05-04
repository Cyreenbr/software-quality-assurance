import axiosAPI from "../axiosAPI/axiosInstance";
export const getPlanning = async () => {
    try {
      const response = await axiosAPI.get(`/internship/stage/planning`);
  
      return response.data; 
    } catch (error) {
      if (error.response) {
        console.error("Server Error:", error.response.data);
      } else if (error.request) {
        console.error("No response from server:", error.request);
      } else {
        console.error("Request setup error:", error.message);
      }
      throw error;
    }
  };