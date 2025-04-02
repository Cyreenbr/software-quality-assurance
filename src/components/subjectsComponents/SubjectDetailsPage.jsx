import React, { useEffect, useRef, useState } from "react";
import {
    FaBook,
    FaCheck,
    FaChevronDown,
    FaChevronUp,
    FaHistory,
    FaTimes,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import matieresServices from "../../services/matieresServices/matieres.service";
import { RoleEnum } from "../../utils/userRoles";
import Popup from "../skillsComponents/Popup";

const SubjectDetailsPage = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedHistory, setSelectedHistory] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expandedChapters, setExpandedChapters] = useState({});
    const userRole = useSelector((state) => state.auth.role);

    // Ref to track if data has been fetched for the current ID
    const fetchRef = useRef(false);

    useEffect(() => {
        const fetchSubject = async () => {
            try {
                // Reset loading and error states
                setLoading(true);
                setError(null);

                // Check if data has already been fetched for this ID
                if (fetchRef.current && formData?.subject?._id === id) {
                    return;
                }

                // Fetch subject data
                const response = await matieresServices.fetchMatiereById(id);
                const { subject, history, historyPagination } = response;

                if (!subject || !subject.curriculum || !Array.isArray(subject.curriculum.chapitres)) {
                    throw new Error("Invalid subject data received from the server.");
                }

                // Update formData with the new structure
                setFormData({
                    subject: {
                        ...subject,
                        curriculum: {
                            ...subject.curriculum,
                            chapitres: subject.curriculum.chapitres.map((chapter) => ({
                                ...chapter,
                                sections: Array.isArray(chapter.sections) ? chapter.sections : [],
                            })),
                        },
                    },
                    history: Array.isArray(history) ? history : [],
                    historyPagination: historyPagination || null,
                });

                // Mark that data has been fetched for this ID
                fetchRef.current = true;
                console.log(response.message);

                // toast.success(response.message);
                setError(null);
            } catch (err) {
                toast.error(err.response?.message || "Failed to load subject data.");
                setError(err.message || "Failed to load subject data.");
            } finally {
                setLoading(false);
            }
        };

        // Call the fetch function
        fetchSubject();
    }, [formData?.subject?._id, id]); // Re-run effect only when `id` changes

    // Toggle chapter expand/collapse
    const toggleChapterExpand = (index) => {
        setExpandedChapters((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    // Toggle status for chapter
    const toggleChapterStatus = (index) => {
        setFormData((prevData) => {
            const updatedChapters = prevData.subject.curriculum.chapitres.map((chapter, i) =>
                i === index ? { ...chapter, status: !chapter.status } : chapter
            );

            return {
                ...prevData,
                subject: {
                    ...prevData.subject,
                    curriculum: {
                        ...prevData.subject.curriculum,
                        chapitres: updatedChapters,
                    },
                },
            };
        });
    };

    // Toggle status for section
    const toggleSectionStatus = (chapterIndex, sectionIndex) => {
        setFormData((prevData) => {
            const updatedChapters = prevData.subject.curriculum.chapitres.map((chapter, cIndex) => {
                if (cIndex === chapterIndex) {
                    const updatedSections = chapter.sections.map((section, sIndex) =>
                        sIndex === sectionIndex ? { ...section, status: !section.status } : section
                    );
                    return { ...chapter, sections: updatedSections };
                }
                return chapter;
            });

            return {
                ...prevData,
                subject: {
                    ...prevData.subject,
                    curriculum: {
                        ...prevData.subject.curriculum,
                        chapitres: updatedChapters,
                    },
                },
            };
        });
    };

    if (loading) return <LoadingState message="Loading subject details..." />;
    if (error) return <ErrorState message={error} />;
    if (!formData) return <ErrorState message="Invalid subject data." />;

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <form className="w-full max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-8 space-y-8">
                {/* Header */}
                <header className="text-center mb-4">
                    <h1 className="text-3xl font-bold text-blue-800 flex items-center justify-center gap-2">
                        <FaBook className="text-blue-600" /> {formData.subject.title}
                    </h1>
                </header>

                {/* Subject Information */}
                <Section title="Subject Details">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <InfoCard label="Module" value={formData.subject.curriculum?.module || "N/A"} />
                        <InfoCard label="Level" value={formData.subject.curriculum?.level || "N/A"} />
                        <InfoCard label="Code" value={formData.subject.curriculum?.code || "N/A"} />
                        <InfoCard label="Semester" value={formData.subject.curriculum?.semestre || "N/A"} />
                        <InfoCard label="Responsible" value={formData.subject.curriculum?.responsable || "N/A"} />
                        <InfoCard label="Language" value={formData.subject.curriculum?.langue || "N/A"} />
                        <InfoCard label="Relation" value={formData.subject.curriculum?.relation || "N/A"} />
                        <InfoCard label="Teaching Type" value={formData.subject.curriculum?.type_enseignement || "N/A"} />
                        <InfoCard label="Total Hours" value={formData.subject.curriculum?.volume_horaire_total || "N/A"} />
                        <InfoCard label="Credits" value={formData.subject.curriculum?.credit || "N/A"} />
                        <InfoCard
                            label="Prerequisites"
                            value={formData.subject.curriculum?.prerequis_recommandes?.join(", ") || "None"}
                        />
                    </div>
                </Section>

                {/* Chapters List */}
                <Section title="Chapters">
                    {formData.subject.curriculum.chapitres.length > 0 ? (
                        <div className="space-y-4">
                            {formData.subject.curriculum.chapitres.map((chapter, index) => (
                                <div key={index} className="border rounded-lg p-4 bg-gray-50 shadow-sm">
                                    {/* Chapter Header */}
                                    <div
                                        className="flex justify-between items-center cursor-pointer"
                                        onClick={() => toggleChapterExpand(index)}
                                    >
                                        <h3 className="text-lg font-semibold flex items-center gap-2">
                                            {chapter.title || `Chapter ${index + 1}`}{" "}
                                            {chapter.status ? (
                                                <FaCheck className="text-green-500" />
                                            ) : (
                                                <FaTimes className="text-red-500" />
                                            )}
                                        </h3>
                                        {expandedChapters[index] ? (
                                            <FaChevronUp className="text-gray-600" />
                                        ) : (
                                            <FaChevronDown className="text-gray-600" />
                                        )}
                                    </div>

                                    {/* Chapter Status Checkbox */}
                                    <div className="flex items-center mt-2">
                                        <input
                                            type="checkbox"
                                            checked={chapter.status}
                                            onChange={() => toggleChapterStatus(index)}
                                            className="mr-2 w-4 h-4 text-green-500 focus:ring-green-400 rounded"
                                        />
                                        <label className="text-sm text-gray-700">Mark as complete</label>
                                    </div>

                                    {/* Sections (if expanded) */}
                                    {expandedChapters[index] && chapter.sections.length > 0 && (
                                        <ul className="mt-3 pl-4 border-l-2 border-gray-300 space-y-2">
                                            {chapter.sections.map((section, sIndex) => (
                                                <li
                                                    key={sIndex}
                                                    className="flex justify-between items-center text-gray-700 text-sm"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span>
                                                            🔹 {section.title || `Section ${sIndex + 1}`}{" "}
                                                            {section.status ? (
                                                                <FaCheck className="text-green-500" />
                                                            ) : (
                                                                <FaTimes className="text-red-500" />
                                                            )}
                                                        </span>
                                                    </div>
                                                    {/* Section Status Checkbox */}
                                                    <input
                                                        type="checkbox"
                                                        checked={section.status}
                                                        onChange={() => toggleSectionStatus(index, sIndex)}
                                                        className="ml-2 w-4 h-4 text-green-500 focus:ring-green-400 rounded"
                                                    />
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState message="No chapters available." />
                    )}
                </Section>

                {/* Skills */}
                <Section title="Skills">
                    {formData.subject.skillsId.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {formData.subject.skillsId.map((skill, index) => (
                                <SkillCard
                                    key={index}
                                    title={skill.title}
                                    families={skill.familyId.map((family) => family.title)}
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyState message="No skills available." />
                    )}
                </Section>

                {/* History (Only for non-students) */}
                {userRole !== RoleEnum.STUDENT && (
                    <Section title="History" icon={<FaHistory className="text-gray-500" />}>
                        {formData.history.length > 0 ? (
                            <ul className="list-none text-gray-700 space-y-2">
                                {formData.history.map((historyItem, index) => (
                                    <li
                                        key={index}
                                        onClick={() => {
                                            setSelectedHistory(historyItem);
                                            setIsModalOpen(true);
                                        }}
                                        className="cursor-pointer hover:bg-gray-200 p-2 rounded-md transition-colors flex justify-between items-center"
                                    >
                                        <span className="flex items-center gap-2">
                                            <strong>{historyItem.title}</strong> -{" "}
                                            {new Date(historyItem.modifiedAt).toLocaleString()}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <EmptyState message="No history available" />
                        )}
                    </Section>
                )}

                {/* History Popup */}
                {isModalOpen && selectedHistory && (
                    <Popup
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        title="History Details"
                        position="center"
                        showCloseButton={true}
                        closeButtonStyle="absolute top-2 right-2 text-gray-600 hover:text-gray-900 cursor-pointer"
                        zindex="z-50"
                        styles="bg-white w-full max-w-3xl p-6 rounded-lg shadow-lg"
                    >
                        <div className="space-y-4">
                            <DetailRow label="Title" value={selectedHistory.title} />
                            <DetailRow
                                label="Modified At"
                                value={new Date(selectedHistory.modifiedAt).toLocaleString()}
                            />
                            <DetailRow
                                label="Teachers"
                                value={
                                    selectedHistory.teacherId
                                        .map((t) => `${t.firstName} ${t.lastName} (${t.email})`)
                                        .join(", ") || "None"
                                }
                            />
                            <DetailRow
                                label="Skills"
                                value={
                                    selectedHistory.skillsId
                                        .map((s) =>
                                            `${s.title} (${s.familyId.map((f) => f.title).join(", ")})`
                                        )
                                        .join(", ") || "None"
                                }
                            />
                        </div>
                    </Popup>
                )}
            </form>
        </div>
    );
};

// Helper Components
const Section = ({ title, icon, children }) => (
    <section className="p-6 border-b border-gray-200 last:border-none">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4 gap-2">
            {icon && <span>{icon}</span>}
            {title}
        </h2>
        {children}
    </section>
);

const InfoCard = ({ label, value }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <p className="text-sm font-semibold text-gray-700">{label}</p>
        <p className="text-gray-600">{value}</p>
    </div>
);

const SkillCard = ({ title, families }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <p className="text-sm font-semibold text-gray-700">{title}</p>
        <ul className="text-gray-600 text-xs mt-2 space-y-1">
            {families.map((family, index) => (
                <li key={index}>• {family}</li>
            ))}
        </ul>
    </div>
);

const EmptyState = ({ message }) => (
    <p className="text-sm text-gray-500 text-center py-4">{message}</p>
);

const ErrorState = ({ message }) => (
    <p className="text-red-600 text-center py-4">{message}</p>
);

const LoadingState = ({ message }) => (
    <p className="text-blue-600 text-center py-4">{message}</p>
);
const DetailRow = ({ label, value }) => (
    <div>
        <p className="font-semibold text-gray-700">{label}:</p>
        <p className="text-gray-600">{value}</p>
    </div>
);
export default SubjectDetailsPage;