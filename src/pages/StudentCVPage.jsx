import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCVacademique } from "../../src/services/ManageUsersServices/students.service";
import Swal from "sweetalert2";

const StudentCVPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate(-1); // Si pas d'ID, retour
      return;
    }

    const fetchCVData = async () => {
      try {
        setLoading(true);
        
        console.log("Fetching CV data for student ID:", id);
        const response = await getCVacademique(id);
        console.log("CV data received:", response);
        
        if (response && response.student && response.model) {
          setCvData(response.model);
          setStudent(response.student);
        } else {
          throw new Error("Structure de données invalide");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du CV académique:", error);
        Swal.fire({
          title: "Erreur",
          text: "Impossible de récupérer le CV académique. Veuillez réessayer.",
          icon: "error",
        });
        navigate(-1); // Retour à la page précédente en cas d'erreur
      } finally {
        setLoading(false);
      }
    };

    fetchCVData();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="w-[90%] p-8 bg-white rounded-xl shadow-xl mx-auto mt-8 min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Chargement du CV académique</h2>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-400"></div>
        </div>
      </div>
    );
  }

  if (!student || !cvData) {
    return (
      <div className="w-[90%] p-8 bg-white rounded-xl shadow-xl mx-auto mt-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Données non disponibles</h2>
        <div className="flex justify-center mt-6">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[90%] bg-gray-50 mx-auto my-8 rounded-xl overflow-hidden shadow-xl">
      {/* En-tête du CV */}
      <div className="bg-gradient-to-r from-blue-400 to-cyan-500 p-8 text-white">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">
            {student.firstName} {student.lastName}
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-white text-blue-400 hover:bg-gray-100 rounded-lg transition-all shadow-md font-medium"
          >
            Retour
          </button>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {student.email}
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {student.phoneNumber}
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Niveau: {student.level}
          </div>
          {student.birthDay && (
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(student.birthDay).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>

      {/* Contenu du CV */}
      <div className="p-8">
        {/* Formation */}
        {cvData.formations?.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4 border-b-2 border-blue-200 pb-2 flex items-center text-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
              </svg>
              Formation
            </h2>
            <div className="space-y-4">
              {cvData.formations.map((f, i) => (
                <div key={i} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all">
                  <div className="font-bold text-lg text-blue-500">{f.diplome}</div>
                  {f.specialite && <div className="text-gray-700">{f.specialite}</div>}
                  {f.etablissement && <div className="text-gray-600">{f.etablissement}</div>}
                  <div className="flex justify-between mt-2">
                    <div className="text-sm text-gray-500">
                      {(f.anneeDebut || f.anneeFin) ?
                        `${f.anneeDebut ? f.anneeDebut : ''} ${f.anneeDebut && f.anneeFin ? '- ' : ''}${f.anneeFin ? f.anneeFin : ''}` :
                        ''}
                    </div>
                    {f.mention && <div className="text-sm font-medium text-indigo-600">Mention: {f.mention}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expériences */}
        {cvData.experiences?.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4 border-b-2 border-indigo-200 pb-2 flex items-center text-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Expériences Professionnelles
            </h2>
            <div className="space-y-4">
              {cvData.experiences.map((e, i) => (
                <div key={i} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all">
                  <div className="font-bold text-lg text-indigo-700">{e.poste}</div>
                  <div className="text-gray-700">{e.entreprise}</div>
                  <div className="text-sm text-gray-500 mt-1">{e.dateDebut} - {e.dateFin}</div>
                  {e.description && <p className="mt-2 text-gray-600">{e.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Compétences */}
          {cvData.competences?.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-4 border-b-2 border-indigo-200 pb-2 flex items-center text-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
                Compétences
              </h2>
              <div className="space-y-4">
                {Object.entries(
                  cvData.competences.reduce((acc, comp) => {
                    const famille = comp.famille || 'Autres';
                    if (!acc[famille]) acc[famille] = [];
                    acc[famille].push(comp);
                    return acc;
                  }, {})
                ).map(([famille, comps]) => (
                  <div key={famille} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all">
                    <h3 className="font-bold text-lg text-indigo-700 mb-2">{famille}</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {comps.map((c, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <span>{c.nom}</span>
                          {c.niveau && (
                            <div className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                              {c.niveau}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Langues */}
          {cvData.langues?.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-4 border-b-2 border-indigo-200 pb-2 flex items-center text-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                Langues
              </h2>
              <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all">
                <div className="space-y-3">
                  {cvData.langues.map((l, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="font-medium">{l.nom}</span>
                      {l.niveau && (
                        <div className="text-sm bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
                          {l.niveau}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Projets */}
        {cvData.projets?.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4 border-b-2 border-indigo-200 pb-2 flex items-center text-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Projets
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cvData.projets.map((p, i) => (
                <div key={i} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all">
                  <div className="font-bold text-lg text-indigo-700">{p.titre}</div>
                  <div className="flex justify-between">
                    {p.entreprise && <div className="text-gray-700">{p.entreprise}</div>}
                    {p.annee && <div className="text-sm text-gray-500">{p.annee}</div>}
                  </div>
                  {p.description && <p className="mt-2 text-gray-600">{p.description}</p>}
                  {p.technologies && (
                    <div className="mt-2">
                      <span className="font-medium text-gray-700">Technologies:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {p.technologies.split(',').map((tech, idx) => (
                          <span key={idx} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certificats */}
        {cvData.certificats?.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4 border-b-2 border-indigo-200 pb-2 flex items-center text-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Certificats
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cvData.certificats.map((c, i) => (
                <div key={i} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all">
                  <div className="font-bold text-indigo-700">{c.titre}</div>
                  {c.organisme && <div className="text-gray-700">{c.organisme}</div>}
                  {c.dateObtention && <div className="text-sm text-gray-500 mt-1">{c.dateObtention}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentCVPage;