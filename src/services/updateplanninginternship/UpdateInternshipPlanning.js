import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/internship"; 

const getAuthHeader = () => {
  const token = localStorage.getItem("token"); 
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const internshipService = {
  getInternships: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/stage/getList`, {
        headers: { ...getAuthHeader() },
      });
      return response.data;
    } catch (error) {
      console.error("Erreur API (GET internships) :", error);
      return null;
    }
  },

  getTeachers: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/teachers`, {
        headers: { ...getAuthHeader() },
      });
      return response.data; 
    } catch (error) {
      console.error("Erreur API (GET teachers) :", error);
      return null;  
    }
  },


  updateInternshipTeacher: async (internshipId, teacherId) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/stage/planning/update`,
        {
          internshipId,
          idTeacher: teacherId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader(),
          },
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
