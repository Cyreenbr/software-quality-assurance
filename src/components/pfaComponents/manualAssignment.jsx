import React, { useEffect, useState } from "react";
import pfaService from "../../services/PfaServices/pfaService";

export default function ManualAssignment() {
  const [pfas, setPfas] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedPfa, setSelectedPfa] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [forceAssign, setForceAssign] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isVisible, setIsVisible] = useState(true); // to control the visibility of the modal

 const fetchData = async () => {
    try {
      const pfaList = await pfaService.getPublishedPfas();
      const studentResponse = await pfaService.getStudents();

    
      
      setPfas(pfaList.openPFA);
      

      setStudents(studentResponse.model);
    } catch (error) {
      console.error("Error fetching PFA or student data:", error);
      setErrorMessage("Error fetching data. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssign = async () => {
    if (!selectedPfa || !selectedStudent) {
      setErrorMessage("Please Select both student and PFA");
      setTimeout(() => setErrorMessage(""), 3000); // Clear the error message after 3 seconds
      return;
    }

    try {
      // Calling the service to assign the PFA to the student
      await pfaService.assignPfaToStudent(selectedPfa, selectedStudent, forceAssign);
      
      await fetchData(); // Appelle à nouveau pour mettre à jour la liste


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
          Assign PFA to Student
        </h3>

        {errorMessage && (
          <div className="bg-red-100 border border-red-300 text-red-700 text-sm rounded-md px-4 py-2 text-center">
            {errorMessage}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select a Student:
          </label>
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">-- Choose a student --</option>
            {students.map((student) => (
              <option key={student._id} value={student._id}>
                {student.firstName} {student.lastName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select a PFA:
          </label>
          <select
            value={selectedPfa}
            onChange={(e) => setSelectedPfa(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">-- Choose a PFA --</option>
            {pfas.map((pfa) => (
              <option key={pfa._id} value={pfa._id}>
                {pfa.projectTitle}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={forceAssign}
            onChange={(e) => setForceAssign(e.target.checked)}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <label className="ml-2 text-sm text-gray-700">
            Force assignment (replace existing)
          </label>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleAssign}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md transition duration-200"
          >
            Assign PFA
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
