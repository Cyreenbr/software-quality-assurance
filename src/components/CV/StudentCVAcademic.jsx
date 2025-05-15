// StudentCVAcademic.jsx
import React, { useState, useEffect } from "react";
import { getCVacademique } from "../../services/ManageUsersServices/students.service";
import { CgEyeAlt } from "react-icons/cg";
import Swal from "sweetalert2";

export const CVAcademique = ({ student, onClose }) => {
  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCVData = async () => {
      try {
        setLoading(true);
        const response = await getCVacademique(student._id);
        setCvData(response.model);
      } catch (error) {
        console.error("Erreur lors de la récupération du CV académique:", error);
        Swal.fire({
          title: "Erreur",
          text: "Impossible de récupérer le CV académique. Veuillez réessayer.",
          icon: "error",
        });
        onClose();
      } finally {
        setLoading(false);
      }
    };

    fetchCVData();
  }, [student._id, onClose]);

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">Chargement du CV académique...</h2>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="sticky top-0 z-10 bg-indigo-600 p-4 flex justify-between items-center text-white rounded-md mb-6">
        <h2 className="text-xl font-semibold">
          CV Académique de {student.firstName} {student.lastName}
        </h2>
        <button
          onClick={onClose}
          className="px-3 py-1 bg-white text-indigo-600 hover:bg-gray-100 rounded-md transition-colors text-sm font-medium"
        >
          Fermer
        </button>
      </div>

      {cvData ? (
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 border-b text-left font-semibold">Catégorie</th>
              <th className="py-3 px-4 border-b text-left font-semibold">Détails</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-gray-50">
              <td className="py-3 px-4 font-medium">Informations personnelles</td>
              <td className="py-3 px-4">
                <ul className="list-disc ml-4">
                  <li>Nom: {student.firstName} {student.lastName}</li>
                  <li>Email: {student.email}</li>
                  <li>Téléphone: {student.phoneNumber}</li>
                  <li>Niveau: {student.level}</li>
                  <li>Date de naissance: {new Date(student.birthDay).toLocaleDateString()}</li>
                </ul>
              </td>
            </tr>

            {cvData.formations?.length > 0 && (
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">Formation</td>
                <td className="py-3 px-4">
                  <ul className="list-disc ml-4">
                    {cvData.formations.map((f, i) => (
                      <li key={i}>{f.diplome} - {f.etablissement} ({f.anneeDebut} - {f.anneeFin})</li>
                    ))}
                  </ul>
                </td>
              </tr>
            )}

            {cvData.competences?.length > 0 && (
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">Compétences</td>
                <td className="py-3 px-4">
                  <ul className="list-disc ml-4">
                    {cvData.competences.map((c, i) => (
                      <li key={i}>{c.nom} ({c.niveau})</li>
                    ))}
                  </ul>
                </td>
              </tr>
            )}

            {cvData.experiences?.length > 0 && (
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">Expériences</td>
                <td className="py-3 px-4">
                  <ul className="list-disc ml-4">
                    {cvData.experiences.map((e, i) => (
                      <li key={i}>
                        {e.poste} chez {e.entreprise} ({e.dateDebut} - {e.dateFin})
                        <p className="text-sm text-gray-600">{e.description}</p>
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            )}

            {cvData.projets?.length > 0 && (
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">Projets</td>
                <td className="py-3 px-4">
                  <ul className="list-disc ml-4">
                    {cvData.projets.map((p, i) => (
                      <li key={i}>{p.titre} ({p.annee})
                        <p className="text-sm text-gray-600">{p.description}</p>
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            )}

            {cvData.langues?.length > 0 && (
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">Langues</td>
                <td className="py-3 px-4">
                  <ul className="list-disc ml-4">
                    {cvData.langues.map((l, i) => (
                      <li key={i}>{l.nom} ({l.niveau})</li>
                    ))}
                  </ul>
                </td>
              </tr>
            )}

            {cvData.certificats?.length > 0 && (
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">Certificats</td>
                <td className="py-3 px-4">
                  <ul className="list-disc ml-4">
                    {cvData.certificats.map((c, i) => (
                      <li key={i}>{c.titre} - {c.organisme} ({c.dateObtention})</li>
                    ))}
                  </ul>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      ) : (
        <div className="text-center py-6">
          <p className="text-gray-600">Aucune donnée de CV disponible pour cet étudiant.</p>
        </div>
      )}
    </div>
  );
};

// Hook personnalisé pour gérer l'affichage du CV
export const useWatchCV = () => {
  const [showCVModal, setShowCVModal] = useState(false);
  const [selectedStudentForCV, setSelectedStudentForCV] = useState(null);

  const watchCV = (studentId, studentsList) => {
    const student = studentsList.find(s => s._id === studentId);
    if (student) {
      setSelectedStudentForCV(student);
      setShowCVModal(true);
    } else {
      Swal.fire({
        title: "Erreur",
        text: "Étudiant introuvable.",
        icon: "error",
      });
    }
  };

  const closeCVModal = () => {
    setShowCVModal(false);
    setSelectedStudentForCV(null);
  };

  const CVButton = ({ studentId, studentsList }) => (
    <button
      onClick={() => watchCV(studentId, studentsList)}
      className="text-blue-600 hover:text-blue-800 transition-colors mr-2"
      title="Voir le CV académique"
    >
      <CgEyeAlt size={18} />
    </button>
  );

  const CVModal = () =>
    showCVModal && selectedStudentForCV && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-screen overflow-y-auto">
          <CVAcademique student={selectedStudentForCV} onClose={closeCVModal} />
        </div>
      </div>
    );

  return { CVButton, CVModal, watchCV, closeCVModal, showCVModal, selectedStudentForCV };
};
