import { useEffect, useState } from "react";
import { FaArrowLeft, FaBook, FaCalendarAlt, FaChalkboardTeacher, FaClock, FaDoorOpen, FaUserGraduate, FaUserTie } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getStudentDefense } from "../../../services/pfeService/pfeSoutenance";

const StudentDefensePage = () => {
  const [defense, setDefense] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyDefense = async () => {
      try {
        const data = await getStudentDefense();
        console.log(data.defense);
        if (data) {
          setDefense(data.defense);
        } else {
          setMessage("No defense found for your internship project.");
        }
      } catch (err) {
        setMessage("Error loading defense information.");
      }
    };

    fetchMyDefense();
  }, []);

  const formatTime = (timeInMinutes) => {
    const hours = Math.floor(timeInMinutes / 60)
      .toString()
      .padStart(2, "0");
    const minutes = (timeInMinutes % 60).toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
                                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center text-blue-500 hover:text-blue-700 transition"
                  >
                    <FaArrowLeft className="mr-2" />
                    Back
                  </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-blue-400 sm:text-4xl">
            My Defense
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Details about your internship project defense
          </p>
        </div>

        {message && (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <p className="text-sm font-medium text-red-800">{message}</p>
          </div>
        )}

        {defense && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-indigo-600">
              <h3 className="text-lg leading-6 font-medium text-white">
                Defense Information
              </h3>
            </div>
            <div className="border-t border-gray-200 divide-y divide-gray-200">
              <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FaBook className="mr-2 text-indigo-500" />
                  Project Title
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {defense.pfe?.title || "Not specified"}
                </dd>
              </div>
              <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FaCalendarAlt className="mr-2 text-indigo-500" />
                  Date
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {new Date(defense.date).toLocaleDateString("en-US", {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </dd>
              </div>
              <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FaClock className="mr-2 text-indigo-500" />
                  Time
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {formatTime(defense.time)}
                </dd>
              </div>
              <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FaDoorOpen className="mr-2 text-indigo-500" />
                  Room
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {defense.room || "Not specified"}
                </dd>
              </div>
              <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FaUserTie className="mr-2 text-indigo-500" />
                  Supervisor
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {defense.pfe?.IsammSupervisor?.email || "Not assigned"}
                </dd>
              </div>
              <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FaChalkboardTeacher className="mr-2 text-indigo-500" />
                  President
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {defense.presidentId?.email || "Not assigned"}
                </dd>
              </div>
              <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FaUserGraduate className="mr-2 text-indigo-500" />
                  Reporter
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {defense.reporterId?.email || "Not assigned"}
                </dd>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDefensePage;