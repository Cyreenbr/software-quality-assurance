import React, { useEffect, useState } from "react";
import pfaService from "../../services/PfaServices/pfaService";
import ManualAssignment from "./manualAssignment";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaRegClock,
  FaSearch,
  FaBolt,
  FaTools,
  FaPaperPlane,
} from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";
import PfaPlannigPopUp from "./pfaPlanningPopUp";
export default function TeacherSOutenacePlanning() {
  const [pfaSoutenanceList, setPfaSoutenanceList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showManual, setShowManual] = useState(false);
  const [isEmailPopupOpen, setIsEmailPopupOpen] = useState(false); // pour gérer l'affichage du popup

  const openEmailPopup = () => setIsEmailPopupOpen(true);
  const closeEmailPopup = () => setIsEmailPopupOpen(false);

  const fetchData = async () => {
    try {
      const soutenanceList = await pfaService.getSoutenancesPfasForTeacher();
      console.log("3aslemmmmmmaaaa!!!");
      setPfaSoutenanceList(soutenanceList.defenseSubjects);
      // setStudents(studentResponse.model);
      console.log(soutenanceList.defenseSubjects);
    } catch (error) {
      console.error("Error fetching PFA or student data:", error);
      setErrorMessage("Error fetching data. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-8 bg-gray-50">
      {/* Barre de recherche + boutons */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search by title or description"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 pr-4 rounded-lg border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <FaSearch size={20} />
          </div>
        </div>
      </div>
      {/* Formulaire d'affectation manuelle */}
      {showManual && (
        <div className="mb-10">
          <PfaPlannigPopUp />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {pfaSoutenanceList.length > 0 ? (
          pfaSoutenanceList.map((pfa) => (
            <div
              key={`${String(pfa.defanseStartTime)}`} // Clé unique basée sur ID + statut
              className="bg-white p-5 rounded-lg shadow hover:shadow-xl hover:bg-gradient-to-r from-blue-50 to-purple-100 transition-all duration-300 overflow-auto"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold">{pfa.projectTitle}</h2>
              </div>
              <div className="space-y-4 p-4 rounded-xl border shadow-sm bg-white text-gray-800">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-500">⏱️</span>
                  <h2 className="text-lg font-semibold">Defense Duration:</h2>
                  <p className="text-gray-600">{pfa.defanceDuration}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-yellow-500">🏫</span>
                  <h2 className="text-lg font-semibold">Classroom:</h2>
                  <p className="text-gray-600">{pfa.defanceClassRoom}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-green-500">🕒</span>
                  <h2 className="text-lg font-semibold">Start Time:</h2>
                  <p className="text-gray-600">
                    {pfa.defanseStartTime}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-red-500">📅</span>
                  <h2 className="text-lg font-semibold">Defense Date:</h2>
                  <p className="text-gray-600">
                    {new Date(pfa.defenseDate).toDateString()}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-purple-500">👨‍🎓</span>
                  <h2 className="text-lg font-semibold">Students:</h2>
                  <p className="text-gray-600">{pfa.students}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No matching PFAs found.
          </p>
        )}
      </div>
    </div>
  );
}
