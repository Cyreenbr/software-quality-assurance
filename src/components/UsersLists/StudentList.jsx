import React, { useState, useEffect } from "react";
import { getStudents, deleteStudent } from "../../services/ManageUsersServices/students.service";
import { FaTrashAlt, FaEdit, FaPlus } from "react-icons/fa";

export default function StudentList({ onAddClick }) {
  const [studentsList, setStudentsList] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    fetchStudents();
  }, []);
  
  const fetchStudents = async () => {
    try {
      const response = await getStudents();
      if (response && response.model) {
        setStudentsList(response.model);
        setFilteredStudents(response.model);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  const handleLevelFilter = (e) => {
    const level = e.target.value;
    setSelectedLevel(level);
    if (level === "") {
      setFilteredStudents(studentsList);
    } else {
      const filtered = studentsList.filter(
        (student) => student.level === level
      );
      setFilteredStudents(filtered);
    }
  };

  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!studentToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteStudent(studentToDelete._id);
      // Remove the deleted student from the lists
      const updatedStudentsList = studentsList.filter(
        student => student._id !== studentToDelete._id
      );
      setStudentsList(updatedStudentsList);
      setFilteredStudents(
        filteredStudents.filter(student => student._id !== studentToDelete._id)
      );
      setShowDeleteModal(false);
      setStudentToDelete(null);
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Failed to delete student. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setStudentToDelete(null);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Manage Students</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">List of Students</h2>
          <button 
            className="bg-gray-400 text-white p-2 rounded-full hover:bg-gray-500"
            onClick={onAddClick}
          >
            <FaPlus size={18} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <div className="mb-4">
            <label
              htmlFor="levelFilter"
              className="block text-sm font-medium text-gray-700"
            >
              Filter by Level:
            </label>
            <select
              id="levelFilter"
              value={selectedLevel}
              onChange={handleLevelFilter}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">All Levels</option>
              <option value="1year">1 Year</option>
              <option value="2year">2 Year</option>
              <option value="3year">3 Year</option>
            </select>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Full Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Creation Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr
                    key={student._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-left font-medium text-gray-900">
                      {student.firstName} {student.lastName}
                    </td>
                    <td className="px-6 py-4 text-left text-gray-500">
                      {student.email}
                    </td>
                    <td className="px-6 py-4 text-left text-center text-gray-900">
                      {student.level}
                    </td>
                    <td className="px-6 py-4 text-left text-center text-gray-500">
                      {formatDate(student.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <button className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600">
                          <FaEdit size={18} />
                        </button>
                        <button 
                          className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                          onClick={() => handleDeleteClick(student)}
                        >
                          <FaTrashAlt size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 py-4">
                    {selectedLevel === ""
                      ? "No students available"
                      : `No students available for level ${selectedLevel}`}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
  {/* Delete Confirmation Modal */}
{showDeleteModal && (
  <div className="fixed inset-0 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
      <p className="text-gray-600 mb-6">
        Are you sure you want to delete {studentToDelete?.firstName} {studentToDelete?.lastName}? This action cannot be undone.
      </p>
      <div className="flex justify-end gap-4">
        <button
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          onClick={handleCancelDelete}
          disabled={isDeleting}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          onClick={handleConfirmDelete}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}