import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { MdSchool, MdUploadFile, MdRefresh, MdEdit, MdDelete } from "react-icons/md";
import { insertStudentsFromExcel } from "../services/AccountServices/account.service";

const StudentManag = () => {
  const [file, setFile] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [showStudentList, setShowStudentList] = useState(false);
  const [importedStudents, setImportedStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(3);
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

  const handleDelete = (id) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet étudiant?")) {
      const updatedStudents = importedStudents.filter(student => student.id !== id);
      setImportedStudents(updatedStudents);
      
      // Mettre à jour le nombre de pages
      setTotalPages(Math.ceil(updatedStudents.length / studentsPerPage));
      
      // Si la page actuelle est désormais vide, revenir à la page précédente
      if (currentPage > Math.ceil(updatedStudents.length / studentsPerPage) && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const renderStudentList = () => {
    return (
      <>
        <div className="bg-green-100 text-green-800 p-4 rounded mb-4">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0">
            <div>
              <span className="icon mr-2"><MdSchool className="inline" /></span>
              <b>Import réussi!</b> {importedStudents.length} étudiants ont été importés
            </div>
            <button 
              type="button" 
              className="px-3 py-1 text-sm bg-transparent hover:bg-green-200 rounded"
              onClick={() => setShowStudentList(false)}
            >
              Retour
            </button>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <header className="bg-gray-100 px-5 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <p className="font-bold text-lg flex items-center">
                <span className="icon mr-2"><MdSchool className="text-blue-500" /></span>
                Liste des Étudiants
              </p>
              <button 
                onClick={() => setShowStudentList(false)}
                className="rounded-full p-2 hover:bg-gray-200"
              >
                <MdRefresh />
              </button>
            </div>
          </header>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-4 py-3 w-10">
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox rounded h-4 w-4 text-blue-500" />
                    </label>
                  </th>
                  <th className="px-4 py-3 w-14">Photo</th>
                  {columns.map((col, index) => (
                    <th key={index} className="px-4 py-3 whitespace-nowrap">{col || "-"}</th>
                  ))}
                  <th className="px-4 py-3 w-20">Actions</th>
                </tr>
              </thead>
              <tbody>
                {getPaginatedStudents().map((student) => (
                  <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <label className="inline-flex items-center">
                        <input type="checkbox" className="form-checkbox rounded h-4 w-4 text-blue-500" />
                      </label>
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-10 h-10 overflow-hidden rounded-full">
                        <img src={student.avatar} className="w-full h-full object-cover" alt="avatar" />
                      </div>
                    </td>
                    {columns.map((col, index) => (
                      <td key={index} className="px-4 py-3" data-label={col}>
                        {student[col] !== undefined && student[col] !== null && student[col] !== "" 
                          ? student[col] 
                          : "-"}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex justify-end space-x-2">
                        <button 
                          className="p-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                          title="Modifier"
                        >
                          <MdEdit />
                        </button>
                        <button 
                          className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                          title="Supprimer"
                          onClick={() => handleDelete(student.id)}
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {importedStudents.length > 0 ? (
              <div className="px-4 py-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="space-x-1">
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-3 py-1 rounded text-sm ${
                          currentPage === index + 1
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 hover:bg-gray-200"
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                  <small className="text-gray-500">
                    Page {currentPage} sur {totalPages}
                  </small>
                </div>
              </div>
            ) : (
              <div className="px-4 py-3 text-center text-gray-500">
                Aucun étudiant disponible
              </div>
            )}
          </div>
        </div>
      </>
    );
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