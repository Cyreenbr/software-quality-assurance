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
export default function PfaSoutenance() {
  const [pfaSoutenanceList, setPfaSoutenanceList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showManual, setShowManual] = useState(false);
  const [isEmailPopupOpen, setIsEmailPopupOpen] = useState(false); // pour gérer l'affichage du popup

  const openEmailPopup = () => setIsEmailPopupOpen(true);
  const closeEmailPopup = () => setIsEmailPopupOpen(false);

  const fetchData = async () => {
    try {
      const soutenanceList = await pfaService.getSoutenancesPfas();
      console.log("3aslemmmmmmaaaa!!!");
      console.log(pfaSoutenanceList);
      setPfaSoutenanceList(soutenanceList);
      // setStudents(studentResponse.model);
      console.log(soutenanceList);
    } catch (error) {
      console.error("Error fetching PFA or student data:", error);
      
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePublish = async () => {
    try {
      const result = await pfaService.publishSoutenance();
      console.log(result);
      const updatedList = pfaSoutenanceList.map((item) =>
        item.status === "hide" ? { ...item, status: "publish" } : item
      );

      setPfaSoutenanceList(updatedList);
      // toast.success(result.message || "publish réussie !");
    } catch (error) {
      toast.error("Erreur lors de l'affectation automatique.", error);
    }
  };

  const filteredPSoutenace = pfaSoutenanceList.filter(
    (pfa) =>
      pfa.projectTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pfa.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMailSending = async () => {
    try {
      await pfaService.sendEmailPlanningSoutenance(); // Logique pour envoyer l'email
      toast.success("Email sent successfully!"); // Affiche un toast de succès
      closeEmailPopup(); // Ferme le popup après l'envoi
    } catch (error) {
      toast.error("Failed to send email!", error); // Affiche un toast d'erreur en cas de problème
    }
  };

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

        {/* Bouton affectation automatique */}
        <button
          onClick={handlePublish}
          className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3 transition-all duration-300 hover:scale-105"
        >
          <span className="p-2 rounded-full bg-white bg-opacity-20 animate-spin-slow">
            <FaBolt className="text-yellow-300" size={20} />
          </span>
          <span className="text-sm font-semibold tracking-wide">
            Publish defences
          </span>
        </button>
        <button
          onClick={handleMailSending}
          className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3 transition-all duration-300 hover:scale-105"
        >
          <span className="p-2 rounded-full bg-white bg-opacity-20 animate-spin-slow">
            <FaBolt className="text-yellow-300" size={20} />
          </span>
          <span className="text-sm font-semibold tracking-wide">
            send email
          </span>
        </button>

        {/* Bouton affichage manuel */}
        <button
          onClick={() => setShowManual(!showManual)}
          className="bg-gradient-to-r from-violet-500 to-rose-500 hover:from-violet-600 hover:to-rose-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3 transition-all duration-300 hover:scale-105"
        >
          <span className="p-2 rounded-full bg-white bg-opacity-20 animate-spin-slow">
            <FaTools className="text-gray-500" size={20} />
          </span>
          <span className="text-sm font-semibold tracking-wide">
            Create Defence
          </span>
        </button>
      </div>
      {/* Formulaire d'affectation manuelle */}
      {showManual && (
        <div className="mb-10">
          <PfaPlannigPopUp />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {filteredPSoutenace.length > 0 ? (
          filteredPSoutenace.map((pfa) => (
            <div
              key={`${String(pfa._id)}-${pfa.assignationStatus}`} // Clé unique basée sur ID + statut
              className="bg-white p-5 rounded-lg shadow hover:shadow-xl hover:bg-gradient-to-r from-blue-50 to-purple-100 transition-all duration-300 overflow-auto"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold">{pfa.projectTitle}</h2>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    pfa.status === "publish"
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {pfa.status}
                </span>
              </div>
              <h2>{pfa.date}</h2>
              <h2>{pfa.duration}</h2>
              <h2>{pfa.room}</h2>
              <h2>{pfa.startTime}</h2>
              {pfa.supervisor !== null && (
                <h2> supervisor : {pfa.supervisor.firstName}</h2>
              )}
              {pfa.rapporteurId !== null && (
                <h2>rapporteur :{pfa.rapporteurId.firstName}</h2>
              )}
              {pfa.studentIds !== null &&
                pfa.studentIds.map((student) => {
                  return (
                    <h2>
                      {student.firstName} {student.lastName}
                    </h2>
                  );
                })}

              <p className="text-sm text-gray-600 mb-4">{pfa.description}</p>
              <p className="text-xs text-gray-500 mb-2">
                Teacher's Name: <strong>{pfa.createdBy || "Inconnu"}</strong>
              </p>

              {/* Footer avec icône */}
              <div className="mt-4 text-sm text-gray-500 flex items-center gap-2">
                <span>Status:</span>
                {pfa.assignationStatus === "published" ? (
                  <FaEye className="text-green-500" />
                ) : (
                  <FaEyeSlash className="text-gray-400" />
                )}
              </div>

              {/* Student Choices */}
              <div className="mt-4">
                <h4 className="font-medium text-gray-700">Student Choices:</h4>
                {pfa.affectedStudents?.length > 0 ? (
                  <ul className="list-disc ml-5 mt-2 text-sm">
                    {pfa.affectedStudents.map((choice, idx) => (
                      <li key={idx} className="flex items-center">
                        {choice.choiceStatus === "approved" ? (
                          <>
                            <FaCheckCircle className="text-green-500 mr-1" />
                            <span className="text-green-700">
                              {choice.studentName} - Approved
                            </span>
                          </>
                        ) : choice.choiceStatus === "pending" ? (
                          <>
                            <FaRegClock className="text-yellow-500 mr-1" />
                            <span className="text-yellow-700">
                              {choice.studentName} - Pending
                            </span>
                          </>
                        ) : (
                          <>
                            <FaTimesCircle className="text-red-500 mr-1" />
                            <span className="text-red-700">
                              {choice.studentName} - Not Approved
                            </span>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-500 ml-5">
                    No student choices yet.
                  </p>
                )}
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
