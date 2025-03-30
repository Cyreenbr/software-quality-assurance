import axios from "axios";

const API_BASE_URL = "http://localhost:3000"; 

const periodService = {
  getPeriods: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/period/open`);
      const result = await response.json();
      console.log("Périodes chargées :", result);
      return result;
    } catch (error) {
      console.error("Erreur API (GET periods) :", error);
      return null;
    }
  },

  addPeriod: async (periodData) => {
    try {
      console.log("Données envoyées à l'API :", periodData);
      const response = await fetch(`${API_BASE_URL}/period/open`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(periodData),
      });

      const result = await response.json();
      console.log("Réponse brute de l'API :", result);

      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}: ${result.message || "Réponse invalide"}`);
      }

      return result;
    } catch (error) {
      console.error("Erreur API (POST addPeriod) :", error);
      return null;
    }
  },

  updatePeriod: async (id, updatedData) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/period/open/${id}`, updatedData, {
        headers: { "Content-Type": "application/json" }
      });
      
      console.log("Période mise à jour :", response.data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la modification de la période :", error);
      return null;
    }
  }
};

export default periodService;
