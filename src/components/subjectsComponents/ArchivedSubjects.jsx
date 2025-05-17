import { useEffect, useState } from "react";
import { BsAwardFill, BsBookHalf } from "react-icons/bs";
import {
    FaArrowLeft,
    FaCalendarAlt,
    FaCheckCircle,
    FaChevronLeft,
    FaChevronRight,
    FaClock,
    FaGraduationCap,
    FaLanguage,
    FaUser
} from "react-icons/fa";
import { MdArchive, MdEmail, MdOutlineSubject } from "react-icons/md";
import matieresServices from "../../services/matieresServices/matieres.service";
import humanizeDate from "../../utils/humanizeDate";
import AcademicYearPicker from "../AcademicYearPicker";

const ArchivedSubjects = ({ subjectId }) => {
    const [archives, setArchives] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [page, setPage] = useState(1);
    const [limit] = useState(9);
    const [search, setSearch] = useState("");
    const [teacherId, setTeacherId] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [academicYear, setAcademicYear] = useState("");

    const fetchArchives = async () => {
        setLoading(true);
        try {
            const result = await matieresServices.fetchMatiereByIdArchive(
                subjectId,
                page,
                search,
                limit,
                teacherId,
                academicYear
            );
            setArchives(result.data || []);
            setTotalPages(result.totalPages || 1);
        } catch (err) {
            console.error("Error fetching archives:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (subjectId) fetchArchives();
    }, [subjectId, page, search, teacherId, academicYear]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="space-y-4 w-full max-w-md">
                    <div className="h-8 bg-gray-200 rounded-md animate-pulse"></div>
                    <div className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
                    <div className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
            </div>
        );
    }

    if (selectedSubject) {
        const curriculum = selectedSubject.curriculum || {};
        const teacher = `${selectedSubject?.teacherId?.[0]?.firstName} ${selectedSubject?.teacherId?.[0]?.lastName}`;
        const teacherEmail = selectedSubject?.teacherId?.[0]?.email;

        return (
            <div className="space-y-6">
                <button
                    onClick={() => setSelectedSubject(null)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-lg hover:shadow-indigo-200"
                >
                    <FaArrowLeft /> Back to Archives
                </button>

                <div className="border rounded-xl shadow-xl p-6 bg-white space-y-4">
                    <div className="flex items-center space-x-2 pb-4 border-b border-gray-100">
                        <MdOutlineSubject className="text-indigo-500 text-3xl" />
                        <h2 className="text-2xl font-bold text-gray-800">{selectedSubject.title}</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-4 text-gray-700">
                        <div className="flex items-center gap-3 bg-indigo-50 p-3 rounded-lg">
                            <div className="bg-indigo-100 p-2 rounded-full">
                                <FaCalendarAlt className="text-indigo-500 text-lg" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Academic Year</div>
                                <div className="font-medium">{curriculum.academicYear || "Unknown"}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 bg-purple-50 p-3 rounded-lg">
                            <div className="bg-purple-100 p-2 rounded-full">
                                <FaUser className="text-purple-500 text-lg" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Coordinator</div>
                                <div className="font-medium">{curriculum.responsable || "N/A"}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 bg-green-50 p-3 rounded-lg">
                            <div className="bg-green-100 p-2 rounded-full">
                                <FaGraduationCap className="text-green-500 text-lg" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Teacher</div>
                                <div className="font-medium">{teacher}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg">
                            <div className="bg-blue-100 p-2 rounded-full">
                                <MdEmail className="text-blue-500 text-lg" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Contact</div>
                                <div className="font-medium">{teacherEmail || "N/A"}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 bg-amber-50 p-3 rounded-lg">
                            <div className="bg-amber-100 p-2 rounded-full">
                                <FaLanguage className="text-amber-500 text-lg" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Language</div>
                                <div className="font-medium">{curriculum.langue || "N/A"}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 bg-rose-50 p-3 rounded-lg">
                            <div className="bg-rose-100 p-2 rounded-full">
                                <BsAwardFill className="text-rose-500 text-lg" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Credits</div>
                                <div className="font-medium">{curriculum.credit || 0}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 bg-emerald-50 p-3 rounded-lg">
                            <div className="bg-emerald-100 p-2 rounded-full">
                                <FaClock className="text-emerald-500 text-lg" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Total Hours</div>
                                <div className="font-medium">{curriculum.volume_horaire_total || 0} hrs</div>
                            </div>
                        </div>
                    </div>

                    {selectedSubject.skillsId?.length > 0 && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="font-semibold mb-2 text-gray-700 flex items-center gap-2">
                                <BsAwardFill className="text-blue-500" /> Skills
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {selectedSubject.skillsId.map(skill => (
                                    <span key={skill._id} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                        {skill.title}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-4">
                        <div className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-800">
                            <BsBookHalf className="text-indigo-600" />
                            Curriculum Chapters
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {curriculum.chapitres?.map((chap, i) => (
                                <div key={chap._id || i} className="border border-gray-100 rounded-lg p-3 shadow-sm hover:shadow-md transition">
                                    <div className="flex justify-between items-center">
                                        <div className="font-medium text-gray-800">{chap.title}</div>
                                        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs ${chap.status ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                                            }`}>
                                            {chap.status ? (
                                                <>
                                                    <FaCheckCircle /> Completed {humanizeDate(chap.completedAt)}
                                                </>
                                            ) : (
                                                "Not completed"
                                            )}
                                        </div>
                                    </div>

                                    {chap.sections?.length > 0 && (
                                        <div className="mt-3 pl-4 border-l-2 border-indigo-100 space-y-2">
                                            {chap.sections.map((sec) => (
                                                <div key={sec._id} className="flex justify-between items-center">
                                                    <div className="text-sm text-gray-700">{sec.title}</div>
                                                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${sec.status ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                                                        }`}>
                                                        {sec.status ? (
                                                            <>Completed {humanizeDate(sec.completedAt)}</>
                                                        ) : (
                                                            "Not completed"
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Search Input */}
            <div className="mb-4">
                <label htmlFor="academicYear" className="block text-sm font-medium text-gray-700 mb-1">
                    Filter by Academic Year
                </label>
                <AcademicYearPicker
                    value={academicYear}
                    onChange={(val) => {
                        setAcademicYear(val);
                    }}
                    label=""
                    range={20}
                    direction="past"
                />

            </div>


            {/* Archive List */}
            {archives.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                    <MdArchive className="text-5xl mb-4 text-gray-300" />
                    <p className="text-xl">No archived versions found</p>
                    <p className="text-sm mt-2">Try adjusting your search criteria</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {archives.map((subject) => (
                        <div
                            key={subject._id}
                            onClick={() => setSelectedSubject(subject)}
                            className="cursor-pointer bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 overflow-hidden"
                        >
                            <div className="bg-indigo-600 h-2"></div>
                            <div className="p-5">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="bg-indigo-100 p-2 rounded-full">
                                        <MdArchive className="text-indigo-600 text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-800">{subject.title}</h3>
                                        <p className="text-sm text-gray-500">{subject.curriculum.academicYear || "Unknown"}</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mt-3">
                                    {subject.skillsId?.slice(0, 2).map(skill => (
                                        <span key={skill._id} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                                            {skill.title}
                                        </span>
                                    ))}
                                    {subject.skillsId?.length > 2 && (
                                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                                            +{subject.skillsId.length - 2} more
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        disabled={page === 1}
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition flex items-center justify-center"
                        aria-label="Previous page"
                    >
                        <FaChevronLeft className="text-gray-700" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                        <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition ${page === pageNum
                                ? "bg-indigo-600 text-white font-medium"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            {pageNum}
                        </button>
                    ))}

                    <button
                        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                        disabled={page === totalPages}
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition flex items-center justify-center"
                        aria-label="Next page"
                    >
                        <FaChevronRight className="text-gray-700" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ArchivedSubjects;