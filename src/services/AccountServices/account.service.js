import axios from "axios";


// Fonction pour l'inscription d'un utilisateur
export const registerUser = async (userData) => {
    const response = await axios.post(`http://localhost:1000/api/users/register`, userData);
    return response.data;

};/*
export const login = async (credentials) => {
    const result = await axios.post(
      "http://localhost:3000/api/users/login",
      credentials
    )
    return result.data.token
  }
*/
