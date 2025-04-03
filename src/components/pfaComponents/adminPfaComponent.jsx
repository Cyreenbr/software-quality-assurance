import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import { useEffect, useState } from "react";
import pfaService from "../../services/PfaServices/pfaService";
import { FaCheckCircle, FaTimesCircle, FaPaperPlane } from "react-icons/fa";
import {
  FaClipboard,
  FaCode,
  FaUsers,
  FaRegLightbulb,
  FaGraduationCap,
  FaTag,
} from "react-icons/fa";

const AdminPfaComponent = () => {
  const [pfaList, setpfaList] = useState([]);

  const [selectedPFA, setSelectedPFA] = useState(null);

  const openModal = (pfa) => setSelectedPFA(pfa);
  const closeModal = () => setSelectedPFA(null);

  useEffect(() => {
    fetchPfas();
  }, []);

  const fetchPfas = async () => {
    try {
      const response = await pfaService.getPfas();
      console.log(response);
      if (!response || !Array.isArray(response.pfas)) {
        throw new Error("The API did not return an array of periods.");
      }
      setpfaList(response.pfas);
    } catch (error) {
      console.error("Error loading periods:", error);
      setpfaList([]);
    }
  };

  const handleReject = (id) => {
    console.log(id);
    setpfaList(
      pfaList.map((pfa) =>
        pfa._id === id ? { ...pfa, status: "rejected" } : pfa
      )
    );
    pfaService.rejectPfa(id);
  };

  const handlePublish = (id) => {
    console.log(id);
    setpfaList(
      pfaList.map((pfa) =>
        pfa._id === id ? { ...pfa, status: "published" } : pfa
      )
    );
    pfaService.publishPfa(id);
  };

  const handleMailSending = () => {
    pfaService.sendEmail();
  };

  const handleMailClick = () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to send this email?"
    );
    if (isConfirmed) {
      handleMailSending(); // Call the function only if confirmed
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen relative">
      <h1 className="text-2xl font-bold mb-4 "> Manage PFAs  </h1>

      {/* Tableau des PFA */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center hover:scale-101"><FaTag className="text-blue-500 mr-2" size={18} />List of PFAs</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider ">
                
                 <span> Title</span>
                 
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  <span>Description</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider ">
                  <span>Technologies</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pfaList.map((pfa) => (
                <tr key={pfa.id} className="hover:bg-gray-50 transition-colors">
                  <td
                    className="px-6 py-4 text-left hover:scale-105 font-medium text-gray-900"
                    onClick={() => openModal(pfa)}
                  >
                    {pfa.projectTitle}
                  </td>
                  <td className="px-6 py-4 text-left  text-gray-900">
                    {pfa.description}
                  </td>
                  <td className="px-6 py-4 text-left text-gray-500">
                    {pfa.technologies.slice(0, 3).join(", ")}
                    {pfa.technologies.length > 3 && " ..."}
                  </td>

                  <td className="py-3 px-6 text-center  flex justify-center space-x-2">
                    {pfa.status === "pending" && (
                      <>
                        {/* Reject Button (Red) */}
                        <button
                          onClick={() => handleReject(pfa._id)}
                          className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                          title="Reject this PFA"
                        >
                          <FaTimesCircle size={18} />
                        </button>

                        {/* Publish Button (Green) */}
                        <button
                          onClick={() => handlePublish(pfa._id)}
                          className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600"
                          title="Publish this PFA"
                        >
                          <FaCheckCircle size={18} />
                        </button>
                      </>
                    )}

                    {pfa.status === "rejected" && (
                      <span
                        className="text-red-500 flex items-center hover:scale-120"
                        title="This PFA is rejected"
                      >
                        <FaTimesCircle size={18} className="mr-1" />
                      </span>
                    )}

                    {pfa.status === "published" && (
                      <span
                        className="text-green-500 hover:scale-120 flex items-center"
                        title="This PFA is published"
                      >
                        <FaCheckCircle size={18} className="mr-1" />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <button
        onClick={handleMailClick}
        className=" hover:scale-108 bg-blue-500 text-white py-2 px-4 rounded flex items-center space-x-2 hover:bg-blue-700 shadow-md transition-all duration-300"
      >
        <FaPaperPlane className="text-white" />
        <span>Send Mail of the Published PFAs</span>
      </button>

      {selectedPFA && (
        <div className="fixed inset-0 bg-transparent bg-opacity-30 backdrop-blur-md flex justify-center items-center">
          <div className="bg-white p-8 rounded-xl shadow-xl max-w-lg w-full space-y-4">
            <h3 className="text-3xl hover:scale-105 font-semibold text-gray-900 bg-gradient-to-r from-indigo-400 to-purple-200 p-5 rounded-t-xl shadow-md text-center">
              PFA Details
            </h3>
            <div className="space-y-3 ml-5 text-gray-700">
              <p className="flex items-center hover:scale-105">
                <FaClipboard className="text-blue-500 mr-2" size={20} />
                <strong>Title:</strong> {selectedPFA.projectTitle}
              </p>
              <p className="flex items-center hover:scale-105">
                <FaRegLightbulb className="text-yellow-500 mr-2" size={20} />
                <strong>Description:</strong> {selectedPFA.description}
              </p>
              <p className="flex items-center hover:scale-105">
                <FaCode className="text-green-500 mr-2" size={20} />
                <strong>Technologies:</strong>{" "}
                {selectedPFA.technologies.join(", ")}
              </p>
              <p className="flex items-center hover:scale-105">
                <FaUsers className="text-purple-500 mr-2" size={20} />
                <strong>Team Project:</strong>{" "}
                {selectedPFA.isTeamProject ? "Binome" : "Monome"}
              </p>
              <p className="flex items-center hover:scale-105">
                <FaGraduationCap className="text-teal-500 mr-2" size={20} />
                <strong>Student Names:</strong>{" "}
                {selectedPFA.studentNames.join(", ")}
              </p>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={closeModal}
                className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition-all duration-300 transform hover:scale-120 shadow-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPfaComponent;
