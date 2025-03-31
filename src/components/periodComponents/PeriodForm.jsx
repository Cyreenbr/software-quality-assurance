const PeriodForm = ({ newPeriod, setNewPeriod, onSave, onCancel, editing }) => {
    return (
      <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
          <button onClick={onCancel} className="absolute top-4 right-4 text-gray-600 hover:text-gray-800">
            ✕
          </button>
          <h3 className="text-xl font-semibold mb-4">{editing ? "Modifier la période" : "Ajouter une période"}</h3>
  
          <form className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Début de Période</label>
              <input
                type="date"
                value={newPeriod.start}
                onChange={(e) => setNewPeriod({ ...newPeriod, start: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 transition"
                required
              />
            </div>
  
            <div>
              <label className="block font-medium mb-1">Fin de Période</label>
              <input
                type="date"
                value={newPeriod.end}
                onChange={(e) => setNewPeriod({ ...newPeriod, end: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 transition"
                required
              />
            </div>
  
            <div>
              <label className="block font-medium mb-1">Type de Période</label>
              <select
                value={newPeriod.type}
                onChange={(e) => setNewPeriod({ ...newPeriod, type: e.target.value })}
                className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-400 transition"
                required
              >
                <option value="">Sélectionner un type</option>
                <option value="periode_depot_stage">Dépôt Stage</option>
                <option value="periode_choix_option">Choix Option</option>
                <option value="periode_choix_pfa">Choix PFA</option>
              </select>
            </div>
  
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={onSave}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 shadow-md transition"
              >
                {editing ? "Modifier" : "Ajouter"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  export default PeriodForm;
  