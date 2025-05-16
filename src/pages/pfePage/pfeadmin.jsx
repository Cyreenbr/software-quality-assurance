import React, { useEffect, useState } from "react";
import {
  FaCheck,
  FaTimes,
  FaPaperPlane,
  FaUserPlus,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import {
  fetchPFEChoices,
  fetchTeachers,
  handleAction,
  assignPFEManually,
  togglePublication,
  sendEmail,
} from "../../services/pfeService/pfe.service";
import { toast } from "react-toastify";

const AdminPfeManagement = () => {
  const [pfeChoices, setPfeChoices] = useState([]);
  const [isPublished, setIsPublished] = useState(true);
  const [loadingId, setLoadingId] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [selectedPfe, setSelectedPfe] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

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
      //console.log(teacherId);
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

  const handleOpenDocument = (document) => {
    if (document) {
      const url = `http://localhost:3000/uploads/${document}`;
      window.open(url, "_blank"); // Open the document in a new tab
    } else {
      console.log("No document found");
    }
  };

  const filteredTeachers = teachers.filter((teacher) =>
    `${teacher.firstName} ${teacher.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen relative">
      <h1 className="text-2xl font-bold mb-4">Admin - Manage PFE</h1>

      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">PFE Choices</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
              <th className="py-3 px-6">Student</th>
              <th className="py-3 px-6">Project</th>
              <th className="py-3 px-6">Documents</th>
              <th className="py-3 px-6">Status</th>
              <th className="py-3 px-6">Supervisor</th>
              <th className="py-3 px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pfeChoices.map((choice) => (
              <tr key={choice.pfeId} className="border-b hover:bg-gray-50">
                <td className="py-3 px-6">
                  {choice.student?.firstName + choice.student?.lastName ||
                    "Unknown"}
                </td>
                <td className="py-3 px-6">{choice.title || "No Title"}</td>
                <td>
                  {/* Display clickable documents */}
                  {choice.documents && choice.documents.length > 0 && (
                    <div className="space-y-2">
                      {choice.documents.map((document, index) => (
                        <button
                          key={index}
                          onClick={() => handleOpenDocument(document)}
                          className="text-blue-500 hover:underline"
                        >
                          {`Doc ${index + 1}`}
                        </button>
                      ))}
                    </div>
                  )}
                </td>
                <td className="py-3 px-6 font-semibold">{choice.status}</td>
                <td className="py-3 px-6">
                  <button
                    onClick={() => {
                      setSelectedPfe(choice);
                      setShowTeacherModal(true);
                    }}
                    className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
                    disabled={loadingId === choice.pfeId}
                  >
                    <FaUserPlus />
                  </button>
                  {choice.IsammSupervisor
                    ? `${choice.IsammSupervisor.firstName} `
                    : "No Supervisor"}
                </td>
                <td className="py-3 px-6 flex space-x-2">
                  <button
                    onClick={() =>
                      handleApproveOrReject(choice.pfeId, "approve")
                    }
                    className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 disabled:opacity-50"
                    disabled={loadingId === choice.pfeId}
                  >
                    {loadingId === choice.pfeId ? "..." : <FaCheck />}
                  </button>
                  <button
                    onClick={() =>
                      handleApproveOrReject(choice.pfeId, "reject")
                    }
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 disabled:opacity-50"
                    disabled={loadingId === choice.pfeId}
                  >
                    {loadingId === choice.pfeId ? "..." : <FaTimes />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for assigning teacher */}
      {showTeacherModal && (
        <div className="modal fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-semibold mb-4">Assign a Teacher</h3>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded mb-4"
              placeholder="Search for a teacher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="max-h-60 overflow-y-auto">
              {filteredTeachers.length === 0 ? (
                <p>No teachers found</p>
              ) : (
                filteredTeachers.map((teacher) => (
                  <div
                    key={teacher._id}
                    className="py-2 px-4 cursor-pointer hover:bg-gray-200"
                    onClick={() =>
                      handleManualAssignment(selectedPfe.pfeId, teacher._id)
                    }
                  >
                    {teacher.firstName} {teacher.lastName}
                  </div>
                ))
              )}
            </div>
            <button
              onClick={() => setShowTeacherModal(false)}
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-4 mt-6">
        <button
          onClick={() => handleSendEmail()}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          <FaPaperPlane className="inline mr-2" /> Send Email
        </button>

        <button
          onClick={handleTogglePublication}
          className={`py-2 px-4 rounded ${
            isPublished ? "bg-gray-500" : "bg-green-500"
          } text-white`}
        >
          {isPublished ? (
            <FaEyeSlash className="inline mr-2" />
          ) : (
            <FaEye className="inline mr-2" />
          )}
          {isPublished ? "Hide Planning" : "Publish Planning"}
        </button>
      </div>
    </div>
  );
};

export default AdminPfeManagement;
