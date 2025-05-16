import React, { useState, useEffect } from "react";
import {
  SwitchYear,
  OpenNewYear,
  GetAllYears,
} from "../../services/UniversityYearServices/universityyear.service.js";
import { getStudents } from "../../services/ManageUsersServices/students.service.js";

const UniversityYears = () => {
  const [years, setYears] = useState([]);
  const [newYear, setNewYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [students, setStudents] = useState([]);
  const [showStudentDialog, setShowStudentDialog] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [dialogStep, setDialogStep] = useState(1);

  useEffect(() => {
    fetchYears();
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await getStudents();
      // Fix: Extract students from the response model property
      if (response && response.model) {
        setStudents(response.model);
      } else {
        // Fallback if response structure is different
        setStudents(Array.isArray(response) ? response : []);
      }
    } catch (err) {
      console.error("Failed to fetch students:", err);
      setStudents([]);
    }
  };

  const fetchYears = async () => {
    try {
      setLoading(true);
      const data = await GetAllYears();
      setYears(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch university years");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenNewYear = async () => {
    if (!newYear) {
      setError("Please enter a valid year");
      return;
    }

    // Show the student dialog instead of immediately creating the year
    setShowStudentDialog(true);
    setDialogStep(1);
  };

  // Get unique levels safely with a fallback empty array
  const levels = Array.isArray(students)
    ? [
        ...new Set(students.map((student) => student.level).filter(Boolean)),
      ].sort()
    : [];

  const filteredStudents =
    selectedLevel === "all"
      ? students
      : students.filter((student) => student.level === selectedLevel);

  const confirmOpenNewYear = async () => {
    try {
      setLoading(true);
      await OpenNewYear({ year: newYear });
      setSuccess("New university year created successfully");
      setNewYear("");
      setShowStudentDialog(false);
      fetchYears();
    } catch (err) {
      setError(err.response?.data || "Failed to create new university year");
      alert(err.response?.data || "Failed to create new university year");
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchYear = async (year) => {
    try {
      setLoading(true);
      await SwitchYear({ year });
      setSuccess(`Switched to university year ${year}`);
      fetchYears();
    } catch (err) {
      setError(err.response?.data || "Failed to switch university year");
    } finally {
      setLoading(false);
    }
  };

  // Clear messages after 3 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">University Years Management</h1>

      {/* Alerts */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Create New Year Form */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">
        <h2 className="text-xl font-semibold mb-4">Open New University Year</h2>
        <div className="flex items-end gap-4">
          <div className="w-full">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="year"
            >
              Year (e.g., 2024-2025)
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="year"
              type="text"
              placeholder="Enter academic year"
              value={newYear}
              onChange={(e) => setNewYear(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleOpenNewYear();
                }
              }}
            />
          </div>
          <button
            className="bg-gray-400 text-white p-2 rounded-full hover:bg-gray-500"
            onClick={handleOpenNewYear}
            disabled={loading}
          >
            {loading ? "Processing..." : "Open New Year "}
          </button>
        </div>
      </div>

      {/* Years List */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
        <h2 className="text-xl font-semibold mb-4">University Years</h2>
        {loading && !years.length ? (
          <p className="text-gray-600">Loading...</p>
        ) : years.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {years.map((year) => (
                  <tr key={year._id}>
                    <td className="py-2 px-4 border-b border-gray-200">
                      {year.year}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      {year.current ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Current
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      {!year.current && (
                        <button
                          onClick={() => handleSwitchYear(year.year)}
                          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-1 px-3 rounded text-sm"
                          disabled={loading}
                        >
                          Switch to this year
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No university years found.</p>
        )}
      </div>

      {/* Student Dialog Modal */}
      {showStudentDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[80vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">
                {dialogStep === 1
                  ? "Select Student Level"
                  : "Students by Level"}
              </h3>
              <button
                onClick={() => setShowStudentDialog(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ×
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {dialogStep === 1 ? (
                <div>
                  <p className="mb-4">
                    Before opening the new academic year {newYear}, please
                    select a student level to view:
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <button
                      className={`p-4 border rounded-lg ${
                        selectedLevel === "all"
                          ? "bg-blue-100 border-blue-500"
                          : "border-gray-300"
                      }`}
                      onClick={() => {
                        setSelectedLevel("all");
                        setDialogStep(2);
                      }}
                    >
                      All Students (
                      {Array.isArray(students) ? students.length : 0})
                    </button>
                    {levels.map((level) => (
                      <button
                        key={level}
                        className={`p-4 border rounded-lg ${
                          selectedLevel === level
                            ? "bg-blue-100 border-blue-500"
                            : "border-gray-300"
                        }`}
                        onClick={() => {
                          setSelectedLevel(level);
                          setDialogStep(2);
                        }}
                      >
                        {level} (
                        {Array.isArray(students)
                          ? students.filter((s) => s.level === level).length
                          : 0}
                        )
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-4 flex justify-between items-center">
                    <h4 className="font-semibold">
                      {selectedLevel === "all"
                        ? "All Students"
                        : `Students in ${selectedLevel}`}
                    </h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setDialogStep(1)}
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        Back
                      </button>
                      <select
                        className="border rounded p-1"
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(e.target.value)}
                      >
                        <option value="all">All Levels</option>
                        {levels.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
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
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {Array.isArray(filteredStudents) &&
                        filteredStudents.length > 0 ? (
                          filteredStudents.map((student) => (
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
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="3"
                              className="px-6 py-4 text-center text-gray-500"
                            >
                              No students found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowStudentDialog(false)}
                className="px-4 py-2 mr-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmOpenNewYear}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "Processing..." : "Confirm & Open New Year"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversityYears;
