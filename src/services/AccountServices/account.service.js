import axios from "axios";


// Fonction pour l'inscription d'un utilisateur
export const registerUser = async (userData) => {
    const response = await axios.post(`http://localhost:1000/api/users/register`, userData);
    return response.data;

};
