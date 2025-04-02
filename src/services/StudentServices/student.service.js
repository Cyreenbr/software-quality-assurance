import axios from "axios";

// Fichier src/services/StudentServices/student.service.js

// Code existant pour l'importation des étudiants
export const insertStudentsFromExcel = async (formData) => {
  const response = await axios.post("http://localhost:3000/api/students/upload", formData);
  return response.data;
};



