import { useEffect, useState } from "react";
import {
  FaBriefcase,
  FaBuilding,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaEnvelope,
  FaExclamationTriangle,
  FaFolderOpen,
  FaInfoCircle,
  FaSpinner,
  FaTimesCircle,
  FaUserTie,
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

  const getStatusIcon = (status) => {
    switch (status) {
      case "Validated":
        return <FaCheckCircle className="text-green-500" />;
      case "Not validated":
        return <FaTimesCircle className="text-red-500" />;
      case "Pending":
      default:
        return <FaExclamationTriangle className="text-amber-500" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {internships.map((internship, index) => (
        <div 
          key={index}
          className="border border-gray-300 p-6 shadow-sm rounded-lg hover:shadow-xl duration-300 hover:bg-gradient-to-r from-blue-50 to-purple-100 w-full mx-auto"
        >
          <table className="min-w-full table-auto">
            <tbody>
              {/* Internship Title and Type */}
              <tr className="mb-4">
                <td className="px-4 py-3 font-semibold text-gray-800 flex items-center gap-3">
                  <FaBriefcase className="text-blue-600" />
                  <span className="text-lg font-bold">{internship.title}</span>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                    {internship.type === "1year" ? "First Year Internship" : "Second Year Internship"}
                  </span>
                </td>
              </tr>

              {/* Company and Duration */}
              <tr className="mb-4">
                <td className="px-4 py-3 text-gray-600 flex items-center gap-3">
                  <FaBuilding className="text-blue-500" />
                  <span className="font-bold">Company:</span> {internship.company}
                </td>
                <td className="px-4 py-3 text-gray-600 flex items-center gap-3">
                  <FaClock className="text-orange-500" />
                  <span className="font-bold">Duration:</span> {internship.duration} months
                </td>
              </tr>

              {/* Status - Highlighted */}
              <tr className="mb-4">
                <td colSpan="2" className="px-4 py-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    {getStatusIcon(internship.status)}
                    <div>
                      <span className="font-bold">Status:</span>
                      <span className={`ml-2 font-semibold ${
                        internship.status === "Validated" ? "text-green-600" : 
                        internship.status === "Not validated" ? "text-red-600" : "text-amber-600"
                      }`}>
                        {internship.status}
                      </span>
                    </div>
                  </div>
                </td>
              </tr>

              {/* Teacher - Highlighted */}
              <tr className="mb-4">
                <td colSpan="2" className="px-4 py-3">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <FaUserTie className="text-blue-600 mt-1" />
                    <div>
                      <span className="font-bold">Assigned Teacher:</span>
                      {internship.teacher && typeof internship.teacher !== "string" ? (
                        <div className="mt-1">
                          <p className="font-semibold text-gray-800">{internship.teacher.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <FaEnvelope className="text-gray-500" />
                            <span className="text-indigo-600">{internship.teacher.email}</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500 italic mt-1">Not assigned yet</p>
                      )}
                    </div>
                  </div>
                </td>
              </tr>

              {/* Defense Details */}
              {internship.defenseDate && internship.defenseDate !== "Not scheduled" && (
                <>
                  <tr className="mb-4">
                    <td colSpan="2" className="px-4 py-3 text-gray-600 flex items-center gap-3">
                      <FaCalendarAlt className="text-green-500" />
                      <span className="font-bold">Defense Date:</span> {internship.defenseDate}
                    </td>
                  </tr>
                  <tr className="mb-4">
                    <td colSpan="2" className="px-4 py-3 text-gray-600 flex items-center gap-3">
                      <FaClock className="text-orange-500" />
                      <span className="font-bold">Defense Time:</span> {internship.defenseTime}
                    </td>
                  </tr>
                </>
              )}

              {/* Google Meet Link */}
              {internship.googleMeetLink && internship.googleMeetLink !== "Not provided" && (
                <tr className="mb-4">
                  <td colSpan="2" className="px-4 py-3 text-gray-600 flex items-start gap-3">
                    <FaVideo className="text-red-500" />
                    <div>
                      <span className="font-bold">Meeting Link:</span>
                      <a 
                        href={internship.googleMeetLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:underline ml-2 block mt-1"
                      >
                        {internship.googleMeetLink}
                      </a>
                    </div>
                  </td>
                </tr>
              )}

              {/* PV Details */}
              {internship.pvDetails && internship.pvDetails !== "Not provided" && (
                <tr className="mb-4">
                  <td colSpan="2" className="px-4 py-3">
                    <div className="flex items-start gap-3">
                      <FaFolderOpen className="text-gray-500 mt-1" size={20} />
                      <div>
                        <span className="font-bold">PV Details:</span>
                        <div className="bg-gray-50 rounded-lg border border-gray-100 p-4 mt-2">
                          <pre className="whitespace-pre-wrap text-sm text-gray-700">
                            {internship.pvDetails}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}

              {/* No meeting or defense scheduled message */}
              {(!internship.defenseDate || internship.defenseDate === "Not scheduled") && (
                <tr className="mb-4">
                  <td colSpan="2" className="px-4 py-3">
                    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded shadow">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <FaInfoCircle className="h-5 w-5 text-amber-500" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-amber-700">
                            Defense has not been scheduled yet. Your teacher will set a date and provide a meeting link.
                          </p>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
              
              {/* Join Meeting Button */}
              {internship.googleMeetLink && internship.googleMeetLink !== "Not provided" && (
                <tr className="mb-4">
                  <td colSpan="2" className="px-4 py-3">
                    <a 
                      href={internship.googleMeetLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out inline-block"
                    >
                      Join Defense Meeting
                    </a>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default StudentInternshipDetails;