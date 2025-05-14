import { useCallback, useEffect, useRef, useState } from "react";
import { CgEye } from "react-icons/cg";
import {
    FaArrowLeft,
    FaCalendarAlt,
    FaCheck,
    FaChevronDown,
    FaChevronUp,
    FaEdit,
    FaEye,
    FaHistory,
    FaStar,
    FaTimes
} from "react-icons/fa";
import { FiBell, FiBook, FiCalendar, FiCheckCircle, FiChevronDown, FiChevronRight, FiClock, FiEyeOff, FiFileText, FiLayers, FiUser, FiXCircle } from "react-icons/fi";
import { MdTitle } from "react-icons/md";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import matieresServices from "../../services/matieresServices/matieres.service";
import humanizeDate from "../../utils/humanizeDate";
import useDeviceType from "../../utils/useDeviceType";
import { RoleEnum } from "../../utils/userRoles";
import PageLayout from "../skillsComponents/PageLayout";
import Popup from "../skillsComponents/Popup";
import Tooltip from "../skillsComponents/Tooltip";
import { CurriculumChapters } from "./CurriculumChapters";
import { SkillList } from "./SkillList";
import SubjectForm from "./SubjectForm";

const SubjectDetailsPage = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState(null);
    const [fetchData, setFetchData] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedHistory, setSelectedHistory] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expandedChapters, setExpandedChapters] = useState({});
    const userRole = useSelector((state) => state.auth.role);
    const userId = useSelector((state) => state.auth.user.id);
    const canEdit = userId === formData?.subject?.teacherId[0]?._id;
    // console.log(formData.subject.teacherId[0]._id);
    const navigate = useNavigate();
    const [isPropositionPopupOpen, setIsPropositionPopupOpen] = useState(false);
    const [propositions, setPropositions] = useState(null);
    const deviceType = useDeviceType();
    let positionTooltip = deviceType === "desktop" ? "bottom" : "left";


    const fetchPropositions = useCallback(async () => {
        if (userRole !== RoleEnum.ADMIN) {
            return;
        }

        try {
            // setLoading(true);
            setError(null);

            const response = await matieresServices.fetchUpdatePropositionMatiere(id);

            // 🔍 Comparaison simple via JSON.stringify (ok si taille raisonnable)
            const hasChanged = JSON.stringify(response) !== JSON.stringify(propositions);

            if (hasChanged) {
                setPropositions(response || []);
                console.log("✅ Propositions mises à jour");
            } else {
                console.log("♻️ Propositions identiques, aucune mise à jour");
            }

        } catch (err) {
            toast.error(err.response?.message || "Failed to load subject data.");
            setError(err.message || "Failed to load subject data.");
        } finally {
            setLoading(false);
        }
    }, [id, userRole, propositions]);

    useEffect(() => {
        fetchPropositions();
    }, [formData?.subject?._id, id]);

    // State to manage visibility of sections for each chapter
    const [visibleChapters, setVisibleChapters] = useState({});

    // Function to toggle the visibility of sections for a specific chapter
    const toggleSectionVisibility = (chapterId) => {
        setVisibleChapters((prevState) => ({
            ...prevState,
            [chapterId]: !prevState[chapterId], // Toggle visibility
        }));
    };
    const [completedAtDates, setCompletedAtDates] = useState({}); // Store completedAt dates
    const fetchRef = useRef(false);
    const toggleForm = () => setShowForm((prev) => !prev);

    const fetchSubject = useCallback(async (force = false) => {
        try {
            if (!force) {
                setLoading(true);
            }
            setError(null);

            if (!force && fetchRef.current && formData?.subject?._id === id) return;

            const response = await matieresServices.fetchMatiereById(id);
            const { subject, history, historyPagination } = response;

            if (!subject || !subject.curriculum || !Array.isArray(subject.curriculum.chapitres)) {
                throw new Error("Invalid subject data received from the server.");
            }
            setFetchData(subject);
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
    }, [id, formData?.subject?._id]); // ajoutez toutes les dépendances nécessaires ici

    const handleUpdateStatus = async (subjectId, newStatus) => {
        try {
            console.log(subjectId);
            console.log(id);

            const result = await matieresServices.validatePropositionMatiere(id, subjectId, newStatus);

            toast.success(
                `Proposition ${newStatus ? "approuvée" : "refusée"} avec succès.`,
                { position: "top-right" }
            );

            // Met à jour localement la liste des propositions
            setPropositions((prev) =>
                prev.map((p) => (p._id === id ? { ...p, isApproved: newStatus } : p))
            );
            fetchSubject(true);
            fetchPropositions();
            // setIsModalOpen(false);
        } catch (error) {
            toast.error(`Erreur : ${error}`, { position: "top-right" });
        }
    };

    useEffect(() => {
        fetchSubject();
    }, [fetchSubject, id]);

    // Handle form submission (after adding/editing a subject)
    const handleFormSubmit = async (updatedData) => {
        try {
            let data;
            if (userRole === RoleEnum.ADMIN) {
                data = await matieresServices.updateMatieres(updatedData);
            } else {
                // toast.info("trigger proposition");
                data = await matieresServices.addUpdatePropositionMatiere(updatedData);
            }
            // Reset form state
            fetchRef.current = false;
            fetchSubject();
            setShowForm(false); // Hide the form after submission
            toast.success(data.message || "Subject updated successfully!");
        } catch (error) {
            toast.error("Failed to update subject: " + error);
        }
    };

    const toggleChapterExpand = (index) => {
        setExpandedChapters((prev) => ({ ...prev, [index]: !prev[index] }));
    };

    const toggleChapterStatus = (index) => {
        setFormData((prevData) => {
            const updatedChapters = prevData.subject.curriculum.chapitres.map((chapter, i) => {
                if (i === index) {
                    const newStatus = !chapter.status;
                    return {
                        ...chapter,
                        status: newStatus,
                        completedDate: newStatus ? new Date().toISOString() : null,
                    };
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

    const toggleSectionStatus = (chapterIndex, sectionIndex) => {
        setFormData((prevData) => {
            const updatedChapters = prevData.subject.curriculum.chapitres.map((chapter, cIndex) => {
                if (cIndex === chapterIndex) {
                    const updatedSections = chapter.sections.map((section, sIndex) => {
                        if (sIndex === sectionIndex) {
                            const newStatus = !section.status;
                            return {
                                ...section,
                                status: newStatus,
                                completedDate: newStatus ? new Date().toISOString() : null, // Ajoute ou supprime la date
                            };
                        }
                        return section;
                    });
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


    // const handleDateChange = (type, index, sectionIndex = null, date) => {
    //     setCompletedAtDates((prev) => {
    //         if (type === "chapter") {
    //             return { ...prev, [`chapter-${index}`]: date };
    //         } else if (type === "section") {
    //             return { ...prev, [`section-${index}-${sectionIndex}`]: date };
    //         }
    //         return prev;
    //     });
    // };

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
            const payload = {
                curriculum: {
                    ...formData.subject.curriculum,
                    chapitres: updatedChapters,
                },
            };
            console.log("Payload envoyé au backend :", payload);
            payload._id = id;
            await matieresServices.updateMatiereAvancement(payload);
            toast.success("Subject Advancements updated successfully!");
            fetchRef.current = false;
            fetchSubject();
            // setFormData({
            //     ...formData,
            //     subject: {
            //         ...formData.subject,
            //         curriculum: {
            //             ...formData.subject.curriculum,
            //             chapitres: updatedChapters,
            //         },
            //     },
            // });

        } catch (err) {
            console.error("Erreur lors de la mise à jour :", err);
            toast.error("Échec de la mise à jour de la matière.");
            toast.error(err.message || err);
        }
    };

    const handleDateChange = (key, date) => {
        setCompletedAtDates((prev) => ({
            ...prev,
            [key]: date,
        }));
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

    const handleSendNotif = async (id) => {
        try {
            const result = await matieresServices.sendEvaluationNotif(id);
            toast.success(result.message);
        } catch (error) {
            toast.error(error.toString());
        }
    };

    const actionHeaders =
        userRole === RoleEnum.STUDENT ? (
            <Tooltip text={"Evaluate Subject"} position={positionTooltip}>
                <button
                    onClick={() => navigate(`/subjects/${id}/evaluation`)}  // Navigate to the evaluate page
                    className="flex justify-center items-center bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition duration-200 sm:w-auto w-full mb-2 sm:mb-0"
                >
                    <FaStar className="mr-2" />
                </button>
            </Tooltip>
        )
            : (userRole === RoleEnum.ADMIN || canEdit) && (
                <>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                        {/* Button reserved for Admins to see proposals */}
                        <div className="pb-2 flex flex-col sm:flex-row gap-3"></div>
                        {userRole === RoleEnum.ADMIN && (
                            <>

                                <Tooltip text={"Send Evaluation Notif to Students"} position={positionTooltip}>
                                    <button
                                        onClick={() => {
                                            handleSendNotif(id);
                                        }}
                                        className="flex items-center justify-center gap-2 bg-gray-500 text-white px-5 py-2.5 rounded-xl font-medium shadow hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200 sm:w-auto w-full"
                                    >
                                        <FiBell className="text-lg" />
                                    </button>
                                </Tooltip>
                                <Tooltip text={"Proposed Modifications"} position={positionTooltip}>
                                    <button
                                        onClick={() => {
                                            setIsPropositionPopupOpen(true);
                                            fetchPropositions();
                                        }}
                                        className="flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl font-medium shadow hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200 sm:w-auto w-full"
                                    >
                                        <FaEye className="text-lg" />
                                    </button>
                                </Tooltip>

                            </>
                        )}

                        {/* Button to Propose a modification or Go Back */}
                        {showForm ? (
                            <Tooltip text={"Go Back"} position={positionTooltip}>
                                <button
                                    onClick={toggleForm}
                                    className="flex justify-center items-center bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400 transition duration-200 sm:w-auto w-full mb-2 sm:mb-0"
                                >
                                    <FaArrowLeft className="mr-2" />
                                </button>
                            </Tooltip>
                        ) : (
                            <Tooltip text={userRole === RoleEnum.ADMIN ? 'Edit' : 'Propose an Edit'}
                                position={positionTooltip}>
                                <button
                                    onClick={toggleForm}
                                    className="flex items-center justify-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-xl font-medium shadow hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-200 sm:w-auto w-full"
                                >
                                    <FaEdit className="mr-2" />
                                </button>
                            </Tooltip>
                        )}

                    </div>

                    {/* Popup for Proposed Modifications */}
                    <Popup
                        isOpen={isPropositionPopupOpen}
                        onClose={() => setIsPropositionPopupOpen(false)}
                        position="center"
                        size="lg"
                        showCloseButton
                    >
                        <div className="max-w-3xl mx-auto text-left">
                            <h2 className="text-2xl font-bold text-blue-800 mb-8 text-center flex items-center justify-center gap-2">
                                <FiFileText className="text-2xl" /> Curriculum Change Proposals
                            </h2>

                            {propositions === null ? (
                                <p className="text-gray-500 text-center">Loading...</p>
                            ) : Array.isArray(propositions) && propositions.length === 0 ? (
                                <p className="text-gray-500 text-center">No proposals available.</p>
                            ) : (
                                <div className="space-y-5 max-h-[65vh] overflow-y-auto pr-2">
                                    {propositions.map((p) => (
                                        <div
                                            key={p._id}
                                            className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm relative"
                                        >
                                            {/* Status */}
                                            <div className="absolute top-4 right-4 text-sm space-y-1 text-right">
                                                {p.isApproved === true ? (
                                                    <div className="text-green-600 space-y-1">
                                                        <div className="flex items-center justify-end gap-1 font-semibold">
                                                            <FiCheckCircle />
                                                            <span>Approved</span>
                                                        </div>
                                                        <div className="flex items-center justify-end gap-1 text-xs text-gray-600">
                                                            <FiUser /> <span><b>{`${p.reviewer?.firstName} ${p.reviewer?.lastName}`}</b></span>
                                                        </div>
                                                        {p.reviewDate && (
                                                            <div className="flex items-center justify-end gap-1 text-xs text-gray-500">
                                                                <FiCalendar />
                                                                <span>on <b>{humanizeDate(p.reviewDate, true)}</b></span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : p.isApproved === false ? (
                                                    <div className="text-red-600 space-y-1">
                                                        <div className="flex items-center justify-end gap-1 font-semibold">
                                                            <FiXCircle />
                                                            <span>Declined</span>
                                                        </div>
                                                        <div className="flex items-center justify-end gap-1 text-xs text-gray-600">
                                                            <FiUser /> <span><b>{`${p.reviewer?.firstName} ${p.reviewer?.lastName}`}</b></span>
                                                        </div>
                                                        {p.reviewDate && (
                                                            <div className="flex items-center justify-end gap-1 text-xs text-gray-500">
                                                                <FiCalendar />
                                                                <span>on <b>{humanizeDate(p.reviewDate, true)}</b></span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="text-yellow-600">
                                                        <div className="flex items-center justify-end gap-1 font-semibold">
                                                            <FiClock />
                                                            <span>Pending</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Header */}
                                            <div className="mb-2">
                                                <p className="text-base font-semibold text-gray-700">
                                                    📚 Proposed by <span className="text-blue-600">{`${p.teacherId[0].firstName} ${p.teacherId[0].lastName}`}</span>
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                                    <FiCalendar className="text-sm" />
                                                    {humanizeDate(p.createdAt, true)}
                                                </p>
                                            </div>

                                            {/* Reason */}
                                            <div className="mb-1 mt-5 bg-gray-50 border rounded-md p-2">
                                                <p className="text-sm text-gray-700">
                                                    <strong>📝 Reason:</strong> {p.reason}
                                                </p>
                                            </div>

                                            {/* Curriculum details */}
                                            <div className="bg-gray-50 border rounded-lg p-4 text-sm space-y-2">
                                                <p className="text-center"><strong>Proposed Curriculum </strong>  </p>
                                                <p><strong>🗓️ Semester:</strong> {p.curriculum?.semestre}</p>
                                                <p><strong>🌐 Language:</strong> {p.curriculum?.langue}</p>
                                                <p><strong>⏱️ Total Hours:</strong> {p.curriculum?.volume_horaire_total}</p>
                                                <p><strong>📖 Teaching Type:</strong> {p.curriculum?.type_enseignement}</p>

                                                {Array.isArray(p.curriculum?.prerequis_recommandes) && p.curriculum.prerequis_recommandes.length > 0 && (
                                                    <p><strong>✅ Prerequisites:</strong> {p.curriculum.prerequis_recommandes.join(", ")}</p>
                                                )}

                                                {Array.isArray(p.curriculum?.chapitres) && p.curriculum.chapitres.length > 0 && (
                                                    <CurriculumChapters curriculum={p.curriculum} />
                                                )}

                                                <div>
                                                    <strong>💡 Skills:</strong>
                                                    <SkillList skills={p.skillsId} />
                                                </div>
                                            </div>

                                            {/* Buttons */}
                                            {p.isApproved === null && (
                                                <div className="flex justify-end gap-3 mt-5">
                                                    <button
                                                        className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-800 text-sm transition"
                                                        onClick={() => handleUpdateStatus(p._id, true)}
                                                    >
                                                        <FiCheckCircle /> Approve
                                                    </button>
                                                    <button
                                                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-800 text-sm transition"
                                                        onClick={() => handleUpdateStatus(p._id, false)}
                                                    >
                                                        <FiXCircle /> Decline
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Popup >
                </>
            );




    return (
        <PageLayout title={formData.subject.title} headerActions={actionHeaders} a >
            {/* <div className="min-h-screen bg-gray-100 p-6"> */}
            {showForm ? (
                <SubjectForm
                    initialData={fetchData}
                    onSubmit={handleFormSubmit} // Pass the updated handleFormSubmit
                    onCancel={toggleForm} // Allow canceling the form
                    proposeEdit={canEdit}
                />
            ) :
                (<div className=" ">
                    {/* <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8 space-y-8"> */}
                    <div className="w-full max-w-6xl mx-auto bg-white  ">
                        {/* Header */}
                        {userRole === RoleEnum.ADMIN && (<header className="text-center mb-8">
                            <div className="flex items-center justify-center space-x-2">
                                {formData.subject.isPublish ? (
                                    <>
                                        <CgEye className="text-gray-700 text-lg" />
                                        <span>Published</span>
                                    </>
                                ) : (
                                    <>
                                        <FiEyeOff className="text-gray-700 text-lg" />
                                        <span>Hidden</span>
                                    </>
                                )}
                            </div>
                            <p className="text-sm text-gray-600">Last update at :{humanizeDate(formData.subject.updatedAt)}</p>
                            <p className="text-sm text-gray-600">Created at :{humanizeDate(formData.subject.createdAt)}</p>
                        </header>)}


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
                                {/* <InfoCard label="Relation" value={formData.subject.curriculum?.relation || "N/A"} /> */}
                                <InfoCard label="Academic Year" value={formData.subject.curriculum?.academicYear || "N/A"} />
                                <InfoCard label="Teaching Type" value={formData.subject.curriculum?.type_enseignement || "N/A"} />
                                <InfoListCard
                                    label="Prerequisites"
                                    values={formData.subject.curriculum?.prerequis_recommandes}
                                />


                            </div>
                        </Section>


                        <Section title="Chapters & Sections">
                            {formData.subject.curriculum.chapitres.length > 0 ? (
                                <div className="space-y-6">
                                    {formData.subject.curriculum.chapitres.map((chapter, index) => {
                                        const chapterKey = `chapter-${index}`;
                                        const isCompleted = chapter.status;
                                        const completedAt = chapter.completedAt || completedAtDates[chapterKey];
                                        // const canEdit = userId === formData?.subject.teacherId._id;
                                        const sectionCount = chapter.sections.length;

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
                                                    <h3
                                                        className={`text-xl font-semibold flex items-center gap-2 ${isCompleted ? "text-green-800" : "text-gray-800"
                                                            }`}
                                                    >
                                                        {chapter.title || `Chapter ${index + 1}`}
                                                        {isCompleted ? (
                                                            <FaCheck className="text-green-500" />
                                                        ) : (
                                                            <FaTimes className="text-red-500" />
                                                        )}
                                                    </h3>
                                                    {expandedChapters[index] ? (
                                                        <Tooltip text={"close"} position="top">
                                                            <FaChevronUp className="text-gray-500" />
                                                        </Tooltip>
                                                    ) : (
                                                        <Tooltip text={"open"} position="top" alwaysOn>
                                                            <FaChevronDown className="text-gray-500" />
                                                        </Tooltip>
                                                    )}
                                                </div>

                                                {/* Number of Sections */}
                                                <div className="text-sm text-gray-500 mt-1">
                                                    {sectionCount} {sectionCount === 1 ? 'Section' : 'Sections'}
                                                </div>

                                                {/* Chapter Checkbox */}
                                                {canEdit && (
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

                                                {/* Completed At + Input */}
                                                {isCompleted && (
                                                    <div className="mt-2 text-sm text-gray-600">
                                                        <div className="flex items-center gap-2">
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

                                                        {canEdit && (
                                                            <div className="mt-2">
                                                                <label className="block text-sm text-gray-600 mb-1">Completion Date:</label>
                                                                <input
                                                                    type="date"
                                                                    defaultValue={new Date().toISOString().split("T")[0]}
                                                                    value={completedAtDates[chapterKey]?.split("T")[0] || new Date().toISOString().split("T")[0]}
                                                                    onChange={(e) => handleDateChange(chapterKey, e.target.value)}
                                                                    className="border rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Sections */}
                                                {expandedChapters[index] && chapter.sections.length > 0 && (
                                                    <ul className="mt-4 border-l-2 border-gray-300 pl-5 space-y-3">
                                                        {chapter.sections.map((section, sIndex) => {
                                                            const sectionKey = `section-${index}-${sIndex}`;
                                                            const sectionCompletedAt = completedAtDates[sectionKey] || section.completedAt;

                                                            return (
                                                                <li key={sIndex} className="flex justify-between items-start">
                                                                    <div
                                                                        className={`flex flex-col items-start gap-1 text-base ${section.status ? "text-green-800" : "text-gray-700"
                                                                            }`}
                                                                    >
                                                                        <div className="flex items-center gap-2">
                                                                            {sIndex + 1} - {section.title || `Section ${sIndex + 1}`}{" "}
                                                                            {section.status ? (
                                                                                <FaCheck className="text-green-500 ml-1" />
                                                                            ) : (
                                                                                <FaTimes className="text-red-500 ml-1" />
                                                                            )}
                                                                        </div>

                                                                        {section.status && (
                                                                            <>
                                                                                <div className="flex items-center text-sm text-gray-600 gap-2">
                                                                                    <FaCalendarAlt />
                                                                                    <span>
                                                                                        Completed At:{" "}
                                                                                        {sectionCompletedAt ? (
                                                                                            <span className="font-medium">
                                                                                                {humanizeDate(sectionCompletedAt)}
                                                                                            </span>
                                                                                        ) : (
                                                                                            <span className="text-gray-400">Not yet updated</span>
                                                                                        )}
                                                                                    </span>
                                                                                </div>

                                                                                {canEdit && (
                                                                                    <div className="mt-1">
                                                                                        <label className="block text-sm text-gray-600 mb-1">
                                                                                            Completion Date:
                                                                                        </label>
                                                                                        <input
                                                                                            type="date"
                                                                                            value={
                                                                                                completedAtDates[sectionKey]
                                                                                                    ? completedAtDates[sectionKey].split("T")[0]
                                                                                                    : new Date().toISOString().split("T")[0]
                                                                                            }
                                                                                            onChange={(e) => handleDateChange(sectionKey, e.target.value)}
                                                                                            className="border rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                                        />

                                                                                    </div>
                                                                                )}
                                                                            </>
                                                                        )}
                                                                    </div>

                                                                    <div className="flex flex-col items-end gap-1">
                                                                        {canEdit && (
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={section.status}
                                                                                onChange={() => toggleSectionStatus(index, sIndex)}
                                                                                className="w-5 h-5 text-green-600 border-gray-300 focus:ring-green-500 rounded"
                                                                                aria-label={`Mark Section ${sIndex + 1} as complete`}
                                                                            />
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
                            {formData.subject.curriculum.chapitres.length > 0 && canEdit && (
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
                                // title="History Details"
                                position="center"
                                showCloseButton={true}
                                zindex="z-50"
                            >
                                <div className="space-y-6">
                                    {/* Header */}
                                    <div className="flex items-center space-x-3">
                                        <MdTitle className="text-2xl text-primary-600" />
                                        <h2 className="text-lg font-bold text-gray-900">History Overview</h2>
                                    </div>

                                    {/* Title */}
                                    <DetailRow
                                        label={
                                            <span className="flex items-center gap-2 text-gray-600 font-medium">
                                                <MdTitle className="text-lg text-indigo-500" />
                                                Title
                                            </span>
                                        }
                                        value={selectedHistory.title}
                                    />

                                    {/* Modified At */}
                                    <DetailRow
                                        label={
                                            <span className="flex items-center gap-2 text-gray-600 font-medium">
                                                <FiLayers className="text-lg text-indigo-500" />
                                                Modified At
                                            </span>
                                        }
                                        value={humanizeDate(selectedHistory.modifiedAt)}
                                    />

                                    {/* Teachers */}
                                    <DetailRow
                                        label={
                                            <span className="flex items-center gap-2 text-gray-600 font-medium">
                                                <FiBook className="text-lg text-indigo-500" />
                                                Teacher
                                            </span>
                                        }
                                        value={
                                            selectedHistory.teacherId.length > 0
                                                ? selectedHistory.teacherId
                                                    .map((t) => `${t.firstName} ${t.lastName} (${t.email})`)
                                                    .join(", ")
                                                : "None"
                                        }
                                    />

                                    {/* Chapters & Sections */}
                                    <DetailRow
                                        label={
                                            <span className="flex items-center gap-2 text-gray-600 font-medium">
                                                <FiLayers className="text-lg text-indigo-500" />
                                                Chapters ({selectedHistory.curriculum.chapitres.length})
                                            </span>
                                        }
                                        value={
                                            selectedHistory.curriculum.chapitres.length > 0 ? (
                                                <div className="space-y-2">
                                                    {selectedHistory.curriculum.chapitres.map((chapter) => {
                                                        const sectionsVisible = visibleChapters[chapter._id];
                                                        const sectionCount = chapter.sections.length;

                                                        return (
                                                            <div
                                                                key={chapter._id}
                                                                className="p-3 border rounded-md bg-gray-50 hover:bg-blue-50 cursor-pointer transition"
                                                                onClick={() => sectionCount > 0 && toggleSectionVisibility(chapter._id)}
                                                            >
                                                                {/* Chapter Header */}
                                                                <div className="flex justify-between items-center">
                                                                    <div className="flex items-center gap-2">
                                                                        <FiBook className="text-blue-600" />
                                                                        <span className="font-semibold text-gray-800">{chapter.title}</span>
                                                                        <span className="text-sm text-gray-500">
                                                                            ({sectionCount} {sectionCount === 1 ? "section" : "sections"})
                                                                        </span>
                                                                    </div>
                                                                    {sectionCount > 0 && (
                                                                        <span className="text-gray-500">
                                                                            {sectionsVisible ? <FiChevronDown /> : <FiChevronRight />}
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                {/* Sections */}
                                                                {sectionsVisible && sectionCount > 0 && (
                                                                    <div className="ml-6 mt-2 space-y-1">
                                                                        {chapter.sections.map((section) => (
                                                                            <div
                                                                                key={section._id}
                                                                                className="flex items-center gap-2 text-sm text-gray-700"
                                                                            >
                                                                                {section.completedAt ? (
                                                                                    <FiCheckCircle className="text-green-500" />
                                                                                ) : (
                                                                                    <FiXCircle className="text-red-400" />
                                                                                )}
                                                                                <span>{section.title}</span>
                                                                                {section.completedAt && (
                                                                                    <span className="text-gray-500 text-xs">
                                                                                        ({humanizeDate(section.completedAt)})
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}

                                                                {/* Empty section */}
                                                                {sectionsVisible && sectionCount === 0 && (
                                                                    <div className="ml-6 text-gray-500 text-sm">No sections</div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <span className="text-gray-500">None</span>
                                            )
                                        }
                                    />

                                    {/* Skills */}
                                    <DetailRow
                                        label={
                                            <span className="flex items-center gap-2 text-gray-600 font-medium">
                                                <FiCheckCircle className="text-lg text-indigo-500" />
                                                Skills
                                            </span>
                                        }
                                        value={
                                            selectedHistory.skillsId.length > 0
                                                ? selectedHistory.skillsId
                                                    .map(
                                                        (s) => `${s.title} (${s.familyId.map((f) => f.title).join(", ")})`
                                                    )
                                                    .join(", ")
                                                : "None"
                                        }
                                    />
                                </div>
                            </Popup>
                        )}

                    </div>
                </div>)
            }
        </PageLayout>
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
const InfoListCard = ({ label, values }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">{label}</h4>
        {values && values.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1 text-gray-800 text-sm">
                {values.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        ) : (
            <p className="text-gray-500 text-sm italic">None</p>
        )}
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
    <div className="flex flex-col space-y-1 transition-all duration-200 rounded-lg ">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        <span className="text-base font-semibold text-gray-900">{value}</span>
    </div>
);

export default SubjectDetailsPage;
