import axios from "axios";

// Fichier src/services/StudentServices/student.service.js

// Code existant pour l'importation des étudiants
export const insertStudentsFromExcel = async (formData) => {
  const response = await axios.post("http://localhost:3000/api/students/upload", formData);
  return response.data;
};

// Version corrigée de la fonction de suppression
export const deleteStudent = async (userData) => {
  try {
    console.log("Service: tentative de suppression avec les données:", userData);
    
    // Assurez-vous que l'URL est correcte et correspond à votre backend
    const response = await axios.post("http://localhost:3000/api/students/archiveStudent", userData);
    
    console.log("Service: réponse de suppression reçue:", response.data);
    return response.data;
  } catch (error) {
    // Journalisation détaillée des erreurs pour faciliter le débogage
    console.error("Service: erreur lors de la suppression:", error);
    if (error.response) {
      console.error("Service: détails de l'erreur de réponse:", {
        data: error.response.data,
        status: error.response.status,
        headers: error.response.headers
      });
    }
    throw error; // Relancer l'erreur pour la gérer dans le composant
  }
};

