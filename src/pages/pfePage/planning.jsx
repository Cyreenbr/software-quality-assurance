import React, { useState, useEffect } from "react";
import { getPlanning } from "../../services/pfeService/pfe.service"; // Import the getPlanning function

const PlanningPage = () => {
  const [pfes, setPfes] = useState([]); // State to store PFE data
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to store any errors

  useEffect(() => {
    const fetchPfes = async () => {
      try {
        const data = await getPlanning(); // Call the getPlanning function
        setPfes(data); // Set the fetched PFE data to the state
      } catch (err) {
        setError(err); // If error occurs, set the error state
      } finally {
        setLoading(false); // Set loading state to false after the data fetch
      }
    };

    fetchPfes(); // Fetch PFEs when the component is mounted
  }, []);

  if (loading) return <div>Loading...</div>; // Show loading text if still fetching
  if (error) return <div>Error: {error.message || "Something went wrong"}</div>; // Show error message if there was an issue

  return (
    <div className="p-6 bg-gray-100 min-h-screen relative">
      <h1 className="text-2xl font-bold mb-4">PFE Planning</h1>

      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Assigned PFEs</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
              <th className="py-3 px-6">Student</th>
              <th className="py-3 px-6">Project</th>
              <th className="py-3 px-6">Status</th>
              <th className="py-3 px-6">Supervisor</th>
              <th className="py-3 px-6">Student Email</th>
              <th className="py-3 px-6">Supervisor Email</th>
            </tr>
          </thead>
          <tbody>
            {pfes.map((choice) => (
              <tr key={choice._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-6">
                  {choice.student?.firstName} {choice.student?.lastName}
                </td>
                <td className="py-3 px-6">{choice.title || "No Title"}</td>
                <td className="py-3 px-6 font-semibold">{choice.status}</td>
                <td className="py-3 px-6">
                  {choice.IsammSupervisor
                    ? `${choice.IsammSupervisor.firstName} ${choice.IsammSupervisor.lastName}`
                    : "No Supervisor"}
                </td>
                <td className="py-3 px-6">
                  {choice.student?.email || "No Email"}
                </td>
                <td className="py-3 px-6">
                  {choice.IsammSupervisor?.email || "No Email"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlanningPage;
