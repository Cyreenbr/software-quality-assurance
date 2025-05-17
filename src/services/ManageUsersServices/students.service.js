import axiosAPI from "../axiosAPI/axiosInstance";

export const getStudents = async () => {
  try {
    const response = await axiosAPI.get(`/students/`);
    console.log("Students retrieved:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
};

export const editStudent = async (_id, editedData) => {
  try {
    const response = await axiosAPI.patch(`/students/${_id}`, editedData);
    console.log("Student edited successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error editing student:", error);
    throw error;
  }
};

export const getStudentById = async (userid) => {
  try {
    const response = await axiosAPI.get(`/students/${userid}`);
    console.log("Student fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding user:", error.response?.data || error.message);
    throw error;
  }

};
export const deleteStudent = async (studentId, force = false) => {
  try {
    const response = await axiosAPI.post(`/students/archiveStudent`, {
      studentId,
      force: force // Bien envoyer le paramètre force
    });
    return response.data;
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    throw error;
  }
};
export const editPassword = async (_id, userpass) => {
  try {
    console.log("Sending password update:", {
      _id,
      oldPassword: userpass.oldPassword,
      newPassword: userpass.newPassword,
      confirmationPassword: userpass.confirmationPassword
    });
    
    const response = await axiosAPI.patch(`/students/${_id}/password`, userpass);
    
    console.log("Student's password updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating student's password:", error);
    throw error;
  }

};
export const getStudentsforTearchers = async () => {
  try {
    const response = await axiosAPI.get(`/students/studentslist`);
    console.log("Students retrieved:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
};
export const insertStudentsFromExcel= async (formData) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };
    const response = await axiosAPI.post(`/students/upload`, formData, config);
    console.log("student upload successful");
    return response.data;
  } catch (error) {
    console.error("Error uploading students:", error.response?.data || error.message);
    throw error;
  }
};
export const getCVacademique = async (studentId) => {
 try {
   // Validation de l'ID de l'étudiant
   if (!studentId) {
     throw new Error('L\'identifiant de l\'étudiant est requis');
   }
   
   console.log(`Récupération du CV pour l'étudiant avec l'ID: ${studentId}`);
   
   // Appel API avec gestion de timeout
   const response = await axiosAPI.get(`/cv/generate/${studentId}`, {
     timeout: 10000 // Timeout de 10 secondes
   });
   
   console.log('Réponse complète:', response.data);
   
   // Vérification des données de la réponse
   if (!response.data) {
     throw new Error('Aucune donnée reçue de l\'API');
   }
   
   if (!response.data.success) {
     throw new Error(response.data.message || 'Échec de la récupération des données du CV');
   }
   
   // Transformation des données pour correspondre à la structure attendue par le composant
   const cvData = response.data.data;
   const student = {
     firstName: cvData.personalInfo.firstName,
     lastName: cvData.personalInfo.lastName,
     email: cvData.personalInfo.email,
     phoneNumber: cvData.personalInfo.phoneNumber,
     birthDay: cvData.personalInfo.birthDay,
     level: cvData.education.currentLevel
   };
   
   // Formatage des données en fonction de la structure attendue par le composant
   const formattedData = {
     success: response.data.success,
     student: student,
     model: {
       formations: [
         cvData.education.bac && {
           diplome: `Baccalauréat ${cvData.education.bac.type}`,
           etablissement: "Lycée",
           anneeDebut: "",
           anneeFin: cvData.education.bac.year,
           mention: cvData.education.bac.mention
         },
         cvData.education.licence && {
           diplome: `Licence ${cvData.education.licence.type}`,
           etablissement: cvData.education.licence.institution,
           specialite: cvData.education.licence.speciality,
           anneeDebut: "",
           anneeFin: cvData.education.licence.year
         },
         cvData.education.master && {
           diplome: "Master",
           etablissement: cvData.education.master.institution,
           specialite: cvData.education.master.speciality,
           anneeDebut: "",
           anneeFin: cvData.education.master.year
         }
       ].filter(Boolean),
       
       competences: Object.entries(cvData.skills.technical).flatMap(([famille, skills]) => 
         skills.map(skill => ({
           nom: skill.title,
           niveau: "Acquis",
           famille: famille
         }))
       ),
       
       langues: cvData.skills.languages.map(lang => ({
         nom: lang.name,
         niveau: lang.level
       })),
       
       certificats: cvData.skills.diplomas.map(diploma => ({
         titre: diploma,
         organisme: "",
         dateObtention: ""
       })),
       
       experiences: cvData.experiences.map(exp => ({
         poste: exp.title,
         entreprise: exp.company,
         dateDebut: new Date(exp.startDate).toLocaleDateString(),
         dateFin: exp.endDate ? new Date(exp.endDate).toLocaleDateString() : "Présent",
         description: exp.description
       })),
       
       projets: [
         ...cvData.projects.pfa.map(pfa => ({
           titre: pfa.title,
           description: pfa.description,
           annee: "",
           technologies: pfa.technologies.join(", ")
         })),
         ...cvData.projects.pfe.map(pfe => ({
           titre: pfe.title,
           description: pfe.description,
           annee: "",
           technologies: pfe.technologies.join(", "),
           entreprise: pfe.company
         }))
       ]
     }
   };
   
   return formattedData;
 } catch (error) {
   // Gestion améliorée des erreurs
   if (error.response) {
     // Erreur de réponse du serveur
     console.error(`Erreur serveur (${error.response.status}):`, error.response.data);
     throw new Error(error.response.data?.message || `Erreur serveur: ${error.response.status}`);
   } else if (error.request) {
     // Absence de réponse du serveur
     console.error('Aucune réponse reçue du serveur:', error.request);
     throw new Error('Le serveur ne répond pas. Veuillez réessayer plus tard.');
   } else {
     // Autre erreur
     console.error('Erreur lors de la récupération du CV:', error.message);
     throw error;
   }
 }
};




export const getProfile = async () => {
  try {
    const response = await axiosAPI.get('/profile/me');
    console.log("Profile data retrieved:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

/*
export const getMYCV = async () => {
 try {
   // Remove spaces from URL
   const response = await axiosAPI.get(`/cv/me`, {
     timeout: 10000
   });
   
   console.log('Réponse complète:', response.data);
   
   // Check if response data exists
   if (!response.data) {
     throw new Error('Aucune donnée reçue de l\'API');
   }
   
   if (!response.data.success) {
     throw new Error(response.data.message || 'Échec de la récupération des données du CV');
   }
   
   // Get data from response and add safety checks
   const cvData = response.data.data || {};
   
   // Safety check - make sure personalInfo exists
   const personalInfo = cvData.personalInfo || {};
   const education = cvData.education || {};
   
   const student = {
     firstName: personalInfo.firstName || '',
     lastName: personalInfo.lastName || '',
     email: personalInfo.email || '',
     phoneNumber: personalInfo.phoneNumber || '',
     birthDay: personalInfo.birthDay || null,
     level: education.currentLevel || ''
   };
   
   // Safe access for nested objects
   const bac = education.bac || {};
   const licence = education.licence || {};
   const master = education.master || {};
   
   // Updated format with safety checks
   const formattedData = {
     success: response.data.success,
     student: student,
     model: {
       formations: [
         education.bac && {
           diplome: `Baccalauréat ${bac.type || ''}`,
           etablissement: "Lycée",
           anneeDebut: "",
           anneeFin: bac.year || '',
           mention: bac.mention || ''
         },
         education.licence && {
           diplome: `Licence ${licence.type || ''}`,
           etablissement: licence.institution || '',
           specialite: licence.speciality || '',
           anneeDebut: "",
           anneeFin: licence.year || ''
         },
         education.master && {
           diplome: "Master",
           etablissement: master.institution || '',
           specialite: master.speciality || '',
           anneeDebut: "",
           anneeFin: master.year || ''
         }
       ].filter(Boolean),
       
       // Add safety check for technical skills
       competences: cvData.skills && cvData.skills.technical ? 
         Object.entries(cvData.skills.technical).flatMap(([famille, skills]) => 
           skills.map(skill => ({
             nom: skill.title || '',
             niveau: "Acquis",
             famille: famille
           }))
         ) : [],
       
       // Add safety check for languages
       langues: cvData.skills && cvData.skills.languages ? 
         cvData.skills.languages.map(lang => ({
           nom: lang.name || '',
           niveau: lang.level || ''
         })) : [],
       
       // Add safety check for diplomas
       certificats: cvData.skills && cvData.skills.diplomas ? 
         cvData.skills.diplomas.map(diploma => ({
           titre: diploma || '',
           organisme: "",
           dateObtention: ""
         })) : [],
       
       // Add safety check for experiences
       experiences: cvData.experiences ? 
         cvData.experiences.map(exp => ({
           poste: exp.title || '',
           entreprise: exp.company || '',
           dateDebut: exp.startDate ? new Date(exp.startDate).toLocaleDateString() : '',
           dateFin: exp.endDate ? new Date(exp.endDate).toLocaleDateString() : "Présent",
           description: exp.description || ''
         })) : [],
       
       // Add safety checks for projects
       projets: [
         ...(cvData.projects && cvData.projects.pfa ? 
           cvData.projects.pfa.map(pfa => ({
             titre: pfa.title || '',
             description: pfa.description || '',
             annee: "",
             technologies: pfa.technologies ? pfa.technologies.join(", ") : ''
           })) : []),
         ...(cvData.projects && cvData.projects.pfe ? 
           cvData.projects.pfe.map(pfe => ({
             titre: pfe.title || '',
             description: pfe.description || '',
             annee: "",
             technologies: pfe.technologies ? pfe.technologies.join(", ") : '',
             entreprise: pfe.company || ''
           })) : [])
       ]
     }
   };
   
   return formattedData;
 } catch (error) {
   // Error handling remains the same
   if (error.response) {
     console.error(`Erreur serveur (${error.response.status}):`, error.response.data);
     throw new Error(error.response.data?.message || `Erreur serveur: ${error.response.status}`);
   } else if (error.request) {
     console.error('Aucune réponse reçue du serveur:', error.request);
     throw new Error('Le serveur ne répond pas. Veuillez réessayer plus tard.');
   } else {
     console.error('Erreur lors de la récupération du CV:', error.message);
     throw error;
   }
 }
};
*/

export const getMYCV = async () => {
  try {
    const response = await axiosAPI.get(`/cv/me`, {
      timeout: 10000
    });
    
    console.log('Réponse complète de l\'API CV:', response.data);
    
    if (!response.data) {
      throw new Error('Aucune donnée reçue de l\'API');
    }
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Échec de la récupération des données du CV');
    }
    
    // Get data from response
    const cvData = response.data.data || {};
    
    // Safety check for required objects
    const personalInfo = cvData.personalInfo || {};
    const education = cvData.education || {};
    const skills = cvData.skills || {};
    const experiences = cvData.experiences || [];
    const projects = cvData.projects || {};
    
    const student = {
      firstName: personalInfo.firstName || '',
      lastName: personalInfo.lastName || '',
      email: personalInfo.email || '',
      phoneNumber: personalInfo.phoneNumber || '',
      birthDay: personalInfo.birthDay || null,
      level: education.currentLevel || ''
    };
    
    // Safe access for nested objects
    const bac = education.bac || {};
    const licence = education.licence || {};
    const master = education.master || {};
    
    // Updated format with consistency from getCVacademique
    const formattedData = {
      success: response.data.success,
      student: student,
      model: {
        formations: [
          education.bac && {
            diplome: `Baccalauréat ${bac.type || ''}`,
            etablissement: "Lycée",
            anneeDebut: "",
            anneeFin: bac.year || '',
            mention: bac.mention || ''
          },
          education.licence && {
            diplome: `Licence ${licence.type || ''}`,
            etablissement: licence.institution || '',
            specialite: licence.speciality || '',
            anneeDebut: "",
            anneeFin: licence.year || ''
          },
          education.master && {
            diplome: "Master",
            etablissement: master.institution || '',
            specialite: master.speciality || '',
            anneeDebut: "",
            anneeFin: master.year || ''
          }
        ].filter(Boolean), // Filter out any undefined items
        
        // Modification pour harmoniser avec getCVacademique
        competences: skills.technical ? 
          Object.entries(skills.technical).flatMap(([famille, skills]) => 
            Array.isArray(skills) ? skills.map(skill => ({
              nom: skill.title || '',
              niveau: "Acquis",
              famille: famille
            })) : []
          ) : [],
        
        // Harmonisation avec getCVacademique
        langues: skills.languages && Array.isArray(skills.languages) ? 
          skills.languages.map(lang => ({
            nom: lang.name || '',
            niveau: lang.level || ''
          })) : [],
        
        // Harmonisation avec getCVacademique
        certificats: skills.diplomas && Array.isArray(skills.diplomas) ? 
          skills.diplomas.map(diploma => ({
            titre: diploma || '',
            organisme: "",
            dateObtention: ""
          })) : [],
        
        // Harmonisation avec getCVacademique
        experiences: Array.isArray(experiences) ? 
          experiences.map(exp => ({
            poste: exp.title || '',
            entreprise: exp.company || '',
            dateDebut: exp.startDate ? new Date(exp.startDate).toLocaleDateString() : '',
            dateFin: exp.endDate ? new Date(exp.endDate).toLocaleDateString() : "Présent",
            description: exp.description || ''
          })) : [],
        
        // Harmonisation avec getCVacademique pour les projets
        projets: [
          ...(projects.pfa && Array.isArray(projects.pfa) ? 
            projects.pfa.map(pfa => ({
              titre: pfa.title || '',
              description: pfa.description || '',
              annee: "",
              technologies: Array.isArray(pfa.technologies) ? pfa.technologies.join(", ") : ''
            })) : []),
          ...(projects.pfe && Array.isArray(projects.pfe) ? 
            projects.pfe.map(pfe => ({
              titre: pfe.title || '',
              description: pfe.description || '',
              annee: "",
              technologies: Array.isArray(pfe.technologies) ? pfe.technologies.join(", ") : '',
              entreprise: pfe.company || ''
            })) : [])
        ]
      }
    };
    
    console.log('Données formatées:', formattedData);
    return formattedData;
  } catch (error) {
    if (error.response) {
      console.error(`Erreur serveur (${error.response.status}):`, error.response.data);
      throw new Error(error.response.data?.message || `Erreur serveur: ${error.response.status}`);
    } else if (error.request) {
      console.error('Aucune réponse reçue du serveur:', error.request);
      throw new Error('Le serveur ne répond pas. Veuillez réessayer plus tard.');
    } else {
      console.error('Erreur lors de la récupération du CV:', error.message);
      throw error;
    }
  }
};/*
export const updateMyCV = async (cvData) => {
  try {
    const response = await axiosAPI.patch('/cv/CV', cvData);
    console.log("CV updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating CV:", error.response?.data || error.message);
    throw error;
  }


};
*/

// Service mis à jour pour updateMyCV
export const updateMyCV = async (cvData) => {
  try {
    // Map the client-side field names to the server-side expected field names
    const mappedData = {
      // Server expects 'languages', we have 'langues'
      languages: cvData.langues?.map(lang => ({
        name: lang.nom,
        level: lang.niveau
      })) || [],
      
      // Server expects 'experiences' with specific field names
      experiences: cvData.experiences?.map(exp => ({
        title: exp.poste,
        company: exp.entreprise,
        startDate: exp.dateDebut,
        endDate: exp.dateFin !== "Présent" ? exp.dateFin : null,
        description: exp.description
      })) || [],
      
      // Ajouter ces champs s'ils existent dans le formulaire
      // Vous devez les récupérer du formulaire et les ajouter ici
      university: cvData.university,
      institution: cvData.institution,
      speciality: cvData.speciality,
      lYear: cvData.lYear,
      typeL: cvData.typeL
    };

    console.log("Mapped data to send to server:", mappedData);
    
    const response = await axiosAPI.patch('/cv/CV', mappedData);
    console.log("CV updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating CV:", error.response?.data || error.message);
    throw error;
  }
};
import { toast } from 'react-toastify';

export const notifyAlumni = async () => {
  try {
    const response = await axiosAPI.post('/cv/notify-alumni');

    // Affiche un toast de succès
    toast.success(response.data.message || "Notification envoyée avec succès !");
    return response.data;
  } catch (error) {
    // Affiche un toast d'erreur avec le message du backend (si dispo)
    const message =
      error.response?.data?.message ||
      error.message ||
      "Une erreur est survenue lors de la notification.";
    
    toast.error(`Erreur : ${message}`);
    throw error;
  }
};
