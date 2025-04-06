import React, { useEffect, useState } from "react";
import { getPfeList, choosePfe } from "../../services/pfeService/pfe.service";

const TeacherPFEList = () => {
  const [pfeList, setPfeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setLoggedInUser(storedUser._id || storedUser.id);
    }
  }, []);

  const fetchPFEs = async () => {
    setLoading(true);
    try {
      const data = await getPfeList();
      setPfeList(data);
    } catch (error) {
      alert("Erreur lors du chargement des PFEs.");
    } finally {
      setLoading(false);
    }
  };

  const handleChoosePFE = async (id) => {
    try {
      await choosePfe(id);
      alert("Sujet choisi avec succès !");
      fetchPFEs();
    } catch (error) {
      alert(error.response?.data?.message || "Erreur lors du choix.");
    }
  };

  useEffect(() => {
    fetchPFEs();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">
        Liste des Sujets PFE
      </h2>
      {loading ? (
        <p className="text-center text-gray-600">
          Chargement des sujets PFE...
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pfeList.map((pfe) => {
            const isSupervisor = loggedInUser === pfe.IsammSupervisor?._id;
            const status = pfe.status;

            let borderColorClass = "";
            let badgeColorClass = "";
            let badgeText = "";

            if (isSupervisor) {
              if (status === "approved") {
                borderColorClass = "border-green-500 bg-green-50";
                badgeColorClass = "bg-green-500";
                badgeText = "(Approuvé)";
              } else if (status === "rejected") {
                borderColorClass = "border-red-500 bg-red-50";
                badgeColorClass = "bg-red-500";
                badgeText = "(Rejeté)";
              } else {
                borderColorClass = "border-orange-500 bg-orange-50";
                badgeColorClass = "bg-orange-500";
                badgeText = "(En attente)";
              }
            }

            return (
              <div
                key={pfe._id}
                className={`relative border rounded-2xl shadow-lg p-6 bg-white transition hover:shadow-xl ${borderColorClass}`}
              >
                {isSupervisor && (
                  <div
                    className={`absolute top-2 right-2 text-white text-xs py-1 px-2 rounded-full ${badgeColorClass}`}
                  >
                    {badgeText}
                  </div>
                )}

                <h3 className="text-xl font-bold text-blue-700 mb-2">
                  {pfe.title}
                </h3>
                <p className="mb-2 text-gray-700">
                  {pfe.description || "Pas de description disponible"}
                </p>

                <div className="mb-1 text-sm text-gray-600">
                  <strong>Domaine:</strong> {pfe.domain || "N/A"}
                </div>
                <div className="mb-1 text-sm text-gray-600">
                  <strong>Entreprise:</strong> {pfe.company || "N/A"}
                </div>
                <div className="mb-1 text-sm text-gray-600">
                  <strong>Technologies:</strong>{" "}
                  {pfe.technologies?.join(", ") || "N/A"}
                </div>
                <div className="mb-1 text-sm text-gray-600">
                  <strong>Étudiant:</strong>{" "}
                  {pfe.student
                    ? `${pfe.student.firstName} ${pfe.student.lastName}`
                    : "Non assigné"}
                </div>
                <div className="mb-1 text-sm text-gray-600">
                  <strong>Affectation visible:</strong>{" "}
                  {pfe.isAssignmentVisible ? "Oui" : "Non"}
                </div>
                <div className="mb-3 text-sm text-gray-600">
                  <strong>Soutenance visible:</strong>{" "}
                  {pfe.isDefenseVisible ? "Oui" : "Non"}
                </div>

                {pfe.IsammSupervisor ? (
                  <div className="text-sm text-red-600 font-semibold">
                    Déjà attribué à: {pfe.IsammSupervisor.firstName}{" "}
                    {pfe.IsammSupervisor.lastName}
                    <button
                      className="mt-3 w-full px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed"
                      disabled
                    >
                      Sujet déjà choisi
                    </button>
                  </div>
                ) : (
                  <button
                    className="mt-3 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    onClick={() => handleChoosePFE(pfe._id)}
                  >
                    Choisir ce sujet
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TeacherPFEList;
