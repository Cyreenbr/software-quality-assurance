import React, { useState, useEffect } from "react";
import {
  getOptions,
  computeOption,
  editOption,
  publishStudentsOptions,
  ListIsPublished, // Import the function to check publication status
} from "../../services/OptionServices/option.service";
import { FaEdit } from "react-icons/fa";

export default function OptionList() {
  const [optionsList, setOptionsList] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedClassement, setSelectedClassement] = useState("");
  const [isComputing, setIsComputing] = useState(false);
  const [hasClassements, setHasClassements] = useState(false);
  const [uniqueClassements, setUniqueClassements] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStudentOption, setSelectedStudentOption] = useState(null);
  const [editedData, setEditedData] = useState({ raison: "", option: "" });

  // State to manage publication/hiding of the list
  const [isPublished, setIsPublished] = useState(false);
  // State to track if we're loading the publication status
  const [isLoadingPublishStatus, setIsLoadingPublishStatus] = useState(true);

  useEffect(() => {
    // Check if the list is published when component mounts
    checkPublicationStatus();
    fetchOptions();
  }, []);

  useEffect(() => {
    if (optionsList.length > 0) {
      applyFilters();
      const classements = optionsList
        .map((option) => option.classement)
        .filter((classement) => classement && classement.trim() !== "");
      setHasClassements(classements.length > 0);
      const uniqueValues = [...new Set(classements)].sort();
      setUniqueClassements(uniqueValues);
    }
  }, [optionsList, selectedStatus, selectedOption, selectedClassement]);

  // Function to check if the list is published
  const checkPublicationStatus = async () => {
    try {
      setIsLoadingPublishStatus(true);
      const response = await ListIsPublished();
      if (response && response.published !== undefined) {
        setIsPublished(response.published);
      }
    } catch (error) {
      console.error("Error checking publication status:", error);
    } finally {
      setIsLoadingPublishStatus(false);
    }
  };

  const fetchOptions = async () => {
    try {
      const response = await getOptions();
      if (response && response.model) {
        setOptionsList(response.model);
        setFilteredOptions(response.model);
      }
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };

  const handleComputeOption = async () => {
    setIsComputing(true);
    try {
      const response = await computeOption();
      console.log("Computation result:", response);
      alert("Scores calculated Successfully!");
      await fetchOptions();
    } catch (error) {
      alert("Error in calculation!");
    } finally {
      setIsComputing(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...optionsList];
    if (selectedStatus === "valid") {
      filtered = filtered.filter((o) => o.valide === true);
    } else if (selectedStatus === "invalid") {
      filtered = filtered.filter((o) => o.valide === false);
    }
    if (selectedOption === "INREV") {
      filtered = filtered.filter((o) => o.firstchoice === "INREV");
    } else if (selectedOption === "INLOG") {
      filtered = filtered.filter((o) => o.firstchoice === "INLOG");
    }
    if (selectedClassement) {
      filtered = filtered.filter((o) => o.classement === selectedClassement);
    }
    setFilteredOptions(filtered);
  };

  const handleStatusFilter = (e) => {
    setSelectedStatus(e.target.value);
  };
  const handleOptionFilter = (e) => {
    setSelectedOption(e.target.value);
  };
  const handleClassementFilter = (e) => {
    setSelectedClassement(e.target.value);
  };

  const handleEdit = (option) => {
    setSelectedStudentOption(option);
    setEditedData({
      raison: option.raison || "",
      option: option.classement || "",
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedStudentOption(null);
    setEditedData({ raison: "", option: "" });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (!selectedStudentOption) return;
    try {
      const userId = selectedStudentOption.user;
      await editOption(userId, {
        raison: editedData.raison,
        option: editedData.option,
      });
      fetchOptions();
      handleCloseDialog();
    } catch (error) {
      console.error("Error updating option:", error);
    }
  };

  // Function to handle publish/hide button click
  const handlePublish = async () => {
    try {
      const newStatus = isPublished ? "masquer" : "publier";
      const result = await publishStudentsOptions(newStatus);
      if (result && result.list) {
        setIsPublished(result.list.published);
      }
      // After toggling publication status, fetch the options again
      await fetchOptions();
    } catch (error) {
      console.error("Error updating publish status:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen relative">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-4">Manage Options</h1>
        <div className="flex space-x-2">
          {isLoadingPublishStatus ? (
            <button
              disabled
              className="px-4 py-2 rounded-md bg-gray-400 text-white"
            >
              Loading status...
            </button>
          ) : (
            <button
              onClick={handlePublish}
              className={`px-4 py-2 rounded-md text-white hover:opacity-90 ${
                isPublished
                  ? "bg-orange-500 hover:bg-orange-600"
                  : "bg-yellow-500 hover:bg-yellow-600"
              }`}
            >
              {isPublished ? "Masquer la liste" : "Publier la liste"}
            </button>
          )}
          <button
            onClick={handleComputeOption}
            disabled={isComputing}
            className={`px-4 py-2 rounded-md text-white font-semibold ${
              isComputing
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isComputing
              ? "Calculation in progress..."
              : "Start Scores Calculation"}
          </button>
        </div>
      </div>

      {/* Publication Status Indicator */}
      <div
        className={`mb-4 p-3 rounded-md ${
          isPublished
            ? "bg-green-100 text-green-800"
            : "bg-amber-100 text-amber-800"
        }`}
      >
        <p className="font-medium">
          {isPublished
            ? "The option list is currently published. Students can see their assigned options."
            : "The option list is not published. Students cannot see their assigned options."}
        </p>
      </div>

      {/* Options List */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">List of Options</h2>
        </div>
        <div className="overflow-x-auto">
          <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label
                htmlFor="statusFilter"
                className="block text-sm font-medium text-gray-700"
              >
                Filter by Status:
              </label>
              <select
                id="statusFilter"
                value={selectedStatus}
                onChange={handleStatusFilter}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">All Statuses</option>
                <option value="valid">Validated</option>
                <option value="invalid">Not Validated</option>
              </select>
            </div>
            {/* Option Filter */}
            <div>
              <label
                htmlFor="optionFilter"
                className="block text-sm font-medium text-gray-700"
              >
                Filter by Option:
              </label>
              <select
                id="optionFilter"
                value={selectedOption}
                onChange={handleOptionFilter}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">All Options</option>
                <option value="INREV">INREV</option>
                <option value="INLOG">INLOG</option>
              </select>
            </div>
            {/* Classement Filter */}
            {hasClassements && (
              <div>
                <label
                  htmlFor="classementFilter"
                  className="block text-sm font-medium text-gray-700"
                >
                  Filter by Classement:
                </label>
                <select
                  id="classementFilter"
                  value={selectedClassement}
                  onChange={handleClassementFilter}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">All Classements</option>
                  {uniqueClassements.map((classement) => (
                    <option key={classement} value={classement}>
                      {classement}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Full Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  First Choice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Classement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Created At
                </th>
                {!isPublished && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <tr
                    key={option._id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-3 px-6 text-left">
                      {option.firstName && option.lastName
                        ? `${option.firstName} ${option.lastName}`
                        : "N/A"}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {option.firstchoice}
                    </td>
                    <td className="py-3 px-6 text-left">{option.score}</td>
                    <td className="py-3 px-6 text-left">{option.classement}</td>
                    <td className="py-3 px-6 text-left">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          option.valide
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {option.valide ? "Validated" : "Not Validated"}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-left">
                      {option.createdAt ? formatDate(option.createdAt) : "N/A"}
                    </td>
                    {!isPublished && (
                      <td className="py-3 px-6 text-center flex justify-center space-x-2">
                        <button
                          onClick={() => handleEdit(option)}
                          className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
                        >
                          <FaEdit size={18} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={isPublished ? 6 : 7}
                    className="py-4 px-6 text-center text-gray-500"
                  >
                    No options available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Dialog */}
      {isDialogOpen && (
        <div className="pointer-events-auto fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-transparent backdrop-blur-sm transition-opacity duration-500 opacity-100">
          <div className="relative mx-auto w-full max-w-[24rem] rounded-lg overflow-hidden shadow-sm">
            <div className="relative flex flex-col bg-white max-h-[80vh] overflow-y-auto">
              <div className="sticky top-0 z-10 bg-indigo-600 p-4 flex justify-center items-center text-white h-12 rounded-md">
                <h2 className="text-xl font-semibold mb-4">Edit Option</h2>
              </div>
              <form onSubmit={handleSubmitEdit} className="p-4">
                {/* Option Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Option
                  </label>
                  <select
                    name="option"
                    value={editedData.option}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">Select Option</option>
                    <option value="INREV">INREV</option>
                    <option value="INLOG">INLOG</option>
                  </select>
                </div>
                {/* Reason Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason
                  </label>
                  <textarea
                    name="raison"
                    value={editedData.raison}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    rows="3"
                    required
                  ></textarea>
                </div>
                {/* Action Buttons */}
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={handleCloseDialog}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
