import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { internshipService, teacherService } from "../../services/internshipServices/AssignInternshipsServices";

const AssignInternships = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [semester, setSemester] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeachers();
  }, []);

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
      setMessage("Unable to load the list of teachers.");
      setIsError(true);
    }
  };

  const handleSelectTeacher = (teacherId) => {
    setSelectedTeachers((prev) =>
      prev.includes(teacherId) ? prev.filter((id) => id !== teacherId) : [...prev, teacherId]
    );
  };

  const handleAssignInternships = async () => {
    if (selectedTeachers.length === 0) {
      setMessage("Please select at least one teacher.");
      setIsError(true);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await internshipService.assignInternships({
        teacherIds: selectedTeachers,
        semester: semester,
      });
      setMessage(response?.message || "Assignment successful!");
      setIsError(false);
      setSelectedTeachers([]);
      fetchTeachers();
    } catch (error) {
      console.error("Error assigning internships:", error);
      const backendMessage = error.response?.data?.message || "An error occurred during the assignment.";
      setMessage(backendMessage);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAssignment = () => {
    navigate('/Planning Update'); 
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-100 py-10 rounded-lg">
      <div className="max-w-7xl bg-white rounded-lg mx-auto mt-8 p-6">
        <h1 className="text-2xl font-bold mb-4">Assign Internships</h1>
        {message && (
          <div className={`p-3 text-center rounded-lg mb-5 ${isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
            {message}
          </div>
        )}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <label className="block text-gray-700 font-medium mr-3">Semester:</label>
            <select
  value={semester}
  onChange={(e) => setSemester(Number(e.target.value))}
  className="px-4 py-2 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none pr-10"
>
  <option value={0}>Semester 1</option>
  <option value={1}>Semester 2</option>
</select>

          </div>
          <button
            onClick={handleUpdateAssignment}
            className="bg-green-500 text-white px-6 py-2 rounded-lg  gap-2 hover:scale-105 transition duration-300"
          >
            Update Assignment
          </button>

          <button
            onClick={handleAssignInternships}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:scale-105 transition duration-200 "
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Assigning...</span>
              </>
            ) : (
              "Assign Internships"
            )}
          </button>
        </div>
        
        <h2 className="text-xl font-semibold mb-4">List of Teachers</h2>
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-8 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-1/6">
                  Select
                </th>
                <th className="px-8 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-2/5">
                  First Name
                </th>
                <th className="px-8 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-2/5">
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
                    <td className="px-8 py-4 text-sm whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedTeachers.includes(teacher._id)}
                        onChange={() => handleSelectTeacher(teacher._id)}
                        className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-400 focus:ring-2 cursor-pointer"
                      />
                    </td>
                    <td className="px-8 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                      {teacher.firstName}
                    </td>
                    <td className="px-8 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                      {teacher.lastName}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center text-gray-500 py-6">
                    No teachers available
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