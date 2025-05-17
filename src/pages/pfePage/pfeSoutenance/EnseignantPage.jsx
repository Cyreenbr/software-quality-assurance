import { useEffect, useState } from "react";
import {
  FaArrowLeft,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getTeacherPlannings } from "../../../services/pfeService/pfeSoutenance";

const EnseignantPage = ({ currentTeacherId }) => {
  const [plannings, setPlannings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const storedUser = useSelector((state) => state.auth.user);
  const loggedInUser = storedUser?._id || storedUser?.id;

  useEffect(() => {
    const fetchPlannings = async () => {
      try {
        const response = await getTeacherPlannings();
        setPlannings(response.defenses || []);
      } catch (err) {
        setMessage("Error loading defenses data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlannings();
  }, []);

  const formatTime = (minutes) => {
    const h = String(Math.floor(minutes / 60)).padStart(2, "0");
    const m = String(minutes % 60).padStart(2, "0");
    return `${h}:${m}`;
  };

  const filteredPlannings = plannings.filter(plan => {
    return (
      (plan.pfe?.IsammSupervisor?._id === loggedInUser) ||
      (plan.presidentId?._id === loggedInUser) ||
      (plan.reporterId?._id === loggedInUser)
    );
  });

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
                        <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-blue-500 hover:text-blue-700 transition"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-blue-600 mb-1">My Defenses</h1>
            <p className="text-indigo-500 text-sm">Overview of all your scheduled defenses</p>
          </div>

          {loading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          )}
          
          {message && (
            <div className="bg-red-100 border-l-4 border-red-600 p-4 mb-6 rounded">
              <p className="text-red-700 font-medium">{message}</p>
            </div>
          )}

          {filteredPlannings.length === 0 && !loading ? (
            <div className="text-center py-12 bg-indigo-50 rounded-lg">
              <svg
                className="mx-auto h-12 w-12 text-indigo-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-indigo-800">No defenses scheduled</h3>
              <p className="mt-1 text-sm text-indigo-600">You don't have any defenses assigned yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PFE Title</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supervisor</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">President</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reporter</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Your role</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPlannings.map((plan) => {
                    let role = "";
                    if (plan.pfe?.IsammSupervisor?._id === loggedInUser) {
                      role = "Supervisor";
                    } else if (plan.presidentId?._id === loggedInUser) {
                      role = "President";
                    } else if (plan.reporterId?._id === loggedInUser) {
                      role = "Reporter";
                    }

                    return (
                      <tr key={plan._id} className="hover:bg-indigo-50 transition-colors">
                        <td className="px-4 py-4 whitespace-normal text-sm font-medium text-gray-900 max-w-xs">
                          {plan.pfe?.title || "N/A"}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                          {plan.room}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(plan.date).toLocaleDateString("en-US")}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatTime(plan.time)}
                        </td>
                        <td className="px-4 py-4 whitespace-normal text-sm text-gray-600 max-w-xs">
                          {plan.pfe?.IsammSupervisor?.email || "N/A"}
                        </td>
                        <td className="px-4 py-4 whitespace-normal text-sm text-gray-600 max-w-xs">
                          {plan.presidentId?.email || "N/A"}
                        </td>
                        <td className="px-4 py-4 whitespace-normal text-sm text-gray-600 max-w-xs">
                          {plan.reporterId?.email || "N/A"}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${role === "Supervisor" ? "bg-blue-100 text-blue-800" :
                              role === "President" ? "bg-green-100 text-green-800" :
                              "bg-purple-100 text-purple-800"}`}>
                            {role}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnseignantPage;