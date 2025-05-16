import { Button, Dropdown, Menu, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TeacherInternshipCard from "../../components/internshipComponents/TeacherInternshipCard";
import { teacherinternshipService } from "../../services/internshipServices/TeacherInternship.service";

const TeacherInternshipList = () => {
  const [internships, setInternships] = useState([]);
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");

  useEffect(() => {
    fetchInternships();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, statusFilter, dateFilter, internships]);

  const fetchInternships = async () => {
    try {
      setLoading(true);
      const data = await teacherinternshipService.getInternships();
      setInternships(data);
      setFilteredInternships(data);
    } catch (error) {
      console.error("Failed to fetch internships:", error);
      toast.error("Failed to fetch internships. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const applyFilters = () => {
    let filtered = [...internships];

    // Apply search term filter
    if (searchTerm) {
      filtered = filtered.filter(
        (internship) =>
          internship.studentId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          internship.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    //status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter((internship) => internship.status === statusFilter);
    }

    // date filter
    if (dateFilter === "Not Scheduled") {
      filtered = filtered.filter((internship) => 
        !internship.defenseDate || 
        internship.defenseDate === "Not scheduled" || 
        internship.defenseDate === ""
      );
    } else if (dateFilter === "Scheduled") {
      filtered = filtered.filter((internship) => 
        internship.defenseDate && 
        internship.defenseDate !== "Not scheduled" && 
        internship.defenseDate !== ""
      );
    }

    setFilteredInternships(filtered);
  };

  const handleScheduleUpdate = async (internshipId, defenseData) => {
    try {
      await teacherinternshipService.scheduleDefense(internshipId, defenseData);
      toast.success("Defense scheduled successfully!");
      await fetchInternships();
      return true; 
    } catch (error) {
      console.error("Error updating schedule:", error);
      toast.error(error.message || "Failed to schedule defense");
      return false;
    }
  };

  const handleEvaluation = async (internshipId, evaluationData) => {
    try {
      await teacherinternshipService.evaluateInternship(internshipId, evaluationData);
      toast.success("Evaluation submitted successfully!");
      await fetchInternships();
      return true;
    } catch (error) {
      console.error("Error evaluating internship:", error);
      toast.error(error.message || "Failed to submit evaluation");
      return false;
    }
  };

  const statusMenu = (
    <Menu
      onClick={({ key }) => setStatusFilter(key)}
      selectedKeys={[statusFilter]}
      items={[
        { key: "All", label: "All Statuses" },
        { key: "Pending", label: "Pending" },
        { key: "Validated", label: "Validated" },
        { key: "Not Validated", label: "Not Validated" }
      ].map(item => ({
        key: item.key,
        label: (
          <div className="flex items-center">
            <span className={`w-3 h-3 rounded-full mr-2 ${
              item.key === "Validated" ? "bg-green-500" : 
              item.key === "Not Validated" ? "bg-red-500" : 
              item.key === "Pending" ? "bg-yellow-500" : "bg-gray-400"
            }`}></span>
            {item.label}
          </div>
        )
      }))}
    />
  );

  const dateMenu = (
    <Menu
      onClick={({ key }) => setDateFilter(key)}
      selectedKeys={[dateFilter]}
      items={[
        { key: "All", label: "All Dates" },
        { key: "Scheduled", label: "Defense Scheduled" },
        { key: "Not Scheduled", label: "Not Scheduled Yet" }
      ].map(item => ({
        key: item.key,
        label: (
          <div className="flex items-center">
            <span className={`w-3 h-3 rounded-full mr-2 ${
              item.key === "Scheduled" ? "bg-purple-500" : 
              item.key === "Not Scheduled" ? "bg-orange-500" : 
              "bg-gray-400"
            }`}></span>
            {item.label}
          </div>
        )
      }))}
    />
  );

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">
              Internship Management
            </h2>
            
            <div className="flex flex-col sm:flex-row w-full md:w-auto space-y-3 sm:space-y-0 sm:space-x-3">
              <div className="relative w-full md:w-80">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-pink-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder="Search by student or title..."
                  className="block w-full pl-10 pr-3 py-2 border border-pink-200 rounded-full leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-pink-300 focus:border-pink-300 sm:text-sm transition-colors"
                />
              </div>
              
              <div className="flex space-x-2">
                <Tooltip title="Filter by status">
                  <Dropdown menu={statusMenu} placement="bottomRight" trigger={["click"]}>
                    <Button 
                      type="default" 
                      className="flex items-center justify-center border border-pink-200 rounded-full bg-white hover:bg-pink-50 hover:border-pink-300 transition-colors"
                    >
                      <div className="flex items-center">
                        <StatusIcon className="text-pink-500 mr-1.5" />
                        <span className="text-gray-700">
                          {statusFilter === "All" ? "Status" : statusFilter}
                        </span>
                      </div>
                    </Button>
                  </Dropdown>
                </Tooltip>
                
                <Tooltip title="Filter by defense date">
                  <Dropdown menu={dateMenu} placement="bottomRight" trigger={["click"]}>
                    <Button 
                      type="default" 
                      className="flex items-center justify-center border border-pink-200 rounded-full bg-white hover:bg-pink-50 hover:border-pink-300 transition-colors"
                    >
                      <div className="flex items-center">
                        <CalendarIcon className="text-pink-500 mr-1.5" />
                        <span className="text-gray-700">
                          {dateFilter === "All" ? "Date" : dateFilter}
                        </span>
                      </div>
                    </Button>
                  </Dropdown>
                </Tooltip>
              </div>
            </div>
          </div>

          {(statusFilter !== "All" || dateFilter !== "All" || searchTerm) && (
            <div className="bg-white p-4 rounded-lg shadow-sm border border-pink-100 mb-6">
              <div className="flex flex-wrap gap-2">
                <span className="font-medium text-gray-700">Active filters:</span>
                {statusFilter !== "All" && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-800">
                    Status: {statusFilter}
                    <button onClick={() => setStatusFilter("All")} className="ml-2 text-pink-500 hover:text-pink-700 focus:outline-none">
                      ×
                    </button>
                  </span>
                )}
                {dateFilter !== "All" && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    Defense: {dateFilter}
                    <button onClick={() => setDateFilter("All")} className="ml-2 text-purple-500 hover:text-purple-700 focus:outline-none">
                      ×
                    </button>
                  </span>
                )}
                {searchTerm && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    Search: "{searchTerm}"
                    <button onClick={() => setSearchTerm("")} className="ml-2 text-blue-500 hover:text-blue-700 focus:outline-none">
                      ×
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col justify-center items-center h-64 space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-pink-500 border-solid"></div>
              <p className="text-gray-600 text-sm">Loading internships...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredInternships.length === 0 ? (
                <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-sm border border-pink-100">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-50 mb-4">
                    <FaSearch className="text-pink-400 text-2xl" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No internships found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
              ) : (
                filteredInternships.map((internship) => (
                  <TeacherInternshipCard
                    key={internship.id || internship._id}
                    internship={internship}
                    onScheduleUpdate={handleScheduleUpdate}
                    onEvaluate={handleEvaluation}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Status Icon Component
const StatusIcon = ({ className }) => (
  <div className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
  </div>
);

// Calendar Icon Component
const CalendarIcon = ({ className }) => (
  <div className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
      <circle cx="12" cy="15" r="2"></circle>
    </svg>
  </div>
);

export default TeacherInternshipList;