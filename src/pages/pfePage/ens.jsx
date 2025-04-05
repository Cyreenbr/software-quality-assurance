import React, { useEffect, useState } from "react";
import { getPfeList, choosePfe } from "../../services/pfeService/pfeService";

const TeacherPFEList = () => {
  const [pfeList, setPfeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Fetch logged-in user ID from localStorage or session
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setLoggedInUser(storedUser._id || storedUser.id); // Set logged-in user ID
    }
  }, []);

  const fetchPFEs = async () => {
    setLoading(true);
    try {
      console.log("🟢 Récupération des PFEs...");
      const data = await getPfeList();
      console.log("✅ Données des PFEs récupérées:", data);
      setPfeList(data);
    } catch (error) {
      console.error("🔴 Erreur lors du chargement des PFEs:", error);
      alert("Erreur lors du chargement des PFEs.");
    } finally {
      setLoading(false);
    }
  };

  const handleChoosePFE = async (id) => {
    console.log(`🟢 Tentative de choix du PFE avec l'ID: ${id}`);
    try {
      const response = await choosePfe(id);
      console.log("✅ PFE choisi avec succès:", response);
      alert("Sujet choisi avec succès !");
      fetchPFEs(); // Refresh the list to reflect the change
    } catch (error) {
      console.error("🔴 Erreur lors du choix du PFE:", error);
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
          {pfeList.map((pfe) => (
            <div
              key={pfe._id}
              className={`border rounded-2xl shadow-lg p-6 bg-white transition hover:shadow-xl ${
                loggedInUser === pfe.IsammSupervisor?._id
                  ? "bg-blue-100 border-blue-500" // Light blue background and blue border if user is supervisor
                  : ""
              }`}
            >
              {loggedInUser === pfe.IsammSupervisor?._id && (
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs py-1 px-2 rounded-full">
                  Supervisé
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
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherPFEList;
