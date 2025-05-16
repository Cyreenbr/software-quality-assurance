import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { MdSchool, MdTimeline, MdDone, MdClose } from "react-icons/md";
import { getStudents } from "../../services/ManageUsersServices/students.service";
import { upgradeStudentById } from "../../services/UniversityYearServices/studentsyear.service.js";

const UpgradeStudents = ({ onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentStatus, setStudentStatus] = useState({});
  const [processedCount, setProcessedCount] = useState(0);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await getStudents();
      if (response && response.model) {
        setStudents(response.model);
      } else {
        setStudents(Array.isArray(response) ? response : []);
      }
    } catch (err) {
      console.error("Failed to fetch students:", err);
      setError("Failed to load students. Please try again.");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStudent = async (studentId, situation) => {
    try {
      setLoading(true);

      // Utilisation du service personnalisé
      const response = await upgradeStudentById(studentId, situation);
      const updatedStudent = response.student;

      setStudentStatus((prevStatus) => ({
        ...prevStatus,
        [studentId]: situation,
      }));

      setProcessedCount((prevCount) => prevCount + 1);
      /*
      Swal.fire({
        title: "Success",
        text: `Student ${updatedStudent.firstName} ${
          updatedStudent.lastName
        } has been ${
          situation === "passe"
            ? "upgraded"
            : situation === "redouble"
            ? "held back"
            : "graduated"
        }!`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });*/
    } catch (err) {
      console.error("Failed to update student:", err);

      Swal.fire({
        title: "Error",
        text: err.response?.data?.message || "Failed to update student status",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  // Check if all students have been processed
  useEffect(() => {
    if (students.length > 0 && processedCount === students.length) {
      // All students have been processed, notify parent component
      onComplete && onComplete();
    }
  }, [processedCount, students.length, onComplete]);

  const getButtonsForLevel = (student) => {
    const level = student.level;

    // Check if this student has already been processed
    if (studentStatus[student._id]) {
      // Render disabled button showing the chosen option
      const status = studentStatus[student._id];
      const statusText =
        status === "passe"
          ? "Upgraded"
          : status === "redouble"
          ? "Held Back"
          : "Graduated";
      const statusIcon =
        status === "passe" ? (
          <MdDone />
        ) : status === "redouble" ? (
          <MdTimeline />
        ) : (
          <MdSchool />
        );

      return (
        <button
          className="px-3 py-1 rounded bg-gray-200 text-gray-800 flex items-center gap-1"
          disabled
        >
          {statusIcon} {statusText}
        </button>
      );
    }

    // If level is 1year or 2year, show upgraded or not upgraded buttons
    if (level === "1year" || level === "2year") {
      return (
        <div className="space-x-2">
          <button
            onClick={() => handleUpdateStudent(student._id, "passe")}
            className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 flex items-center gap-1"
          >
            <MdDone /> Upgrade
          </button>
          <button
            onClick={() => handleUpdateStudent(student._id, "redouble")}
            className="px-3 py-1 rounded bg-yellow-600 text-white hover:bg-yellow-700 flex items-center gap-1"
          >
            <MdTimeline /> Hold Back
          </button>
        </div>
      );
    }
    // If level is 3year, show graduated or not upgraded buttons
    else if (level === "3year") {
      return (
        <div className="space-x-2">
          <button
            onClick={() => handleUpdateStudent(student._id, "diplome")}
            className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1"
          >
            <MdSchool /> Graduate
          </button>
          <button
            onClick={() => handleUpdateStudent(student._id, "redouble")}
            className="px-3 py-1 rounded bg-yellow-600 text-white hover:bg-yellow-700 flex items-center gap-1"
          >
            <MdTimeline /> Hold Back
          </button>
        </div>
      );
    }

    // For any other level (should not happen, but just in case)
    return <span className="text-gray-500">No actions available</span>;
  };

  const getProgressPercentage = () => {
    if (students.length === 0) return 0;
    return (processedCount / students.length) * 100;
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Student Progression Management
      </h2>
      <p className="mb-6 text-gray-600">
        Update the status of each student by selecting whether they should be
        upgraded, held back, or graduated. You must process all students before
        proceeding.
      </p>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-medium text-gray-700">
            {processedCount} of {students.length} students processed
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Student Table */}
      {loading && !students.length ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Loading students...</p>
        </div>
      ) : (
        <div className="overflow-x-auto border rounded">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Level
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(students) && students.length > 0 ? (
                students.map((student) => (
                  <tr key={student._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.firstName} {student.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.level}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getButtonsForLevel(student)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UpgradeStudents;
