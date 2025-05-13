import debounce from "lodash.debounce";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    FaBook,
    FaEdit,
    FaSortAlphaDown,
    FaSortAlphaUp,
    FaTrashAlt,
} from "react-icons/fa";
import { FiAlertTriangle, FiArchive, FiCheck, FiCheckCircle, FiX, } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import matieresServices from "../../services/matieresServices/matieres.service";
import { RoleEnum } from "../../utils/userRoles";
import NotFound404 from "../skillsComponents/NotFound404";
import Pagination from "../skillsComponents/Pagination";
import Popup from "../skillsComponents/Popup";
import SearchBar from "../skillsComponents/SearchBar";
import Tooltip from "../skillsComponents/Tooltip";

const SubjectList = ({ onEdit, refresh = false, }) => {
    const role = useSelector((status) => status.auth.role);
    const userId = useSelector((status) => status.auth.user.id);
    const [subjects, setSubjects] = useState([]);
    const [subjectToDelete, setSubjectToDelete] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortedSubjects, setSortedSubjects] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [titleSortOrder, setTitleSortOrder] = useState("asc");
    const navigate = useNavigate();
    const firstFetchDone = useRef(false);
    const [forced, setForced] = useState(false);
    const [archive, setArchive] = useState(false);
    const [itemsOnPage,] = useState(0);
    const confirmDeleteMessage = `Are you sure you want to delete this subject?`;
    let hide = false

    const handleConfirmDelete = async () => {
        const deleteSuccess = await handleDeleteSubject(subjectToDelete._id, { forced, archive });
        console.log(deleteSuccess);

        if (deleteSuccess === true) setIsDeletePopupOpen(false);
    };



    // Fetch subjects
    const fetchSubjects = useCallback(async (page, searchTerm, sortBy, order) => {
        setLoading(true);

        try {
            const response = await matieresServices.fetchMatieres(page, searchTerm, sortBy, order);
            const fetchedSubjects = response.subjects || [];
            setSubjects(fetchedSubjects);
            setSortedSubjects(fetchedSubjects); // Update sorted subjects
            setTotalPages(response.pagination?.totalPages || 1);
            setError(null);
        } catch (err) {
            if (!hide)
                toast.error(`Failed to load subjects: ${err}`);
            hide = true
            setError(err || "An error occurred while fetching subjects.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSubjects();
    }, [fetchSubjects, refresh]);

    // Initial fetch
    useEffect(() => {
        if (!firstFetchDone.current) {
            firstFetchDone.current = true;
            fetchSubjects(currentPage, searchQuery, "title", titleSortOrder);
        }
    }, [fetchSubjects, currentPage, searchQuery, titleSortOrder]);

    // Debounced search handler
    const handleSearch = debounce((query) => {
        setSearchQuery(query.trim());
        setCurrentPage(1); // Reset to the first page when searching
        fetchSubjects(1, query.trim(), "title", titleSortOrder); // Trigger fetch with new search query
    }, 500);

    // Toggle sort order
    const handleSortByTitle = () => {
        const newSortOrder = titleSortOrder === "asc" ? "desc" : "asc";
        setTitleSortOrder(newSortOrder);
        fetchSubjects(currentPage, searchQuery, "title", newSortOrder); // Trigger fetch with new sort order
    };

    // Handle page change
    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            fetchSubjects(pageNumber, searchQuery, "title", titleSortOrder); // Trigger fetch for the new page
        }
    };

    // Delete subject
    const handleDeleteSubject = useCallback(async (id, forced = false) => {
        try {
            await matieresServices.deleteMatiere(id, forced);

            // Met à jour la page actuelle si l'élément supprimé était le dernier de la page
            setCurrentPage(prevPage => (itemsOnPage === 1 && prevPage > 1 ? prevPage - 1 : prevPage));
            await fetchSubjects(currentPage, searchQuery);
            toast.success("Subject deleted successfully!");
            return true;
        } catch (error) {
            setError(error);
            console.error("Error deleting subject:", error);
            toast.error("Failed to delete subject: " + (error?.message || error));
            return false;
        }
    }, [fetchSubjects, currentPage, searchQuery, itemsOnPage]);

    return (
        <div className="min-h-screen p-6 ">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
                {/* Search Bar */}
                <SearchBar
                    handleSearch={handleSearch}
                    placeholder="Search subjects..."
                    className="w-full md:max-w-sm"
                />

                {/* Sort Button */}
                <Tooltip text={`Sort by Title (${titleSortOrder.toUpperCase()})`} position="top">
                    <button
                        onClick={handleSortByTitle}
                        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md"
                    >
                        {titleSortOrder === "asc" ? (
                            <>
                                <FaSortAlphaUp className="mr-2" /> Ascending
                            </>
                        ) : (
                            <>
                                <FaSortAlphaDown className="mr-2" /> Descending
                            </>
                        )}
                    </button>
                </Tooltip>
            </header>

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center min-h-[300px]">
                    <ClipLoader color="#3B82F6" size={50} />
                </div>
            )}

            {/* Error State */}
            {error && (
                // <div className="text-red-600 text-center py-4">
                <NotFound404 title={error} iconSize={150} />
                // <p>{error}</p>
                // </div>
            )}

            {/* Subjects List */}
            {!loading && !error && subjects.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedSubjects.map((subject) => (
                        <div
                            key={subject._id}
                            className="bg-white border border-gray-300 p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:bg-gradient-to-r from-blue-50 to-purple-100 overflow-hidden"
                        >
                            {/* Subject Title (Clickable Link) */}
                            <div
                                className="flex items-center justify-between mb-4 cursor-pointer"
                                onClick={() => navigate(`/subjects/${subject._id}`)}
                            >
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <FaBook className="text-blue-600" /> {subject.title}
                                </h2>
                                {role === RoleEnum.ADMIN && <span
                                    className={`text-xs font-semibold px-2 py-1 rounded-full ${subject.isPublish ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                                        }`}
                                >
                                    {subject.isPublish ? "Published" : "Hidden"}
                                </span>}
                            </div>

                            {/* Subject Details */}
                            <ul className="mt-3 space-y-2 text-sm text-gray-600">
                                <li>📌 Level: {subject.curriculum?.level || "Not specified"}</li>
                                <li>⏳ Semester: {subject.curriculum?.semestre || "N/A"}</li>
                                <li>📚 Code: {subject.curriculum?.code || "N/A"}</li>
                            </ul>

                            {/* Actions */}
                            {(RoleEnum.ADMIN === role || userId === subject.curriculum?.teacherId) && (
                                <div className="flex flex-col sm:flex-row sm:justify-center items-center mt-6">
                                    {/* Edit Button */}
                                    <button
                                        onClick={() => onEdit(subject)}
                                        className="flex justify-center items-center bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition duration-200 sm:w-auto w-full mb-2 sm:mb-0 sm:mr-2"
                                    >
                                        <FaEdit className="mr-2" /> Edit
                                    </button>

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => {
                                            setIsDeletePopupOpen(true);
                                            setSubjectToDelete(subject);
                                        }}
                                        className="flex justify-center items-center bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition duration-200 sm:w-auto w-full sm:ml-2"
                                    >
                                        <FaTrashAlt className="mr-2" /> Delete
                                    </button>
                                </div>
                            )}


                        </div>
                    ))}
                </div>
            )}

            {/* No Subjects Found */}
            {!loading && !error && subjects.length === 0 && (
                <div className="text-center">
                    <NotFound404 title="No subjects found." iconSize={150} />
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    styles="bg-blue-700 text-white"
                    hoverColor="bg-blue-500"
                    NextTxtBtn="Next"
                    PreviousTxtBtn="Prev"
                />
            )}

            {/* Delete Confirmation Popup */}
            <Popup
                isOpen={isDeletePopupOpen}
                onClose={() => setIsDeletePopupOpen(false)}
                // onConfirm={() => handleDelete(subjectToDelete._id)}
                position="center"
            >
                <div className="max-w-md mx-auto text-center">
                    <h2 className="text-2xl font-semibold text-red-600 mb-4">{confirmDeleteMessage}</h2>
                    <div className="flex justify-center gap-4 mb-6">
                        {/* Archive Toggle Button */}
                        <Tooltip text={archive ? "Archive Enabled" : "Enable Archive"} position="bottom">
                            <button
                                onClick={() => setArchive(!archive)} // Toggle archive state
                                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-md ${archive ? "bg-black text-white hover:bg-gray-700" : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                                    }`}
                            >
                                {archive ? <FiAlertTriangle className="text-white text-lg" /> : <FiArchive className="text-gray-700 text-lg" />}
                                {archive ? "Enabled" : "Archive"}
                            </button>
                        </Tooltip>

                        {/* Force Delete Toggle Button */}
                        <Tooltip text={forced ? "Force Delete Enabled" : "Enable Force Delete"} position="bottom">
                            <button
                                onClick={() => setForced(!forced)} // Toggle force state
                                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-md ${forced ? "bg-red-600 text-white hover:bg-red-700" : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                                    }`}
                            >
                                {forced ? <FiCheckCircle className="text-white text-lg" /> : <FiAlertTriangle className="text-gray-700 text-lg" />}
                                {forced ? "Enabled" : "Force Delete"}
                            </button>
                        </Tooltip>
                    </div>

                    {/* Confirm and Cancel Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                        {[
                            {
                                label: "Confirm",
                                action: () => {
                                    handleConfirmDelete(); console.log(subjectToDelete._id);
                                },
                                bgColor: "bg-red-600 hover:bg-red-700",
                                icon: <FiCheck className="text-lg" />,
                            },
                            {
                                label: "Cancel",
                                action: () => setIsDeletePopupOpen(false),
                                bgColor: "bg-gray-400 hover:bg-gray-500",
                                icon: <FiX className="text-lg" />,
                            },
                        ].map(({ label, action, bgColor, icon }) => (
                            <button
                                key={label}
                                onClick={action}
                                className={`${bgColor} text-white px-6 py-3 rounded-lg transition flex items-center justify-center gap-2 w-full`}
                            >
                                {icon}
                                <span>{label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </Popup>
        </div>
    );
};

export default SubjectList;