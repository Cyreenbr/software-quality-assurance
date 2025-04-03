import React, { useEffect, useState } from "react";
import { getStudentsforTearchers } from "../../services/ManageUsersServices/students.service";

const StudentsListForTeachers = ({ onAddClick }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await getStudentsforTearchers();
        if (response && response.model) {
          setStudents(response.model);
          setFilteredStudents(response.model);
        } else {
          setStudents([]);
          setFilteredStudents([]);
          setError("Invalid response format");
        }
      } catch (error) {
        console.error("Error fetching students:", error);
        setError("Failed to load students");
        setStudents([]);
        setFilteredStudents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleLevelFilter = (e) => {
    const level = e.target.value;
    setSelectedLevel(level);
    setFilteredStudents(
      level ? students.filter((s) => s.level === level) : students
    );
  };
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">List of Students</h2>
        {onAddClick && (
          <button
            onClick={onAddClick}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Student
          </button>
        )}
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
                Enrollement Date
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents && filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr
                  key={student._id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-6 text-left">
                    {student.firstName} {student.lastName}
                  </td>
                  <td className="py-3 px-6 text-left">{student.email}</td>
                  <td className="py-3 px-6 text-left">{student.level}</td>
                  <td className="py-3 px-6 text-left">
                    {formatDate(student.createdAt)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-4 px-6 text-center text-gray-500">
                  No students available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentsListForTeachers;
