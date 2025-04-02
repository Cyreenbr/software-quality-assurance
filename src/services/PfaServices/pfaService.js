// import axios from 'axios';

// URL du backend (remplacer par l'URL de votre API)

import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/PFA";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const pfaService = {
  getPfas: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/list`, {
        headers: { ...getAuthHeader() },
      });
      return response.data;
    } catch (error) {
      console.error("Error API (GET PFA) :", error);
      return null;
    }
  },

  getTeacherPfas: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/mine`, {
        headers: { ...getAuthHeader() },
      });
      console.log(response)
      return response.data;
    } catch (error) {
      console.error("Error API (GET PFA) :", error);
      return null;
    }
  },

  createPfa: async (pfaData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/post`, pfaData, {
        headers: { ...getAuthHeader() },
      });

      console.log("i netred the create fnct", pfaData);
      return response.data;
    } catch (error) {
      console.error("Error API (POST PFA) :", error);
      return null;
    }
  },

  //   addPeriod: async (periodData) => {
  //     try {
  //       const response = await axios.post(`${API_BASE_URL}/period/open`, periodData, {
  //         headers: {
  //           "Content-Type": "application/json",
  //           ...getAuthHeader(),
  //         },
  //       });
  //       return response.data;
  //     } catch (error) {
  //       console.error("Erreur API (POST addPeriod) :", error);
  //       return null;
  //     }
  //   },

  //   updatePeriod: async (id, updatedData) => {
  //     try {
  //       const response = await axios.patch(`${API_BASE_URL}/period/open/${id}`, updatedData, {
  //         headers: {
  //           "Content-Type": "application/json",
  //           ...getAuthHeader(),
  //         },
  //       });
  //       return response.data;
  //     } catch (error) {
  //       console.error("Error API (PATCH updatePeriod) :", error);
  //       return null;
  //     }
  //   },
};

export default pfaService;
