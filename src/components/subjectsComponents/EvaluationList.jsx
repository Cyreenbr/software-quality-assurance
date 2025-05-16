import { useEffect, useState } from "react";
import {
    FaArrowLeft,
    FaInfoCircle,
    FaRegCommentDots,
    FaRegStar,
    FaStar,
    FaStarHalfAlt
} from "react-icons/fa";
import { FiCheckCircle } from "react-icons/fi";
import { ClipLoader } from "react-spinners";
import matieresServices from "../../services/matieresServices/matieres.service";
import humanizeDate from "../../utils/humanizeDate";

const getRankColor = (rank) => {
    if (rank >= 4.1) return "text-green-600";
    if (rank >= 2.6) return "text-yellow-600";
    return "text-red-500";
};
const getRankBgColor = (rank) => {
    if (rank >= 4.5) return "bg-green-100";
    if (rank >= 3.5) return "bg-yellow-100";
    if (rank >= 2.5) return "bg-orange-100";
    if (rank >= 1.5) return "bg-red-100";
    return "bg-gray-100";
};

const getRankMessage = (rank) => {
    if (rank >= 4.6) return "Excellent";
    if (rank >= 4.1) return "Very Good";
    if (rank >= 3) return "Good";
    if (rank >= 2) return "Okay";
    return "Not Satisfied";
};

const renderStars = (rank) => {
    const stars = [];
    const fullStars = Math.floor(rank);
    const halfStar = rank % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
        stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    }
    if (halfStar) {
        stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    }
    for (let i = 0; i < emptyStars; i++) {
        stars.push(<FaRegStar key={`empty-${i}`} className="text-gray-300" />);
    }
    return stars;
};

const EvaluationList = ({ subjectId, showHeader = false }) => {
    const [evaluations, setEvaluations] = useState([]);
    const [subject, setSubject] = useState(null);
    const [selectedEval, setSelectedEval] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchEvaluations = async () => {
            try {
                const data = await matieresServices.getEvaluationsBySubject(subjectId);
                setEvaluations(data.evaluations || []);
                setSubject(data.subject);
            } catch (err) {
                setError(err.toString());
            } finally {
                setLoading(false);
            }
        };
        fetchEvaluations();
    }, [subjectId]);

    const calculateSummary = () => {
        const totalEvaluations = evaluations.length;
        const allRanks = evaluations.flatMap((e) => e.evaluation.map((v) => v.rank));
        const avgRank = allRanks.length ? (allRanks.reduce((a, b) => a + b, 0) / allRanks.length).toFixed(2) : "-";
        return { totalEvaluations, avgRank };
    };

    const { totalEvaluations, avgRank } = calculateSummary();

    return (
        <div className="p-6 bg-white rounded-xl max-w-3xl mx-auto">
            {!selectedEval ? (
                <>
                    {showHeader &&
                        <h2 className="text-2xl font-bold text-blue-800 mb-4 text-center flex items-center justify-center  ">
                            <FiCheckCircle className="text-2xl" /> List of Evaluations for this Subject
                        </h2>
                        // <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                        //     <FaListUl className="text-blue-500" /> Evaluation List
                        // </h2>
                    }

                    {loading ? (
                        <div className="flex flex-col items-center justify-center gap-2 text-gray-500 py-6">
                            <p>Loading...</p>
                            <ClipLoader size={35} color="#3B82F6" />
                        </div>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : (
                        <>
                            <div className="mb-6 flex flex-col items-center text-center">
                                <p className="text-xl font-bold text-gray-800">
                                    <strong>Subject:</strong> {subject?.title}
                                </p>
                                <div className="text-gray-700 space-y-2 mt-3">
                                    <p className="flex items-center gap-2 justify-center text-lg font-semibold">
                                        <FaStar className="text-yellow-500 text-xl" />
                                        Average rating:
                                        <span className={`ml-1 font-bold text-xl ${getRankColor(avgRank)}`}>
                                            {avgRank}
                                        </span>
                                    </p>
                                    <p className="flex items-center gap-2 justify-center text-lg font-semibold">
                                        <FaRegCommentDots className="text-blue-500 text-lg" />
                                        Total: <strong>{totalEvaluations}</strong> evaluation(s)
                                    </p>
                                </div>
                            </div>


                            <ul className="space-y-4">
                                {evaluations.map((evalItem, idx) => (
                                    <li
                                        key={idx}
                                        className="border border-gray-200 p-4 rounded-lg hover:shadow-md transition duration-200 cursor-pointer bg-gray-50"
                                        onClick={() => setSelectedEval(evalItem)}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="text-md font-medium text-gray-800 flex items-center gap-2">
                                                    <FaInfoCircle className="text-blue-500" />
                                                    Evaluation #{idx + 1}
                                                </h3>
                                                <p className="text-gray-600 text-sm mt-1">
                                                    Comment: {evalItem.comment || "None"}
                                                </p>
                                            </div>
                                            <p className="text-sm text-gray-400">
                                                {humanizeDate(evalItem.createdAt, true)}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </>
            ) : (
                <>
                    <button
                        className="mb-4 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-2"
                        onClick={() => setSelectedEval(null)}
                    >
                        <FaArrowLeft />
                        Back to list
                    </button>

                    <div className="bg-white rounded-2xl p-5">
                        <h3 className="text-2xl font-extrabold mb-5 flex items-center gap-2 text-blue-700">
                            <FaInfoCircle className="text-3xl" />
                            Evaluation Details
                        </h3>

                        <div className="space-y-6">
                            {selectedEval.evaluation.map((item, index) => (
                                <div
                                    key={index}
                                    className={`flex flex-col sm:flex-row justify-between sm:items-center border-b pb-1 px-3 py-2 rounded-lg ${getRankBgColor(item.rank)}`}
                                >
                                    <span className="text-lg font-medium text-gray-800">{item.description}</span>
                                    <div className="flex flex-col sm:items-end mt-3 sm:mt-0">
                                        <div className="flex gap-1">
                                            {renderStars(item.rank)}
                                        </div>
                                        <span className={`text-sm mt-1 font-semibold ${getRankColor(item.rank)}`}>
                                            {item.rank} / 5 - {getRankMessage(item.rank)}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            <div className="mt-6 p-4 bg-gray-50 rounded-md">
                                <p className="text-gray-700 font-semibold text-lg mb-1 flex items-center gap-2">
                                    <FaRegCommentDots className="text-blue-400" />
                                    Comment
                                </p>
                                <p className="text-gray-600 italic">{selectedEval.comment || "No comment provided."}</p>
                            </div>

                            <p className="text-sm text-gray-500 mt-4 text-right">
                                Added on: {humanizeDate(selectedEval.createdAt, true)}
                            </p>
                        </div>
                    </div>


                </>
            )}
        </div>
    );
};

export default EvaluationList;
