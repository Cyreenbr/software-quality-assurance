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

      return response.data;
    } catch (error) {
      console.error("Error API (POST PFA) :", error);
      return null;
    }
  },

  //   // get les PFAs par ID de teacher
  //  getPfasByTeacherName = async (teacherName) => {
  //     try {
  //       const response = await axios.get(
  //         `${API_BASE_URL}/teacher/${teacherName}/subjects`, // Assurez-vous que l'URL est correcte
  //         {
  //           headers: { ...getAuthHeader() }
  //         }
  //       );
  //       return response.data;
  //     } catch (error) {
  //       console.error("Error fetching PFAs by teacher:", error);
  //       return null;
  //     }
  //   },

  // getTeachers = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:3000/api/teachers/teacherslist');
  //     return response.data; // Liste des enseignants
  //   } catch (error) {
  //     console.error("Error fetching teachers:", error);
  //     return [];
  //   }
  // };

  // getPfasByTeacherName: async (teacherName) => {
  //   try {
  //     const response = await axiosAPI.get(`${API_BASE_URL}/teacher/${teacherName}/subjects`, {
  //       headers: { ...getAuthHeader() },
  //     });
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error API (GET PFA) :", error);
  //     return null;
  //   }
  // },

  // getPfasByTeacherId: async (teacherId) => {
  //   try {
  //     const response = await axiosAPI.get(`${API_BASE_URL}/teacher/${teacherId}/subjects`, {
  //       headers: { ...getAuthHeader() },
  //     });
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error API (GET PFA) :", error);
  //     return null;
  //   }
  // },
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
      const response = await axiosAPI.patch(
        `${API_BASE_URL}/${pfaId}/acceptance`,
        { acceptTeacher },
        {
          headers: { ...getAuthHeader() },
        }
      );
      console.log("Data:", { acceptTeacher });
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

  /////////  7.1
  getChoicesByStudent: async () => {
    try {
      const response = await axiosAPI.get(`${API_BASE_URL}/admin/choices`, {
        headers: { ...getAuthHeader() },
      });
      return response.data;
    } catch (error) {
      console.error("Error API (GET PFA) :", error);
      return null;
    }
  },

  /////////   7.2
  assignProjectsAutomatically: async () => {
    try {
      const token = localStorage.getItem("token"); // Assure-toi que le token est stocké ici

      const response = await axiosAPI.post(
        `${API_BASE_URL}/PFA/assign`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'affectation automatique :", error);
      throw error;
    }
  },

  //7.3
  assignPfaToStudent: async (pfaId, studentId, force = false) => {
    try {
      const response = await axiosAPI.patch(
        `${API_BASE_URL}/PFA/${pfaId}/assign/student/${studentId}`,
        {
          force,
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Assignment failed." };
    }
  },

  ///7.4

  // pfaService.js
  publishOrHide: async (pfaId, response) => {
    try {
      const res = await axiosAPI.patch(
        `${API_BASE_URL}/publish/${pfaId}/${response}`,
        {},
        {
          headers: getAuthHeader(),
        }
      );

      return res.data;
    } catch (error) {
      console.error("❌ Erreur API (PATCH publish/hide PFA):", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      return null;
    }
  },

  sendEmailAssignation: async () => {
    try {
      const response = await axiosAPI.post(
        `${API_BASE_URL}/PFA/list/send`,
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
};

export default pfaService;
