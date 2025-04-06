import React, { useEffect, useState } from "react";
import { getPlanning } from "../../services/planinginternshipService/Planninginternship.service";

const PlanninginternshipPage = () => {
  const [internships, setInternships] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const data = await getPlanning(); 
        console.log("DATA FROM API:", data);
  
        setInternships(data.planning || []);
      } catch (err) {
        setError(err); 
      } finally {
        setLoading(false);
      }
    };
  
    fetchInternships();
  }, []);
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message || "Something went wrong"}</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen relative">
      <h1 className="text-2xl font-bold mb-4">Internship Planning</h1>

      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Assigned Internships</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
              <th className="py-3 px-6">Student</th>
              <th className="py-3 px-6">Title</th>
              <th className="py-3 px-6">Company</th>
              <th className="py-3 px-6">Supervisor</th>
              <th className="py-3 px-6">Student Email</th>
              <th className="py-3 px-6">Supervisor Email</th>
            </tr>
          </thead>
          <tbody>
            {internships.map((internship) => (
              <tr key={internship._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-6">
                  {internship.student.name}
                </td>
                <td className="py-3 px-6">{internship.title || "No Title"}</td>
                <td className="py-3 px-6">{internship.entreprise || "No Company"}</td>
                <td className="py-3 px-6">
                  {internship.teacherId
                    ? `${internship.teacher}`
                    : "No Supervisor"}
                </td>
                <td className="py-3 px-6">
                  {internship.student.email || "No Email"}
                </td>
                <td className="py-3 px-6">
                  {internship.teacher.email || "No Email"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlanninginternshipPage;
