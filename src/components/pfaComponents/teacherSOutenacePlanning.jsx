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
import {
  FaClock,
  FaUserGraduate,
  FaPlay,
  FaMapMarkerAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Toaster } from "react-hot-toast";
import PfaPlannigPopUp from "./pfaPlanningPopUp";
export default function TeacherSOutenacePlanning() {
  const [pfaSoutenanceList, setPfaSoutenanceList] = useState([]);

  const [showManual, setShowManual] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.id || user?._id || "";

  function getTeacherRoles(pfa, userId) {
    const roles = [];
    if (!userId) return roles;

    const userIdStr = userId.toString();

    if (pfa.rapporteurId && pfa.rapporteurId._id?.toString() === userIdStr)
      roles.push("Rapporteur");
    if (pfa.supervisor && pfa.supervisor._id?.toString() === userIdStr)
      roles.push("Superviseur");
    return roles;
  }

  const fetchData = async () => {
    try {
      const soutenanceList = await pfaService.getSoutenancesPfasForTeacher();
      console.log("3aslemmmmmmaaaa!!!");
      setPfaSoutenanceList(soutenanceList.defenseSubjects);
      // setStudents(studentResponse.model);
      console.log(soutenanceList.defenseSubjects);
    } catch (error) {
      console.error("Error fetching PFA or student data:", error);

      setTimeout(() => setErrorMessage(""), error, 3000);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-8 bg-gray-50">
      {showManual && (
        <div className="mb-10">
          <PfaPlannigPopUp />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {pfaSoutenanceList.length > 0 ? (
          pfaSoutenanceList.map((pfa) => {
            console.log("PFA rapporteurId:", pfa.rapporteurId);
            console.log("PFA supervisor:", pfa.supervisor);
            const roles = getTeacherRoles(pfa, userId);
            console.log("Roles:", roles);

            return (
              <div
                key={`${String(pfa.defanseStartTime)}`}
                className="bg-white p-5 rounded-lg shadow hover:shadow-xl hover:bg-gradient-to-r from-blue-50 to-purple-100 transition-all duration-300 overflow-auto"
              >
                <div className="flex items-center mb-2 space-x-3 mt-[-4px]">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-semibold">
                      {pfa.projectTitle}
                    </h2>
                  </div>
                  {/* Badges rôles */}
                  {roles.length > 0 && (
                    <div className="ml-35 flex gap-2">
                      {roles.includes("Rapporteur") && (
                        <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                          Rapporteur
                        </span>
                      )}
                      {roles.includes("Superviseur") && (
                        <span className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                          Superviseur
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-3 p-4 rounded-xl border bg-white text-gray-800 text-sm">
                  <div className="flex items-center gap-2">
                    <FaClock className="text-yellow-500" size={20} />
                    <p>
                      <span className="font-semibold">Duration: </span>
                      {pfa.defanceDuration}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-blue-700" size={20} />
                    <p>
                      <span className="font-semibold">Classroom: </span>
                      {pfa.defanceClassRoom}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaPlay className="text-green-600" size={20} />
                    <p>
                      <span className="font-semibold">Start Time: </span>
                      {pfa.defanseStartTime}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-purple-800" size={20} />
                    <p>
                      <span className="font-semibold">Date: </span>
                      {new Date(pfa.defenseDate).toDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaUserGraduate className="text-black-600" size={20} />
                    <p>
                      <span className="font-semibold">Student(s): </span>
                      {pfa.students}
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
