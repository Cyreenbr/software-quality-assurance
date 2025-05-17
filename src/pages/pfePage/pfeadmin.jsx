import { useEffect, useState } from "react";
import {
  FaCheck,
  FaEye,
  FaEyeSlash,
  FaPaperPlane,
  FaSearch,
  FaTimes,
  FaUserPlus,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  assignPFEManually,
  fetchPFEChoices,
  fetchTeachers,
  handleAction,
  sendEmail,
  togglePublication,
} from "../../services/pfeService/pfe.service";

const AdminPfeManagement = () => {
  const [pfeChoices, setPfeChoices] = useState([]);
  const [isPublished, setIsPublished] = useState(true);
  const [loadingId, setLoadingId] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [selectedPfe, setSelectedPfe] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [projectSearchQuery, setProjectSearchQuery] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const pfeData = await fetchPFEChoices();
      setPfeChoices(pfeData);
      if (pfeData[0]?.isAssignmentVisible !== undefined) {
        setIsPublished(pfeData[0].isAssignmentVisible);
      }
      const teacherData = await fetchTeachers();
      setTeachers(teacherData);
    } catch (error) {
      toast.error(` ${error.response?.data?.message || error.message}`);
    }
  };

  const handleApproveOrReject = async (id, action) => {
    setLoadingId(id);
    try {
      await handleAction(id, action);
      await loadData();
    } catch (err) {
      console.error("Failed to perform action:", err);
    } finally {
      setLoadingId(null);
    }
  };

  const handleManualAssignment = async (pfeId, teacherId) => {
    setLoadingId(pfeId);
    try {
      console.log(pfeId);
      await assignPFEManually(pfeId, teacherId);
      await loadData();
    } catch (err) {
      console.error("Error assigning teacher:", err);
    } finally {
      setLoadingId(null);
      setShowTeacherModal(false);
    }
  };

  const handleTogglePublication = async () => {
    try {
      await togglePublication(isPublished);
      await loadData();
      setIsPublished(!isPublished);
    } catch (err) {
      console.error("Toggle publication failed:", err);
    }
  };

  const handleSendEmail = async () => {
    try {
      await sendEmail();
    } catch (err) {
      console.error("Failed to send email:", err);
    }
  };

    const handlePageAssignment  = () => {
    navigate("/soutenancePlanning");
  };


  const handleOpenDocument = (document) => {
    if (document) {
      const url = `http://localhost:3000/uploads/${document}`;
      window.open(url, "_blank");
    } else {
      console.log("No document found");
    }
  };

  const filteredTeachers = teachers.filter((teacher) =>
    `${teacher.firstName} ${teacher.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const filteredPfeChoices = pfeChoices.filter((choice) => {
    const projectTitle = choice.title?.toLowerCase() || "";
    const studentName = `${choice.student?.firstName || ""} ${
      choice.student?.lastName || ""
    }`.toLowerCase();

    return (
      projectTitle.includes(projectSearchQuery.toLowerCase()) ||
      studentName.includes(projectSearchQuery.toLowerCase())
    );
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
<div className="max-w-7xl mx-auto flex justify-between items-center mb-6">
  <h1 className="text-2xl font-bold text-blue-400">
    PFE Management
  </h1>
  <button
    onClick={handlePageAssignment}
    className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors duration-200 flex items-center shadow-sm"
  >
    Defense PFE
  </button>
</div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="px-6 py-3 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-700">
              PFE Projects
            </h2>
            <div className="flex items-center space-x-3">
              {/* Project Search Bar */}
              <div className="relative w-64">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400 text-xs" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-7 pr-2 py-1 text-sm border border-gray-200 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search projects..."
                  value={projectSearchQuery}
                  onChange={(e) => setProjectSearchQuery(e.target.value)}
                />
              </div>

              <button
                onClick={() => handleSendEmail()}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md transition-colors text-sm"
              >
                <FaPaperPlane className="text-xs" />
                <span>Send Email</span>
              </button>

              <button
                onClick={handleTogglePublication}
                className={`flex items-center space-x-2 px-3 py-1 rounded-md transition-colors text-sm ${
                  isPublished
                    ? "bg-gray-600 hover:bg-gray-700"
                    : "bg-green-600 hover:bg-green-700"
                } text-white`}
              >
                {isPublished ? (
                  <FaEyeSlash className="text-xs" />
                ) : (
                  <FaEye className="text-xs" />
                )}
                <span>
                  {isPublished ? "Hide Planning" : "Publish Planning"}
                </span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-500 text-sm font-medium">
                  <th className="py-3 px-6">Student</th>
                  <th className="py-3 px-6">Project</th>
                  <th className="py-3 px-6">Documents</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Supervisor</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPfeChoices.length > 0 ? (
                  filteredPfeChoices.map((choice) => (
                    <tr
                      key={choice.pfeId}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6 text-gray-700">
                        {choice.student?.firstName +
                          " " +
                          choice.student?.lastName || "Unknown"}
                      </td>
                      <td className="py-4 px-6 font-medium text-gray-800">
                        {choice.title || "No Title"}
                      </td>
                      <td className="py-4 px-6">
                        {choice.documents && choice.documents.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {choice.documents.map((document, index) => (
                              <button
                                key={index}
                                onClick={() => handleOpenDocument(document)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 transition-colors"
                              >
                                Document {index + 1}
                              </button>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            choice.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : choice.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {choice.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          {choice.IsammSupervisor ? (
                            <span className="text-gray-700">
                              {choice.IsammSupervisor.firstName}{" "}
                              {choice.IsammSupervisor.lastName}
                            </span>
                          ) : (
                            <span className="text-gray-400">Not assigned</span>
                          )}
                          <button
                            onClick={() => {
                              setSelectedPfe(choice);
                              setShowTeacherModal(true);
                            }}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                            disabled={loadingId === choice.pfeId}
                          >
                            <FaUserPlus className="text-sm" />
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() =>
                              handleApproveOrReject(choice.pfeId, "approve")
                            }
                            className="p-2 text-green-600 hover:text-white hover:bg-green-600 rounded-full transition-colors disabled:opacity-50"
                            disabled={loadingId === choice.pfeId}
                          >
                            {loadingId === choice.pfeId ? "..." : <FaCheck />}
                          </button>
                          <button
                            onClick={() =>
                              handleApproveOrReject(choice.pfeId, "reject")
                            }
                            className="p-2 text-red-600 hover:text-white hover:bg-red-600 rounded-full transition-colors disabled:opacity-50"
                            disabled={loadingId === choice.pfeId}
                          >
                            {loadingId === choice.pfeId ? "..." : <FaTimes />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-4 px-6 text-center text-gray-500"
                    >
                      No projects found matching your search
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Teacher Assignment Modal */}
        {showTeacherModal && (
          <div className="modal fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">
                  Assign Supervisor
                </h3>
              </div>

              <div className="p-6">
                <div className="relative mb-4">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search teachers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
                  {filteredTeachers.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No teachers found
                    </div>
                  ) : (
                    <ul className="divide-y divide-gray-200">
                      {filteredTeachers.map((teacher) => (
                        <li
                          key={teacher._id}
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() =>
                            handleManualAssignment(
                              selectedPfe.pfeId,
                              teacher._id
                            )
                          }
                        >
                          <div className="font-medium text-gray-800">
                            {teacher.firstName} {teacher.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {teacher.email}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setShowTeacherModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPfeManagement;
