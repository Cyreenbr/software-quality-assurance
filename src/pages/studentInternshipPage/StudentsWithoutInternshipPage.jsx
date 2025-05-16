import { useEffect, useState } from "react";
import {
  FaBook,
  FaChartBar,
  FaEnvelope,
  FaSearch,
  FaUser
} from "react-icons/fa";
import studentInternshipService from "../../services/internshipServices/studentsWithoutInternship";

const StudentsWithoutInternship = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [internshipType, setInternshipType] = useState("any");
  const [internshipTypes, setInternshipTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(9);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const typesResponse = await studentInternshipService.getStudentsWithoutInternship();
        setInternshipTypes(typesResponse?.type || ["1year", "2year"]);
        
        const response = await studentInternshipService.getStudentsWithoutInternship(internshipType);
        setStudents(response?.students || []);
        setError(null);
      } catch (err) {
        setError("Failed to load data. Please try again later.");
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [internshipType]);

  const handleTypeChange = (e) => {
    setInternshipType(e.target.value);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredStudents = students.filter(student => 
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const formatInternshipType = (type) => {
    switch(type) {
      case "1year": return "First Year";
      case "2year": return "Second Year";
      default: return type;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-400 mb-8 ">
        Students Without Internship
      </h1>

{/* Filters Section */}
<div className="bg-transparent p-4 rounded-lg mb-8 w-full max-w-lg mx-auto">
  <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-4">
    {/* Internship Type Filter */}
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaBook className="h-4 w-4 text-pink-400" />
      </div>
      <select
        value={internshipType}
        onChange={handleTypeChange}
        className="pl-8 w-full px-3 py-1.5 border border-pink-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-200 text-gray-700 bg-white text-sm"
      >
        <option value="any">All Internship Types</option>
        {internshipTypes.map((type, index) => (
          <option key={index} value={type}>
            {formatInternshipType(type)}
          </option>
        ))}
      </select>
    </div>

    {/* Search Filter*/}
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
        <FaSearch className="h-4 w-4 text-pink-400" />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search..."
        className="pl-8 w-full px-3 py-1.5 border border-pink-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-200 text-gray-700 bg-white text-sm"
      />
    </div>
  </div>
</div>

      {/* Results Section */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-blue-50 p-4 rounded-lg text-blue-700 text-center">{error}</div>
      ) : filteredStudents.length === 0 ? (
        <div className="bg-blue-50 p-8 rounded-lg text-center text-blue-600 text-lg">
          No students found matching your criteria
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentStudents.map((student) => (
              <div 
                key={student.id}
                className="bg-transparent p-6 rounded-lg border border-gray-300 hover:shadow-xl hover:bg-gradient-to-r from-blue-50 to-purple-100 transition-all duration-200"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <FaUser className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">{student.name}</h3>
                    <p className="text-sm text-blue-600">{student.email}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <FaEnvelope className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">{student.email}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <FaChartBar className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">{student.level}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-10">
              <nav className="inline-flex rounded-md shadow-sm">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-4 py-2 rounded-l-md border ${
                    currentPage === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-blue-50'
                  } border-gray-200 text-sm font-medium`}
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`relative inline-flex items-center px-4 py-2 border ${
                      currentPage === number
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-700 hover:bg-blue-50 border-gray-200'
                    } text-sm font-medium`}
                  >
                    {number}
                  </button>
                ))}

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-4 py-2 rounded-r-md border ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-blue-50 border-gray-200'
                  } text-sm font-medium`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}

      {/* Summary */}
      {!loading && !error && (
        <div className="mt-8 text-center text-blue-600 font-light">
          Showing {currentStudents.length} of {filteredStudents.length} students without internship
          {internshipType !== "any" && ` (${formatInternshipType(internshipType)})`}
        </div>
      )}
    </div>
  );
};

export default StudentsWithoutInternship;