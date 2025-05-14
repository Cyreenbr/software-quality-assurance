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



export const getMYCV = async (studentId) => {
 try {
   // Validation de l'ID de l'étudiant
   if (!studentId) {
     throw new Error('L\'identifiant de l\'étudiant est requis');
   }
   
   console.log(`Récupération du CV pour l'étudiant avec l'ID: ${studentId}`);
   
   // Appel API avec gestion de timeout
   const response = await axiosAPI.get(`  `, {
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


