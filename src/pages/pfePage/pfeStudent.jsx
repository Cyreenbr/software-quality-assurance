import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Updated import

const PFEStudent = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [domain, setDomain] = useState("");
  const [company, setCompany] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [files, setFiles] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [pfeId, setPfeId] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Using useNavigate instead of useHistory

  // Fetch the existing PFE if updating
  useEffect(() => {
    if (pfeId) {
      axios
        .get(`http://localhost:3000/api/pfe/${pfeId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((response) => {
          const {
            title,
            description,
            domain,
            company,
            technologies,
            documents,
          } = response.data;
          setTitle(title);
          setDescription(description);
          setDomain(domain);
          setCompany(company);
          setTechnologies(technologies.join(", "));
        })
        .catch((error) => {
          console.error("Error fetching PFE:", error);
          setMessage("Failed to fetch PFE data.");
        });
    }
  }, [pfeId]);

  // Handle file upload change
  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  // Submit or update PFE
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("domain", domain);
    formData.append("company", company);
    formData.append(
      "technologies",
      technologies.split(",").map((item) => item.trim())
    );
    if (files) {
      Array.from(files).forEach((file) => formData.append("files", file));
    }

    try {
      let response;
      if (isUpdate && pfeId) {
        // Update the existing PFE
        response = await axios.patch(
          `http://localhost:3000/api/pfe/${pfeId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setMessage("PFE updated successfully!");
      } else {
        // Create a new PFE
        response = await axios.post(
          "http://localhost:3000/api/pfe/post",
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setMessage("PFE submitted successfully!");
      }

      navigate("/dashboard"); // Redirect to dashboard or appropriate page using navigate
    } catch (error) {
      console.error("Error submitting/updating PFE:", error);
      setMessage("Failed to submit or update PFE.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">
        {isUpdate ? "Update PFE" : "Submit PFE"}
      </h1>
      {message && <p className="text-red-500 mb-4">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Domain
          </label>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Company
          </label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Technologies (comma separated)
          </label>
          <input
            type="text"
            value={technologies}
            onChange={(e) => setTechnologies(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload Documents
          </label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="mt-1 block w-full"
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard")} // Redirect to dashboard on cancel
            className="px-4 py-2 bg-gray-500 text-white rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            {isUpdate ? "Update PFE" : "Submit PFE"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PFEStudent;
