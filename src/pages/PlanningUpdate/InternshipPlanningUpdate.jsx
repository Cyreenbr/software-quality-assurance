import React, { useEffect, useState } from "react";
import { FaEdit, FaEnvelope, FaSearch, FaTimes, FaUserTie } from "react-icons/fa";
import internshipService from "../../services/updateplanninginternship/UpdateInternshipPlanning.service";

const InternshipPlanning = () => {
  const [internships, setInternships] = useState([]);
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const internshipsData = await internshipService.getInternships();
        if (Array.isArray(internshipsData)) {
          setInternships(internshipsData);
          setFilteredInternships(internshipsData);
        }

        const teachersData = await internshipService.getTeachers();
        if (Array.isArray(teachersData)) {
          setTeachers(teachersData);
        }
      } catch (error) {
        setMessage("Error fetching data. Please try again later.");
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = internships.filter((internship) =>
      internship.student?.name?.toLowerCase().includes(value)
    );
    setFilteredInternships(filtered);
  };

  const handleAssignTeacher = async () => {
    if (!selectedTeacher || !selectedInternship?._id) {
      setMessage("Please select both an internship and a teacher.");
      setMessageType("error");
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
      return;
    }

    try {
      const response = await internshipService.updateInternshipTeacher(
        selectedInternship._id,
        selectedTeacher
      );

      if (response) {
        setMessage("Internship updated successfully!");
        setMessageType("success");
        setTimeout(() => {
          setMessage("");
          setMessageType("");
        }, 3000);
        const selectedTeacherObj = teachers.find(t => t._id === selectedTeacher);
        const updatedInternships = internships.map((internship) =>
          internship._id === selectedInternship._id
            ? { ...internship, teacher: selectedTeacherObj }
            : internship
        );

        setInternships(updatedInternships);
        setFilteredInternships(updatedInternships);
        setSelectedTeacher("");
        setSelectedInternship(null);
      } else {
        setMessage("Error updating internship.");
        setMessageType("error");
        setTimeout(() => {
          setMessage("");
          setMessageType("");
        }, 3000);
      }
    } catch (error) {
      setMessage("Error updating internship. Please try again.");
      setMessageType("error");
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
    }
  };

  const getTeacherName = (teacher) => {
    if (!teacher) return "Not Assigned";

    if (teacher.firstName && teacher.lastName) {
      return `${teacher.firstName} ${teacher.lastName}`;
    }

    if (teacher.name) {
      return teacher.name;
    }

    return "Not Assigned";
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-100 py-10">
      <div className="max-w-7xl bg-white rounded-lg shadow-lg mx-auto p-8">
        <h1 className="text-3xl font-semibold text-start text-gray-700 mb-6">Internship Assignments</h1>

        {message && (
          <div
            className={`p-3 rounded-lg mb-4 ${messageType === "error" ? "bg-red-400 text-white" : "bg-green-400 text-white"}`}
          >
            {message}
          </div>
        )}

        <div className="relative w-full max-w-md ml-auto mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by Student Name"
            className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            <FaSearch />
          </span>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading data...</p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 px-8 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-2/5">
                <tr>
                  <th className="p-4 text-left">Student</th>
                  <th className="p-4 text-left">Internship</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Supervisor</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInternships.length > 0 ? (
                  filteredInternships.map((internship) => (
                    <tr key={internship._id} className="hover:bg-gray-50 transition">
                      <td className="p-4 flex items-center space-x-2">
                        <FaUserTie className="text-blue-500" />
                        <span>{internship.student?.name || "No Name Available"}</span>
                      </td>
                      <td className="p-4">{internship.titre || "No Title Available"}</td>
                      <td className="p-4 flex items-center space-x-2">
                        <FaEnvelope className="text-gray-500" />
                        <span>{internship.student?.email || "No Email Available"}</span>
                      </td>
                      <td className="p-4">{getTeacherName(internship.teacher)}</td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedInternship(internship);
                            setSelectedTeacher(internship.teacher?._id || "");
                          }}
                          className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:scale-105 transition"
                        >
                          <FaEdit />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center p-4 text-gray-500">
                      No internships match your search
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedInternship && (
        <div className="fixed inset-0 flex items-center justify-center z-40">
          <div className="absolute inset-0 bg-black opacity-50"></div>

          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative z-50">
            <h2 className="text-xl font-bold mb-4">Assign a Supervisor</h2>
            <button
              onClick={() => setSelectedInternship(null)}
              className="absolute top-2 right-2 text-red-500 text-xl hover:scale-105 transition"
            >
              <FaTimes />
            </button>
            <select
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              className="w-full border p-2 rounded-lg mb-4"
            >
              <option value="">Select a Teacher</option>
              {teachers.length > 0 ? (
                teachers.map((teacher) => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.firstName} {teacher.lastName}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No teachers available
                </option>
              )}
            </select>

            {message && (
              <div
                className={`p-3 rounded-lg mb-4 ${messageType === "error" ? "bg-red-400 text-white" : "bg-green-400 text-white"}`}
              >
                {message}
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={handleAssignTeacher}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:scale-105 transition"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternshipPlanning;
