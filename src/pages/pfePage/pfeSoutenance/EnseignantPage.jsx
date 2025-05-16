import React, { useEffect, useState } from "react";
import { getTeacherPlannings } from "../../../services/pfeService/pfeSoutenance";

const EnseignantPage = ({ currentTeacherId }) => {
  const [plannings, setPlannings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchPlannings = async () => {
      try {
        const response = await getTeacherPlannings();
        console.log(response.defenses);
        setPlannings(response.defenses || []);
      } catch (err) {
        setMessage("Erreur lors du chargement des soutenances.");
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

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Mes Soutenances</h1>

      {loading && <p className="text-blue-600">Chargement...</p>}
      {message && <p className="text-red-600">{message}</p>}

      {plannings.length === 0 && !loading ? (
        <p className="text-gray-600">Aucune soutenance à afficher.</p>
      ) : (
        <table className="w-full table-auto mt-4 border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Titre PFE</th>
              <th className="p-2 border">Salle</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Heure</th>
              <th className="p-2 border">Encadrant</th>
              <th className="p-2 border">Président</th>
              <th className="p-2 border">Rapporteur</th>
            </tr>
          </thead>
          <tbody>
            {plannings.map((plan) => (
              <tr key={plan._id}>
                <td className="p-2 border">{plan.pfe?.title || "N/A"}</td>
                <td className="p-2 border">{plan.room}</td>
                <td className="p-2 border">
                  {new Date(plan.date).toLocaleDateString("fr-FR")}
                </td>
                <td className="p-2 border">{formatTime(plan.time)}</td>
                <td className="p-2 border">
                  {plan.pfe?.IsammSupervisor?.email || "N/A"}
                </td>
                <td className="p-2 border">
                  {plan.presidentId?.email || "N/A"}
                </td>
                <td className="p-2 border">
                  {plan.reporterId?.email || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EnseignantPage;
