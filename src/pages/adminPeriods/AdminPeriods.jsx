import { useEffect, useState } from "react";
import periodService from "../../services/periodService";

const AdminPeriods = () => {
  const [periods, setPeriods] = useState([]);
  const [newPeriod, setNewPeriod] = useState({ start: "", end: "", type: "" });

  useEffect(() => {
    fetchPeriods();
  }, []);

  const fetchPeriods = async () => {
    try {
      const response = await periodService.getPeriods();
      if (!response || !response.periods) {
        throw new Error("L'API n'a pas renvoyé de périodes.");
      }
      setPeriods(response.periods);
    } catch (error) {
      console.error("Erreur lors du chargement des périodes :", error);
    }
  };

  const handleAddPeriod = async () => {
    try {
      console.log("Envoi des données :", newPeriod);
      const response = await periodService.addPeriod(newPeriod);

      console.log("Réponse reçue :", response);

      if (!response || !response.period) {
        throw new Error("L'API n'a pas renvoyé de période.");
      }

      setPeriods([...periods, response.period]);
      setNewPeriod({ start: "", end: "", type: "" });
      console.log("Période ajoutée :", response.period);

    } catch (error) {
      console.error("Erreur lors de l'ajout de la période :", error);
    }
  };

  return (
    <div>
      <h2>Admin Period</h2>
      <div>
        <input
          type="date"
          value={newPeriod.start}
          onChange={(e) => setNewPeriod({ ...newPeriod, start: e.target.value })}
        />
        <input
          type="date"
          value={newPeriod.end}
          onChange={(e) => setNewPeriod({ ...newPeriod, end: e.target.value })}
        />
        <select
          value={newPeriod.type}
          onChange={(e) => setNewPeriod({ ...newPeriod, type: e.target.value })}
        >
          <option value="">Sélectionner un type</option>
          <option value="periode_depot_stage">Dépôt Stage</option>
          <option value="periode_choix_option">Choix Option</option>
          <option value="periode_choix_pfa">Choix PFA</option>
        </select>
        <button onClick={handleAddPeriod}>Ajouter une période</button>
      </div>
      <ul>
        {periods.map((period) => (
          <li key={period._id}>
            {period.type}: {new Date(period.start).toLocaleDateString()} - {new Date(period.end).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPeriods;
