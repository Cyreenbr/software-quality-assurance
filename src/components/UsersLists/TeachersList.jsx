import React, { useState, useEffect } from "react";
import { getTeachers } from "../../services/ManageUsersServices/teachers.service";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

export function TeachersList() {
  const [teachersList, setTeachersList] = useState([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await getTeachers();
        if (response && response.model) {
          setTeachersList(response.model); // Initialize teachers list
        }
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    fetchTeachers();
  }, []);

  // Function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short", // e.g. "Tue"
      year: "numeric", // e.g. "2025"
      month: "short", // e.g. "Mar"
      day: "numeric", // e.g. "30"
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Manage Teachers</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">List of Teachers</h2>
        <div className="overflow-x-auto">
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
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Hiring Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teachersList.length > 0 ? (
                teachersList.map((teacher) => (
                  <tr
                    key={teacher._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {teacher.firstName} {teacher.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {teacher.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-left text-gray-900">
                      {teacher.grade}
                    </td>
                    <td className="px-6 py-4 text-sm text-left text-gray-500">
                      {formatDate(teacher.hiringDate)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <button className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600">
                          <FaEdit size={18} />
                        </button>
                        <button className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600">
                          <FaTrashAlt size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 py-4">
                    No teachers available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
