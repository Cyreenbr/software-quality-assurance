import React, { useEffect, useState } from "react";
import { getStudentDefense } from "../../../services/pfeService/pfeSoutenance";

const EtudiantSoutenancePage = () => {
  const [soutenance, setSoutenance] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMyDefense = async () => {
      try {
        const data = await getStudentDefense();
        console.log(data.defense);
        if (data) {
          setSoutenance(data.defense);
        } else {
          setMessage("Aucune soutenance trouvée pour votre PFE.");
        }
      } catch (err) {
        setMessage("Erreur lors du chargement de la soutenance.");
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
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Ma soutenance</h1>

      {message && <p className="text-red-600">{message}</p>}

      {soutenance && (
        <div className="bg-white p-4 rounded shadow space-y-3">
          <p>
            <strong>Titre du PFE :</strong> {soutenance.pfe?.title}
          </p>
          <p>
            <strong>Date :</strong>{" "}
            {new Date(soutenance.date).toLocaleDateString("fr-FR")}
          </p>
          <p>
            <strong>Heure :</strong> {formatTime(soutenance.time)}
          </p>
          <p>
            <strong>Salle :</strong> {soutenance.room}
          </p>
          <p>
            <strong>Encadrant :</strong>{" "}
            {soutenance.pfe?.IsammSupervisor?.email || "N/A"}
          </p>
          <p>
            <strong>Président :</strong>{" "}
            {soutenance.presidentId?.email || "N/A"}
          </p>
          <p>
            <strong>Rapporteur :</strong>{" "}
            {soutenance.reporterId?.email || "N/A"}
          </p>
        </div>
      )}
    </div>
  );
};

export default EtudiantSoutenancePage;
