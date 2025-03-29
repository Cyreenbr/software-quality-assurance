import axios from "axios";

const API_URL = "http://localhost:5000/api/internships"; // URL du backend

export const getInternships = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des stages :", error);
    throw error;
  }
};

export const createInternship = async (internshipData) => {
  try {
    const response = await axios.post(API_URL, internshipData);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout du stage :", error);
    throw error;
  }
};

export const updateInternship = async (id, internshipData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, internshipData);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du stage :", error);
    throw error;
  }
};

export const deleteInternship = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Erreur lors de la suppression du stage :", error);
    throw error;
  }
};
