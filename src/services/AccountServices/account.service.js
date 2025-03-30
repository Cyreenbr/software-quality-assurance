import axios from "axios";


// Fonction pour l'inscription d'un utilisateur
export const registerUser = async (userData) => {
   console.log("hello from serviceee")
    const response = await axios.post(`http://localhost:3000/api/users/register`, userData);
    console.log("yesssssss")
    return response.data;

};
export const login = async (credentials) => {
    const result = await Axios.post(
      "http://localhost:3000/api/users/login",
      credentials
    )
    return result.data.token
  }
