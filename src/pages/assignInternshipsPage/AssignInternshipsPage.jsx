import { useEffect, useState } from "react";
import { FaArrowLeft, FaEnvelope, FaInfoCircle, FaPlus, FaSync } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  internshipService,
  teacherService,
} from "../../services/internshipServices/AssignInternships.service";

const AssignInternships = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [semester, setSemester] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await teacherService.getTeachers();
      const teachersList = response.model || response;
      if (!Array.isArray(teachersList)) {
        throw new Error("Invalid teacher data.");
      }
      setTeachers(teachersList);
    } catch (error) {
      console.error("Error loading teachers:", error);
      toast.error("Unable to load the list of teachers.");
    }
  };

  const handleSelectTeacher = (teacherId) => {
    //prend en paramètre l'id d'un enseignant en le cochant
    setSelectedTeachers(
      (
        prev //prev est la valeur actuelle du tableau selectedTeachers.
      ) =>
        prev.includes(teacherId)
          ? prev.filter((id) => id !== teacherId)
          : [...prev, teacherId]
    );
  };

  const handleAssignInternships = async () => {
    if (selectedTeachers.length === 0) {
      toast.error("Please select at least one teacher.");
      return;
    }

    setLoading(true);

    try {
      const response = await internshipService.assignInternships({
        teacherIds: selectedTeachers,
        semester: semester,
      });
      toast.success(response?.message || "Assignment successful!");
      setSelectedTeachers([]);
      fetchTeachers();
    } catch (error) {
      console.error("Error assigning internships:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while assigning internships."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAssignment = () => {
    navigate("/PlanningUpdate");
  };

  const handleSendPlanning = async () => {
    try {
      const response = await internshipService.sendPlanning();
      toast.success(
        response?.message || "Planning notification emails sent successfully!"
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error sending notification emails."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-100 py-10 rounded-lg">
      <ToastContainer position="top-right" autoClose={3000} />
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-blue-500 hover:text-blue-700 transition"
            >
              <FaArrowLeft className="mr-2" />
              Back
            </button>
      <div className="max-w-8xl bg-white rounded-lg mx-auto mt-9 p-4">
        <h1 className="text-2xl text-blue-500 font-bold mb-4">
          Assign Internships
        </h1>

        <div className="flex flex-wrap gap-2 mb-6 justify-between items-center">
          <div className="flex items-center mr-4">
            <label className="block text-gray-700 font-medium mr-3">
              Semester:
            </label>
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
            {/*Notice buttons */}
            <div className="flex items-center mr-4 border-r border-gray-200 pr-4">
              <button
                onClick={handleSendPlanning}
                className="bg-blue-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-600 flex items-center mx-2"
              >
                <FaEnvelope className="mr-1" />
                Send Planning Notification
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
