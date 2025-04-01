import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const periodService = {
  getPeriods: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/period/open`, {
        headers: { ...getAuthHeader() },
      });
      return response.data;
    } catch (error) {
      console.error("Erreur API (GET periods) :", error);
      return null;
    }
  },

  addPeriod: async (periodData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/period/open`, periodData, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erreur API (POST addPeriod) :", error);
      return null;
    }
  },

  updatePeriod: async (id, updatedData) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/period/open/${id}`, updatedData, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erreur API (PATCH updatePeriod) :", error);
      return null;
    }
  },
};

export default periodService;
