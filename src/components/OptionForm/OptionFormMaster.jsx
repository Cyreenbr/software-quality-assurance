import React, { useState } from "react";

export default function OptionFormMaster() {
  const [score, setScore] = useState("");
  const [firstChoice, setFirstChoice] = useState("INLOG");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateMoyennes()) return;
    setLoading(true);
    console.log("submit");
    if (!firstChoice || !score) {
      alert("Please fill in all fields.");
      setLoading(false);
      return;
    }
    const optionData = {
      firstChoice,
      score,
    };

    console.log(optionData);
    console.log(chooseOption);
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
              value={firstChoice}
              onChange={(e) => setFirstChoice(e.target.value)}
            >
              <option value="INREV">Réalité Virtuelle</option>
              <option value="INLOG">Génie Logiciel</option>
            </select>
            <label
              htmlFor="moygen"
              className="block text-sm font-medium text-gray-700"
            >
              Your Score
            </label>
            <input
              type="number"
              step="0.01"
              id="score"
              name="score"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your general average in your 1st year ING"
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
