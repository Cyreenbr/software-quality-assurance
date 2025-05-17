/**
 * Service de gestion du profil utilisateur
 * Contient les fonctions pour récupérer et mettre à jour le profil
 */
import axiosAPI from "../services/axiosAPI/axiosInstance.js";


export const getProfile = async () => {
  try {
    const response = await axiosAPI.get('/profile/me');
    
    // Debug the response
    console.log("Raw profile data:", response.data);
    
    // Handle the profilePhoto field correctly
    if (response.data && response.data.data) {
      const userData = response.data.data;
      
      // Convert string "null" to actual null
      if (userData.profilePhoto === "null" || userData.profilePhoto === "") {
        userData.profilePhoto = null;
      }
      
      // Check if there's a nested _doc object with the real data (MongoDB document structure)
      if (!userData.profilePhoto && userData._doc && userData._doc.profilePhoto) {
        userData.profilePhoto = userData._doc.profilePhoto;
        console.log("Using profilePhoto from _doc:", userData.profilePhoto);
      }
    }
    
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

/**
 * Updates the user profile
 * @param {Object} profileData - The profile data to update
 * @returns {Promise<Object>} The updated profile
 *//*
export const updateProfile = async (profileData) => {
  try {
    // Handle file upload separately if needed
    const response = await axiosAPI.patch('/profile/update', profileData);
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};*/

/**
 * Uploads a profile photo
 * @param {File} photoFile - The photo file to upload
 * @returns {Promise<Object>} The upload response
 */
export const uploadProfilePhoto = async (photoFile) => {
  try {
    const formData = new FormData();
    formData.append('profilePhoto', photoFile);
    
    const response = await axiosAPI.post('/profile/upload-photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error("Error uploading profile photo:", error);
    throw error;
  }
};
/**
 
 * Met à jour le profil utilisateur
 * @param {Object} profileData - Données du profil à mettre à jour
 * @param {File} [profilePhoto] - Fichier image pour la photo de profil (optionnel)
 * @returns {Promise} Promesse avec la réponse du serveur
 */

export const updateProfile = async (profileData, profilePhoto = null) => {
  try {
    const formData = new FormData();
    
    // Clone the profileData to avoid modifying the original
    const processedData = { ...profileData };
    
    // Map French gender values to English as expected by the backend
    if (processedData.sexe === 'Homme') {
      processedData.sexe = 'Male';
    } else if (processedData.sexe === 'Femme') {
      processedData.sexe = 'Female';
    }
    
    // Ajout des champs texte
    for (const key in processedData) {
      // Traitement spécial pour les compétences (skills)
      if (key === 'skills' && Array.isArray(processedData[key])) {
        formData.append('skills', processedData[key].join(','));
      }
      // Ignorer le champ profilePhoto car on le gère séparément
      else if (key === 'profilePhoto') {
        continue;
      }
      // Si c'est un tableau (autre que skills)
      else if (Array.isArray(processedData[key])) {
        formData.append(key, JSON.stringify(processedData[key]));
      }
      // Valeur simple (inclut aussi les chaînes vides et valeurs falsy)
      else if (processedData[key] !== null && processedData[key] !== undefined) {
        formData.append(key, processedData[key]);
      }
    }
    
    // Ajout de la photo de profil si fournie
    if (profilePhoto instanceof File) {
      formData.append('profilePhoto', profilePhoto);
    }
    
    // Log des données envoyées pour débogage
    console.log("Données envoyées au serveur:", Object.fromEntries(formData.entries()));
    
    const response = await axiosAPI.patch('/profile/me', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error);
    throw error;
  }
};

/**
 * Met à jour la photo de profil utilisateur
 * @param {File} profilePhotoFile - Fichier image pour la photo de profil
 * @returns {Promise} Promesse avec la réponse du serveur
 */
export const updateProfilePhoto = async (profilePhotoFile) => {
  try {
    // Validation du fichier
    if (!(profilePhotoFile instanceof File)) {
      throw new Error("Le paramètre doit être un fichier valide");
    }
    
    // Vérification du type de fichier
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(profilePhotoFile.type)) {
      throw new Error("Format de fichier non supporté. Utilisez JPG, JPEG ou PNG.");
    }
    
    // Vérification de la taille du fichier (5MB max)
    if (profilePhotoFile.size > 5 * 1024 * 1024) {
      throw new Error("La taille de l'image ne doit pas dépasser 5MB");
    }
    
    const formData = new FormData();
    formData.append('profilePhoto', profilePhotoFile);
    
    const response = await axiosAPI.patch('/profile/me', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la photo de profil:", error);
    throw error;
  }
};

/**
 * Récupère l'URL de la photo de profil en fonction de sa valeur
 * @param {string} profilePhoto - Nom ou URL de la photo de profil
 * @param {string} defaultAvatar - URL de l'avatar par défaut si aucune photo n'est disponible
 * @returns {string} URL complète de la photo de profil
 */
export const getProfilePhotoUrl = (profilePhoto, defaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23CBD5E0'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E") => {
  if (!profilePhoto) {
    return defaultAvatar;
  }
  
  // Si c'est déjà une URL complète
  if (profilePhoto.startsWith('http')) {
    return profilePhoto;
  }
  
  // Obtenir la base URL de l'API depuis la configuration axios ou l'env
  const baseURL = axiosAPI.defaults.baseURL || process.env.REACT_APP_API_URL || '';
  
  // Construire l'URL complète
  return `${baseURL}/uploads/profiles/${profilePhoto}`;
};

export default {
  getProfile,
  updateProfile,
  updateProfilePhoto,
  getProfilePhotoUrl
};