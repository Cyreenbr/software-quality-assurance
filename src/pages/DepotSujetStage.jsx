import { useState } from "react";
import { createInternship } from "../services/DepotStageService";

const DepotSujet = () => {
  const [formData, setFormData] = useState({
    titre: "",
    duree: "",
    entreprise: "",
    type: "",
    documents: [],
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, documents: e.target.files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "documents") {
        Array.from(formData.documents).forEach((file) => {
          data.append("documents", file);
        });
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      const response = await createInternship(data);
      setMessage(response.message);
      setError(null);
    } catch (err) {
      setError(err.message);
      setMessage(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Déposer un Stage
      </h2>
      
      {message && <p className="text-green-600 text-center">{message}</p>}
      {error && <p className="text-red-600 text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-700 font-medium">Titre du stage</label>
          <input
            type="text"
            name="titre"
            placeholder="Titre du stage"
            value={formData.titre}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 transition"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Durée (en mois)</label>
          <input
            type="text"
            name="duree"
            placeholder="Durée du stage"
            value={formData.duree}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 transition"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Entreprise</label>
          <input
            type="text"
            name="entreprise"
            placeholder="Nom de l'entreprise"
            value={formData.entreprise}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 transition"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Type de Stage</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-400 transition"
            required
          >
            <option value="">Sélectionner le type</option>
            <option value="1year">Stage 1ère année</option>
            <option value="2year">Stage 2ème année</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Documents à joindre</label>
          <div className="border-dashed border-2 border-gray-400 p-4 rounded-lg flex items-center justify-center">
            <label className="cursor-pointer flex items-center space-x-2 text-blue-600 font-medium">
              <span>Choisir des fichiers</span>
              <input
                type="file"
                name="documents"
                multiple
                onChange={handleFileChange}
                className="hidden"
                required
              />
            </label>
          </div>
          {formData.documents.length > 0 && (
            <p className="text-gray-600 mt-2">{formData.documents.length} fichier(s) sélectionné(s)</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
          ) : (
            "Soumettre"
          )}
        </button>
      </form>
    </div>
  );
};

export default DepotSujet;
