import { useEffect, useState } from "react";
import { FiAlertCircle, FiCalendar, FiLoader, FiMail, FiMapPin, FiUser } from "react-icons/fi";
import { getPlannings } from "../../../services/pfeService/pfeSoutenance";

const DefensePlanningPage = () => {
  const [defenses, setDefenses] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchDefenses = async () => {
      try {
        const data = await getPlannings(); 
        setDefenses(data.defenses || []);
      } catch (err) {
        setError(err); 
      } finally {
        setLoading(false);
      }
    };
  
    fetchDefenses();
  }, []);
  
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <FiLoader className="animate-spin h-12 w-12 mx-auto text-blue-500" />
        <p className="mt-4 text-lg text-gray-600">Loading defense schedule...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center max-w-md p-6 bg-white rounded-lg shadow">
        <FiAlertCircle className="h-12 w-12 mx-auto text-red-500" />
        <h2 className="mt-4 text-xl font-semibold text-gray-800">Error loading data</h2>
        <p className="mt-2 text-gray-600">{error.message || "Something went wrong while fetching the defense schedule."}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Defense Planning</h1>
          <p className="text-gray-600 mt-2">
            {defenses.length} {defenses.length === 1 ? 'defense' : 'defenses'} scheduled
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PFE Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <FiUser className="inline mr-1" /> Supervisor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <FiMail className="inline mr-1" /> Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    President
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reporter
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <FiCalendar className="inline mr-1" /> Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <FiMapPin className="inline mr-1" /> Room
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {defenses.map((defense) => (
                  <tr key={defense._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                        {defense.pfe?.title || <span className="text-gray-400">No Title</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {defense.pfe?.student?.name || <span className="text-gray-400">No Student</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {defense.pfe?.IsammSupervisor?.name || <span className="text-gray-400">No Supervisor</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {defense.pfe?.IsammSupervisor?.email || <span className="text-gray-400">No Email</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {defense.presidentId?.firstName || <span className="text-gray-400">No President</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {defense.reporterId?.firstName || <span className="text-gray-400">No Reporter</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {defense.date ? (
                          <>
                            <div>{new Date(defense.date).toLocaleDateString()}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(defense.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                          </>
                        ) : (
                          <span className="text-gray-400">No Date</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${defense.room ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {defense.room || "No Room"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {defenses.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400">
              <FiCalendar className="w-full h-full" />
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No defenses scheduled</h3>
            <p className="mt-1 text-gray-500">There are currently no defense sessions planned.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DefensePlanningPage;