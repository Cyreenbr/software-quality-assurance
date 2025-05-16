
import PropTypes from "prop-types";
import { useState } from "react";

const SubjectEvaluationForm = ({ onSubmit, onCancel }) => {
    const [rank, setRank] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!rank || !description.trim()) {
            alert("Both rank and description are required.");
            return;
        }

        onSubmit({ rank: parseInt(rank, 10), description: description.trim() });
        setRank("");
        setDescription("");
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-md p-6 w-full max-w-xl mx-auto space-y-4"
        >
            <h2 className="text-xl font-semibold text-gray-700">Evaluate Subject</h2>

            <div className="flex flex-col">
                <label htmlFor="rank" className="text-gray-600 mb-1">
                    Rank (1-5)
                </label>
                <select
                    id="rank"
                    value={rank}
                    onChange={(e) => setRank(e.target.value)}
                    required
                    className="border border-gray-300 rounded-md px-4 py-2"
                >
                    <option value="">Select a rank</option>
                    {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                            {num}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col">
                <label htmlFor="description" className="text-gray-600 mb-1">
                    Description
                </label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={4}
                    placeholder="Your feedback..."
                    className="border border-gray-300 rounded-md px-4 py-2"
                />
            </div>

            <div className="flex justify-end space-x-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Submit
                </button>
            </div>
        </form>
    );
};

SubjectEvaluationForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default SubjectEvaluationForm;
