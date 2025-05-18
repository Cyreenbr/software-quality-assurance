import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMYCV, updateMyCV } from "../services/ManageUsersServices/students.service";
import Swal from "sweetalert2";

const EditCV = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cvData, setCvData] = useState(null);
  const [formData, setFormData] = useState({
    languages: [],
    experiences: [],
    diplomas: [],
  });

  useEffect(() => {
    const fetchCVData = async () => {
      try {
        setLoading(true);
        const response = await getMYCV();

        if (response && response.student && response.model) {
          setCvData(response);

          setFormData({
            languages: response.model.langues || [],
            experiences: response.model.experiences || [],
            diplomas: response.model.formations || [],
          });
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
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchCVData();
  }, [navigate]);

  // Gestion des langues
  const handleLanguageChange = (index, field, value) => {
    const updatedLanguages = [...formData.languages];

    if (!updatedLanguages[index]) {
      updatedLanguages[index] = { nom: "", niveau: "" };
    }

    updatedLanguages[index] = {
      ...updatedLanguages[index],
      [field]: value,
    };

    setFormData({
      ...formData,
      languages: updatedLanguages,
    });
  };

  const addLanguage = () => {
    setFormData({
      ...formData,
      languages: [...formData.languages, { nom: "", niveau: "" }],
    });
  };

  const removeLanguage = (index) => {
    const updatedLanguages = [...formData.languages];
    updatedLanguages.splice(index, 1);

    setFormData({
      ...formData,
      languages: updatedLanguages,
    });
  };

  // Gestion des expériences
  const handleExperienceChange = (index, field, value) => {
    const updatedExperiences = [...formData.experiences];

    if (!updatedExperiences[index]) {
      updatedExperiences[index] = {
        poste: "",
        entreprise: "",
        dateDebut: "",
        dateFin: "",
        description: "",
      };
    }

    updatedExperiences[index] = {
      ...updatedExperiences[index],
      [field]: value,
    };

    setFormData({
      ...formData,
      experiences: updatedExperiences,
    });
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      experiences: [
        ...formData.experiences,
        { poste: "", entreprise: "", dateDebut: "", dateFin: "", description: "" },
      ],
    });
  };

  const removeExperience = (index) => {
    const updatedExperiences = [...formData.experiences];
    updatedExperiences.splice(index, 1);

    setFormData({
      ...formData,
      experiences: updatedExperiences,
    });
  };

  // Gestion des diplômes
  const handleDiplomaChange = (index, field, value) => {
    const updatedDiplomas = [...formData.diplomas];

    if (!updatedDiplomas[index]) {
      updatedDiplomas[index] = {
        diplome: "",
        specialite: "",
        etablissement: "",
        anneeDebut: "",
        anneeFin: "",
        mention: "",
      };
    }

    updatedDiplomas[index] = {
      ...updatedDiplomas[index],
      [field]: value,
    };

    setFormData({
      ...formData,
      diplomas: updatedDiplomas,
    });
  };

  const addDiploma = () => {
    setFormData({
      ...formData,
      diplomas: [
        ...formData.diplomas,
        { diplome: "", specialite: "", etablissement: "", anneeDebut: "", anneeFin: "", mention: "" },
      ],
    });
  };

  const removeDiploma = (index) => {
    const updatedDiplomas = [...formData.diplomas];
    updatedDiplomas.splice(index, 1);

    setFormData({
      ...formData,
      diplomas: updatedDiplomas,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const filteredLanguages = formData.languages.filter(
        (lang) => lang.nom && lang.nom.trim() !== "" && lang.niveau && lang.niveau.trim() !== ""
      );

      const filteredExperiences = formData.experiences.filter(
        (exp) => exp.poste && exp.poste.trim() !== "" && exp.entreprise && exp.entreprise.trim() !== ""
      );

      const filteredDiplomas = formData.diplomas.filter(
        (dip) => dip.diplome && dip.diplome.trim() !== ""
      );

      const updateData = {
        langues: filteredLanguages,
        experiences: filteredExperiences,
        formations: filteredDiplomas,
      };

      await updateMyCV(updateData);

      Swal.fire({
        title: "Succès",
        text: "Votre CV a été mis à jour avec succès",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        navigate("/CV/me");
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du CV:", error);
      Swal.fire({
        title: "Erreur",
        text: "Une erreur est survenue lors de la mise à jour de votre CV",
        icon: "error",
      });
    } finally {
      setSaving(false);
      navigate("/CV/me");
    }
  };

  if (loading) {
    return (
      <div className="w-[100%] p-8 bg-white rounded-xl shadow-xl mx-auto mt-8 min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Chargement du formulaire</h2>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[100%] bg-gray-50 mx-auto my-8 rounded-xl overflow-hidden shadow-xl">
      <div className="bg-gradient-to-r from-blue-400 to-cyan-500 p-8 text-white">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Éditer votre CV académique</h1>
          <button
            onClick={() => navigate("/CV")}
            className="px-4 py-2 bg-white text-blue-400 hover:bg-gray-100 rounded-lg transition-all shadow-md font-medium"
          >
            Annuler
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8">
        {/* Section Diplômes */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
              </svg>
              Formations
            </h2>
            <button
              type="button"
              onClick={addDiploma}
              className="px-4 py-2 bg-indigo-500 text-white hover:bg-indigo-600 rounded-lg transition-all shadow-md font-medium"
            >
              Ajouter une formation
            </button>
          </div>

          <div className="space-y-4">
            {formData.diplomas.map((diploma, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-lg text-gray-700">Formation {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeDiploma(index)}
                    className="px-3 py-1 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-all"
                  >
                    Supprimer
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2">Diplôme *</label>
                    <input
                      type="text"
                      value={diploma.diplome || ""}
                      onChange={(e) => handleDiplomaChange(index, "diplome", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Ex: Master, Licence, BTS..."
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Spécialité</label>
                    <input
                      type="text"
                      value={diploma.specialite || ""}
                      onChange={(e) => handleDiplomaChange(index, "specialite", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Ex: Informatique, Marketing..."
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Établissement</label>
                    <input
                      type="text"
                      value={diploma.etablissement || ""}
                      onChange={(e) => handleDiplomaChange(index, "etablissement", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Nom de l'établissement"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Mention</label>
                    <select
                      value={diploma.mention || ""}
                      onChange={(e) => handleDiplomaChange(index, "mention", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Sélectionnez une mention</option>
                      <option value="Passable">Passable</option>
                      <option value="Assez bien">Assez bien</option>
                      <option value="Bien">Bien</option>
                      <option value="Très bien">Très bien</option>
                      <option value="Excellent">Excellent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Année de début</label>
                    <input
                      type="text"
                      value={diploma.anneeDebut || ""}
                      onChange={(e) => handleDiplomaChange(index, "anneeDebut", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Ex: 2020"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Année de fin</label>
                    <input
                      type="text"
                      value={diploma.anneeFin || ""}
                      onChange={(e) => handleDiplomaChange(index, "anneeFin", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Ex: 2023, En cours..."
                    />
                  </div>
                </div>
              </div>
            ))}
            {formData.diplomas.length === 0 && (
              <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300 text-center">
                <p className="text-gray-500">Aucune formation ajoutée. Cliquez sur "Ajouter une formation" pour commencer.</p>
              </div>
            )}
          </div>
        </div>

        {/* Section Langues */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              Langues
            </h2>
            <button
              type="button"
              onClick={addLanguage}
              className="px-4 py-2 bg-indigo-500 text-white hover:bg-indigo-600 rounded-lg transition-all shadow-md font-medium"
            >
              Ajouter une langue
            </button>
          </div>

          <div className="space-y-4">
            {formData.languages.map((langue, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-lg text-gray-700">Langue {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeLanguage(index)}
                    className="px-3 py-1 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-all"
                  >
                    Supprimer
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2">Nom de la langue *</label>
                    <input
                      type="text"
                      value={langue.nom || ""}
                      onChange={(e) => handleLanguageChange(index, "nom", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Ex: Français, Anglais, Espagnol..."
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Niveau *</label>
                    <select
                      value={langue.niveau || ""}
                      onChange={(e) => handleLanguageChange(index, "niveau", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Sélectionnez un niveau</option>
                      <option value="A1">A1 - Débutant</option>
                      <option value="A2">A2 - Élémentaire</option>
                      <option value="B1">B1 - Intermédiaire</option>
                      <option value="B2">B2 - Avancé</option>
                      <option value="C1">C1 - Autonome</option>
                      <option value="C2">C2 - Maîtrise</option>
                      <option value="Natif">Natif</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
            {formData.languages.length === 0 && (
              <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300 text-center">
                <p className="text-gray-500">Aucune langue ajoutée. Cliquez sur "Ajouter une langue" pour commencer.</p>
              </div>
            )}
          </div>
        </div>

        {/* Section Expériences */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Expériences Professionnelles
            </h2>
            <button
              type="button"
              onClick={addExperience}
              className="px-4 py-2 bg-indigo-500 text-white hover:bg-indigo-600 rounded-lg transition-all shadow-md font-medium"
            >
              Ajouter une expérience
            </button>
          </div>

          <div className="space-y-4">
            {formData.experiences.map((experience, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-lg text-gray-700">Expérience {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeExperience(index)}
                    className="px-3 py-1 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-all"
                  >
                    Supprimer
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2">Poste *</label>
                    <input
                      type="text"
                      value={experience.poste || ""}
                      onChange={(e) => handleExperienceChange(index, "poste", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Ex: Développeur Web, Chef de projet..."
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Entreprise *</label>
                    <input
                      type="text"
                      value={experience.entreprise || ""}
                      onChange={(e) => handleExperienceChange(index, "entreprise", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Nom de l'entreprise"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Date de début</label>
                    <input
                      type="text"
                      value={experience.dateDebut || ""}
                      onChange={(e) => handleExperienceChange(index, "dateDebut", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Ex: Janvier 2022"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Date de fin</label>
                    <input
                      type="text"
                      value={experience.dateFin || ""}
                      onChange={(e) => handleExperienceChange(index, "dateFin", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Ex: Présent, Décembre 2022"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-gray-700 mb-2">Description</label>
                  <textarea
                    value={experience.description || ""}
                    onChange={(e) => handleExperienceChange(index, "description", e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Décrivez vos responsabilités et réalisations..."
                  ></textarea>
                </div>
              </div>
            ))}
            {formData.experiences.length === 0 && (
              <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300 text-center">
                <p className="text-gray-500">Aucune expérience ajoutée. Cliquez sur "Ajouter une expérience" pour commencer.</p>
              </div>
            )}
          </div>
        </div>

        {/* Boutons de soumission */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate("/CV")}
            className="px-6 py-2 mr-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all flex items-center"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></div>
                Enregistrement...
              </>
            ) : (
              "Enregistrer"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCV;