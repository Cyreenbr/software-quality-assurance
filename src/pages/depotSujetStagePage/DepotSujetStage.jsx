import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import {
  FiArrowRight,
  FiChevronDown,
  FiFileText,
  FiFolder,
  FiPlus,
  FiUpload,
  FiX
} from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StudentInternshipDetails from "../../components/internshipComponents/StudentInternshipDetails";
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
  const [refreshDetails, setRefreshDetails] = useState(false);
  const [activeTab, setActiveTab] = useState("form"); // "form" or "details"

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
      toast.success(response.message || "Internship submitted successfully");
      // reset the form after successful submission
      setFormData({
        titre: "",
        duree: "",
        entreprise: "",
        type: "",
        documents: [],
      });
      // Trigger a refresh of the student details component
      setRefreshDetails((prev) => !prev);
      // Switch to details tab to show the newly added internship
      setActiveTab("details");
    } catch (err) {
      toast.error(err.message || "Failed to submit internship");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
          Internship Management
        </h1>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-md shadow-sm bg-white" role="group">
            <button
              type="button"
              onClick={() => setActiveTab("form")}
              className={`px-5 py-2.5 text-sm font-medium rounded-l-lg ${
                activeTab === "form"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-blue-600 hover:bg-gray-100"
              }`}
            >
              Add New Internship
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("details")}
              className={`px-5 py-2.5 text-sm font-medium rounded-r-lg ${
                activeTab === "details"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-blue-600 hover:bg-gray-100"
              }`}
            >
              View My Internships
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          {activeTab === "form" ? (
            <div className="p-6">
              <div className="max-w-5xl mx-auto">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center mr-3">
                  <FiPlus className="h-4 w-4" />
                </span>
                Submit a New Internship
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Internship Title
                  </label>
                  <input
                    type="text"
                    name="titre"
                    placeholder="Enter the internship title"
                    value={formData.titre}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Duration (in months)
                  </label>
                  <input
                    type="text"
                    name="duree"
                    placeholder="How long will the internship last?"
                    value={formData.duree}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    name="entreprise"
                    placeholder="Where will you intern?"
                    value={formData.entreprise}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Internship Type
                  </label>
                  <div className="relative">
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none appearance-none"
                      required
                    >
                      <option value="">Select internship type</option>
                      <option value="1year">1st Year Internship</option>
                      <option value="2year">2nd Year Internship</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                      <FiChevronDown className="h-5 w-5" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Documents to attach
                  </label>
                  <div className="border-dashed border-2 border-blue-300 p-4 rounded bg-blue-50 hover:bg-blue-100 transition flex flex-col items-center justify-center cursor-pointer">
                    <FiUpload className="w-8 h-8 text-blue-500 mb-2" />
                    <label className="cursor-pointer flex flex-col items-center">
                      <span className="text-blue-600 font-medium">
                        Drop files here or click to browse
                      </span>
                      <input
                        type="file"
                        name="documents"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {formData.documents.length > 0 && (
                    <ul className="mt-3 space-y-2">
                      {formData.documents.map((doc, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between bg-blue-50 p-2 rounded border border-blue-100"
                        >
                          <span className="flex items-center">
                            <FiFileText className="w-4 h-4 text-blue-500 mr-2" />
                            <span className="truncate max-w-xs">{doc.name}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(index)}
                            className="text-red-500 hover:text-red-700 p-1 rounded-full"
                          >
                            <FiX className="w-5 h-5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="flex items-center pt-3">
                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-3 rounded font-medium hover:bg-blue-600 transition flex items-center justify-center"
                    disabled={loading}
                  >
                    {loading ? (
                      <FaSpinner className="animate-spin h-5 w-5 mr-3 text-white" />
                    ) : (
                      <>
                        <span>Submit Internship</span>
                        <FiArrowRight className="h-5 w-5 ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
                  </div>
          ) : (
           <div className="max-w-5xl mx-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center mr-3">
                  <FiFolder className="h-4 w-4" />
                </span>
                My Internships
              </h2>
              <div>
                <StudentInternshipDetails key={refreshDetails} />
              </div>
             </div>
            </div>

          )}
        </div>


      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default DepotSujet;