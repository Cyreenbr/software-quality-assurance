// import axios from 'axios';

// URL du backend (remplacer par l'URL de votre API)

import axiosAPI from "../axiosAPI/axiosInstance";

const API_BASE_URL = "http://localhost:3000/api/PFA";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const pfaService = {
  getPfas: async () => {
    try {
      const response = await axiosAPI.get(`${API_BASE_URL}/list`, {
        headers: { ...getAuthHeader() },
      });
      return response.data;
    } catch (error) {
      console.error("Error API (GET PFA) :", error);
      return null;
    }
  },

  getPublishedPfas: async () => {
    try {
      console.log("i trigred the publish pfas");
      const response = await axiosAPI.get(`${API_BASE_URL}/open`, {
        headers: { ...getAuthHeader() },
      });
      return response.data;
    } catch (error) {
      console.error("Error API (GET PFA) :", error);
      return null;
    }
  },

  rejectPfa: async (pfaId) => {
    try {
      const response = await axiosAPI.patch(
        `${API_BASE_URL}/${pfaId}/reject`,
        {}, // Pass an empty body if the API requires it
        { headers: { ...getAuthHeader() } } // Headers should be the third argument
      );

      console.log("Successfully rejected PFA");
      return response.data;
    } catch (error) {
      console.error("Error API (Patch PFA):", error.response?.data || error);
      return null;
    }
  },

  publishPfa: async (pfaId) => {
    try {
      const response = await axiosAPI.patch(
        `${API_BASE_URL}/${pfaId}/publish`,
        {}, // Pass an empty body if the API requires it
        { headers: { ...getAuthHeader() } } // Headers should be the third argument
      );

      console.log("Successfully rejected PFA");
      return response.data;
    } catch (error) {
      console.error("Error API (Patch PFA):", error.response?.data || error);
      return null;
    }
  },

  getTeacherPfas: async () => {
    try {
      const response = await axiosAPI.get(`${API_BASE_URL}/mine`, {
        headers: { ...getAuthHeader() },
      });
      console.log(response);
      return response.data;
    } catch (error) {
      console.error("Error API (GET PFA) :", error);
      return null;
    }
  },

  createPfa: async (pfaData) => {
    try {
      const response = await axiosAPI.post(`${API_BASE_URL}/post`, pfaData, {
        headers: { ...getAuthHeader() },
      });

      console.log("i netred the create fnct", pfaData);
      return response.data;
    } catch (error) {
      console.error("Error API (POST PFA) :", error);
      return null;
    }
  },

  updatePfa: async (pfaData, pfaId) => {
    try {
      const response = await axiosAPI.patch(
        `${API_BASE_URL}/${pfaId}/mine`,
        pfaData,
        {
          headers: { ...getAuthHeader() },
        }
      );

      console.log("i netred the update fnct", pfaData);
      return response.data;
    } catch (error) {
      console.error("Error API (POST PFA) :", error);
      return null;
    }
  },

  deletePfa: async (pfaId) => {
    try {
      const response = await axiosAPI.delete(`${API_BASE_URL}/${pfaId}`, {
        headers: { ...getAuthHeader() },
      });

      console.log("i netred the delete fnct");
      return response.data;
    } catch (error) {
      console.error("Error API (POST PFA) :", error);
      return null;
    }
  },

  sendEmail: async () => {
    var status;
    const param = localStorage.getItem("emailSent");

    if (param) {
      status = "modified";
    } else {
      localStorage.setItem("emailSent", true);
      status = "first";
    }
    try {
      const response = await axiosAPI.post(
        `${API_BASE_URL}/send/${status}`,
        {},
        {
          headers: { ...getAuthHeader() },
        }
      );

      console.log("i netred the send mail fnct");
      alert("email has been sent");

      return response.data;
    } catch (error) {
      console.error("Error API (POST PFA) :", error);
      return null;
    }
  },

  // get teacher par son nom  a verifirer avec farah
  getTeacherByName: async (teacherName) => {
    try {
      const response = await axiosAPI.get(
        `/api/teacher/${teacherName}`,
        {},
        {
          headers: { ...getAuthHeader() },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error API (POST PFA) :", error);
      return null;
    }
  },

  // get les PFAs par ID de teacher
  getPfasByTeacherId: async (teacherId) => {
    try {
      const response = await axiosAPI.get(
        `/${API_BASE_URL}/teacher/${teacherId}/subjects`,
        {},
        {
          headers: { ...getAuthHeader() },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error API (POST PFA) :", error);
      return null;
    }
  },

  getStudents: async () => {
    try {
      const response = await axiosAPI.get(
        `http://localhost:3000/api/students/studentlist
        `,
        {},
        {
          headers: { ...getAuthHeader() },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error API (POST PFA) :", error);
      return null;
    }
  },

  addPriority: async (pfaId, data) => {
    try {
      const response = await axiosAPI.patch(
        `${API_BASE_URL}/${pfaId}/choice`,
        data,
        {
          headers: { ...getAuthHeader() },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error API (POST PFA) :", error);
      return null;
    }
  },

  acceptBinome: async (pfaId, studentIds) => {
    try {
      const response = await axiosAPI.patch(
        `${API_BASE_URL}/${pfaId}/accept`,
        { studentIds },
        {
          headers: { ...getAuthHeader() },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error API (POST PFA) :", error);
      return null;
    }
  },

  acceptTeacher: async (pfaId, acceptTeacher) => {
    try {
      console.log(pfaId, acceptTeacher);
      const response = await axiosAPI.patch(
        `${API_BASE_URL}/${pfaId}/acceptance`,
        { acceptTeacher },
        {
          headers: { ...getAuthHeader() },
        }
      );
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
