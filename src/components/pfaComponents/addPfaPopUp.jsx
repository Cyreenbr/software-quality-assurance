import { useState } from "react";

export default function AddPfaPopUp({
  isEditing,
  editedData,
  newPfa,
  handleCreateChange,
  projectType,
  studentOne,
  handleSubmitCreate,
  setProjectType,
  studentTwo,
  setStudentOne,
  setStudentTwo,
  handleChange,
  setIsDialogOpen,
  handleSubmitEdit
}) {
  const [errorMessage, setErrorMessage] = useState("");

  // Fonction de validation pour la création
  const validateFields = () => {
    if (
      !newPfa.projectTitle.trim() ||
      !newPfa.description.trim() ||
      !newPfa.technologies.trim() ||
      !studentOne.trim() ||
      (projectType === "binome" && !studentTwo.trim())
    ) {
      return false;
    }
    return true;
  };

  const handleButtonClick = (e) => {
    e.preventDefault();
    if (!isEditing) {
      if (!validateFields()) {
        setErrorMessage("Please fill in all required fields");
        // Effacer le message après 3 secondes
        setTimeout(() => setErrorMessage(""), 3000);
        return;
      }
      handleSubmitCreate(e);
    } else {
      handleSubmitEdit(e);
    }
  };

  return (
    <div className="fixed inset-0 mt-20 z-20 bg-transparent bg-opacity-30 backdrop-blur-md flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl p-6 space-y-6">
        <h3 className="text-3xl font-semibold text-center text-white bg-gradient-to-r from-indigo-600 to-purple-300 py-4 rounded-t-xl shadow-md">
          {isEditing ? "Update PFA" : "Create PFA"}
        </h3>

        {/* Popup d'erreur */}
        {errorMessage && (
          <div className="bg-red-100 border border-red-300 text-red-700 text-sm rounded-md px-4 py-2 text-center">
            {errorMessage}
          </div>
        )}

        <div className="space-y-4 px-2 sm:px-4">
          {/* Title */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Title of The Project
            </label>
            <input
              type="text"
              name="projectTitle"
              value={isEditing ? editedData.projectTitle : newPfa.projectTitle}
              onChange={isEditing ? handleChange : handleCreateChange}
              placeholder="Enter project title"
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={isEditing ? editedData.description : newPfa.description}
              onChange={isEditing ? handleChange : handleCreateChange}
              placeholder="Project description"
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm"
              required
            />
          </div>

          {/* Technologies */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Technologies
            </label>
            <input
              type="text"
              name="technologies"
              value={isEditing ? editedData.technologies : newPfa.technologies}
              onChange={isEditing ? handleChange : handleCreateChange}
              placeholder="e.g., React, Node.js"
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm"
              required
            />
          </div>

          {/* Project Type & Students */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Project Type
            </label>
            <div className="flex gap-4 mb-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="projectType"
                  value="monome"
                  checked={projectType === "monome"}
                  onChange={() => setProjectType("monome")}
                />
                Monome
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="projectType"
                  value="binome"
                  checked={projectType === "binome"}
                  onChange={() => setProjectType("binome")}
                />
                Binome
              </label>
            </div>
            <input
              type="text"
              placeholder="Enter Student One Name"
              value={studentOne}
              onChange={(e) => setStudentOne(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm"
              required
            />
            {projectType === "binome" && (
              <input
                type="text"
                placeholder="Enter Student Two Name"
                value={studentTwo}
                onChange={(e) => setStudentTwo(e.target.value)}
                className="w-full mt-2 rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm"
                required
              />
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            onClick={() => setIsDialogOpen(false)}
            className="bg-gray-400 text-white px-4 py-2 rounded-full hover:bg-gray-500 transition-all duration-200 shadow"
          >
            Cancel
          </button>
          <button
            onClick={handleButtonClick}
            className="bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 transition-all duration-200 shadow"
          >
            {isEditing ? "Save" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
