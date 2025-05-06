import React, { useEffect, useState } from "react";
import pfaService from "../../services/PfaServices/pfaService";
import { FaCheckCircle, FaTimesCircle, FaRegClock, FaSearch } from "react-icons/fa"; // Import the clock icon
import { Toaster, toast } from "react-hot-toast";

const PfaAssignmentPage = () => {
  const [pfaList, setPfaList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch PFAs using the correct service function
  const fetchPfas = async () => {
    try {
      const data = await pfaService.getChoicesByStudent(); // Calls GET /api/PFA
      if (data && Array.isArray(data.choices)) {
        setPfaList(data.choices);
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

  const filteredPfas = pfaList.filter(
    (pfa) =>
      pfa.projectTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pfa.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Toaster position="top-right" reverseOrder={false} />


      {/* Search Bar */}
       <div className="flex justify-end mb-4">
            <div className="relative w-full sm:w-auto md:w-80">
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

      {/* List of Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPfas.length > 0 ? (
          filteredPfas.map((pfa) => (
            <div key={pfa._id} className="bg-white p-5 rounded-lg shadow hover:shadow-xl transition-shadow">
              <h2 className="text-xl font-semibold mb-2">{pfa.projectTitle}</h2>
              <p className="text-sm text-gray-600 mb-4">{pfa.description}</p>

              {/* Instructor Name */}
              <p className="text-xs text-gray-500 mb-2">
                Teacher's Name: <strong>{pfa.createdBy || "Inconnu"}</strong>
              </p>

              {/* Choices by Students */}
              <div className="mt-4">
                <h4 className="font-medium text-gray-700">Student Choices:</h4>
                {pfa.affectedStudents && pfa.affectedStudents.length > 0 ? (
                  <ul className="list-disc ml-5 mt-2 text-sm">
                    {pfa.affectedStudents.map((choice, idx) => (
                      <li key={idx} className="flex items-center">
                        {choice.choiceStatus === "approved" ? (
                          <>
                            <FaCheckCircle className="text-green-500 mr-1" />
                            <span className="text-green-700">{choice.studentName} - Approved</span>
                          </>
                        ) : choice.choiceStatus === "pending" ? (
                          <>
                            <FaRegClock className="text-yellow-500 mr-1" /> {/* Clock icon for Pending */}
                            <span className="text-yellow-700">{choice.studentName} - Pending</span>
                          </>
                        ) : (
                          <>
                            <FaTimesCircle className="text-red-500 mr-1" />
                            <span className="text-red-700">{choice.studentName} - Not Approved</span>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-500 ml-5">No student choices yet.</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">No matching PFAs found.</p>
        )}
      </div>
    </div>
  );
};

export default PfaAssignmentPage;
