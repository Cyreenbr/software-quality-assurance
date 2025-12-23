import ga4Service from "./ga4.service";

/**
 * Service pour tracker les conversions importantes
 * 
 * Utilisez ces fonctions pour marquer les événements importants comme conversions
 * Cela facilitera la création de funnels dans GA4
 */

/**
 * Conversions liées à l'authentification
 */
export const authConversions = {
  /**
   * Marque une connexion réussie comme conversion
   * @param {object} additionalData - Données supplémentaires
   */
  loginSuccess: (additionalData = {}) => {
    ga4Service.trackConversion("login_success", additionalData);
  },

  /**
   * Marque une inscription réussie comme conversion
   * @param {object} additionalData - Données supplémentaires
   */
  signupSuccess: (additionalData = {}) => {
    ga4Service.trackConversion("signup_success", additionalData);
  },
};

/**
 * Conversions liées au CV
 */
export const cvConversions = {
  /**
   * Marque une sauvegarde de CV comme conversion
   * @param {object} additionalData - Données supplémentaires
   */
  cvSaved: (additionalData = {}) => {
    ga4Service.trackConversion("cv_saved", additionalData);
  },

  /**
   * Marque une création de CV comme conversion
   * @param {object} additionalData - Données supplémentaires
   */
  cvCreated: (additionalData = {}) => {
    ga4Service.trackConversion("cv_created", additionalData);
  },
};

/**
 * Conversions liées aux options (PFA)
 */
export const optionConversions = {
  /**
   * Marque une sélection d'option comme conversion
   * @param {string} optionName - Nom de l'option sélectionnée
   * @param {object} additionalData - Données supplémentaires
   */
  optionSelected: (optionName = "", additionalData = {}) => {
    ga4Service.trackConversion("option_selected", {
      option_name: optionName,
      ...additionalData,
    });
  },
};

/**
 * Conversions liées aux évaluations
 */
export const evaluationConversions = {
  /**
   * Marque une soumission d'évaluation comme conversion
   * @param {string} subjectId - ID de la matière
   * @param {object} additionalData - Données supplémentaires
   */
  evaluationSubmitted: (subjectId = "", additionalData = {}) => {
    ga4Service.trackConversion("evaluation_submitted", {
      subject_id: subjectId,
      ...additionalData,
    });
  },
};

/**
 * Conversions liées aux soumissions (Stage/PFE)
 */
export const submissionConversions = {
  /**
   * Marque une soumission de stage/PFE comme conversion
   * @param {string} type - Type de soumission ("internship" ou "pfe")
   * @param {object} additionalData - Données supplémentaires
   */
  submissionCompleted: (type = "internship", additionalData = {}) => {
    ga4Service.trackConversion("submission_completed", {
      submission_type: type,
      ...additionalData,
    });
  },
};

/**
 * Conversions liées aux actions admin
 */
export const adminConversions = {
  /**
   * Marque une action admin importante comme conversion
   * @param {string} actionType - Type d'action (ex: "user_created", "period_opened")
   * @param {object} additionalData - Données supplémentaires
   */
  adminAction: (actionType = "", additionalData = {}) => {
    ga4Service.trackConversion("admin_action", {
      action_type: actionType,
      ...additionalData,
    });
  },
};

/**
 * Fonction utilitaire pour tracker une conversion générique
 * @param {string} conversionName - Nom de la conversion
 * @param {object} additionalData - Données supplémentaires
 */
export const trackConversion = (conversionName, additionalData = {}) => {
  ga4Service.trackConversion(conversionName, additionalData);
};

/**
 * Export de toutes les conversions pour facilité d'utilisation
 */
export default {
  auth: authConversions,
  cv: cvConversions,
  option: optionConversions,
  evaluation: evaluationConversions,
  submission: submissionConversions,
  admin: adminConversions,
  track: trackConversion,
};

