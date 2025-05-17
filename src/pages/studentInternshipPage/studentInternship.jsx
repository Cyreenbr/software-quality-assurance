import { Button, Dropdown, Menu, Pagination, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { FaClock, FaEye, FaEyeSlash, FaSearch, FaSync, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    lateSubmission: "",
    supervisor: ""
  });
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchInternships();
  }, []);

 
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
      setTotalItems(data.length);
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
    setCurrentPage(1); // Reset to first page on new search
  };

  // Filter handling
  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    applyFilters(searchTerm, newFilters);
    setCurrentPage(1);
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
    setTotalItems(filtered.length);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      lateSubmission: "",
      supervisor: ""
    });
    setSearchTerm("");
    setFilteredInternships(internships);
    setTotalItems(internships.length);
    setCurrentPage(1); 
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


  const handleUpdateAssignment = () => {
    navigate('/StudentsWithoutInternship'); 
  };

    const handlePageAssignment  = () => {
    navigate("/InternshipAssignment");
  };


  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (current, size) => {
    setPageSize(size);
    setCurrentPage(1); 
  };

  // Calculate current items to display
  const getCurrentInternships = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredInternships.slice(startIndex, endIndex);
  };

  
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

  // For late submission filter menu
  const lateSubmissionMenu = (
    <Menu
      onClick={({ key }) => handleFilterChange('lateSubmission', key)}
      selectedKeys={[filters.lateSubmission]}
      items={[
        { key: "", label: "All" },
        { key: "yes", label: "Late" },
        { key: "no", label: "On Time" }
      ].map(item => ({
        key: item.key,
        label: (
          <div className="flex items-center">
            <span className={`w-3 h-3 rounded-full mr-2 ${
              item.key === "yes" ? "bg-red-500" : 
              item.key === "no" ? "bg-green-500" : 
              "bg-gray-400"
            }`}></span>
            {item.label}
          </div>
        )
      }))}
    />
  );

  // For supervisor filter menu
  const supervisorMenu = (
    <Menu
      onClick={({ key }) => handleFilterChange('supervisor', key)}
      selectedKeys={[filters.supervisor]}
      items={
        [{ key: "", label: "All" }].concat(
          getUniqueSupervisors().map(name => ({
            key: name,
            label: name
          }))
        ).map(item => ({
          key: item.key,
          label: (
            <div className="flex items-center">
              {item.key === "Not Assigned" ? (
                <span className="w-3 h-3 rounded-full mr-2 bg-orange-500"></span>
              ) : item.key === "" ? (
                <span className="w-3 h-3 rounded-full mr-2 bg-gray-400"></span>
              ) : (
                <span className="w-3 h-3 rounded-full mr-2 bg-blue-500"></span>
              )}
              {item.label}
            </div>
          )
        }))
      }
    />
  );

  return (
    <div className="min-h-screen bg-white py-10 rounded-lg">
      <div className="max-w-7xl mx-auto p-8">
        <h2 className="text-2xl font-bold text-blue-500 mb-6 text-start">
          Internship List
        </h2>

        {/* First row - Action buttons */}
        <div className="mb-4 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center border-r border-gray-200 pr-4">
            <button
              onClick={handlePublishPlanning}
              disabled={isLoading || isPublished}
              className={`${
                isLoading || isPublished 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-pink-500 hover:bg-pink-600'
              } text-white px-4 py-2 rounded-full text-sm font-medium flex items-center mx-2 transition-colors`}
            >
              <FaEye className="mr-2" />
              {isPublished ? 'Published' : 'Publish'}
            </button>

            <button
              onClick={handleHidePlanning}
              disabled={isLoading || !isPublished}
              className={`${
                isLoading || !isPublished 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-purple-500 hover:bg-purple-600'
              } text-white px-4 py-2 rounded-full text-sm font-medium flex items-center mx-2 transition-colors`}
            >
              <FaEyeSlash className="mr-2" />
              {!isPublished ? 'Hidden' : 'Hide'}
            </button>
          </div>

          <div className="flex items-center">
            <button
              onClick={handleUpdateAssignment}
              className="bg-transparent text-gray-700 font-medium px-4 py-1.5 rounded-full border border-pink-300 text-sm hover:bg-pink-50 hover:border-blue-400 transition-colors duration-200 flex items-center mx-2"
            >
              Students without internship
            </button>
                      <button
            onClick={handlePageAssignment}
            className="bg-transparent text-gray-700 font-medium px-4 py-1.5 rounded-full border border-pink-300 text-sm hover:bg-pink-50 hover:border-blue-400 transition-colors duration-200 flex items-center mx-2"
          >
            Internship Assignment
          </button>
          </div>
          
        </div>

        {/* Second row - Filter and search controls */}
        <div className="mb-6 flex flex-wrap justify-between items-center gap-4 bg-gray-50 p-4 rounded-lg">
          <div className="flex space-x-2">
            <Tooltip title="Filter by submission status">
              <Dropdown overlay={lateSubmissionMenu} placement="bottomRight" trigger={["click"]}>
                <Button 
                  type="default" 
                  className="flex items-center justify-center border border-pink-200 rounded-full bg-white hover:bg-pink-50 hover:border-pink-300 transition-colors"
                >
                  <div className="flex items-center">
                    <FaClock className="text-pink-500 mr-1.5" />
                    <span className="text-gray-700">
                      {filters.lateSubmission ? 
                        (filters.lateSubmission === "yes" ? "Late" : "On Time") : 
                        "Submission"
                      }
                    </span>
                  </div>
                </Button>
              </Dropdown>
            </Tooltip>
            
            <Tooltip title="Filter by supervisor">
              <Dropdown overlay={supervisorMenu} placement="bottomRight" trigger={["click"]}>
                <Button 
                  type="default" 
                  className="flex items-center justify-center border border-pink-200 rounded-full bg-white hover:bg-pink-50 hover:border-pink-300 transition-colors"
                >
                  <div className="flex items-center">
                    <FaUser className="text-pink-500 mr-1.5" />
                    <span className="text-gray-700">
                      {filters.supervisor ? 
                        (filters.supervisor.length > 10 ? 
                          filters.supervisor.substring(0, 10) + "..." : 
                          filters.supervisor) : 
                        "Supervisor"
                      }
                    </span>
                  </div>
                </Button>
              </Dropdown>
            </Tooltip>
            
            {(filters.lateSubmission || filters.supervisor || searchTerm) && (
              <Button
                onClick={resetFilters}
                className="flex items-center justify-center border border-pink-200 rounded-full bg-white hover:bg-pink-50 hover:border-pink-300 transition-colors"
              >
                <div className="flex items-center">
                  <FaSync className="text-pink-500 mr-1.5" />
                  <span className="text-gray-700">Reset</span>
                </div>
              </Button>
            )}
          </div>
          
          <div className="relative w-full sm:w-auto sm:min-w-48 md:min-w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-pink-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search student..."
              className="block w-full pl-10 pr-3 py-2 border border-pink-200 rounded-full leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-pink-300 focus:border-pink-300 sm:text-sm transition-colors"
            />
          </div>
        </div>

        {/* Active filters display */}
        {(filters.lateSubmission || filters.supervisor || searchTerm) && (
          <div className="bg-white p-4 rounded-lg shadow-sm border border-pink-100 mb-6">
            <div className="flex flex-wrap gap-2">
              <span className="font-medium text-gray-700">Active filters:</span>
              {filters.lateSubmission && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-800">
                  {filters.lateSubmission === "yes" ? "Late" : "On Time"}
                  <button onClick={() => handleFilterChange('lateSubmission', '')} className="ml-2 text-pink-500 hover:text-pink-700 focus:outline-none">
                    ×
                  </button>
                </span>
              )}
              {filters.supervisor && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  Supervisor: {filters.supervisor}
                  <button onClick={() => handleFilterChange('supervisor', '')} className="ml-2 text-blue-500 hover:text-blue-700 focus:outline-none">
                    ×
                  </button>
                </span>
              )}
              {searchTerm && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  Search: "{searchTerm}"
                  <button onClick={() => setSearchTerm("")} className="ml-2 text-purple-500 hover:text-purple-700 focus:outline-none">
                    ×
                  </button>
                </span>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-6">
          {filteredInternships.length > 0 ? (
            getCurrentInternships().map((internship, index) => (
              <InternshipCard key={index} internship={internship} />
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-sm border border-pink-100">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-50 mb-4">
                <FaSearch className="text-pink-400 text-2xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No internships found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
        
        {/* Pagination controls */}
        {filteredInternships.length > 0 && (
          <div className="flex justify-center mt-8 mb-8">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalItems}
              onChange={handlePageChange}
              onShowSizeChange={handlePageSizeChange}
              showSizeChanger
              pageSizeOptions={['5', '10', '20', '50']}
              showTotal={(total, range) => `Showing ${range[0]}-${range[1]} of ${total} internships`}
              className="pagination-blue" 
            />
          </div>
        )}
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