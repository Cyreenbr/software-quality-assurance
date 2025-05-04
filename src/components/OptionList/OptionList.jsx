import React, { useState, useEffect } from "react";
import {
  getOptions,
  computeOption,
} from "../../services/OptionServices/option.service";

export default function OptionList() {
  const [optionsList, setOptionsList] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedClassement, setSelectedClassement] = useState("");
  const [isComputing, setIsComputing] = useState(false);
  const [hasClassements, setHasClassements] = useState(false);
  const [uniqueClassements, setUniqueClassements] = useState([]);

  useEffect(() => {
    fetchOptions();
  }, []);

  useEffect(() => {
    if (optionsList.length > 0) {
      applyFilters();

      // Check if any options have classement values
      const classements = optionsList
        .map((option) => option.classement)
        .filter((classement) => classement && classement.trim() !== "");

      setHasClassements(classements.length > 0);

      // Get unique classement values
      const uniqueValues = [...new Set(classements)].sort();
      setUniqueClassements(uniqueValues);
    }
  }, [optionsList, selectedStatus, selectedOption, selectedClassement]);

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

    // Apply status filter
    if (selectedStatus === "valid") {
      filtered = filtered.filter((o) => o.valide === true);
    } else if (selectedStatus === "invalid") {
      filtered = filtered.filter((o) => o.valide === false);
    }

    // Apply option type filter
    if (selectedOption === "INREV") {
      filtered = filtered.filter((o) => o.firstchoice === "INREV");
    } else if (selectedOption === "INLOG") {
      filtered = filtered.filter((o) => o.firstchoice === "INLOG");
    }

    // Apply classement filter
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
            </div>{" "}
            {/* Classement Filter - Only displayed if there are classement values */}
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
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
    </div>
  );
}
