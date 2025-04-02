import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { MdSchool, MdUploadFile, MdRefresh, MdEdit, MdDelete, MdWarning } from "react-icons/md";
import { insertStudentsFromExcel, deleteStudent } from "../services/StudentServices/student.service";

const StudentManag = () => {
  const [file, setFile] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [showStudentList, setShowStudentList] = useState(false);
  const [importedStudents, setImportedStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    readExcel(selectedFile);
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
      alert("Veuillez sélectionner un fichier Excel");
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      console.log("Envoi des données au serveur...");
      const response = await insertStudentsFromExcel(formData);
      console.log("Réponse du serveur:", response);
      
      // Transformer les données du tableau en format étudiant
      const students = tableData.map((row, index) => {
        const studentData = {};
        columns.forEach((col, colIndex) => {
          studentData[col] = row[colIndex] !== undefined ? row[colIndex] : "";
        });
        
        // Générer un nom pour l'avatar à partir de la première colonne ou utiliser "student" par défaut
        const firstColValue = row[0] ? String(row[0]).replace(/\s+/g, '-').toLowerCase() : 'student';
        studentData.id = index + 1;
        studentData.avatar = `https://avatars.dicebear.com/v2/initials/${firstColValue}.svg`;
        
        return studentData;
      });
      
      setImportedStudents(students);
      setShowStudentList(true);
      
      // Calculer le nombre de pages total
      setTotalPages(Math.ceil(students.length / studentsPerPage));
      
      alert("Import réussi!");
    } catch (error) {
      console.error("Erreur lors de l'import:", error);
      alert(`Erreur lors de l'import: ${error.response?.data?.message || error.message}`);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getPaginatedStudents = () => {
    const startIndex = (currentPage - 1) * studentsPerPage;
    const endIndex = startIndex + studentsPerPage;
    return importedStudents.slice(startIndex, endIndex);
  };

  const renderImportForm = () => {
    return (
      <div className="bg-white shadow-md rounded-lg p-4 w-full">
        <div className="flex justify-between mb-4">
          <input 
            type="file" 
            accept=".xlsx,.xls" 
            onChange={handleFileChange} 
            className="border p-2 rounded" 
          />
          <button 
            onClick={handleImportClick}
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            <MdUploadFile className="mr-2" /> Import Excel
          </button>
        </div>
        {tableData.length > 0 && (
          <div className="overflow-x-auto max-w-full">
            <table className="w-max border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  {columns.map((col, index) => (
                    <th key={index} className="border p-2 whitespace-nowrap">{col || "-"}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border">
                    {columns.map((_, cellIndex) => (
                      <td key={cellIndex} className="border p-2 whitespace-nowrap">
                        {(row[cellIndex] !== undefined && row[cellIndex] !== null && row[cellIndex] !== "") 
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

  return (
    <div className="w-full p-6">
      <h1 className="text-2xl font-bold mb-4 flex items-center">
        <MdSchool className="text-blue-500 text-3xl mr-2" /> 
        Student Management
      </h1>
      
      {showStudentList ? renderStudentList() : renderImportForm()}
    </div>
  );
};

export default StudentManag;