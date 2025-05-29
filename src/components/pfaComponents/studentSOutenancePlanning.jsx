import React, { useEffect, useState } from "react";
import pfaService from "../../services/PfaServices/pfaService";
import {
  FaSearch,
  FaUserTie,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import { HiUser } from "react-icons/hi";
import PfaPlannigPopUp from "./pfaPlanningPopUp";

export default function StudentOutenacePlanning() {
  const [pfaSoutenanceList, setPfaSoutenanceList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showManual, setShowManual] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user?.id || user?._id || "";

      if (!userId) {
        setErrorMessage("User ID not found in localStorage.");
        return;
      }

      const response = await pfaService.getSoutenancesPfasForStudent();
      const defenseInfo = Array.isArray(response?.defenseInfo)
        ? response.defenseInfo
        : [];

      console.log("Raw defenseInfo:", defenseInfo);

      const filteredDefenses = defenseInfo.filter((defense) => {
        if (!defense) {
          console.log("Skipping undefined defense");
          return false;
        }

        console.log("Checking defense:", defense.projectTitle);
        console.log("students:", defense.students, "userId:", userId);

        if (!Array.isArray(defense.students)) {
          console.log("No students array for defense:", defense.projectTitle);
          return false;
        }

        return defense.students.some((student) => {
          const studentIdStr = student.id?.toString();
          console.log("Comparing:", studentIdStr, "with", userId);
          return studentIdStr === userId;
        });
      });

      console.log("Filtered Defenses:", filteredDefenses);
      setPfaSoutenanceList(filteredDefenses);
    } catch (error) {
      console.error("Error fetching PFA or student data:", error);
      setErrorMessage("Error fetching data. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredPfas = pfaSoutenanceList.filter((pfa) =>
    pfa.projectTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {showManual && (
        <div className="mb-10">
          <PfaPlannigPopUp />
        </div>
      )}

      {errorMessage && (
        <p className="text-center text-red-600 mb-4 font-semibold">
          {errorMessage}
        </p>
      )}

      {/* PFAs grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPfas.length > 0 ? (
          filteredPfas.map((pfa) => {
            console.log("PFA item:", pfa);

            // Rapporteur name ou fallback "N/A"

            // Salle avec fallback
            const salle = pfa.room || pfa.location || pfa.defenseRoom || "N/A";

            return (
              <div
                key={pfa._id}
                className="bg-white p-6 rounded-lg shadow hover:shadow-xl hover:bg-gradient-to-r from-blue-50 to-purple-100 transition duration-300 flex flex-col"
                style={{ minHeight: "320px" }}
              >
                {/* Title */}
                <h2
                  className="text-xl font-semibold mb-5 truncate"
                  title={pfa.projectTitle}
                >
                  {pfa.projectTitle || "Untitled Project"}
                </h2>

                {/* Content block */}
                <div className="flex-grow space-y-4 rounded-xl border border-gray-200 shadow-sm bg-white text-gray-800 p-4">
                  {/* Supervisor */}
                  {pfa.supervisor ? (
                    <>
                      <div className="flex items-center gap-2">
                        <FaUserTie className="text-indigo-600" size={20} />
                        <strong>Supervisor:</strong>
                        <p className="truncate" title={pfa.supervisor.name}>
                          {pfa.supervisor.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaEnvelope className="text-indigo-400" size={18} />
                        <strong>Email:</strong>
                        <p className="truncate" title={pfa.supervisor.email}>
                          {pfa.supervisor.email}
                        </p>
                      </div>
                    </>
                  ) : (
                    <p className="italic text-gray-500">No supervisor info</p>
                  )}

                  {/* Rapporteur */}
                  {/* Rapporteur */}
                  <div className="flex items-center gap-2">
                    <FaUserTie className="text-green-600" size={20} />
                    <strong>Rapporteur:</strong>
                    <p
                      className="truncate"
                      title={
                        pfa.rapporteur
                          ? `${pfa.rapporteur.firstName} ${pfa.rapporteur.lastName}`
                          : "N/A"
                      }
                    >
                      {pfa.rapporteur
                        ? `${pfa.rapporteur.firstName} ${pfa.rapporteur.lastName}`
                        : "N/A"}
                    </p>
                  </div>

                  {/* Salle */}
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-purple-600" size={20} />
                    <strong>Room:</strong>
                    <p>{salle}</p>
                  </div>

                  {/* Defense Date */}
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-red-500" size={20} />
                    <strong>Defense Date:</strong>
                    <p>
                      {pfa.defenseDate
                        ? new Date(pfa.defenseDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No matching PFAs found.
          </p>
        )}
      </div>
    </div>
  );
}
