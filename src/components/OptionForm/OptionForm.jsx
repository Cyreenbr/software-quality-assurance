import React, { useState } from "react";
import { chooseOption } from "../../services/OptionServices/option.service";
import Swal from "sweetalert2";
export default function OptionForm() {
  const [firstchoice, setFirstChoice] = useState("INLOG");
  const [moy_general_1ING, setMoyGeneral1ING] = useState("");
  const [moy_algo_complexite, setMoyAlgoComplexite] = useState("");
  const [moy_POO, setMoyPOO] = useState("");
  const [moy_programmation_web, setMoyProgrammationWeb] = useState("");
  const [statut, setStatut] = useState("validé");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const validateMoyennes = () => {
    const moyennes = [
      moy_general_1ING,
      moy_algo_complexite,
      moy_POO,
      moy_programmation_web,
    ];
    for (let value of moyennes) {
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue < 1 || numValue > 20) {
        setError("All averages must be between 1 and 20.");
        return false;
      }
    }
    setError("");
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!validateMoyennes()) {
      setLoading(false);
      return;
    }
    if (
      !firstchoice ||
      !moy_general_1ING ||
      !moy_algo_complexite ||
      !moy_POO ||
      !moy_programmation_web
    ) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }
    const optionData = {
      firstchoice,
      moy_general_1ING,
      moy_algo_complexite,
      moy_POO,
      moy_programmation_web,
      statut,
    };
    try {
      const response = await chooseOption(optionData);
      console.log("Option choice sent:", response);
      Swal.fire({
        title: "Success",
        text: "Option chosen successfully!",
        icon: "success",
      });
    } catch (error) {
      console.error("Error sending option choice:", error);
      Swal.fire({
        title: "Error",
        text: "Error sending option choice. Please try again.",
        icon: "error",
      });
      // Handle backend errors
      if (error.response) {
        const { status, data } = error.response;

        if (status === 404 && data.message === "Utilisateur non trouvé") {
          setError("User not found. Please log in again.");
        } else if (
          status === 403 &&
          data.message.includes("période de choix")
        ) {
          setError(data.message);
        } else if (
          status === 400 &&
          data.message === "Erreur de validation des données"
        ) {
          setError(
            "Data validation error: " +
              (data.error ? data.error.join(", ") : "")
          );
        } else if (status === 500) {
          if (data.error && data.error.includes("duplicate key")) {
            setError("You have already chosen your option.");
          } else {
            setError("An internal server error occurred: " + data.message);
          }
        } else {
          setError(data.message || "An error occurred. Please try again.");
        }
      } else {
        setError("Network error. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-2xl p-16 bg-white shadow-xl rounded">
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
              Your First Choice
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
          </div>

          <div className="mb-4">
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
          </div>

          <div className="mb-4">
            <label
              htmlFor="moy_algo_complexite"
              className="block text-sm font-medium text-gray-700"
            >
              Your average in algorithm and complexity
            </label>
            <input
              type="number"
              step="0.01"
              id="moy_algo_complexite"
              name="moy_algo_complexite"
              value={moy_algo_complexite}
              onChange={(e) => setMoyAlgoComplexite(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your average in algorithm and complexity"
              required
            />
          </div>

          <div className="mb-4">
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
          </div>

          <div className="mb-4">
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
