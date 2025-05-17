import React, { useEffect, useState } from "react";
import pfaService from "../../services/PfaServices/pfaService";

export default function PfaPlannigPopUp() {
  const [rooms, setRooms] = useState([]);
  const [startDay, setStartDay] = useState();
  const [endDay, setEndDay] = useState();
  const [soutenances, setSoutenances] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isVisible, setIsVisible] = useState(true); // to control the visibility of the modal

  const fetchData = async () => {
    try {
      const pfaSoutenanceList = await pfaService.getSoutenancesPfas();
      console.log("3aslemmmmmmaaaa!!!");
      console.log(pfaSoutenanceList);
      // setStudents(studentResponse.model);
    } catch (error) {
      console.error("Error fetching PFA or student data:", error);
      setErrorMessage("Error fetching data. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePfaPlanning = async () => {
    if (!rooms || !startDay || !endDay) {
      setErrorMessage("Please Select both student and PFA");
      setTimeout(() => setErrorMessage(""), 3000); // Clear the error message after 3 seconds
      return;
    }

    try {
      // Calling the service to assign the PFA to the student
      const response = await pfaService.pfaAutoPlanning(rooms, [
        startDay,
        endDay,
      ]);
      console.log(response);

      // await fetchData(); // Appelle à nouveau pour mettre à jour la liste

      setIsVisible(false); // Close the modal after successful assignment
    } catch (err) {
      setErrorMessage(err.error || "Assignment failed");
      setTimeout(() => setErrorMessage(""), 3000); // Clear the error message after 3 seconds
    }
  };

  const handleCancel = () => {
    setIsVisible(false); // Close the modal on cancel
  };

  if (!isVisible) return null; // Don't render the component if it's not visible

  return (
    <div className="fixed inset-0 mt-20 z-20 bg-transparent bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl p-6 space-y-6">
        <h3 className="text-2xl font-bold text-center text-white bg-gradient-to-r from-indigo-600 to-purple-400 py-3 rounded-t-xl">
          Create Defence
        </h3>

        {errorMessage && (
          <div className="bg-red-100 border border-red-300 text-red-700 text-sm rounded-md px-4 py-2 text-center">
            {errorMessage}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            entre classrooms:
          </label>
          <input
            onChange={(e) => {
              setRooms(e.target.value.split(","));
              console.log(rooms);
            }}
            type="text"
            className=" border p-1 outline-none rounded-lg w-full "
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select start date:
          </label>
          <input
            onChange={(e) => {
              setStartDay(e.target.value);
              console.log(startDay);
            }}
            type="date"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select end date:
          </label>
          <input
            onChange={(e) => {
              setEndDay(e.target.value);
              console.log(endDay);
            }}
            type="date"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={handlePfaPlanning}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md transition duration-200"
          >
            planning PFA
          </button>
          <button
            onClick={handleCancel}
            className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded-md transition duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
