import { useEffect, useState } from "react";
import periodService from "../services/periodService";

const AdminPeriods = () => {
  const [periods, setPeriods] = useState([]);
  const [newPeriod, setNewPeriod] = useState({ start: "", end: "", type: "" });
  const [editingPeriod, setEditingPeriod] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchPeriods();
  }, []);

  const fetchPeriods = async () => {
    try {
      const response = await periodService.getPeriods();
      if (!response || !Array.isArray(response.periods)) {
        throw new Error("L'API n'a pas renvoyé de tableau de périodes.");
      }
      setPeriods(response.periods);
    } catch (error) {
      console.error("Erreur lors du chargement des périodes :", error);
      setPeriods([]);
    }
  };

  const handleAddOrUpdatePeriod = async () => {
    try {
      if (editingPeriod) {
        const response = await periodService.updatePeriod(editingPeriod._id, newPeriod);
        setPeriods(periods.map(p => (p._id === editingPeriod._id ? response.period : p)));
        setEditingPeriod(null);
      } else {
        const response = await periodService.addPeriod(newPeriod);
        setPeriods([...periods, response.period]);
      }
      setNewPeriod({ start: "", end: "", type: "" });
      setShowForm(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout/modification de la période :", error);
    }
  };

  const handleEdit = (period) => {
    setEditingPeriod(period);
    setNewPeriod({ start: period.start.split("T")[0], end: period.end.split("T")[0], type: period.type });
    setShowForm(true);
  };

  return (
    <div className={`max-w-5xl mx-auto mt-8 p-6 bg-white shadow-xl rounded-lg relative ${showForm ? 'backdrop-blur-md' : ''}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Gérer les Périodes</h2>
        <button 
          onClick={() => setShowForm(true)} 
          className="bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700 shadow-md transition"
        >
          Ajouter une période
        </button>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition ${showForm ? 'opacity-50 blur-sm' : ''}`}>
        {periods.length > 0 ? (
          periods.map((period) => (
            <div key={period._id} className="p-4 bg-gray-100 text-gray-800 shadow-lg rounded-lg flex justify-between items-center transition transform hover:scale-105">
              <div>
                <h3 className="font-semibold text-teal-700">{period.type.replace(/_/g, " ")}</h3>
                <p>{new Date(period.start).toLocaleDateString()} - {new Date(period.end).toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => handleEdit(period)}
                className="bg-teal-500 text-white px-4 py-2 rounded-md text-sm hover:bg-teal-700 shadow-md transition"
              >
                Modifier
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">Aucune période trouvée.</p>
        )}
      </div>

      {showForm && (
        <div className="absolute inset-x-0 top-20 mx-auto w-full max-w-lg bg-white p-6 rounded-lg shadow-lg text-gray-800">
          <h3 className="text-xl font-semibold mb-4">{editingPeriod ? "Modifier la période" : "Ajouter une période"}</h3>
          <form className="space-y-4">
            <div>
              <label className="block font-medium">Début de Période</label>
              <input
                type="date"
                value={newPeriod.start}
                onChange={(e) => setNewPeriod({ ...newPeriod, start: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-400 transition"
                required
              />
            </div>

            <div>
              <label className="block font-medium">Fin de Période</label>
              <input
                type="date"
                value={newPeriod.end}
                onChange={(e) => setNewPeriod({ ...newPeriod, end: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-400 transition"
                required
              />
            </div>

            <div>
              <label className="block font-medium">Type de Période</label>
              <select
                value={newPeriod.type}
                onChange={(e) => setNewPeriod({ ...newPeriod, type: e.target.value })}
                className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-teal-400 transition"
                required
              >
                <option value="">Sélectionner un type</option>
                <option value="periode_depot_stage">Dépôt Stage</option>
                <option value="periode_choix_option">Choix Option</option>
                <option value="periode_choix_pfa">Choix PFA</option>
              </select>
            </div>

            <div className="flex justify-between">
              <button 
                type="button" 
                onClick={() => setShowForm(false)} 
                className="bg-gray-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-600 shadow-md transition"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleAddOrUpdatePeriod}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700 shadow-md transition"
              >
                {editingPeriod ? "Modifier" : "Ajouter"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminPeriods;
