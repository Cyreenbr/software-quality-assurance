import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { getPfeList, choosePfe } from "../../services/pfeService/pfeService";

const TeacherPFEList = () => {
  const [pfeList, setPfeList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPFEs();
  }, []);

  const fetchPFEs = async () => {
    setLoading(true);
    try {
      console.log("📥 Récupération des PFEs...");
      const data = await getPfeList();
      console.log("📄 Liste des PFEs reçue:", data);
      console.log(
        "👤 Current teacher ID:",
        JSON.parse(localStorage.getItem("user"))?.id
      ); // Log the current teacher ID
      // Log each PFE and its supervisor
      data.forEach((pfe) => {
        console.log("📘 PFE ID:", pfe._id);
        console.log(
          "🧑‍🏫 Superviseur ID:",
          pfe.IsammSupervisor ? pfe.IsammSupervisor._id : "Pas encore attribué"
        );
      });

      setPfeList(data);
      setFilteredList(data);
    } catch (error) {
      console.error("🔴 Erreur lors du chargement des PFEs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const filtered = pfeList.filter(
      (pfe) =>
        pfe.student?.firstName.toLowerCase().includes(value.toLowerCase()) ||
        pfe.student?.lastName.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredList(filtered);
  };

  const handleChoosePFE = async (id) => {
    try {
      console.log("🔘 Choix du PFE avec ID:", id);
      await choosePfe(id);
      alert("Sujet choisi avec succès !");
      fetchPFEs();
    } catch (error) {
      console.error("Erreur lors du choix du PFE:", error);
      alert(error.response?.data?.message || "Erreur lors du choix.");
    }
  };

  return (
    <div className="min-h-screen bg-white py-10">
      <div className="max-w-7xl mx-auto p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-start">
          Liste des Sujets PFE
        </h2>

        {/* Search Input */}
        <div className="mb-6 flex justify-end">
          <div className="relative w-full max-w-md">
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              <FaSearch />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Recherche par nom d'étudiant"
              className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out"
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <p className="text-center text-gray-600">Chargement...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredList.map((pfe) => (
              <div
                key={pfe._id}
                className="border rounded-2xl shadow-lg p-6 bg-white hover:shadow-xl transition duration-300"
              >
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

                {/* Button logic */}
                {pfe.IsammSupervisor ? (
                  <div className="text-sm font-semibold">
                    {pfe.IsammSupervisor._id === currentTeacherId ? (
                      <>
                        <p className="text-green-600">
                          ✅ Vous avez choisi ce sujet
                        </p>
                        <button
                          className="mt-3 w-full px-4 py-2 bg-green-600 text-white rounded-lg cursor-not-allowed"
                          disabled
                        >
                          Sujet déjà choisi par vous
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="text-red-600">
                          Déjà attribué à : {pfe.IsammSupervisor.firstName}{" "}
                          {pfe.IsammSupervisor.lastName}
                        </p>
                        <button
                          className="mt-3 w-full px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed"
                          disabled
                        >
                          Sujet déjà choisi
                        </button>
                      </>
                    )}
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
    </div>
  );
};

export default TeacherPFEList;
