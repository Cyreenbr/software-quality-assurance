import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { MdDone, MdUploadFile } from "react-icons/md";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import {
  getStudents,
  insertStudentsFromExcel,
} from "../../services/ManageUsersServices/students.service.js";
import matieresServices from "../../services/matieresServices/matieres.service.js";
import { OpenNewYear } from "../../services/UniversityYearServices/universityyear.service.js";
import AcademicYearPicker from "../AcademicYearPicker.jsx";
import AssignTeachersStep from "./AssignTeachersToSubjects.jsx";
import UpgradeStudents from "./UpgradeStudents.jsx"; // Import UpgradeStudents component
const NewYearListing = ({ onBack }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [currentStep, setCurrentStep] = useState(1);
  const [year, setYear] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [importedStudents, setImportedStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [allStudentsProcessed, setAllStudentsProcessed] = useState(false);
  const studentsPerPage = 5;
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedTeachers, setSelectedTeachers] = useState({});
  const [fetchingSubjects, setFetchingSubjects] = useState(false);
  const steps = [
    "Create Year",
    "Process Students",
    "Upload Data",
    "Assign Teachers to Subjects",
    "Completion",
  ];

  // Fetch subjects & teachers when entering step 4

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);

      return () => clearTimeout(timer); // Clean up if component unmounts
    }
  }, [success, error]);

  useEffect(() => {
    const loadSubjectsAndTeachers = async () => {
      if (currentStep !== 3) return;

      try {
        setFetchingSubjects(true);
        const [subjectsResponse, teachersResponse] = await Promise.all([
          matieresServices.fetchMatieres({ page: 1, limit: 100 }),
          matieresServices.fetchTeachers({ page: 1, limit: 100 }),
        ]);

        const fetchedSubjects = subjectsResponse.subjects || [];
        const fetchedTeachers = teachersResponse.teachers || [];
        console.log(fetchedSubjects);
        console.log(fetchedTeachers);

        setSubjects(fetchedSubjects);
        setTeachers(fetchedTeachers);

        const initialSelected = {};
        fetchedSubjects.forEach((subject) => {
          if (subject.teacherId) {
            initialSelected[subject._id] = subject.teacherId;
          }
        });
        setSelectedTeachers(initialSelected);
      } catch (err) {
        console.error("Failed to load subjects or teachers:", err);
        Swal.fire("Error", "Could not load subjects or teachers.", "error");
      } finally {
        setFetchingSubjects(false);
      }
    };

    loadSubjectsAndTeachers();
  }, [currentStep]);

  const fetchTeachers = async (searchTerm) => {
    try {
      const data = await matieresServices.fetchTeachers({
        page: 1,
        searchTerm: searchTerm,
        limit: 100,
      });
      return data.teachers;
    } catch (error) {
      console.error("Error fetching teachers:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await getStudents();
      // Extract students from the response model property
      if (response && response.model) {
        setStudents(response.model);
      } else {
        // Fallback if response structure is different
        setStudents(Array.isArray(response) ? response : []);
      }
    } catch (err) {
      console.error("Failed to fetch students:", err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // Get unique levels and sort them
  const levels = Array.isArray(students)
    ? [
        ...new Set(students.map((student) => student.level).filter(Boolean)),
      ].sort()
    : [];

  const filteredStudents =
    selectedLevel === "all"
      ? students
      : students.filter((student) => student.level === selectedLevel);

  const createNewYear = async () => {
    try {
      setLoading(true);
      await OpenNewYear({ year: year });
      setSuccess("New university year created successfully");
      // Move to next step after creation
      setCurrentStep(2);
    } catch (err) {
      setError(err.response?.data || "Failed to create new university year");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      readExcel(selectedFile);
    }
  };

  const readExcel = (file) => {
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (jsonData.length > 0) {
        setColumns(jsonData[0]); // First row as headers
        setTableData(jsonData.slice(1)); // Remaining rows as data
      }
    };
  };

  const handleFileUpload = async () => {
    if (!file) {
      Swal.fire({
        title: "Error",
        text: "Please select an Excel file",
        icon: "error",
      });
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      console.log("Sending data to server...");
      const response = await insertStudentsFromExcel(formData);
      console.log("Server response:", response);

      // Transform table data into student format
      const students = tableData.map((row, index) => {
        const studentData = {};
        columns.forEach((col, colIndex) => {
          studentData[col] = row[colIndex] !== undefined ? row[colIndex] : "";
        });

        // Generate avatar name from first column or use "student" as default
        const firstColValue = row[0]
          ? String(row[0]).replace(/\\s+/g, "-").toLowerCase()
          : "student";
        studentData.id = index + 1;
        studentData.avatar = `https://avatars.dicebear.com/v2/initials/${firstColValue}.svg`;

        return studentData;
      });

      setImportedStudents(students);
      setTotalPages(Math.ceil(students.length / studentsPerPage));

      setSuccess("Student data uploaded successfully!");

      Swal.fire({
        title: "Success",
        text: "Students imported successfully!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        // Go back to Season component after success
        if (onBack) onBack();
      });
    } catch (err) {
      console.error("Error during import:", err);
      setError(err.response?.data?.message || "Failed to upload student data");

      Swal.fire({
        title: "Error",
        text: `Import error: ${err.response?.data?.message || err.message}`,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      // Return to Season component
      if (onBack) onBack();
    }
  };

  const handleNext = () => {
    // Only proceed to next step if all students are processed (when coming from Step 2)
    // if (currentStep === 2 && !allStudentsProcessed) {
    //   Swal.fire({
    //     title: "Error",
    //     text: "Please process all students before proceeding",
    //     icon: "warning",
    //   });
    //   return;
    // }

    setCurrentStep(currentStep + 1);
  };

  // Handle completion of student processing
  const handleStudentProcessingComplete = () => {
    setAllStudentsProcessed(true);
    Swal.fire({
      title: "Success",
      text: "All students have been processed successfully!",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  // Calculate progress percentage
  const progressPercentage = (currentStep / 5) * 100;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Academic Year</h1>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="relative">
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                <div
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center p-4 bg-white border rounded-xl shadow-sm">
                {steps.map((label, index) => {
                  const stepNumber = index + 1;
                  const isCompleted = currentStep > stepNumber;
                  const isCurrent = currentStep === stepNumber;
                  const isFuture = currentStep < stepNumber;

                  return (
                    <div key={label} className="flex items-center gap-2">
                      {isCompleted ? (
                        <FaCheckCircle className="text-green-600" />
                      ) : (
                        <div
                          className={`w-4 h-4 rounded-full border-2 ${
                            isCurrent
                              ? "border-blue-600 bg-blue-600"
                              : "border-gray-400"
                          }`}
                        />
                      )}
                      <span
                        className={`${
                          isCompleted || isCurrent
                            ? "text-blue-600 font-medium"
                            : "text-gray-500"
                        }`}
                      >
                        Step {stepNumber}: {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

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

      {/* Step Content */}
      <div className="bg-white shadow-md rounded-lg p-6">
        {/* Step 1: Create Academic Year */}
        {currentStep === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Step 1: Create Academic Year
            </h2>
            <p className="mb-6 text-gray-600">
              Select the academic year you want to create. This will set up the
              system for new student enrollments and course registrations.
            </p>

            <div className="w-full mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="year"
              >
                Academic Year :
              </label>
              <AcademicYearPicker
                value={year}
                onChange={(val) => setYear(val)}
                range={0}
                direction="future"
                includeCurrent={true}
                label=""
                required
              />
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-blue-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Important Information
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>Creating a new academic year will:</p>
                    <ul className="list-disc list-inside mt-1">
                      <li>
                        Set up the academic structure for the selected year
                      </li>
                      <li>Enable student registration for courses</li>
                      <li>
                        Prepare the system for grade recording and academic
                        progress tracking
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Process Students using UpgradeStudents component */}
        {currentStep === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Step 2: Process Students
            </h2>
            <p className="mb-6 text-gray-600">
              Update the status of each student by selecting whether they should
              be upgraded, held back, or graduated. You must process all
              students before proceeding to the next step.
            </p>

            {/* Using the UpgradeStudents component */}
            <UpgradeStudents onComplete={handleStudentProcessingComplete} />

            {/* Display message when all students are processed */}
            {allStudentsProcessed && (
              <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                <div className="flex items-center">
                  <MdDone className="h-5 w-5 mr-2" />
                  <span>All students have been successfully processed!</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Upload Excel File */}
        {currentStep === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Step 3: Upload Student Data
            </h2>
            <p className="mb-6 text-gray-600">
              Upload an Excel file containing student data for the new academic
              year. This will help update student information and academic
              records.
            </p>

            <div className="mb-8">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Upload Excel File:
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <MdUploadFile className="w-10 h-10 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      Excel files only (XLS, XLSX)
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              {fileName && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected file: <span className="font-medium">{fileName}</span>
                </p>
              )}
            </div>

            {/* Excel Preview */}
            {tableData.length > 0 && (
              <div className="mt-6 mb-8">
                <h3 className="text-lg font-medium mb-3">Excel Preview:</h3>
                <div className="overflow-x-auto border rounded">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {columns.map((column, index) => (
                          <th
                            key={index}
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tableData.slice(0, 5).map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((cell, cellIndex) => (
                            <td
                              key={cellIndex}
                              className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                            >
                              {cell !== undefined ? cell : ""}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {tableData.length > 5 && (
                  <p className="mt-2 text-sm text-gray-500">
                    Showing first 5 rows of {tableData.length} total rows
                  </p>
                )}
              </div>
            )}

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Important Note
                  </h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    The Excel file should follow the required format. Make sure
                    it contains all necessary student information with correct
                    column headers. Any inconsistencies may cause import errors.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-md font-medium mb-2">
                Excel File Format Requirements:
              </h3>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Student ID (required)</li>
                <li>First Name and Last Name (required)</li>
                <li>Email Address (required)</li>
                <li>Academic Level (1ère, 2ème, or 3ème année)</li>
                <li>Date of Birth (format: DD/MM/YYYY)</li>
                <li>Phone Number</li>
              </ul>
            </div>
            <div className="flex justify-center items-center">
              <button
                onClick={handleFileUpload}
                disabled={loading || !file}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  loading || !file
                    ? "bg-green-300 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                Upload file
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Assign Teachers */}
        {currentStep === 4 && (
          <AssignTeachersStep
            step={4}
            currentStep={currentStep}
            subjects={subjects}
            fetchTeachers={fetchTeachers}
            fetchingSubjects={fetchingSubjects}
            teachers={teachers}
            // onSubmitAssignments={handleSubmitAssignments}
          />
        )}

        {currentStep === 5 && (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              🎉 New Academic Year Setup Completed!
            </h2>
            <p className="text-gray-700 text-lg">
              The academic year <strong>{year}</strong> has been successfully
              set up, including students, subjects, and teacher assignments.
            </p>
            <button
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              onClick={onBack}
            >
              Return to Dashboard
            </button>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            {currentStep === 1 ? "Cancel" : "Back"}
          </button>

          {currentStep < 5 && (
            <button
              onClick={currentStep === 1 ? createNewYear : handleNext}
              disabled={currentStep === 1 && !year}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                currentStep === 1 && !year
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {currentStep === 1 ? (
                loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating...
                  </span>
                ) : (
                  "Create & Continue"
                )
              ) : currentStep === 4 ? (
                "Finish Academic Year Setup"
              ) : (
                "Next"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewYearListing;
