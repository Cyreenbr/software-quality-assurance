import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import PeriodCard from "../../components/periodComponents/PeriodCard";
import PeriodForm from "../../components/periodComponents/PeriodForm";
import periodService from "../../services/periodSrvices/period.service";

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
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-100 py-10 rounded-lg ">
    <div className="max-w-5xl bg-white rounded-lg mx-auto mt-8 p-6">
      <h2 className="text-2xl font-bold text-black-700 mb-6 text-start">Manage Periods</h2>
      <div className="flex justify-end items-center mb-6">
  <button
    onClick={() => {
      setNewPeriod({ start: "", end: "", type: "" });
      setEditingPeriod(null);
      setShowForm(true);
    }}
    
    className="bg-green-500 text-white p-3 rounded-2xl shadow-lg  transition-all duration-300 transform hover:scale-105 "
  >
    <FontAwesomeIcon icon={faPlus} className="mr-2" />
    <span className="font-semibold">Add Period</span>
  </button>
</div>

      <div className="flex flex-col gap-6">
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
