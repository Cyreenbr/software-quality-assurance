import React, { useState, useEffect } from "react";
import {
  getOptionsList,
  ListIsPublished,
  MyOption,
} from "../../services/OptionServices/optionforstudents.service";

export default function OptionsListStudent() {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedClassement, setSelectedClassement] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [isPublished, setIsPublished] = useState(false);
  const [uniqueClassements, setUniqueClassements] = useState([]);
  const [hasClassements, setHasClassements] = useState(false);

  // State variables for dialog
  const [showDialog, setShowDialog] = useState(false);
  const [myOptionDetails, setMyOptionDetails] = useState(null);
  const [loadingOption, setLoadingOption] = useState(false);

  useEffect(() => {
    checkPublicationAndFetchOptions();
  }, []);

  useEffect(() => {
    if (options.length > 0) {
      applyFilters();
      const classements = options
        .map((option) => option.classement)
        .filter((classement) => classement && classement.trim() !== "");
      setHasClassements(classements.length > 0);
      const uniqueValues = [...new Set(classements)].sort();
      setUniqueClassements(uniqueValues);
    }
  }, [options, selectedStatus, selectedOption, selectedClassement]);

  const checkPublicationAndFetchOptions = async () => {
    try {
      setLoading(true);

      // Check if the options list is published
      const publicationStatus = await ListIsPublished();
      if (!publicationStatus.published) {
        setIsPublished(false);
        setLoading(false);
        return;
      }

      setIsPublished(true);

      // Fetch the options list
      const data = await getOptionsList();
      setOptions(data.model || []);
      setFilteredOptions(data.model || []);
    } catch (err) {
      setError("Error loading data. Please try again later.");
      console.error("Error fetching options:", err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...options];

    // Apply status filter
    if (selectedStatus === "valid") {
      filtered = filtered.filter((o) => o.valide === true);
    } else if (selectedStatus === "invalid") {
      filtered = filtered.filter((o) => o.valide === false);
    }

    // Apply option filter
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
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Function to fetch and display my option details
  const handleShowMyClassement = async () => {
    try {
      setLoadingOption(true);
      setShowDialog(true);

      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.id;

      const response = await MyOption(userId);
      if (response && response.option) {
        setMyOptionDetails(response.option);
      } else {
        setMyOptionDetails({
          error: "No option details found for your account.",
        });
      }
    } catch (err) {
      setMyOptionDetails({
        error: "Failed to load your option details. Please try again later.",
      });
      console.error("Error fetching my option:", err);
    } finally {
      setLoadingOption(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white shadow rounded text-center">
          <p>Checking your eligibility...</p>
        </div>
      </div>
    );
  }

  if (!isPublished) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg text-center transform transition-transform duration-300 hover:scale-105">
          <svg
            className="mx-auto h-16 w-16 text-red-600 animate-pulse"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h1 className="mt-4 text-3xl font-extrabold text-red-700">
            List Not Published
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            The options list has not been published yet. Please check back
            later.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="bg-red-100 p-6 border border-red-300 rounded-lg shadow-md text-red-800">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">List of options</h1>

      {/* Publication Status Indicator */}
      <div className="mb-4 p-3 rounded-md bg-green-100 text-green-800">
        <p className="font-medium">
          The option list is currently published. You can see the assigned
          options.
        </p>
      </div>

      {/* Options List */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Student's Option List</h2>
          <button
            onClick={handleShowMyClassement}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            SEE MY CLASSEMENT
          </button>
        </div>

        <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
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

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Full Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Assigned Option
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <tr
                    key={option._id || index}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-3 px-6 text-left">
                      {option.user?.firstName && option.user?.lastName
                        ? `${option.user.firstName} ${option.user.lastName}`
                        : "N/A"}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {option.score !== undefined ? option.score : "N/A"}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {option.classement || "N/A"}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {formatDate(option.createdAt)}
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

      {/* Modal Dialog for My Classement */}
      {showDialog && (
        <div className="pointer-events-auto fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-transparent backdrop-blur-sm transition-opacity duration-500 opacity-100">
          <div className="relative mx-auto w-full max-w-[36rem] rounded-lg overflow-hidden shadow-sm">
            <div className="relative flex flex-col bg-white max-h-[80vh] overflow-y-auto">
              <div className="sticky top-0 z-10 bg-indigo-600 p-4 flex justify-center items-center text-white h-12 rounded-md">
                <h3 className="text-lg font-semibold">My Option Details</h3>
                <button
                  onClick={() => setShowDialog(false)}
                  className="text-white hover:text-gray-200 focus:outline-none"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="p-6">
                {loadingOption ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-2 text-gray-600">
                      Loading your option details...
                    </p>
                  </div>
                ) : myOptionDetails?.error ? (
                  <div className="bg-red-50 text-red-700 p-4 rounded-md">
                    <p>{myOptionDetails.error}</p>
                  </div>
                ) : myOptionDetails ? (
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-md">
                      <h4 className="font-medium text-blue-700">
                        Option Assignment
                      </h4>
                      <p className="text-blue-600">
                        <span className="font-semibold">
                          Your Assigned Option:
                        </span>{" "}
                        {myOptionDetails.classement || "Not yet assigned"}
                      </p>
                      <p className="text-blue-600">
                        <span className="font-semibold">Your Score:</span>{" "}
                        {myOptionDetails.score !== undefined
                          ? myOptionDetails.score
                          : "N/A"}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-md">
                      <h4 className="font-medium text-gray-700">
                        Option Preferences
                      </h4>
                      <p className="text-gray-600">
                        <span className="font-semibold">
                          Your First Choice:
                        </span>{" "}
                        {myOptionDetails.firstchoice || "N/A"}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md">
                      {myOptionDetails.raison ? (
                        <div>
                          <h4 className="font-medium text-gray-700">
                            Option Rectification Reason
                          </h4>
                          <p className="text-gray-600">
                            <span className="font-semibold">Reason:</span>{" "}
                            {myOptionDetails.raison}
                          </p>
                        </div>
                      ) : (
                        <p className="text-gray-600">
                          No rectification reason available.
                        </p>
                      )}
                    </div>
                    <div className="text-gray-600 text-sm">
                      <p>Applied on: {formatDate(myOptionDetails.createdAt)}</p>
                      <p>
                        Last Updated: {formatDate(myOptionDetails.updatedAt)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600">No option details available.</p>
                )}

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowDialog(false)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition-colors duration-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
