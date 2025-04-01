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
      setSuccessMessage("Period added successfully!");
  
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
      setSuccessMessage("Period updated successfully!");
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
    <div className="max-w-5xl mx-auto mt-8 p-6 bg-white shadow-xl rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Manage Periods</h2>
        <button
          onClick={() => {
            setNewPeriod({ start: "", end: "", type: "" });
            setEditingPeriod(null);
            setShowForm(true);
          }}
          className="bg-blue-400 text-white p-3 rounded-full hover:bg-blue-700 transition shadow-md"
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
  );
};

export default AdminPeriods;
