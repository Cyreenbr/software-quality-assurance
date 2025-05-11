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

  useEffect(() => {
    fetchInternships();
  }, []);

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

    const filtered = internships.filter(
      (internship) =>
        internship.studentId?.name?.toLowerCase().includes(value.toLowerCase()) ||
        internship.title?.toLowerCase().includes(value.toLowerCase())
    );
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

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">
              Internship Management
            </h2>
            
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search by student or title..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          {loading ? (
  <div className="flex flex-col justify-center items-center h-64 space-y-4">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
    <p className="text-gray-600 text-sm">Loading internships...</p>
  </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredInternships.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No internships found 
                </div>
              ) : (
                filteredInternships.map((internship) => (
                  <TeacherInternshipCard
                    key={internship.id || internship._id}
                    internship={internship}
                    onScheduleUpdate={handleScheduleUpdate}
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

export default TeacherInternshipList;