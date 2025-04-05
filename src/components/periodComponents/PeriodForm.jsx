import { useEffect, useState } from "react";

const PeriodForm = ({ newPeriod, setNewPeriod, onSave, onCancel, editing }) => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-40">
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative z-50">
        <button onClick={onCancel} className="absolute top-4 right-4 text-gray-600 hover:text-gray-800">
          ✕
        </button>
        <h3 className="text-xl font-semibold mb-4">{editing ? "Edit Period" : "Add Period"}</h3>

        {successMessage && (
          <div className="bg-green-200 text-green-700 px-4 py-2 rounded-md mb-4">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="bg-red-200 text-red-700 px-4 py-2 rounded-md mb-4">
            {errorMessage}
          </div>
        )}

        <form className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Start of Period</label>
            <input
              type="date"
              value={newPeriod.start}
              onChange={(e) => setNewPeriod({ ...newPeriod, start: e.target.value })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 transition"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">End of Period</label>
            <input
              type="date"
              value={newPeriod.end}
              onChange={(e) => setNewPeriod({ ...newPeriod, end: e.target.value })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 transition"
              required
            />
          </div>

          {!editing && (
            <div>
              <label className="block font-medium mb-1">Period Type</label>
              <select
                value={newPeriod.type}
                onChange={(e) => setNewPeriod({ ...newPeriod, type: e.target.value })}
                className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-400 transition"
                required
              >
                <option value="">Select a type</option>
                <option value="periode_depot_stage">Internship</option>
                <option value="periode_choix_option">Option</option>
                <option value="periode_depot_pfa">depot PFA</option>
                <option value="periode_choix_pfe">Choix PFE</option>

              </select>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => onSave(setSuccessMessage, setErrorMessage)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 shadow-md transition"
            >
              {editing ? "Edit" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PeriodForm;
