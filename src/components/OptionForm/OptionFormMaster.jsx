import React, { useState } from "react";
import { chooseOption } from "../../services/OptionServices/option.service";
import { toast } from "react-toastify";
export default function OptionFormMaster() {
  const [firstchoice, setFirstChoice] = useState("INLOG");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!firstchoice) {
      toast.error("Please choose your orientation.");
      setLoading(false);
      return;
    }
    try {
      const response = await chooseOption({ firstchoice });
      console.log("Option choice sent:", response);
      toast.success("Option chosen successfully!");
    } catch (error) {
      console.error("Error sending option choice:", error);
      if (error.response?.status === 500) {
        toast.error("You already did chose your option.");
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow rounded">
        <h1 className="text-2xl font-bold text-center mb-6">
          Choose Your Option
        </h1>
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
