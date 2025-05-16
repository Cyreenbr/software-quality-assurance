import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import PageLayout from "../../components/skillsComponents/PageLayout";
import StarRating from "../../components/subjectsComponents/StarRating";
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
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false); // Ajout d'un état pour éviter des toasts multiples

    useEffect(() => {
        let isMounted = true;

        // ✅ Reset des valeurs à chaque (re)montage
        setEvaluation(initialCriteria);
        setAdditionalComment("");

        const init = async () => {
            try {
                if (!subjectId) throw new Error("Invalid subject ID");
                await matieresServices.checkEvaluatedStudentMatiere(subjectId);
                const { subject } = await matieresServices.fetchMatiereById(subjectId);
                if (isMounted) {
                    setTitle(subject.title);
                }
            } catch (err) {
                if (!hasError) {
                    toast.error(err.message || "You cannot evaluate this subject.");
                    setHasError(true);
                    navigate(-1);
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        init();

        return () => {
            isMounted = false;
        };
    }, [subjectId, navigate, hasError]);


    const handleRemoveCriterion = (index) => {
        if (index < 5) return; // Prevent deletion of default criteria
        const updated = evaluation.filter((_, i) => i !== index);
        setEvaluation(updated);
    };

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
        setEvaluation([...evaluation, { description: "", rank: 0 }]);
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

    if (isLoading) {
        return <PageLayout title="Loading..."><div className="text-center p-6">Checking evaluation rights...</div></PageLayout>;
    }

    return (
        <PageLayout title={`Evaluation Form for ${title}`}>
            <div className="max-w-3xl mx-auto p-6   space-y-6">
                {evaluation.map((item, index) => (
                    <div key={index} className="space-y-2 relative border border-gray-200 p-4 rounded-lg bg-gray-50">
                        {index < 5 ? (
                            <label className="block font-medium text-gray-800">{item.description}</label>
                        ) : (
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={item.description}
                                    onChange={(e) => handleDescriptionChange(index, e.target.value)}
                                    placeholder={`Criterion ${index + 1} description`}
                                    className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-blue-400"
                                />
                                <button
                                    onClick={() => handleRemoveCriterion(index)}
                                    className="text-red-600 hover:text-red-800 text-xl"
                                    title="Remove this criterion"
                                >
                                    &times;
                                </button>
                            </div>
                        )}
                        <StarRating
                            value={item.rank}
                            onChange={(value) => handleRankChange(index, value)}
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
