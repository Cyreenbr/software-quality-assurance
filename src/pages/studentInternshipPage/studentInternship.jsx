import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaFilter, FaSearch } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InternshipCard from "../../components/internshipComponents/InternshipCard";
import internshipService from "../../services/internshipServices/internshipStudentList.service";

const InternshipList = () => {
  const [internships, setInternships] = useState([]);
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    lateSubmission: "",
    supervisor: ""
  });

  useEffect(() => {
    fetchInternships();
  }, []);

  // Fetching internships
  const fetchInternships = async () => {
    try {
      console.log("Fetching internships...");
      const data = await internshipService.getInternships();
      console.log("Fetched internships:", data);

      // Check if any internship is published
      const publishStatus = data.some(internship => internship.planningStatus === "Published");
      setIsPublished(publishStatus);
      
      setInternships(data);
      setFilteredInternships(data); // initialize with all internships
    } catch (error) {
      console.error("Error fetching internships:", error);
      toast.error("Failed to load internships");
    }
  };

  // Text search
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    applyFilters(value, filters);
  };

  // Filter handling
  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    applyFilters(searchTerm, newFilters);
  };

  // Apply all filters
  const applyFilters = (search, filterOptions) => {
    let filtered = internships;

    // Filter by student name (search)
    if (search) {
      filtered = filtered.filter((internship) =>
        internship.student?.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by late submission
    if (filterOptions.lateSubmission !== "") {
      const isLate = filterOptions.lateSubmission === "yes";
      filtered = filtered.filter(internship => internship.isRetard === isLate);
    }

    // Filter by supervisor
    if (filterOptions.supervisor !== "") {
      if (filterOptions.supervisor === "Not Assigned") {
        filtered = filtered.filter(internship => !internship.teacher?.name);
      } else {
        filtered = filtered.filter(internship => 
          internship.teacher?.name?.toLowerCase().includes(filterOptions.supervisor.toLowerCase())
        );
      }
    }

    setFilteredInternships(filtered);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      lateSubmission: "",
      supervisor: ""
    });
    setSearchTerm("");
    setFilteredInternships(internships);
  };

  const handlePublishPlanning = async () => {
    try {
      setIsLoading(true);
      console.log("Publishing planning...");
      const response = await internshipService.publishPlanning("publish");
      console.log("Publish response:", response);
      
      setIsPublished(true);
      toast.success(response?.message || "Planning successfully published.");
      
      // Refresh the list to reflect the changes
      await fetchInternships();
    } catch (error) {
      console.error("Error publishing planning:", error);
      toast.error(error.response?.data?.message || "Error publishing planning.");
    } finally {
      setIsLoading(false);
    }
  };

  // hide planning
  const handleHidePlanning = async () => {
    try {
      setIsLoading(true);
      console.log("Hiding planning...");
      const response = await internshipService.publishPlanning("hide");
      console.log("Hide response:", response);
      
      setIsPublished(false);
      toast.success(response?.message || "Planning successfully hidden.");
      
      // Refresh the list to reflect the changes
      await fetchInternships();
    } catch (error) {
      console.error("Error hiding planning:", error);
      toast.error(error.response?.data?.message || "Error hiding planning.");
    } finally {
      setIsLoading(false);
    }
  };

  // Extract unique values for supervisor filter
  const getUniqueSupervisors = () => {
    const values = new Set();

    values.add("Not Assigned");
    
    internships.forEach(internship => {
      if (internship.teacher?.name) {
        values.add(internship.teacher.name);
      }
    });
    
    return Array.from(values);
  };

  return (
    <div className="min-h-screen bg-white py-10 rounded-lg">
      <div className="max-w-7xl mx-auto p-8">
        <h2 className="text-2xl font-bold text-black-700 mb-6 text-start">
          Internship List
        </h2>

        <div className="mb-6 flex flex-wrap justify-between items-center">
          {/* Publish and Hide buttons */}
          <div className="flex items-center mr-4 border-r border-gray-200 pr-4">
            <button
              onClick={handlePublishPlanning}
              disabled={isLoading || isPublished}
              className={`${
                isLoading || isPublished 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-purple-500 hover:bg-purple-600'
              } text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center mx-2 transition-colors`}
            >
              <FaEye className="mr-1" />
              {isPublished ? 'Published' : 'Publish'}
            </button>

            <button
              onClick={handleHidePlanning}
              disabled={isLoading || !isPublished}
              className={`${
                isLoading || !isPublished 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-red-500 hover:bg-red-600'
              } text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center mx-2 transition-colors`}
            >
              <FaEyeSlash className="mr-1" />
              {!isPublished ? 'Hidden' : 'Hide'}
            </button>
          </div>

          <div className="flex flex-1 items-center justify-end gap-2">
            <div className="flex items-center">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center transition-colors mr-2"
              >
                <FaFilter className="mr-1" />
                {showFilters ? 'Hide' : 'Filter'}
              </button>
              
              {(filters.lateSubmission || filters.supervisor) && (
                <button 
                  onClick={resetFilters}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors mr-2"
                >
                  Reset
                </button>
              )}
            </div>
            
            <div className="relative w-48 md:w-64">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <FaSearch />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search Student"
                className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>
          </div>
        </div>

        {/*Filter Panel */}
        {showFilters && (
          <div className="bg-gray-50 p-3 rounded-lg mb-4 border border-gray-200 shadow-sm">
            <div className="flex flex-wrap gap-3">
              {/* Late submission filter */}
              <div className="w-auto min-w-32">
                <label className="block text-xs font-medium text-gray-700 mb-1">Late Submission</label>
                <select
                  value={filters.lateSubmission}
                  onChange={(e) => handleFilterChange('lateSubmission', e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">All</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              
              {/* Supervisor filter */}
              <div className="w-auto min-w-48">
                <label className="block text-xs font-medium text-gray-700 mb-1">Supervisor</label>
                <select
                  value={filters.supervisor}
                  onChange={(e) => handleFilterChange('supervisor', e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">All</option>
                  {getUniqueSupervisors().map((name, idx) => (
                    <option key={idx} value={name}>{name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredInternships.length > 0 ? (
            filteredInternships.map((internship, index) => (
              <InternshipCard key={index} internship={internship} />
            ))
          ) : (
            <p className="col-span-3 text-center text-gray-500 py-10">No internships found</p>
          )}
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default InternshipList;