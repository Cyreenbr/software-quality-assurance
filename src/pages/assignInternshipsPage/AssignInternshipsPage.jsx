import { useEffect, useState } from "react";
import { FaCheckCircle, FaEnvelope, FaExclamationCircle, FaEye, FaEyeSlash, FaInfoCircle, FaPencilAlt, FaPlus, FaSync } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { internshipService, teacherService } from "../../services/internshipServices/AssignInternshipsServices";

const AssignInternships = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [semester, setSemester] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeachers();
  }, []);

  const showTemporaryMessage = (msg, error = false) => {
    setMessage(msg);
    setIsError(error);
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const fetchTeachers = async () => {
    try {
      const response = await teacherService.getTeachers();
      const teachersList = response.teachers || response;
      if (!Array.isArray(teachersList)) {
        throw new Error("Invalid teacher data.");
      }
      setTeachers(teachersList);
    } catch (error) {
      console.error("Error loading teachers:", error);
      showTemporaryMessage("Unable to load the list of teachers.", true);
    }
  };

  const handleSelectTeacher = (teacherId) => {
    setSelectedTeachers((prev) =>
      prev.includes(teacherId) ? prev.filter((id) => id !== teacherId) : [...prev, teacherId]
    );
  };

  const handleAssignInternships = async () => {
    if (selectedTeachers.length === 0) {
      showTemporaryMessage("Please select at least one teacher.", true);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await internshipService.assignInternships({
        teacherIds: selectedTeachers,
        semester: semester,
      });
      showTemporaryMessage(response?.message || "Assignment successful!", false);
      setSelectedTeachers([]);
      fetchTeachers();
    } catch (error) {
      console.error("Error assigning internships:", error);
      showTemporaryMessage(error.response?.data?.message || "An error occurred while assigning internships.", true);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAssignment = () => {
    navigate('/PlanningUpdate'); 
  };

  //publish
  const handlePublishPlanning = async () => {
    try {
      const response = await internshipService.publishPlanning("publish");
      setIsPublished(true);
      showTemporaryMessage(response?.message || "Planning successfully published.", false);
    } catch (error) {
      showTemporaryMessage(error.response?.data?.message || "Error publishing planning.", true);
    }
  };

  // hide
  const handleHidePlanning = async () => {
    try {
      const response = await internshipService.publishPlanning("hide");
      setIsPublished(false);
      showTemporaryMessage(response?.message || "Planning successfully hidden.", false);
    } catch (error) {
      showTemporaryMessage(error.response?.data?.message || "Error hiding planning.", true);
    }
  };

  const handleSendPlanning = async (sendType) => {
    try {
      const response = await internshipService.sendPlanning(sendType);
      showTemporaryMessage(response?.message || `${sendType === "first" ? "First" : "Modified"} notification emails sent successfully!`, false);
    } catch (error) {
      showTemporaryMessage(error.response?.data?.message || `Error sending ${sendType} notification emails.`, true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-100 py-10 rounded-lg">
      <div className="max-w-7xl bg-white rounded-lg mx-auto mt-8 p-6">
        <h1 className="text-2xl font-bold mb-4">Assign Internships</h1>
        
        {message && (
          <div className={`p-3 text-center rounded-lg mb-5 flex items-center justify-center ${isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
            {isError ? (
              <FaExclamationCircle className="w-5 h-5 mr-2" />
            ) : (
              <FaCheckCircle className="w-5 h-5 mr-2" />
            )}
            {message}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-6 justify-between items-center">
          <div className="flex items-center mr-4">
            <label className="block text-gray-700 font-medium mr-3">Semester:</label>
            <select
              value={semester}
              onChange={(e) => setSemester(Number(e.target.value))}
              className="px-3 py-1.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            >
              <option value={0}>Semester 1</option>
              <option value={1}>Semester 2</option>
            </select>
          </div>

          <div className="ml-auto flex items-center">
            {/* Group 1: Publish and Hide buttons */}
            <div className="flex items-center mr-4 border-r border-gray-200 pr-4">
              <button
                onClick={handlePublishPlanning}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium flex items-center mx-2"
              >
                <FaEye className="mr-1" />
                Publish Planning
              </button>

              <button
                onClick={handleHidePlanning}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium flex items-center mx-2"
              >
                <FaEyeSlash className="mr-1" />
                Hide Planning
              </button>
            </div>

            {/* Group 2: Modified and First Notice buttons */}
            <div className="flex items-center mr-4 border-r border-gray-200 pr-4">
              <button
                onClick={() => handleSendPlanning("modified")}
                className="bg-orange-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-orange-600 flex items-center mx-2"
              >
                <FaPencilAlt className="mr-1" />
                Modified Notice
              </button>

              <button
                onClick={() => handleSendPlanning("first")}
                className="bg-yellow-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-yellow-600 flex items-center mx-2"
              >
                <FaEnvelope className="mr-1" />
                First Notice
              </button>
            </div>

            <div className="flex items-center">
              <button
                onClick={handleUpdateAssignment}
                className="bg-green-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-green-600 flex items-center mx-2"
              >
                <FaSync className="mr-1" />
                Update Assignment
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold mb-4">List of Teachers</h2>

          <button
            onClick={handleAssignInternships}
            className="bg-blue-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-600 flex items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                <span>Assigning...</span>
              </>
            ) : (
              <>
                <FaPlus className="mr-1" />
                Assign Internships
              </>
            )}
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-1/6">
                  Select
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-2/5">
                  First Name
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-2/5">
                  Last Name
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teachers.length > 0 ? (
                teachers.map((teacher) => (
                  <tr
                    key={teacher._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedTeachers.includes(teacher._id)}
                        onChange={() => handleSelectTeacher(teacher._id)}
                        className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-400 focus:ring-1 cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">
                      {teacher.firstName}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">
                      {teacher.lastName}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center text-gray-500 py-4">
                    <FaInfoCircle className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2">No teachers available</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AssignInternships;