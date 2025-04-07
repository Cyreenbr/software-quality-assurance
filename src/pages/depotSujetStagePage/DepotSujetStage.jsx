import { useState } from "react";
import { createInternship } from "../../services/internshipServices/DepositInternship.service";

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
    const newFiles = Array.from(e.target.files); //Array.from transforme les fichiers sélectionnés en tableau.
    setFormData((prevFormData) => ({
      ...prevFormData,
      documents: [...prevFormData.documents, ...newFiles], // ajout du doc
    }));
  };

  // New function to handle file removal
  const handleRemoveFile = (index) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      documents: prevFormData.documents.filter((_, i) => i !== index),
    }));
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
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-100 py-10 rounded-lg">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-black-700 mb-6 text-start">Submit an Internship</h2>
    <div className="max-w-4xl mx-auto py-10 px-6 ">
      {message && <p className="text-green-600 text-center">{message}</p>}
      {error && <p className="text-red-600 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-800 font-semibold">Internship Title</label>
          <input
            type="text"
            name="titre"
            placeholder="Internship title"
            value={formData.titre}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition hover:shadow-md"
            required
          />
        </div>
        <div>
          <label className="block text-gray-800 font-semibold">Duration (in months)</label>
          <input
            type="text"
            name="duree"
            placeholder="Duration of internship"
            value={formData.duree}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition hover:shadow-md"
            required
          />
        </div>
        <div>
          <label className="block text-gray-800 font-semibold">Company</label>
          <input
            type="text"
            name="entreprise"
            placeholder="Company name"
            value={formData.entreprise}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition hover:shadow-md"
            required
          />
        </div>
        <div>
          <label className="block text-gray-800 font-semibold">Internship Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-blue-500 transition hover:shadow-md"
            required
          >
            <option value="">Select type</option>
            <option value="1year">1st Year Internship</option>
            <option value="2year">2nd Year Internship</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-800 font-semibold">Documents to attach</label>
          <div className="border-dashed border-2 border-gray-400 p-4 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition">
            <label className="cursor-pointer flex items-center space-x-2 text-blue-600 font-medium">
              <span>Choose files</span>
              <input
                type="file"
                name="documents"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
          
          {/* Display selected files with remove button */}
          {formData.documents.length > 0 && (
            <ul className="mt-2">
              {formData.documents.map((doc, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-gray-100 p-2 rounded-lg mt-2"
                >
                  <span>{doc.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition shadow-md hover:shadow-lg flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </div>
    </div>
    </div>
  );
};

export default DepotSujet;