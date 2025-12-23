import { useCallback } from "react";
import ga4Service from "../services/analytics/ga4.service";

/**
 * Hook personnalisé pour envoyer facilement des événements GA4
 * 
 * @example
 * const MyComponent = () => {
 *   const { trackEvent, trackUserAction } = useGA4Event();
 * 
 *   const handleClick = () => {
 *     trackUserAction("button_click", "Submit Button");
 *   };
 * 
 *   const handleCustomEvent = () => {
 *     trackEvent({
 *       action: "custom_action",
 *       category: "Custom",
 *       label: "My Label",
 *       value: 100
 *     });
 *   };
 * 
 *   return <button onClick={handleClick}>Click me</button>;
 * };
 */
const useGA4Event = () => {
  /**
   * Envoie un événement personnalisé GA4
   * @param {object} eventParams - Paramètres de l'événement
   */
  const trackEvent = useCallback((eventParams) => {
    ga4Service.sendEvent(eventParams);
  }, []);

  /**
   * Enregistre une action utilisateur (clics, interactions)
   * @param {string} actionName - Nom de l'action
   * @param {string} elementLabel - Label de l'élément (optionnel)
   * @param {object} additionalParams - Paramètres supplémentaires (optionnel)
   */
  const trackUserAction = useCallback((actionName, elementLabel = null, additionalParams = {}) => {
    ga4Service.userAction(actionName, elementLabel, additionalParams);
  }, []);

  /**
   * Démarre une tâche (alias pour taskStart)
   * @param {string} taskName - Nom de la tâche
   * @param {string} taskCategory - Catégorie (optionnel)
   */
  const trackTaskStart = useCallback((taskName, taskCategory = "Task") => {
    ga4Service.taskStart(taskName, taskCategory);
  }, []);

  /**
   * Termine une tâche (alias pour taskComplete)
   * @param {string} taskName - Nom de la tâche
   * @param {number} startTime - Timestamp de début
   * @param {string} taskCategory - Catégorie (optionnel)
   */
  const trackTaskComplete = useCallback((taskName, startTime = null, taskCategory = "Task") => {
    ga4Service.taskComplete(taskName, taskCategory, startTime);
  }, []);

  /**
   * Enregistre une erreur de tâche (alias pour taskError)
   * @param {string} taskName - Nom de la tâche
   * @param {string} errorMessage - Message d'erreur (optionnel)
   * @param {string} taskCategory - Catégorie (optionnel)
   */
  const trackTaskError = useCallback((taskName, errorMessage = null, taskCategory = "Task") => {
    ga4Service.taskError(taskName, errorMessage, taskCategory);
  }, []);

  return {
    trackEvent,
    trackUserAction,
    trackTaskStart,
    trackTaskComplete,
    trackTaskError,
  };
};

export default useGA4Event;

