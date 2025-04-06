import React, { useEffect, useRef, useState } from "react";
import {
    FaBook,
    FaCalendarAlt,
    FaCheck,
    FaChevronDown,
    FaChevronUp,
    FaHistory,
    FaTimes,
} from "react-icons/fa";
import { MdTitle } from "react-icons/md";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import matieresServices from "../../services/matieresServices/matieres.service";
import humanizeDate from "../../utils/humanizeDate";
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
    const userId = useSelector((state) => state.auth.user.id);


    const [completedAtDates, setCompletedAtDates] = useState({}); // Store completedAt dates
    const fetchRef = useRef(false);

    useEffect(() => {
        const fetchSubject = async () => {
            try {
                setLoading(true);
                setError(null);

                if (fetchRef.current && formData?.subject?._id === id) return;

                const response = await matieresServices.fetchMatiereById(id);
                const { subject, history, historyPagination } = response;

                if (!subject || !subject.curriculum || !Array.isArray(subject.curriculum.chapitres)) {
                    throw new Error("Invalid subject data received from the server.");
                }

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

                fetchRef.current = true;
                console.log(response.message);
            } catch (err) {
                toast.error(err.response?.message || "Failed to load subject data.");
                setError(err.message || "Failed to load subject data.");
            } finally {
                setLoading(false);
            }
        };

        fetchSubject();
    }, [formData?.subject?._id, id]);

    const toggleChapterExpand = (index) => {
        setExpandedChapters((prev) => ({ ...prev, [index]: !prev[index] }));
    };

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

    if (loading)
        return (
            <div className="flex justify-center items-center h-screen text-center">
                <div>
                    <ClipLoader size={50} color="#3B82F6" />
                    <p className="mt-4 font-bold text-gray-700">Loading subject details...</p>
                </div>
            </div>
        );

    if (error) return <ErrorState message={error} />;
    if (!formData) return <ErrorState message="Invalid subject data." />;
    const handleDateChange = (type, index, sectionIndex = null, date) => {
        setCompletedAtDates((prev) => {
            if (type === "chapter") {
                return { ...prev, [`chapter-${index}`]: date };
            } else if (type === "section") {
                return { ...prev, [`section-${index}-${sectionIndex}`]: date };
            }
            return prev;
        });
    };

    const handleSubmit = async () => {
        try {
            // Étape 1 : Mise à jour des dates dans les chapitres et sections
            const updatedChapters = formData.subject.curriculum.chapitres.map((chapter, cIndex) => {
                const chapterKey = `chapter-${cIndex}`;

                // Si le chapitre est marqué comme sélectionné, et qu'il n'a pas de date, mettre à jour avec la date actuelle
                const updatedChapter = {
                    ...chapter,
                    completedAt: chapter.status && !completedAtDates[chapterKey]
                        ? new Date().toISOString().split('T')[0]  // Date actuelle (format yyyy-mm-dd)
                        : completedAtDates[chapterKey] || chapter.completedAt,
                    sections: chapter.sections.map((section, sIndex) => {
                        const sectionKey = `section-${cIndex}-${sIndex}`;

                        // Si la section est marquée comme sélectionnée, et qu'elle n'a pas de date, mettre à jour avec la date actuelle
                        return {
                            ...section,
                            completedAt: section.status && !completedAtDates[sectionKey]
                                ? new Date().toISOString().split('T')[0]  // Date actuelle (format yyyy-mm-dd)
                                : completedAtDates[sectionKey] || section.completedAt,
                        };
                    }),
                };
                return updatedChapter;
            });

            // Étape 2 : Construction du payload complet
            const payload = {
                curriculum: {
                    ...formData.subject.curriculum,
                    chapitres: updatedChapters,
                },
            };

            console.log("Payload envoyé au backend :", payload);
            payload._id = id;

            // Étape 3 : Appel au service avec l’ID de la matière
            await matieresServices.updateMatiereAvancement(payload);

            toast.success("Subject details updated successfully!");

            // Facultatif : mettre à jour l’état local
            setFormData({
                ...formData,
                subject: {
                    ...formData.subject,
                    curriculum: {
                        ...formData.subject.curriculum,
                        chapitres: updatedChapters,
                    },
                },
            });

        } catch (err) {
            console.error("Erreur lors de la mise à jour :", err);
            toast.error("Échec de la mise à jour de la matière.");
            toast.error(err.message || err);
        }
    };

    if (loading)
        return (
            <div className="flex justify-center items-center h-screen text-center">
                <div>
                    <ClipLoader size={50} color="#3B82F6" />
                    <p className="mt-4 font-bold text-gray-700">Loading subject details...</p>
                </div>
            </div>
        );
    if (error) return <ErrorState message={error} />;
    if (!formData) return <ErrorState message="Invalid subject data." />;
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8 space-y-8">
                {/* Header */}
                <header className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-blue-800 flex items-center justify-center gap-2">
                        <FaBook className="text-3xl text-blue-600" /> {formData.subject.title}
                    </h1>
                    <p className="text-sm text-gray-600">{humanizeDate(formData.subject.createdAt)}</p>
                </header>

                {/* Subject Overview */}
                <Section title="Overview">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <InfoCard label="Module" value={formData.subject.curriculum?.module || "N/A"} />
                        <InfoCard label="Level" value={formData.subject.curriculum?.level || "N/A"} />
                        <InfoCard
                            label="Teacher"
                            value={
                                formData.subject.teacherId
                                    ? formData.subject.teacherId
                                        .map((teacher) => `${teacher.firstName} ${teacher.lastName} (${teacher.email})`)
                                        .join(", ")
                                    : "N/A"
                            }
                        />
                        <InfoCard label="Semester" value={formData.subject.curriculum?.semestre || "N/A"} />
                        <InfoCard label="Responsible" value={formData.subject.curriculum?.responsable || "N/A"} />
                        <InfoCard label="Language" value={formData.subject.curriculum?.langue || "N/A"} />
                        <InfoCard label="Total Hours" value={formData.subject.curriculum?.volume_horaire_total || "N/A"} />
                        <InfoCard label="Credits" value={formData.subject.curriculum?.credit || "N/A"} />
                        <InfoCard label="Code" value={formData.subject.curriculum?.code || "N/A"} />
                        <InfoCard label="Relation" value={formData.subject.curriculum?.relation || "N/A"} />
                        <InfoCard label="Teaching Type" value={formData.subject.curriculum?.type_enseignement || "N/A"} />
                        <InfoCard
                            label="Prerequisites"
                            value={formData.subject.curriculum?.prerequis_recommandes?.join(", ") || "None"}
                        />
                    </div>
                </Section>


                <Section title="Chapters & Sections">
                    {formData.subject.curriculum.chapitres.length > 0 ? (
                        <div className="space-y-6">
                            {formData.subject.curriculum.chapitres.map((chapter, index) => {
                                const chapterKey = `chapter-${index}`;
                                const isCompleted = chapter.status;
                                const completedAt = completedAtDates[chapterKey] || chapter.completedAt;

                                return (
                                    <div
                                        key={index}
                                        className={`border rounded-2xl p-5 shadow-md transition-colors duration-200 ${isCompleted ? "bg-green-50 border-green-300" : "bg-white"
                                            }`}
                                    >
                                        {/* Chapter Header */}
                                        <div
                                            className="flex justify-between items-center cursor-pointer"
                                            onClick={() => toggleChapterExpand(index)}
                                        >
                                            <h3 className={`text-xl font-semibold flex items-center gap-2 ${isCompleted ? "text-green-800" : "text-gray-800"}`}>
                                                {chapter.title || `Chapter ${index + 1}`}
                                                {isCompleted ? (
                                                    <FaCheck className="text-green-500" />
                                                ) : (
                                                    <FaTimes className="text-red-500" />
                                                )}
                                            </h3>
                                            {expandedChapters[index] ? (
                                                <FaChevronUp className="text-gray-500" />
                                            ) : (
                                                <FaChevronDown className="text-gray-500" />
                                            )}
                                        </div>

                                        {/* Chapter Status Checkbox */}
                                        {(userRole === RoleEnum.ADMIN || userId === formData?.teacherId) && (
                                            <div className="flex items-center mt-3 gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={chapter.status}
                                                    onChange={() => toggleChapterStatus(index)}
                                                    className="w-5 h-5 text-green-600 border-gray-300 focus:ring-green-500 rounded"
                                                    aria-label={`Mark Chapter ${index + 1} as complete`}
                                                />
                                                <label className="text-sm text-gray-700">Mark as complete</label>
                                            </div>
                                        )}

                                        {/* Completed At Date */}
                                        {isCompleted && (
                                            <div className="flex items-center mt-2 text-sm text-gray-600 gap-2">
                                                <FaCalendarAlt />
                                                <span>
                                                    Completed At:{" "}
                                                    {completedAt ? (
                                                        <span className="font-medium">{humanizeDate(completedAt)}</span>
                                                    ) : (
                                                        <span className="text-gray-400">Not yet updated</span>
                                                    )}
                                                </span>
                                            </div>
                                        )}

                                        {/* Sections */}
                                        {expandedChapters[index] && chapter.sections.length > 0 && (
                                            <ul className="mt-4 border-l-2 border-gray-300 pl-5 space-y-3">
                                                {chapter.sections.map((section, sIndex) => {
                                                    const sectionKey = `section-${index}-${sIndex}`;
                                                    const sectionCompletedAt =
                                                        completedAtDates[sectionKey] || section.completedAt;

                                                    return (
                                                        <li key={sIndex} className="flex justify-between items-start">
                                                            <div className={`flex items-start gap-2 text-base ${section.status ? "text-green-800" : "text-gray-700"}`}>
                                                                🔹 {section.title || `Section ${sIndex + 1}`}{" "}
                                                                {section.status ? (
                                                                    <FaCheck className="text-green-500 ml-1" />
                                                                ) : (
                                                                    <FaTimes className="text-red-500 ml-1" />
                                                                )}
                                                                {isCompleted && (
                                                                    <div className="flex items-center mt-2 text-sm text-gray-600 gap-2">
                                                                        <FaCalendarAlt />
                                                                        <span>
                                                                            Completed At:{" "}
                                                                            {section.completedAt ? (
                                                                                <span className="font-medium">{humanizeDate(section.completedAt)}</span>
                                                                            ) : (
                                                                                <span className="text-gray-400">Not yet updated</span>
                                                                            )}
                                                                        </span>
                                                                    </div>)}

                                                            </div>


                                                            <div className="flex flex-col items-end gap-1">
                                                                {(userRole === RoleEnum.ADMIN || userId === formData?.teacherId) && (
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={section.status}
                                                                        onChange={() => toggleSectionStatus(index, sIndex)}
                                                                        className="w-5 h-5 text-green-600 border-gray-300 focus:ring-green-500 rounded"
                                                                        aria-label={`Mark Section ${sIndex + 1} as complete`}
                                                                    />
                                                                )}
                                                                {section.status && sectionCompletedAt && (
                                                                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                                                        <FaCalendarAlt />
                                                                        <span className="font-medium">{humanizeDate(sectionCompletedAt)}</span>
                                                                    </div>
                                                                )}
                                                            </div>

                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <EmptyState message="No chapters available." />
                    )}

                    {/* Submit Button */}
                    {(userRole === RoleEnum.ADMIN || userId === formData?.teacherId) && (
                        <div className="flex justify-end mt-8">
                            <button
                                onClick={handleSubmit}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-all"
                            >
                                Update Status
                            </button>
                        </div>
                    )}
                </Section>
                {/* Skills */}
                <Section title="Skills">
                    {formData.subject.skillsId.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                        zindex="z-50"
                    >
                        <div className="space-y-6">
                            {/* Header Section */}
                            <div className="flex items-center space-x-3">
                                <MdTitle className="text-2xl text-primary-600" />
                                <h2 className="text-lg font-bold text-gray-900">History Details</h2>
                            </div>
                            {/* Title Row */}
                            <DetailRow label="Title" value={selectedHistory.title} />
                            {/* Modified At Row */}
                            <DetailRow label="Modified At" value={humanizeDate(selectedHistory.modifiedAt)} />
                            {/* Teachers Row */}
                            <DetailRow
                                label="Teachers"
                                value={
                                    selectedHistory.teacherId.length > 0 ? (
                                        selectedHistory.teacherId
                                            .map((t) => `${t.firstName} ${t.lastName} (${t.email})`)
                                            .join(", ")
                                    ) : (
                                        "None"
                                    )
                                }
                            />
                            {/* Skills Row */}
                            <DetailRow
                                label="Skills"
                                value={
                                    selectedHistory.skillsId.length > 0 ? (
                                        selectedHistory.skillsId
                                            .map((s) =>
                                                `${s.title} (${s.familyId.map((f) => f.title).join(", ")})`
                                            )
                                            .join(", ")
                                    ) : (
                                        "None"
                                    )
                                }
                            />
                        </div>
                    </Popup>
                )}
            </div>
        </div>
    );
};

// Helper Components
const Section = ({ title, icon, children }) => (
    <section className="p-6 border-b border-gray-200 last:border-none">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center mb-4 gap-2">
            {icon && <span>{icon}</span>}
            {title}
        </h2>
        {children}
    </section>
);

const InfoCard = ({ label, value }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <p className="text-sm font-semibold text-gray-700">{label}</p>
        <p className="text-gray-600 truncate overflow-hidden whitespace-nowrap">{value}</p>
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

const DetailRow = ({ label, value }) => (
    <div className="flex flex-col space-y-1 transition-all duration-200 hover:bg-gray-100 rounded-lg p-3">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        <span className="text-base font-semibold text-gray-900">{value}</span>
    </div>
);

export default SubjectDetailsPage;