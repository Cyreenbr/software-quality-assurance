import React, { useState, useEffect } from "react";
import {
  SwitchYear,
  OpenNewYear,
  GetAllYears,
} from "../../services/UniversityYearServices/universityyear.service";
import { FaPlus } from "react-icons/fa";
import AcademicYearPicker from "../AcademicYearPicker";
import NewYearListing from "./NewYearListing";

const Season = () => {
  const [years, setYears] = useState([]);
  const [newYear, setNewYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showAddYear, setShowAddYear] = useState(false); // State to control NewYearListing visibility
  const [selectedYear, setSelectedYear] = useState(""); // State to track the year for NewYearListing

  useEffect(() => {
    fetchYears();
  }, []);

  const fetchYears = async () => {
    try {
      setLoading(true);
      const data = await GetAllYears();

      // Trier les années universitaires par ordre chronologique
      const sortedData = [...data].sort((a, b) => {
        // Extraire les années de début pour le tri
        const getStartYear = (yearStr) => {
          const match = yearStr.year.match(/^(\d{4})/);
          return match ? parseInt(match[1]) : 0;
        };

        return getStartYear(a) - getStartYear(b);
      });

      setYears(sortedData);
      setError(null);
    } catch (err) {
      setError("Failed to fetch university years");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddYearClick = () => {
    // Set the selected year using the new year input value or a default format
    const currentDate = new Date();
    const defaultYear = `${currentDate.getFullYear()}-${
      currentDate.getFullYear() + 1
    }`;
    setSelectedYear(newYear || defaultYear);
    setShowAddYear(true);
  };

  const handleBackFromNewYearListing = () => {
    setShowAddYear(false);
    fetchYears(); // Refresh years list when coming back from NewYearListing
  };

  const handleOpenNewYear = async (e) => {
    e.preventDefault();
    if (!newYear) {
      setError("Please enter a valid year");
      return;
    }

    try {
      setLoading(true);
      await OpenNewYear({ year: newYear });
      setSuccess("New university year created successfully");
      setNewYear("");
      fetchYears();
    } catch (err) {
      setError(err.response?.data || "Failed to create new university year");
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchYear = async (year) => {
    try {
      setLoading(true);
      await SwitchYear({ year });
      setSuccess(`Switched to university year ${year}`);
      fetchYears();
    } catch (err) {
      setError(err.response?.data || "Failed to switch university year");
    } finally {
      setLoading(false);
    }
  };

  // Clear messages after 3 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  // Render NewYearListing when showAddYear is true
  if (showAddYear) {
    return <NewYearListing onBack={handleBackFromNewYearListing} />;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">University Years Management</h1>

      {/* Alerts */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Years List */}
      <div className="bg-white shadow-md rounded px-10 pt-6 pb-18">
        {loading && !years.length ? (
          <p className="text-gray-600">Loading...</p>
        ) : years.length > 0 ? (
          <div className="overflow-x-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">University Years</h2>
              <button
                className="bg-gray-400 text-white p-2 rounded-full hover:bg-gray-500"
                onClick={handleAddYearClick}
                title="Add new academic year"
              >
                <FaPlus size={18} />
              </button>
            </div>
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {years.map((year) => (
                  <tr key={year._id}>
                    <td className="py-2 px-4 border-b border-gray-200">
                      {year.year}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      {year.current ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Current
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      {!year.current && (
                        <button
                          onClick={() => handleSwitchYear(year.year)}
                          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-1 px-3 rounded text-sm"
                          disabled={loading}
                        >
                          Switch to this year
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No university years found.</p>
        )}
      </div>
    </div>
  );
};

export default Season;
