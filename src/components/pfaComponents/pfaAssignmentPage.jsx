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

const PfaAssignmentPage = () => {
  const [pfaList, setPfaList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showManual, setShowManual] = useState(false);
   const [isEmailPopupOpen, setIsEmailPopupOpen] = useState(false); // pour gérer l'affichage du popup

  const openEmailPopup = () => setIsEmailPopupOpen(true);
  const closeEmailPopup = () => setIsEmailPopupOpen(false);

  const fetchPfas = async () => {
    try {
      const data = await pfaService.getChoicesByStudent();
      if (data && Array.isArray(data.choices)) {
        // Renommer id → _id ET convertir en string pour éviter les bugs
        const pfasWithId = data.choices.map((pfa) => ({
          ...pfa,
          _id: String(pfa.id),
        }));

        setPfaList(pfasWithId);
      } else {
        throw new Error("Invalid data returned from API.");
      }
    } catch (error) {
      console.error("Error loading PFAs:", error);
      toast.error("Failed to load PFA projects.");
    }
  };

  useEffect(() => {
    fetchPfas();
  }, []);

  const handleAutoAssign = async () => {
    try {
      const result = await pfaService.assignProjectsAutomatically();
      toast.success(result.message || "Affectation réussie !");
      fetchPfas();
    } catch (error) {
      toast.error("Erreur lors de l'affectation automatique.", error);
    }
  };

  const handleTogglePublish = async (pfa) => {
    const newStatus =
      pfa.assignationStatus === "published" ? "hidden" : "published";

    try {
      console.log("🔄 Envoi au backend:", `/publish/${pfa._id}/${newStatus}`);

      const result = await pfaService.publishOrHide(pfa._id, newStatus);

      console.log("📦 Réponse brute du backend:", result); // ✅ Pour voir ce que tu reçois

      if (result && result.pfaProject && result.pfaProject._id) {
        setPfaList((prev) =>
          prev.map((item) =>
            item._id === pfa._id
              ? {
                  ...item,
                  assignationStatus: result.pfaProject.assignationStatus,
                }
              : item
          )
        );
        toast.success(`Status updated to "${newStatus}"`);
      } else {
        console.error("❌ Unexpected response structure", result);
        toast.error("Incorrect server response.");
      }
    } catch (error) {
      console.error("🔥 Error while updating:", error);
      toast.error("Impossible to update status.");
    }
  };
  const filteredPfas = pfaList.filter(
    (pfa) =>
      pfa.projectTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pfa.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleMailSending = async () => {
    try {
      await pfaService.sendEmailAssignation(); // Logique pour envoyer l'email
      toast.success("Email sent successfully!"); // Affiche un toast de succès
      closeEmailPopup(); // Ferme le popup après l'envoi
    } catch (error) {
      toast.error("Failed to send email!",error); // Affiche un toast d'erreur en cas de problème
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Toaster position="top-right" reverseOrder={false} />

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
          onClick={handleAutoAssign}
          className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3 transition-all duration-300 hover:scale-105"
        >
          <span className="p-2 rounded-full bg-white bg-opacity-20 animate-spin-slow">
            <FaBolt className="text-yellow-300" size={20} />
          </span>
          <span className="text-sm font-semibold tracking-wide">
            Start automatic assignment
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
            Start manual assignment
          </span>
        </button>
      </div>

      {/* Formulaire d'affectation manuelle */}
      {showManual && (
        <div className="mb-10">
          <ManualAssignment />
        </div>
      )}

      {/* Liste des projets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPfas.length > 0 ? (
          filteredPfas.map((pfa) => (
            <div
              key={`${String(pfa._id)}-${pfa.assignationStatus}`} // Clé unique basée sur ID + statut
              className="bg-white p-5 rounded-lg shadow hover:shadow-xl hover:bg-gradient-to-r from-blue-50 to-purple-100 transition-all duration-300 overflow-auto"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold">{pfa.projectTitle}</h2>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    pfa.assigned
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {pfa.assigned ? "Assigned" : "Not Assigned"}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-4">{pfa.description}</p>
              <p className="text-xs text-gray-500 mb-2">
                Teacher's Name: <strong>{pfa.createdBy || "Inconnu"}</strong>
              </p>

              {/* Status Toggle */}
              <div className="mt-4">
                <h4 className="font-medium text-gray-700 mb-2">
                  Assignment Status:
                </h4>
                <select
                  className="text-sm p-1 rounded-md border border-gray-300"
                  value={pfa.assignationStatus}
                  onChange={() => handleTogglePublish(pfa)}
                >
                  <option value="hidden">Hidden</option>
                  <option value="published">Published</option>
                </select>
              </div>

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
      {/* Bouton pour envoyer l'email des PFAs publiés */}
        <button
          onClick={openEmailPopup}
          className="hover:scale-105 bg-blue-500 text-white py-2 px-4 mt-10 rounded flex items-center space-x-2 hover:bg-blue-700 shadow-md transition-all duration-300"
        >
          <FaPaperPlane className="text-white animate-[spin_5s_linear_infinite]" />
          <span>Send Mail of the  Published Assignation PFAs</span>
        </button>
      
        {/* Popup de confirmation pour l'envoi de l'email */}
        {isEmailPopupOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-40 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-300 px-6 py-4">
                <h3 className="text-lg font-bold text-white">
                  Confirm Email Sending
                </h3>
              </div>
              <div className="bg-white px-6 py-4">
                <p className="text-gray-700 mb-4">
                  Are you sure you want to send this email?
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={closeEmailPopup}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleMailSending}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Animation keyframes inline */}
      <style>
        {`
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 5s linear infinite;
          }
        `}
      </style>
    </div>
  );
};

export default PfaAssignmentPage;
