import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import PeriodCard from "../../components/periodComponents/PeriodCard";
import PeriodForm from "../../components/periodComponents/PeriodForm";
import periodService from "../../services/periodSrvices/periodService";

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
        throw new Error("The API did not return an array of periods.");
      }
      setPeriods(response.periods);
    } catch (error) {
      console.error("Error loading periods:", error);
      setPeriods([]);
    }
  };

  const handleAdd = async (setSuccessMessage, setErrorMessage) => {
    if (!newPeriod.start || !newPeriod.end || (!editingPeriod && !newPeriod.type)) {
      setErrorMessage("All fields are required.");
      return;
    }

    try {
      const response = await periodService.addPeriod(newPeriod);
      setPeriods([...periods, response.period]);
      setSuccessMessage("Period added successfully and email scheduled!");
  
      // make it close late so I can see the message
      setTimeout(() => {
        resetForm();
      }, 3000);  //close after 3s  
    } catch (error) {
      console.error("Error adding period:", error);
      setErrorMessage("An error occurred.");
    }
  };
  
  const handleUpdate = async (setSuccessMessage, setErrorMessage) => {
    if (!newPeriod.start || !newPeriod.end) {
      setErrorMessage("Start and end dates are required.");
      return;
    }
  
    try {
      const response = await periodService.updatePeriod(editingPeriod._id, {
        start: newPeriod.start,
        end: newPeriod.end,
      });
      setPeriods(periods.map((p) => (p._id === editingPeriod._id ? response.period : p)));
      setSuccessMessage("Period updated successfully and email scheduled!");
      setTimeout(() => {
        resetForm();
      }, 3000);  
    } catch (error) {
      console.error("Error updating period:", error);
      setErrorMessage("An error occurred.");
    }
  };
  
  const resetForm = () => {
    setEditingPeriod(null);
    setNewPeriod({ start: "", end: "", type: "" });
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-200 py-10 rounded-lg ">
    <div className="max-w-5xl mx-auto mt-8 p-6">
      <h2 className="text-3xl font-bold text-gray-700 mb-6 text-center">Manage Periods</h2>
      <div className="flex justify-between items-center mb-6">
  <button
    onClick={() => {
      setNewPeriod({ start: "", end: "", type: "" });
      setEditingPeriod(null);
      setShowForm(true);
    }}
    
    className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-3 rounded-2xl shadow-lg  transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
  >
    <FontAwesomeIcon icon={faPlus} className="text-xl" />
  </button>
</div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {periods.map((period) => (
          <PeriodCard
            key={period._id}
            period={period}
            onEdit={() => {
              setEditingPeriod(period);
              setNewPeriod({
                start: period.start.split("T")[0],
                end: period.end.split("T")[0],
              });
              setShowForm(true);
            }}
          />
        ))}
      </div>

      {showForm && (
        <PeriodForm
          newPeriod={newPeriod}
          setNewPeriod={setNewPeriod}
          onSave={editingPeriod ? handleUpdate : handleAdd}
          onCancel={() => setShowForm(false)}
          editing={editingPeriod}
        />
      )}
    </div>
    </div>
  );
};

export default AdminPeriods;
