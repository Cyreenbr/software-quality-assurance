import debounce from "lodash.debounce";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaSortAlphaDown, FaSortAlphaUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import matieresServices from "../../services/matieresServices/matieres.service";
import NotFound404 from "../skillsComponents/NotFound404";
import Pagination from "../skillsComponents/Pagination";
import SearchBar from "../skillsComponents/SearchBar";
import Tooltip from "../skillsComponents/Tooltip";

const SubjectList = ({ onEdit, refresh = false }) => {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortedSubjects, setSortedSubjects] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [titleSortOrder, setTitleSortOrder] = useState("asc");
    const navigate = useNavigate();
    const firstFetchDone = useRef(false);

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
            setError(err.message || "An error occurred while fetching subjects.");
            toast.error(`Failed to load subjects: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (refresh) {
            fetchSubjects()
        }
    }, [fetchSubjects, refresh])
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

    return (
        <div className="min-h-screen p-5">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
                <SearchBar
                    handleSearch={handleSearch}
                    placeholder="Search subjects..."
                    className="w-full md:max-w-sm"
                />
                <Tooltip text={`Sort by Title (${titleSortOrder.toUpperCase()})`} position="top">
                    <button
                        onClick={handleSortByTitle}
                        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
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
                <div className="text-red-600 text-center py-4">
                    <p>{error}</p>
                </div>
            )}

            {/* Subjects List */}
            {!loading && !error && subjects.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedSubjects.map((subject) => (
                        <div
                            key={subject._id}
                            className=" border border-gray-300 p-6 shadow-sm rounded-lg hover:shadow-xl hover:cursor-pointer  transition-all duration-300 overflow-auto hover:bg-gradient-to-r from-blue-50 to-purple-100 "
                        // className="bg-white rounded-lg shadow-lg p-5 border border-gray-300 hover:shadow-xl transition transform hover:-translate-y-1"
                        >
                            {/* Subject Title */}
                            <h2 className="text-xl font-semibold text-gray-900">{subject.title}</h2>

                            {/* Subject Details */}
                            <ul className="mt-3 space-y-2 text-sm text-gray-600">
                                <li>📌 Level: {subject.curriculum?.level || "Not specified"}</li>
                                <li>⏳ Semester: {subject.curriculum?.semestre || "N/A"}</li>
                                <li>📚 Code: {subject.curriculum?.code || "N/A"}</li>
                            </ul>

                            {/* Actions */}
                            <div className="flex flex-col gap-2 mt-4">
                                <button
                                    onClick={() => navigate(`/subjects/${subject._id}`)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition w-full"
                                >
                                    Show Details
                                </button>
                                <button
                                    onClick={() => onEdit(subject)}
                                    className="bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition w-full"
                                >
                                    Edit Subject
                                </button>

                            </div>
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
                />
            )}
        </div>
    );
};

export default SubjectList;