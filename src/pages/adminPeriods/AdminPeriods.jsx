// src/pages/AdminPeriods.jsx
import { useEffect, useState } from "react";
import PeriodCard from "../../components/periodComponents/PeriodCard";
import PeriodForm from "../../components/periodComponents/PeriodForm";
import periodService from "../../services/periodService";


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

  const handleSave = async () => {
    try {
      if (editingPeriod) {
        const response = await periodService.updatePeriod(editingPeriod._id, newPeriod);
        setPeriods(periods.map(p => (p._id === editingPeriod._id ? response.period : p)));
      } else {
        const response = await periodService.addPeriod(newPeriod);
        setPeriods([...periods, response.period]);
      }
      setEditingPeriod(null);
      setNewPeriod({ start: "", end: "", type: "" });
      setShowForm(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout/modification de la période :", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 p-6 bg-white shadow-xl rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Gérer les Périodes</h2>
        <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Ajouter une période
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {periods.map((period) => (
          <PeriodCard key={period._id} period={period} onEdit={() => { setEditingPeriod(period); setShowForm(true); }} />
        ))}
      </div>

      {showForm && <PeriodForm newPeriod={newPeriod} setNewPeriod={setNewPeriod} onSave={handleSave} onCancel={() => setShowForm(false)} editing={editingPeriod} />}
    </div>
  );
};

export default AdminPeriods;
