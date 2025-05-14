import { useEffect, useState } from "react";
import {
  FaBookmark,
  FaBriefcase,
  FaBuilding,
  FaCalendarAlt,
  FaClock,
  FaExclamationTriangle,
  FaFileAlt,
  FaInfoCircle,
  FaSpinner,
  FaTimesCircle,
  FaUser,
  FaVideo
} from 'react-icons/fa';
import { getStudentInternship } from "../../services/internshipServices/DepositInternship.service";

const StudentInternshipDetails = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInternshipDetails = async () => {
      try {
        setLoading(true);
        const response = await getStudentInternship();
        if (response.data) {
          setInternships(response.data);
        }
      } catch (err) {
        console.error("Error fetching internship details:", err);
        setError(err.message || "Failed to load internship details");
      } finally {
        setLoading(false);
      }
    };

    fetchInternshipDetails();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-10">
        <FaSpinner className="animate-spin h-12 w-12 text-indigo-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded shadow">
        <div className="flex">
          <div className="flex-shrink-0">
            <FaTimesCircle className="h-5 w-5 text-red-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-1 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!internships || internships.length === 0) {
    return (
      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded shadow">
        <div className="flex">
          <div className="flex-shrink-0">
            <FaExclamationTriangle className="h-5 w-5 text-amber-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-amber-700">
              No internship information available. Please submit an internship first.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Validated":
        return "bg-green-100 text-green-800 border-green-200";
      case "Pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {internships.map((internship, index) => (
        <div 
          key={index}
          className="mb-8 bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
        >
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
            <div className="inline-flex items-center bg-white bg-opacity-20 text-grey-100 rounded-full px-4 py-1.5 mb-3">
              <span className="mb-2 font-semibold text-gray-700 text-xm">
                {internship.type === "1year" ? "First Year Internship" : "Second Year Internship"}
              </span>
            </div>

            <div className="flex items-center">
              <FaBriefcase className="text-yellow-300 mr-2 text-lg" />
              <h3 className="text-xl font-semibold text-white">
                {internship.title}
              </h3>
            </div>
            
            <div className="flex items-center mt-2 text-indigo-100">
              <FaBuilding className="text-sm text-blue-300" />
              <span className="ml-2">{internship.company}</span>
              <span className="mx-2 text-indigo-200">•</span>
              <FaClock className="text-sm text-purple-300" />
              <span className="ml-2">{internship.duration} months</span>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[250px]">
                <div className="flex items-center mb-2 text-gray-700">
                  <FaBookmark className="text-indigo-500" />
                  <span className="ml-2 font-medium">Status</span>
                </div>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(internship.status)}`}>
                  {internship.status}
                </div>
              </div>
              
              <div className="flex-1 min-w-[250px]">
                <div className="flex items-center mb-2 text-gray-700">
                  <FaUser className="text-green-500" />
                  <span className="ml-2 font-medium">Assigned Teacher</span>
                </div>
                {internship.teacher && typeof internship.teacher !== "string" ? (
                  <div>
                    <p className="text-gray-800">{internship.teacher.name}</p>
                    <p className="text-indigo-600">{internship.teacher.email}</p>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Not assigned yet</p>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex-1 min-w-[250px]">
                <div className="flex items-center mb-2 text-gray-700">
                  <FaInfoCircle className="text-blue-400" />
                  <span className="ml-2 font-medium">Defense Details</span>
                </div>
                {internship.defenseDate !== "Not scheduled" ? (
                  <div className="space-y-1">
                    <div className="flex items-center text-gray-700">
                      <FaCalendarAlt className="text-blue-400 mr-2" />
                      <span className="text-gray-500">Date:</span> {internship.defenseDate}
                    </div>
                    <div className="flex items-center text-gray-700">
                      <FaClock className="text-blue-400 mr-2" />
                      <span className="text-gray-500">Time:</span> {internship.defenseTime}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Not scheduled yet</p>
                )}
              </div>
              
              <div className="flex-1 min-w-[250px]">
                <div className="flex items-center mb-2 text-gray-700">
                  <FaVideo className="text-purple-500" />
                  <span className="ml-2 font-medium">Google Meet</span>
                </div>
                {internship.googleMeetLink !== "Not provided" ? (
                  <a 
                    href={internship.googleMeetLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
                  >
                    Join Meeting
                  </a>
                ) : (
                  <p className="text-gray-500 italic">Not provided yet</p>
                )}
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex items-center mb-2 text-gray-700">
                <FaFileAlt className="text-amber-500" />
                <span className="ml-2 font-medium">PV Details</span>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                {internship.pvDetails && internship.pvDetails !== "Not provided" ? (
                  <pre className="whitespace-pre-wrap text-sm text-gray-700">{internship.pvDetails}</pre>
                ) : (
                  <p className="text-gray-500 italic text-sm">No PV details available yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudentInternshipDetails;