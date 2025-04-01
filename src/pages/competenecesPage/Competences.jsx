import debounce from "lodash.debounce";
import React, { useCallback, useEffect, useState } from "react";
import { FaPlusCircle, FaSortAlphaDown, FaSortAlphaUp } from 'react-icons/fa';
import { ClipLoader } from "react-spinners";
import { toast } from 'react-toastify';
import SkillCard from "../../components/skillsComponents/CompetenceCard";
import SkillForm from "../../components/skillsComponents/CompetenceForm";
import NotFound404 from "../../components/skillsComponents/NotFound404";
import Pagination from "../../components/skillsComponents/Pagination";
import SearchBar from "../../components/skillsComponents/SearchBar";
import Tooltip from "../../components/skillsComponents/tooltip";
import axiosAPI from "../../services/axiosAPI/axiosInstance";

const Competences = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortedSkills, setSortedSkills] = useState([]);
    const [newSkill, setNewSkill] = useState({
        title: '',
        frDescription: '',
        enDescription: '',
        isPublish: false,
        familyId: [],
        forced: false,
    });
    const [editSkill, setEditSkill] = useState(null);
    const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [families, setFamilies] = useState([]);

    const [titleSortOrder, setTitleSortOrder] = useState("asc");
    const [familySortOrder, setFamilySortOrder] = useState("asc");

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsOnPage, setItemsOnPage] = useState(8);
    const [itemsPerPage] = useState(8);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const [hasSearched, setHasSearched] = useState(false);

    const fetchCompetences = useCallback(async (page = 1, searchTerm = '', sortBy = '_id', order = 'desc') => {
        setLoading(true);
        try {
            const response = await axiosAPI.get("/competences", {
                params: {
                    page,
                    limit: itemsPerPage,
                    searchTerm,
                    sortBy,
                    order,
                }
            });
            setSkills(response.data.skills);
            setSortedSkills(response.data.skills);
            setTotalItems(response.data.pagination.totalSkills);
            setItemsOnPage(response.data.pagination.itemsOnPage);
            setTotalPages(response.data.pagination.totalPages);
        } catch (err) {
            // setError(err.response?.data?.error || "Failed to load skills.");
            setError("Failed to load skills: " + err.response?.data?.error);
            // toast.error(err.response?.data?.message || "Failed to load skills.");
            console.error(error);
            toast.error("Failed to load skills: " + (err.response?.data?.message || err.response?.data?.error));
        } finally {
            setLoading(false);
        }
    }, [error, itemsPerPage]);

    useEffect(() => {
        fetchCompetences(currentPage, searchQuery);
    }, [currentPage, searchQuery, fetchCompetences]);

    useEffect(() => {
        const fetchFamilies = async () => {
            try {
                const response = await axiosAPI.get("/family/");
                setFamilies(response.data.families);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load families.");
                toast.error(err.response?.data?.message || "Failed to load families.");
            }
        };
        fetchFamilies();
    }, []);

    const handleSearch = debounce((query) => {
        setSearchQuery(query.trim());
        setCurrentPage(1);  // Reset page to 1 whenever the search query changes
        setHasSearched(true);
    }, 500);

    const handleAddSkill = useCallback(async (event) => {
        event.preventDefault();

        try {
            const response = await axiosAPI.post("/competences", newSkill);

            setIsAddPopupOpen(false);
            setSearchQuery('');


            setSkills(prevSkills => [...prevSkills, response.data.skill]);
            setSortedSkills(prevSkills => [...prevSkills, response.data.skill]);

            setNewSkill({
                title: '',
                frDescription: '',
                enDescription: '',
                isPublish: false,
                familyId: [],
                forced: false,
            });

            // Only call fetchCompetences if the POST request is successful
            await fetchCompetences(currentPage, searchQuery);
            toast.success(response.data.message);

            // toast.error("Failed to add skill: Invalid response.");

        } catch (err) {
            // Display error and do not fetch competences if the POST request fails
            setError(err.response?.data?.message || "Failed to add skill.");
            toast.error("Failed to add skill : " + (err.response?.data?.error || err.response?.data?.message));
        }
    }, [newSkill, fetchCompetences, currentPage, searchQuery]);

    const handleUpdateSkill = useCallback(async (event) => {
        event.preventDefault();

        try {
            const response = await axiosAPI.patch(`/competences/${editSkill._id}`, editSkill);

            const updatedSkillsList = skills.map(skill =>
                skill._id === editSkill._id ? response.data.skill : skill
            );
            setSkills(updatedSkillsList);
            setSortedSkills(updatedSkillsList);

            setIsEditPopupOpen(false);

            // Only call fetchCompetences if the PATCH request is successful
            await fetchCompetences(currentPage);
            toast.success(response.data.message);
        } catch (err) {
            // Display error and do not fetch competences if the PATCH request fails
            setError(err.response?.data?.message || "Failed to update skill.");
            toast.error("Failed to update skill : " + (err.response?.data?.error || err.response?.data?.message));
        }
    }, [editSkill, skills, currentPage, fetchCompetences]);

    const handleDeleteSkill = useCallback(async (id, forced = false) => {
        try {
            await axiosAPI.delete(`/competences/${id}`, { data: { forced: forced } });
            // const updatedSkillsList = skills.filter(skill => skill._id !== id);
            // setSkills(updatedSkillsList);
            // setSortedSkills(updatedSkillsList);
            if (itemsOnPage === 1)
                setCurrentPage(1);
            await fetchCompetences(currentPage, searchQuery);
            toast.success("Competence deleted successfully!");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete skill.");
            toast.error("Failed to delete skill : " + + (err.response?.data?.error || err.response?.data?.message));
        }
    }, [itemsOnPage, fetchCompetences, currentPage, searchQuery]);

    const handleSortByTitle = useCallback(() => {
        const newSortOrder = titleSortOrder === 'asc' ? 'desc' : 'asc';
        setTitleSortOrder(newSortOrder);
        fetchCompetences(currentPage, searchQuery, 'title', newSortOrder); // Fetch sorted data from backend
    }, [currentPage, searchQuery, titleSortOrder, fetchCompetences]);

    const handleSortByFamily = useCallback(() => {
        const newSortOrder = familySortOrder === 'asc' ? 'desc' : 'asc';
        setFamilySortOrder(newSortOrder);
        fetchCompetences(currentPage, searchQuery, 'familyId', newSortOrder); // Fetch sorted data from backend
    }, [currentPage, searchQuery, familySortOrder, fetchCompetences]);

    const handlePageChange = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) return; // Prevent navigating out of bounds
        setCurrentPage(pageNumber);
    };

    return (
        <div className="container mx-auto p-6 bg-white shadow-l rounded-xl">
            <h1 className="text-4xl font-bold text-center mb-8 text-indigo-700">List of Competences</h1>

            {/* Search bar, Add Competence button, and Sorting buttons inline */}
            <div className="flex justify-around items-center mb-8 space-x-6 ">
                {/* Add Competence Button */}
                <Tooltip text="Add Competenence" position="top" bgColor="bg-black"  >
                    <button
                        onClick={() => setIsAddPopupOpen(true)}
                        className="bg-teal-600  text-white px-4 py-2 rounded-md hover:bg-teal-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 flex items-center"
                    >
                        <FaPlusCircle className="mr-2" />
                        <span className="font-semibold">Add </span>
                    </button>
                </Tooltip>
                {/* Search Bar */}
                <SearchBar handleSearch={handleSearch} className="flex-grow max-w-xs" />

                {/* Sorting Buttons */}
                <div className="flex space-x-4">
                    <Tooltip text={`${titleSortOrder.toUpperCase()} : Sort by`} position="top" bgColor="bg-black"  >
                        <button
                            onClick={handleSortByTitle}
                            className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            title="Sort by Title"
                        >
                            {titleSortOrder === "asc" ? <FaSortAlphaUp /> : <FaSortAlphaDown />}
                            <span className="ml-2">Title</span>
                        </button>
                    </Tooltip>
                    <Tooltip text={`${familySortOrder.toUpperCase()} : Sort by`} position="top" bgColor="bg-black"  >
                        <button
                            onClick={handleSortByFamily}
                            className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            title="Sort by Family"
                        >
                            {familySortOrder === "asc" ? <FaSortAlphaUp /> : <FaSortAlphaDown />}
                            <span className="ml-2">Family</span>
                        </button>
                    </Tooltip>
                </div>
            </div>

            {/* Competences Cards Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-6">
                        <ClipLoader color="#4A90E2" size={50} />
                        <p>Loading...</p>
                    </div>
                ) : sortedSkills.length === 0 && hasSearched ? (
                    <div className="col-span-full text-center py-6">
                        <NotFound404 iconSize={250} />
                    </div>
                ) : (
                    sortedSkills.map((skill, index) => (
                        <SkillCard
                            key={skill?._id || index}
                            skill={skill}
                            setEditSkill={setEditSkill}
                            setIsEditPopupOpen={setIsEditPopupOpen}
                            handleDeleteSkill={handleDeleteSkill}
                            families={families}
                        />
                    ))
                )}
            </div>

            {/* Pagination */}
            {sortedSkills.length > 0 && totalItems > 0 &&
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            }

            {/* Use the SkillForm component for both Add and Edit popups */}
            <SkillForm
                isAddPopupOpen={isAddPopupOpen}
                setIsAddPopupOpen={setIsAddPopupOpen}
                families={families}
                newSkill={newSkill}
                setNewSkill={setNewSkill}
                handleAddSkill={handleAddSkill}
                editSkill={editSkill}
                setEditSkill={setEditSkill}
                isEditPopupOpen={isEditPopupOpen}
                setIsEditPopupOpen={setIsEditPopupOpen}
                handleUpdateSkill={handleUpdateSkill}
            />
        </div >
    );
};

export default Competences;
