import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import PageLayout from "../../components/skillsComponents/PageLayout";
import matieresServices from "../../services/matieresServices/matieres.service";

const initialCriteria = [
    { description: "Clarity of explanations", rank: 0 },
    { description: "Subject mastery", rank: 0 },
    { description: "Interaction with students", rank: 0 },
    { description: "Use of teaching materials", rank: 0 },
    { description: "Time management", rank: 0 },
];

const EvaluationFormPage = () => {
    const { id: subjectId } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [evaluation, setEvaluation] = useState(initialCriteria);
    const [additionalComment, setAdditionalComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Step 1: Check if user can evaluate first
    useEffect(() => {
        const checkIfEvaluated = async () => {
            try {
                // This will throw if user cannot evaluate
                await matieresServices.checkEvaluatedStudentMatiere(subjectId);
                // Only fetch the subject if the user can evaluate
                const { subject } = await matieresServices.fetchMatiereById(subjectId);
                setTitle(subject.title);
            } catch (err) {
                // If user cannot evaluate, show error and redirect
                toast.error(err.message || "You cannot evaluate this subject.");
                navigate(-1); // Redirect to previous page
            }
        };

        if (subjectId) {
            checkIfEvaluated();
        }
    }, [subjectId, navigate]);

    const handleRankChange = (index, value) => {
        const updated = [...evaluation];
        updated[index].rank = Math.max(1, Math.min(5, Number(value)));
        setEvaluation(updated);
    };

    const handleDescriptionChange = (index, value) => {
        const updated = [...evaluation];
        updated[index].description = value;
        setEvaluation(updated);
    };

    const handleCommentChange = (e) => {
        setAdditionalComment(e.target.value.slice(0, 300));
    };

    const handleAddCriterion = () => {
        setEvaluation([
            ...evaluation,
            { description: "", rank: 0 }
        ]);
    };

    const handleSubmit = async () => {
        if (!subjectId) return toast.error("Subject ID is missing.");

        if (evaluation.some((e, idx) => idx >= 5 && !e.description.trim())) {
            return toast.error("Each added criterion must have a description.");
        }

        if (evaluation.some(e => e.rank < 1 || e.rank > 5)) {
            return toast.error("All criteria must be rated from 1 to 5.");
        }

        try {
            setIsSubmitting(true);
            const res = await matieresServices.evaluateMatiere(subjectId, evaluation, additionalComment);
            toast.success(res.message || "Evaluation submitted successfully!");
            navigate("/subjects");
        } catch (error) {
            toast.error(error?.message || error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <PageLayout title={`Evaluation Form for ${title}`}>
            <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow space-y-6">
                {evaluation.map((item, index) => (
                    <div key={index} className="space-y-2">
                        {index < 5 ? (
                            <label className="block font-medium text-gray-800">{item.description}</label>
                        ) : (
                            <input
                                type="text"
                                value={item.description}
                                onChange={(e) => handleDescriptionChange(index, e.target.value)}
                                placeholder={`Criterion ${index + 1} description`}
                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-blue-400"
                            />
                        )}
                        <input
                            type="number"
                            min={1}
                            max={5}
                            value={item.rank}
                            onChange={(e) => handleRankChange(index, e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-blue-400"
                            placeholder="Rank from 1 to 5"
                        />
                    </div>
                ))}

                <button
                    onClick={handleAddCriterion}
                    className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                >
                    + Add Criterion
                </button>

                <div className="space-y-1 pt-4">
                    <label className="block font-medium text-gray-800">Additional Comments (optional)</label>
                    <textarea
                        value={additionalComment}
                        onChange={handleCommentChange}
                        rows={4}
                        maxLength={300}
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-blue-400"
                        placeholder="Share any feedback, suggestions, or thoughts..."
                    />
                    <div className="text-sm text-gray-500 text-right">{additionalComment.length}/300</div>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`w-full py-2 px-4 text-white rounded-md transition ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                        }`}
                >
                    {isSubmitting ? "Submitting..." : "Submit Evaluation"}
                </button>
            </div>
        </PageLayout>
    );
};

export default EvaluationFormPage;
