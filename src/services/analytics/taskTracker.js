import ga4Service from "./ga4.service";

/**
 * Utilitaire pour tracker les tâches selon ISO 25010
 * 
 * Cette classe facilite le suivi de l'efficacité des tâches utilisateur
 * en mesurant les temps d'exécution et les erreurs.
 */
class TaskTracker {
  constructor() {
    this.activeTasks = new Map(); // Map pour stocker les tâches actives
  }

  /**
   * Démarre le suivi d'une tâche
   * @param {string} taskName - Nom unique de la tâche
   * @param {string} taskCategory - Catégorie de la tâche (optionnel)
   * @returns {string} ID de la tâche pour référence ultérieure
   */
  start(taskName, taskCategory = "Task") {
    if (!taskName) {
      console.warn("TaskTracker: taskName est requis.");
      return null;
    }

    const taskId = `${taskName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = performance.now();

    // Stocker dans la Map active
    this.activeTasks.set(taskId, {
      taskName,
      taskCategory,
      startTime,
      taskId,
    });

    // Envoyer l'événement GA4
    ga4Service.taskStart(taskName, taskCategory);

    return taskId;
  }

  /**
   * Termine le suivi d'une tâche
   * @param {string} taskId - ID de la tâche retourné par start()
   * @param {boolean} success - Indique si la tâche s'est terminée avec succès (par défaut: true)
   * @returns {number|null} Durée en millisecondes ou null si erreur
   */
  complete(taskId, success = true) {
    if (!taskId) {
      console.warn("TaskTracker: taskId est requis.");
      return null;
    }

    const task = this.activeTasks.get(taskId);
    if (!task) {
      console.warn(`TaskTracker: Tâche "${taskId}" non trouvée.`);
      return null;
    }

    const duration = performance.now() - task.startTime;
    
    // Retirer de la Map active
    this.activeTasks.delete(taskId);

    if (success) {
      ga4Service.taskComplete(task.taskName, task.taskCategory, task.startTime);
    } else {
      ga4Service.taskError(task.taskName, "Task completed with failure", task.taskCategory);
    }

    return duration;
  }

  /**
   * Enregistre une erreur dans une tâche active
   * @param {string} taskId - ID de la tâche
   * @param {string} errorMessage - Message d'erreur
   */
  error(taskId, errorMessage = "Unknown error") {
    if (!taskId) {
      console.warn("TaskTracker: taskId est requis.");
      return;
    }

    const task = this.activeTasks.get(taskId);
    if (!task) {
      console.warn(`TaskTracker: Tâche "${taskId}" non trouvée.`);
      return;
    }

    ga4Service.taskError(task.taskName, errorMessage, task.taskCategory);
  }

  /**
   * Obtient toutes les tâches actives
   * @returns {Array} Liste des tâches actives
   */
  getActiveTasks() {
    return Array.from(this.activeTasks.values());
  }

  /**
   * Nettoie toutes les tâches actives (utile en cas de navigation ou nettoyage)
   */
  clear() {
    this.activeTasks.clear();
  }
}

// Export d'une instance singleton
const taskTracker = new TaskTracker();
export default taskTracker;

