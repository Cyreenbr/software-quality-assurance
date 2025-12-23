import { useEffect, useRef } from "react";
import taskTracker from "../services/analytics/taskTracker";

/**
 * Hook personnalisé pour tracker facilement les tâches dans les composants React
 * 
 * @example
 * const MyComponent = () => {
 *   const { startTask, completeTask, errorTask } = useGA4TaskTracker();
 * 
 *   const handleFormSubmit = async () => {
 *     const taskId = startTask("Form Submission", "Form");
 *     try {
 *       await submitForm();
 *       completeTask(taskId);
 *     } catch (error) {
 *       errorTask(taskId, error.message);
 *     }
 *   };
 * 
 *   return <button onClick={handleFormSubmit}>Submit</button>;
 * };
 */
const useGA4TaskTracker = () => {
  const activeTasksRef = useRef(new Map()); // Stocker les tâches actives du composant

  /**
   * Démarre le suivi d'une tâche
   * @param {string} taskName - Nom de la tâche
   * @param {string} taskCategory - Catégorie de la tâche (optionnel)
   * @returns {string} ID de la tâche
   */
  const startTask = (taskName, taskCategory = "Task") => {
    const taskId = taskTracker.start(taskName, taskCategory);
    if (taskId) {
      activeTasksRef.current.set(taskId, { taskName, taskCategory });
    }
    return taskId;
  };

  /**
   * Termine le suivi d'une tâche avec succès
   * @param {string} taskId - ID de la tâche
   * @returns {number|null} Durée en millisecondes
   */
  const completeTask = (taskId) => {
    if (!taskId) {
      return null;
    }
    const duration = taskTracker.complete(taskId, true);
    if (duration !== null) {
      activeTasksRef.current.delete(taskId);
    }
    return duration;
  };

  /**
   * Enregistre une erreur dans une tâche
   * @param {string} taskId - ID de la tâche
   * @param {string} errorMessage - Message d'erreur
   */
  const errorTask = (taskId, errorMessage = "Unknown error") => {
    if (!taskId) {
      return;
    }
    taskTracker.error(taskId, errorMessage);
    activeTasksRef.current.delete(taskId);
  };

  /**
   * Termine une tâche avec échec (marque comme erreur)
   * @param {string} taskId - ID de la tâche
   * @returns {number|null} Durée en millisecondes
   */
  const failTask = (taskId, errorMessage = "Task failed") => {
    if (!taskId) {
      return null;
    }
    taskTracker.error(taskId, errorMessage);
    const duration = taskTracker.complete(taskId, false);
    activeTasksRef.current.delete(taskId);
    return duration;
  };

  // Nettoyer les tâches actives lors du démontage du composant
  useEffect(() => {
    return () => {
      // Annuler toutes les tâches actives non complétées
      activeTasksRef.current.forEach((task, taskId) => {
        taskTracker.error(taskId, "Component unmounted - task incomplete");
        taskTracker.complete(taskId, false);
      });
      activeTasksRef.current.clear();
    };
  }, []);

  return {
    startTask,
    completeTask,
    errorTask,
    failTask,
  };
};

export default useGA4TaskTracker;

