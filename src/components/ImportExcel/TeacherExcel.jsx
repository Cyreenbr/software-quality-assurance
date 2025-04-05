import { useState } from "react";
import * as XLSX from "xlsx";
import { MdSchool, MdUploadFile, MdRefresh } from "react-icons/md";
import { insertTeacherFromExcel } from "../../services/ManageUsersServices/teachers.service";
import AddTeacher from "../AddUser/AddTeacher";
import Swal from "sweetalert2";
const TeacherExcel = ({ onBackClick }) => {
  const [file, setFile] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [showTeacherList, setShowTeacherList] = useState(false);
  const [importedTeachers, setImportedTeachers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const teachersPerPage = 5;

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    readExcel(selectedFile);
  };

  const handleAddTeachersClick = () => {
    // Show the AddTeacher component instead of navigating
    setShowAddTeacher(true);
  };

  // Handler for when user returns from AddTeacher component
  const handleReturnFromAddTeacher = () => {
    setShowAddTeacher(false);
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

  const handleImportClick = async () => {
    if (!file) {
      Swal.fire({
        title: "Error",
        text: "Please select an Excel file",
        icon: "error",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      console.log("Sending data to server...");
      const response = await insertTeacherFromExcel(formData);
      console.log("Server response:", response);

      // Transform table data to teacher format
      const teachers = tableData.map((row, index) => {
        const teacherData = {};
        columns.forEach((col, colIndex) => {
          teacherData[col] = row[colIndex] !== undefined ? row[colIndex] : "";
        });

        // Generate a name for the avatar from the first column or use "teacher" as default
        const firstColValue = row[0]
          ? String(row[0]).replace(/\s+/g, "-").toLowerCase()
          : "teacher";
        teacherData.id = index + 1;
        teacherData.avatar = `https://avatars.dicebear.com/v2/initials/${firstColValue}.svg`;

        return teacherData;
      });

      setImportedTeachers(teachers);
      setShowTeacherList(true);

      // Calculate total pages
      setTotalPages(Math.ceil(teachers.length / teachersPerPage));

      Swal.fire({
        title: "Success",
        text: "Teachers imported successfully!",
        icon: "success",
      });
    } catch (error) {
      console.error("Error during import:", error);
      Swal.fire({
        title: "Error",
        text: `Import error: ${error.response?.data?.message || error.message}`,
        icon: "error",
      });
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getPaginatedTeachers = () => {
    const startIndex = (currentPage - 1) * teachersPerPage;
    const endIndex = startIndex + teachersPerPage;
    return importedTeachers.slice(startIndex, endIndex);
  };

  // If AddTeacher component should be shown, render it instead of the main content
  if (showAddTeacher) {
    return <AddTeacher onBackClick={handleReturnFromAddTeacher} />;
  }

  const renderImportForm = () => {
    return (
      <div className="bg-white shadow-md rounded-lg p-4 w-full">
        <div className="flex justify-between mb-4">
          <div className="flex flex-col gap-2">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="border p-2 rounded"
            />

            <button
              onClick={handleAddTeachersClick}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Add Teachers
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleImportClick}
              className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              <MdUploadFile className="mr-2" /> Import Excel
            </button>
            <button
              onClick={onBackClick}
              className="flex items-center bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Back
            </button>
          </div>
        </div>
        {tableData.length > 0 && (
          <div className="overflow-x-auto max-w-full">
            <table className="w-max border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  {columns.map((col, index) => (
                    <th key={index} className="border p-2 whitespace-nowrap">
                      {col || "-"}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border">
                    {columns.map((_, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="border p-2 whitespace-nowrap"
                      >
                        {row[cellIndex] !== undefined &&
                        row[cellIndex] !== null &&
                        row[cellIndex] !== ""
                          ? row[cellIndex]
                          : "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderTeacherList = () => {
    return (
      <div className="bg-white shadow-md rounded-lg p-4 w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Imported Teachers</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowTeacherList(false)}
              className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              <MdRefresh className="mr-2" /> New Import
            </button>
            <button
              onClick={onBackClick}
              className="flex items-center bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Back
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                {columns.map((col, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                  >
                    {col || "-"}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {getPaginatedTeachers().map((teacher, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {teacher[col] || "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`mx-1 px-3 py-1 rounded ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full p-6">
      <h1 className="text-2xl font-bold mb-4 flex items-center">
        <MdSchool className="text-blue-500 text-3xl mr-2" />
        Excel Import for Teachers
      </h1>

      {showTeacherList ? renderTeacherList() : renderImportForm()}
    </div>
  );
};

export default TeacherExcel;
