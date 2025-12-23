import ReactGA from "react-ga4";

/**
 * Service Google Analytics 4 (GA4)
 * 
 * Service centralisé pour l'initialisation et le tracking des événements GA4
 * Conforme aux normes ISO 25010 pour la mesure de l'efficacité
 */
class GA4Service {
  constructor() {
    this.isInitialized = false;
    this.measurementId = null;
  }

  /**
   * Initialise Google Analytics 4
   * @param {string} measurementId - Le Measurement ID GA4 (format: G-XXXXXXXXXX)
   * @param {object} config - Configuration optionnelle pour GA4
   */
  initialize(measurementId, config = {}) {
    if (this.isInitialized) {
      console.warn("GA4: Déjà initialisé. Ignorant la réinitialisation.");
      return;
    }

    if (!measurementId) {
      console.warn("GA4: Measurement ID non fourni. Le tracking GA4 est désactivé.");
      return;
    }

    try {
      this.measurementId = measurementId;
      
      // Configuration par défaut
      const defaultConfig = {
        testMode: import.meta.env.DEV, // Mode test en développement
        debug_mode: import.meta.env.DEV, // Mode debug en développement
        ...config,
      };

      ReactGA.initialize(measurementId, defaultConfig);
      this.isInitialized = true;

      // Envoyer la pageview initiale
      this.sendPageView(window.location.pathname + window.location.search);

      console.log("GA4: Initialisé avec succès", { measurementId, config: defaultConfig });
    } catch (error) {
      console.error("GA4: Erreur lors de l'initialisation", error);
    }
  }

  /**
   * Envoie une pageview
   * @param {string} page - Le chemin de la page (ex: /dashboard)
   * @param {string} title - Le titre de la page (optionnel)
   */
  sendPageView(page, title = null) {
    if (!this.isInitialized) {
      console.warn("GA4: Non initialisé. Impossible d'envoyer la pageview.");
      return;
    }

    try {
      const params = { page };
      if (title) {
        params.title = title;
      }

      ReactGA.send({ hitType: "pageview", ...params });
    } catch (error) {
      console.error("GA4: Erreur lors de l'envoi de la pageview", error);
    }
  }

  /**
   * Envoie un événement personnalisé
   * @param {object} eventParams - Paramètres de l'événement
   * @param {string} eventParams.action - Action de l'événement (requis)
   * @param {string} eventParams.category - Catégorie de l'événement (requis)
   * @param {string} eventParams.label - Label de l'événement (optionnel)
   * @param {number} eventParams.value - Valeur numérique (optionnel)
   * @param {object} eventParams.customParams - Paramètres personnalisés supplémentaires (optionnel)
   */
  sendEvent({ action, category, label = null, value = null, customParams = {} }) {
    if (!this.isInitialized) {
      console.warn("GA4: Non initialisé. Impossible d'envoyer l'événement.", { action, category });
      return;
    }

    if (!action || !category) {
      console.warn("GA4: Action et category sont requis pour envoyer un événement.");
      return;
    }

    try {
      const eventParams = {
        category,
        action,
        ...(label && { label }),
        ...(value !== null && { value }),
        ...customParams,
      };

      ReactGA.event(eventParams);
    } catch (error) {
      console.error("GA4: Erreur lors de l'envoi de l'événement", error);
    }
  }

  /**
   * Mesure l'efficacité selon ISO 25010 - Début d'une tâche
   * @param {string} taskName - Nom de la tâche (ex: "Formulaire A")
   * @param {string} taskCategory - Catégorie de la tâche (optionnel, défaut: "Task")
   * @returns {number} Timestamp de début pour calculer la durée
   */
  taskStart(taskName, taskCategory = "Task") {
    if (!taskName) {
      console.warn("GA4: taskName est requis pour taskStart.");
      return null;
    }

    // Stocker le temps de début dans le localStorage pour persister entre les rechargements
    const startTime = performance.now();
    const taskKey = `ga4_task_${taskName}_${Date.now()}`;
    
    try {
      window.sessionStorage.setItem(taskKey, startTime.toString());
      window.currentTaskKey = taskKey;

      this.sendEvent({
        action: "task_start",
        category: taskCategory,
        label: taskName,
        customParams: {
          task_id: taskKey,
          timestamp: Date.now(),
        },
      });

      return startTime;
    } catch (error) {
      console.error("GA4: Erreur lors du démarrage de la tâche", error);
      return null;
    }
  }

  /**
   * Mesure l'efficacité selon ISO 25010 - Fin d'une tâche avec durée
   * @param {string} taskName - Nom de la tâche (doit correspondre au taskStart)
   * @param {string} taskCategory - Catégorie de la tâche (optionnel, défaut: "Task")
   * @param {number} startTime - Timestamp de début (optionnel, si fourni directement)
   * @returns {number|null} Durée en millisecondes ou null si erreur
   */
  taskComplete(taskName, taskCategory = "Task", startTime = null) {
    if (!taskName) {
      console.warn("GA4: taskName est requis pour taskComplete.");
      return null;
    }

    try {
      let duration = null;

      if (startTime !== null) {
        // Si le startTime est fourni directement
        duration = performance.now() - startTime;
      } else {
        // Sinon, chercher dans sessionStorage
        const taskKey = window.currentTaskKey || `ga4_task_${taskName}_${Date.now()}`;
        const storedStartTime = window.sessionStorage.getItem(taskKey);

        if (storedStartTime) {
          duration = performance.now() - parseFloat(storedStartTime);
          window.sessionStorage.removeItem(taskKey);
        } else {
          console.warn(`GA4: Impossible de trouver le temps de début pour la tâche "${taskName}".`);
          return null;
        }
      }

      if (duration !== null && duration >= 0) {
        this.sendEvent({
          action: "task_complete",
          category: taskCategory,
          label: taskName,
          value: Math.round(duration), // Durée en millisecondes arrondie
          customParams: {
            duration_ms: Math.round(duration),
            duration_seconds: Math.round(duration / 1000),
          },
        });

        return duration;
      }

      return null;
    } catch (error) {
      console.error("GA4: Erreur lors de la complétion de la tâche", error);
      return null;
    }
  }

  /**
   * Mesure l'efficacité selon ISO 25010 - Erreur dans une tâche
   * @param {string} taskName - Nom de la tâche où l'erreur s'est produite
   * @param {string} errorMessage - Message d'erreur (optionnel)
   * @param {string} taskCategory - Catégorie de la tâche (optionnel, défaut: "Task")
   */
  taskError(taskName, errorMessage = null, taskCategory = "Task") {
    if (!taskName) {
      console.warn("GA4: taskName est requis pour taskError.");
      return;
    }

    this.sendEvent({
      action: "task_error",
      category: taskCategory,
      label: taskName,
      customParams: {
        error_message: errorMessage || "Unknown error",
        timestamp: Date.now(),
      },
    });
  }

  /**
   * Enregistre une action utilisateur (clics, interactions)
   * @param {string} actionName - Nom de l'action (ex: "button_click", "form_submit")
   * @param {string} elementLabel - Label de l'élément interacté (ex: "Submit Button", "Search Form")
   * @param {object} additionalParams - Paramètres supplémentaires (optionnel)
   */
  userAction(actionName, elementLabel = null, additionalParams = {}) {
    if (!actionName) {
      console.warn("GA4: actionName est requis pour userAction.");
      return;
    }

    this.sendEvent({
      action: "user_action",
      category: "Interaction",
      label: elementLabel || actionName,
      customParams: {
        action_name: actionName,
        ...additionalParams,
      },
    });
  }

  /**
   * Vérifie si GA4 est initialisé
   * @returns {boolean}
   */
  getIsInitialized() {
    return this.isInitialized;
  }

  /**
   * Récupère le Measurement ID
   * @returns {string|null}
   */
  getMeasurementId() {
    return this.measurementId;
  }

  /**
   * Marque un événement comme conversion (pour faciliter la création de funnels dans GA4)
   * Cette fonction envoie un événement spécialement formaté pour être facilement identifiable
   * comme conversion dans l'interface GA4
   * 
   * @param {string} conversionName - Nom de la conversion (ex: "login_success", "cv_saved")
   * @param {object} additionalData - Données supplémentaires à inclure
   */
  trackConversion(conversionName, additionalData = {}) {
    if (!this.isInitialized) {
      console.warn("GA4: Non initialisé. Impossible de tracker la conversion.", conversionName);
      return;
    }

    try {
      // Envoyer l'événement avec un nom de conversion clair
      ReactGA.event({
        action: "conversion",
        category: "Conversion",
        label: conversionName,
        customParams: {
          conversion_name: conversionName,
          ...additionalData,
        },
      });

      // Aussi envoyer comme événement personnalisé pour faciliter le tracking dans GA4
      ReactGA.event(conversionName, {
        conversion: true,
        ...additionalData,
      });
    } catch (error) {
      console.error("GA4: Erreur lors du tracking de conversion", error);
    }
  }
}

// Export d'une instance singleton
const ga4Service = new GA4Service();
export default ga4Service;

