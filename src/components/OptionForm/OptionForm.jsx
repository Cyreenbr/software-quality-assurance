import React, { useState } from "react";
import { chooseOption } from "../../services/OptionServices/option.service";

export default function OptionForm() {
  const [firstchoice, setFirstChoice] = useState("INLOG");
  const [moy_general_1ING, setMoyGeneral1ING] = useState("");
  const [moy_algo_complexité, setMoyAlgoComplexite] = useState("");
  const [moy_POO, setMoyPOO] = useState("");
  const [moy_programmation_web, setMoyProgrammationWeb] = useState("");
  const [statut, setStatut] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateMoyennes = () => {
    const moyennes = [
      moy_general_1ING,
      moy_algo_complexité,
      moy_POO,
      moy_programmation_web,
    ];
    for (let value of moyennes) {
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue < 1 || numValue > 20) {
        setError("All averages must be between 1 and 20.");
        setLoading(false);
        return false;
      }
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateMoyennes()) return;
    setLoading(true);
    if (
      !firstchoice ||
      !moy_general_1ING ||
      !moy_algo_complexité ||
      !moy_POO ||
      !moy_programmation_web
    ) {
      alert("Please fill in all fields.");
      setLoading(false);
      return;
    }
    setStatut("validé");
    const optionData = {
      firstchoice,
      moy_general_1ING,
      moy_algo_complexité,
      moy_POO,
      moy_programmation_web,
      statut,
    };
    try {
      const response = await chooseOption(optionData);
      console.log("Option choice sent:", response);
    } catch (error) {
      console.error("Error sending option choice:", error);
      alert(error);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow rounded">
        <h1 className="text-2xl font-bold text-center mb-6">
          Choose Your Option
        </h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="firstChoice"
              className="block text-sm font-medium text-gray-700"
            >
              First Choice
            </label>
            <select
              id="firstChoice"
              name="firstChoice"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={firstchoice}
              onChange={(e) => setFirstChoice(e.target.value)}
            >
              <option value="INREV">Réalité Virtuelle</option>
              <option value="INLOG">Génie Logiciel</option>
            </select>
            <label
              htmlFor="moygen"
              className="block text-sm font-medium text-gray-700"
            >
              Your general average in your 1st year ING
            </label>
            <input
              type="number"
              step="0.01"
              id="moygen"
              name="moy_general_1ING"
              value={moy_general_1ING}
              onChange={(e) => setMoyGeneral1ING(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your general average in your 1st year ING"
              required
            />
            <label
              htmlFor="moy_algo_complexité"
              className="block text-sm font-medium text-gray-700"
            >
              Your average in algorithm and complexity
            </label>
            <input
              type="number"
              step="0.01"
              id="moy_algo_complexité"
              name="moy_algo_complexité"
              value={moy_algo_complexité}
              onChange={(e) => setMoyAlgoComplexite(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your average in algorithm and complexity"
              required
            />
            <label
              htmlFor="moy_POO"
              className="block text-sm font-medium text-gray-700"
            >
              Your average in programming oriented object
            </label>
            <input
              type="number"
              step="0.01"
              id="moy_POO"
              name="moy_POO"
              value={moy_POO}
              onChange={(e) => setMoyPOO(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your average in programming oriented object"
              required
            />
            <label
              htmlFor="moy_programmation_web"
              className="block text-sm font-medium text-gray-700"
            >
              Your average in web programming
            </label>
            <input
              type="number"
              step="0.01"
              id="moy_programmation_web"
              name="moy_programmation_web"
              value={moy_programmation_web}
              onChange={(e) => setMoyProgrammationWeb(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your average in web programming"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
