import axios from "axios";

const BASE_URL = "http://localhost:3000/api/internship"; 

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};


const teacherService = {
  getTeachers: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/teachers`, { headers: { ...getAuthHeader() } });
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
      const response = await axios.post(
        `${BASE_URL}/stage/planning/assign`,
        assignmentData,
        { headers: { "Content-Type": "application/json", ...getAuthHeader() } }
      );
      return response.data;
    } catch (error) {
      console.error("Erreur while assigning internships:", error.response?.status, error.response?.data);
      throw error;
    }
  },
};

export { internshipService, teacherService };

