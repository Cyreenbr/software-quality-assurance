/**
 * EXEMPLE D'UTILISATION DE GA4
 * 
 * Ce fichier montre comment utiliser GA4 pour tracker les événements
 * et mesurer l'efficacité selon ISO 25010 dans vos composants React.
 * 
 * Copiez les patterns de ce fichier dans vos propres composants.
 */

import { useState } from "react";
import useGA4TaskTracker from "../hooks/useGA4TaskTracker";
import useGA4Event from "../hooks/useGA4Event";

const GA4ExampleComponent = () => {
  // Hook pour tracker les tâches
  const { startTask, completeTask, errorTask, failTask } = useGA4TaskTracker();
  
  // Hook pour tracker les événements généraux
  const { trackUserAction, trackEvent } = useGA4Event();

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  // Exemple 1: Soumission de formulaire avec tracking
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Démarrer le suivi de la tâche
    const taskId = startTask("Form Submission", "Form");

    // Tracker l'action utilisateur (clic sur le bouton)
    trackUserAction("form_submit_click", "Submit Button", {
      form_name: "Example Form",
    });

    setLoading(true);

    try {
      // Simuler une requête API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Tracker un événement personnalisé
      trackEvent({
        action: "form_submitted",
        category: "Form",
        label: "Example Form",
        value: Object.keys(formData).length, // Nombre de champs remplis
      });

      // Tâche complétée avec succès
      const duration = completeTask(taskId);
      console.log(`Formulaire soumis avec succès en ${duration}ms`);

      setFormData({});
      alert("Formulaire soumis avec succès!");
    } catch (error) {
      // Enregistrer l'erreur
      errorTask(taskId, error.message);
      
      // Tracker l'erreur comme événement
      trackEvent({
        action: "form_error",
        category: "Form",
        label: "Example Form",
        customParams: {
          error_message: error.message,
        },
      });

      alert("Erreur lors de la soumission du formulaire");
    } finally {
      setLoading(false);
    }
  };

  // Exemple 2: Tracker un clic simple
  const handleButtonClick = () => {
    trackUserAction("button_click", "Example Button", {
      button_id: "example-btn",
      button_text: "Click me",
    });
  };

  // Exemple 3: Tracker une navigation
  const handleLinkClick = (destination) => {
    trackUserAction("link_click", destination, {
      link_type: "internal",
      destination,
    });
  };

  // Exemple 4: Processus multi-étapes
  const handleMultiStepProcess = async () => {
    // Étape 1
    const step1Id = startTask("Step 1: Validation", "MultiStep");
    try {
      await validateStep1();
      completeTask(step1Id);
    } catch (error) {
      errorTask(step1Id, error.message);
      return;
    }

    // Étape 2
    const step2Id = startTask("Step 2: Processing", "MultiStep");
    try {
      await processStep2();
      completeTask(step2Id);
    } catch (error) {
      errorTask(step2Id, error.message);
      return;
    }

    // Étape 3
    const step3Id = startTask("Step 3: Finalization", "MultiStep");
    try {
      await finalizeStep3();
      completeTask(step3Id);
    } catch (error) {
      failTask(step3Id, error.message); // failTask = error + complete
    }
  };

  // Exemple 5: Tracker une erreur avec contexte
  const handleErrorExample = () => {
    try {
      // Code qui peut échouer
      throw new Error("Something went wrong");
    } catch (error) {
      // Tracker l'erreur avec contexte
      trackEvent({
        action: "error_occurred",
        category: "Error",
        label: "Example Error",
        customParams: {
          error_type: error.name,
          error_message: error.message,
          stack_trace: error.stack,
          page: window.location.pathname,
        },
      });
    }
  };

  // Fonctions d'exemple (à remplacer par votre logique)
  const validateStep1 = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  const processStep2 = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  const finalizeStep3 = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Exemples d'utilisation GA4</h1>

      {/* Exemple 1: Formulaire */}
      <form onSubmit={handleFormSubmit} className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Exemple 1: Formulaire</h2>
        <input
          type="text"
          value={formData.name || ""}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Nom"
          className="border p-2 mb-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {loading ? "Envoi..." : "Soumettre"}
        </button>
      </form>

      {/* Exemple 2: Bouton simple */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Exemple 2: Bouton</h2>
        <button
          onClick={handleButtonClick}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Cliquez-moi
        </button>
      </div>

      {/* Exemple 3: Lien */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Exemple 3: Lien</h2>
        <button
          onClick={() => handleLinkClick("/dashboard")}
          className="text-blue-500 underline"
        >
          Aller au Dashboard
        </button>
      </div>

      {/* Exemple 4: Processus multi-étapes */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">
          Exemple 4: Processus multi-étapes
        </h2>
        <button
          onClick={handleMultiStepProcess}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          Démarrer le processus
        </button>
      </div>

      {/* Exemple 5: Gestion d'erreur */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Exemple 5: Erreur</h2>
        <button
          onClick={handleErrorExample}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Simuler une erreur
        </button>
      </div>
    </div>
  );
};

export default GA4ExampleComponent;

