import { useState, useEffect } from "react";
import {
  createPFE,
  updatePFE,
  getPFEByUser,
} from "../../services/pfeService/pfeService";

const PFEStudent = ({ userId }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    domain: "",
    company: "",
    technologies: "",
    documents: [],
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [pfeId, setPfeId] = useState(null);

  // Refresh key to force re-fetch after creation
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchUserPFE = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const userId = storedUser ? storedUser._id || storedUser.id : null;

        if (!userId) return;

        const pfe = await getPFEByUser(userId);
        if (pfe) {
          setFormData({
            title: pfe.title || "",
            description: pfe.description || "",
            domain: pfe.domain || "",
            company: pfe.company || "",
            technologies: pfe.technologies || "",
            documents: pfe.documents || [],
          });
          setPfeId(pfe._id);
        } else {
          // Reset form if no PFE found
          setFormData({
            title: "",
            description: "",
            domain: "",
            company: "",
            technologies: "",
            documents: [],
          });
          setPfeId(null);
        }
      } catch (err) {
        console.error("Error fetching PFE data:", err);
      }
    };

    fetchUserPFE();
  }, [userId, refreshKey]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFormData((prevFormData) => ({
      ...prevFormData,
      documents: [...prevFormData.documents, ...newFiles],
    }));
  };

  const handleRemoveFile = (index) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      documents: prevFormData.documents.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (formData.documents.length === 0 && !pfeId) {
      setError("Please upload at least one document.");
      setLoading(false);
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "documents") {
        formData.documents.forEach((file) => {
          if (file instanceof File) {
            data.append("documents", file);
          } else {
            data.append("existingDocuments[]", file);
          }
        });
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      if (pfeId) {
        await updatePFE(pfeId, data);
        setMessage("PFE updated successfully!");
      } else {
        await createPFE(data);
        setMessage("PFE submitted successfully!");
        // Trigger re-fetch of PFE data by updating the key
        setRefreshKey((prev) => prev + 1);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(
          err.response.data.message || "An error occurred while submitting."
        );
      } else {
        setError(err.message || "An error occurred while submitting.");
      }
      setMessage(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-100 py-10 rounded-lg">
      <h2 className="text-2xl font-bold text-black-700 mb-6 text-start">
        {pfeId ? "Update Your PFE" : "Submit a PFE"}
      </h2>
      <div className="max-w-4xl mx-auto py-10 px-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-800 font-semibold">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-gray-800 font-semibold">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-gray-800 font-semibold">Domain</label>
            <input
              type="text"
              name="domain"
              value={formData.domain}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-gray-800 font-semibold">Company</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-gray-800 font-semibold">
              Technologies
            </label>
            <input
              type="text"
              name="technologies"
              value={formData.technologies}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-gray-800 font-semibold">
              Documents
            </label>
            <input
              type="file"
              name="documents"
              multiple
              onChange={handleFileChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
            />
            <ul className="mt-2">
              {formData.documents.map((doc, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-gray-100 p-2 rounded-lg"
                >
                  <span>{doc.name || doc}</span>
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
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium"
            disabled={loading}
          >
            {loading ? "Processing..." : pfeId ? "Update PFE" : "Submit PFE"}
          </button>

          {message && (
            <p className="text-green-600 text-center mt-4">{message}</p>
          )}
          {error && <p className="text-red-600 text-center mt-4">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default PFEStudent;
