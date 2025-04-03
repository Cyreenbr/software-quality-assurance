import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaCheck,
  FaTimes,
  FaPaperPlane,
  FaUserPlus,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

const AdminPfeManagement = () => {
  const [pfeChoices, setPfeChoices] = useState([]);
  const [isPublished, setIsPublished] = useState(true);
  const [loadingId, setLoadingId] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [selectedPfe, setSelectedPfe] = useState(null); // Track the selected PFE
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPFEChoices();
    fetchTeachers();
  }, []);

  // Fetch PFE choices
  const fetchPFEChoices = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/pfe/list", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      // Set the PFE choices
      setPfeChoices(response.data);

      // If isAssignmentVisible is present in the first PFE item, set the state
      if (response.data[0]?.isAssignmentVisible !== undefined) {
        setIsPublished(response.data[0].isAssignmentVisible); // Update the state based on isAssignmentVisible of the first PFE
      } else {
        console.warn("isAssignmentVisible is missing in the response data.");
      }
    } catch (error) {
      console.error("Error fetching PFE data:", error);
      alert("Failed to fetch PFE choices. Please check the API.");
    }
  };

  // Fetch Teachers
  const fetchTeachers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/teachers", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTeachers(response.data.model || []);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  // Handle PFE action (approve/reject)
  const handleAction = async (id, action) => {
    if (!id) {
      console.error("Invalid ID:", id);
      return;
    }
    console.error("approve", id);
    setLoadingId(id);
    try {
      await axios.patch(
        "http://localhost:3000/api/pfe/planning/assign",
        { pfeIds: [id], action },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchPFEChoices();
    } catch (error) {
      console.error(`Error processing action ${action} on PFE:`, error);
    } finally {
      setLoadingId(null);
    }
  };

  // Assign PFE manually to a teacher
  const assignPFEManually = async (id, teacherId) => {
    setLoadingId(id);
    try {
      // Ensure that the ID is part of the URL and the teacherId and force are in the body
      console.log(
        "Assigning PFE with ID:",
        id,
        "to teacher with ID:",
        teacherId
      );
      await axios.patch(
        `http://localhost:3000/api/pfe/${id}/planning/assign`, // ID is part of the URL
        { teacherId, force: true }, // Body contains teacherId and force
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchPFEChoices(); // Refresh the PFE list after assignment
    } catch (error) {
      console.error("Error assigning PFE:", error);
    } finally {
      setLoadingId(null);
    }
  };

  // Toggle the publication status (Publish/Hide)
  const togglePublication = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/pfe/planning/publish/${
          isPublished ? "hide" : "publish"
        }`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchPFEChoices();
      setIsPublished(!isPublished);
      alert(response.data.message);
    } catch (error) {
      console.error("Error toggling publication:", error);
    }
  };

  // Send an email (First or Modified)
  const sendEmail = async (type) => {
    try {
      await axios.post(
        "http://localhost:3000/api/pfe/planning/send",
        { sendType: type },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert(
        `Email sent: ${type === "first" ? "First email" : "Modified email"}`
      );
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  // Filter teachers based on search query
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
              <th className="py-3 px-6">Status</th>
              <th className="py-3 px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pfeChoices.map((choice) => (
              <tr key={choice._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-6">
                  {choice.student?.name || "Unknown"}
                </td>
                <td className="py-3 px-6">{choice.title || "No Title"}</td>
                <td className="py-3 px-6 font-semibold">{choice.status}</td>
                <td className="py-3 px-6 flex space-x-2">
                  <button
                    onClick={() => handleAction(choice._id, "approve")}
                    className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 disabled:opacity-50"
                    disabled={loadingId === choice._id}
                  >
                    {loadingId === choice._id ? "..." : <FaCheck />}
                  </button>
                  <button
                    onClick={() => handleAction(choice._id, "reject")}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 disabled:opacity-50"
                    disabled={loadingId === choice._id}
                  >
                    {loadingId === choice._id ? "..." : <FaTimes />}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPfe(choice); // Store the selected PFE
                      setShowTeacherModal(true); // Show the modal to assign teacher
                    }}
                    className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
                    disabled={loadingId === choice._id}
                  >
                    {loadingId === choice._id ? "..." : <FaUserPlus />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Teacher Assignment Modal */}
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
                    onClick={() => {
                      assignPFEManually(selectedPfe._id, teacher._id); // Assign teacher to the selected PFE
                      setShowTeacherModal(false); // Close modal after assigning
                    }}
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

      {/* Action buttons for publication and email */}
      <div className="flex space-x-4 mt-6">
        <button
          onClick={() => sendEmail("first")}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          <FaPaperPlane className="inline mr-2" /> Send First Email
        </button>
        <button
          onClick={() => sendEmail("modified")}
          className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600"
        >
          <FaPaperPlane className="inline mr-2" /> Send Modified Email
        </button>
        <button
          onClick={togglePublication}
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
