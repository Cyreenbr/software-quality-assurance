import debounce from "lodash.debounce";
import React, { useCallback, useEffect, useState } from "react";
import { FaPlusCircle, FaSortAlphaDown, FaSortAlphaUp } from 'react-icons/fa';
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';
import SkillForm from "../../components/skillsComponents/CompetenceForm";
import CompetenceList from "../../components/skillsComponents/CompetenceList";
import PageLayout from "../../components/skillsComponents/PageLayout";
import SearchBar from "../../components/skillsComponents/SearchBar";
import Tooltip from "../../components/skillsComponents/Tooltip";
import competenceServices from "../../services/CompetencesServices/competences.service";
import { RoleEnum } from "../../utils/userRoles";

const Competences = () => {
    const role = useSelector((state) => state.auth.role);
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
    const [totalPages, setTotalPages] = useState(1);
    const [hasSearched, setHasSearched] = useState(false);
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    const fetchCompetences = useCallback(async (page = 1, searchTerm = '', sortBy = '_id', order = 'desc') => {
        setLoading(true);
        try {
            const data = await competenceServices.fetchCompetences(page, searchTerm, sortBy, order, itemsPerPage);
            setSkills(data.skills);
            setSortedSkills(data.skills);
            setItemsOnPage(data.pagination.itemsOnPage);
            setTotalPages(data.pagination.totalPages);
        } catch (er) {
            setError(er);
            console.error("Failed to load skills: ", error);
            toast.error("Failed to load skills: " + error);
        } finally {
            setLoading(false);
        }
    }, [error, itemsPerPage]);

    useEffect(() => {
        fetchCompetences(currentPage, searchQuery);
    }, [currentPage, searchQuery, fetchCompetences]);

    useEffect(() => {
        if (role === RoleEnum.ADMIN) {
            const fetchFamilies = async () => {
                try {
                    const data = await competenceServices.fetchFamilies();
                    setFamilies(data.families);
                } catch (error) {
                    setError(error);
                    // toast.error("Failed to load families: " + error);
                    console.error("Failed to load families: " + error);
                }
            };
            fetchFamilies();
        }
    }, [role]);

    const handleSearch = debounce((query) => {
        setSearchQuery(query.trim());
        setCurrentPage(1);
        setHasSearched(true);
    }, 500);

    const handleAddSkill = useCallback(async () => {
        try {
            const data = await competenceServices.addCompetence(newSkill);
            setIsAddPopupOpen(false);
            setSearchQuery('');
            setSkills(prevSkills => [...prevSkills, data.skill]);
            setSortedSkills(prevSkills => [...prevSkills, data.skill]);
            setNewSkill({
                title: '',
                frDescription: '',
                enDescription: '',
                isPublish: false,
                familyId: [],
                forced: false,
            });

            await fetchCompetences(currentPage, searchQuery);
            toast.success(data.message || "Skill added successfully!");
        } catch (error) {
            setError(error);
            toast.error("Failed to add skill: " + error);
        }
    }, [newSkill, fetchCompetences, currentPage, searchQuery]);

    const handleUpdateSkill = useCallback(async () => {
        try {
            const data = await competenceServices.updateCompetence(editSkill);
            const updatedSkillsList = skills.map(skill =>
                skill._id === editSkill._id ? data.skill : skill
            );
            setSkills(updatedSkillsList);
            setSortedSkills(updatedSkillsList);
            setIsEditPopupOpen(false);

            await fetchCompetences(currentPage);
            toast.success(data.message || "Skill updated successfully!");
        } catch (error) {
            setError(error);
            toast.error("Failed to update skill: " + error);
        }
    }, [editSkill, skills, currentPage, fetchCompetences]);

    const handleDeleteSkill = useCallback(async (id, { forced = false, archive = false }) => {
        try {
            const response = await competenceServices.deleteCompetence(id, { forced, archive });
            // console.log(response);

            setCurrentPage(prevPage => (itemsOnPage === 1 && prevPage > 1 ? prevPage - 1 : prevPage));
            await fetchCompetences(currentPage, searchQuery);
            toast.success(response.message);
            return true;
        } catch (error) {
            setError(error);
            console.error("Error deleting skill:", error);
            toast.error("Failed to delete skill: " + (error?.message || error));
            return false;
        }
    }, [itemsOnPage, fetchCompetences, currentPage, searchQuery]);

    const handleSortByTitle = useCallback(() => {
        const newSortOrder = titleSortOrder === 'asc' ? 'desc' : 'asc';
        setTitleSortOrder(newSortOrder);
        fetchCompetences(currentPage, searchQuery, 'title', newSortOrder);
    }, [currentPage, searchQuery, titleSortOrder, fetchCompetences]);

    const handleSortByFamily = useCallback(() => {
        const newSortOrder = familySortOrder === 'asc' ? 'desc' : 'asc';
        setFamilySortOrder(newSortOrder);
        fetchCompetences(currentPage, searchQuery, 'familyId', newSortOrder);
    }, [currentPage, searchQuery, familySortOrder, fetchCompetences]);

    const handleOpenAddPopup = () => {
        setEditSkill(null);
        setIsEditPopupOpen(false);
        setIsAddPopupOpen(true);
    };

    const closePopup = () => {
        setIsAddPopupOpen(false);
        setIsEditPopupOpen(false);
        setEditSkill(null);
    };
    const headerActions = (role === RoleEnum.ADMIN) && (
        /* Bouton visible uniquement sur desktop */
        // <Tooltip text="Add Competence" position="top" bgColor="bg-black">
        <button
            onClick={handleOpenAddPopup}
            className="hidden md:flex items-center bg-indigo-400 text-white px-4 py-2 rounded-md hover:bg-indigo-500 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
            <FaPlusCircle className="text-2xl" />
            <span className="ml-2">Add</span>
        </button>
        // </Tooltip>
    )

    return (
        // <div className="min-h-screen bg-gray-100 p-4">
        //     <div className=" mx-auto bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">

        // <div className="  mx-auto p-8 bg-white shadow-lg rounded-xl min-h-screen overflow-hidden border border-gray-200">
        // <h1 className="text-4xl font-bold text-center mb-8 text-indigo-700">List of Competences</h1>
        <PageLayout title={"Competences"} headerActions={headerActions}>
            <div className="flex flex-col md:flex-row md:justify-between items-center mb-8 space-y-4 md:space-y-0 md:space-x-6">
                <SearchBar handleSearch={handleSearch} className="w-full md:max-w-xs" />
                <div className="pl-4 pr-4 flex space-x-4 w-full md:w-auto justify-center">


                    <Tooltip text={`${titleSortOrder.toUpperCase()} : Sort by Title`} position="top" bgColor="bg-black">
                        <button
                            onClick={handleSortByTitle}
                            className="flex items-center bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 w-full md:w-auto justify-center"
                            title="Sort by Title"
                        >
                            {titleSortOrder === "asc" ? <FaSortAlphaUp /> : <FaSortAlphaDown />}
                            <span className="ml-2">Title</span>
                        </button>
                    </Tooltip>
                    <Tooltip text={`${familySortOrder.toUpperCase()} : Sort by Family`} position="top" bgColor="bg-black">
                        <button
                            onClick={handleSortByFamily}
                            className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-auto justify-center"
                            title="Sort by Family"
                        >
                            {familySortOrder === "asc" ? <FaSortAlphaUp /> : <FaSortAlphaDown />}
                            <span className="ml-2">Family</span>
                        </button>
                    </Tooltip>


                </div>
            </div>

            <CompetenceList className="pl-4 pr-4"
                skills={sortedSkills}
                loading={loading}
                handleDeleteSkill={handleDeleteSkill}
                handleSortByTitle={handleSortByTitle}
                handleSortByFamily={handleSortByFamily}
                titleSortOrder={titleSortOrder}
                familySortOrder={familySortOrder}
                currentPage={currentPage}
                totalPages={totalPages}
                fetchCompetences={fetchCompetences}
                hasSearched={hasSearched}
                families={families}
                setEditSkill={setEditSkill}
                setIsEditPopupOpen={setIsEditPopupOpen}
                enableSortingBtns={true}
            />
            {/* <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                styles={" bg-blue-600 text-white"}
                hoverColor="bg-blue-500"
            /> */}

            {(role === RoleEnum.ADMIN) &&
                <div className="md:hidden">
                    {/* <Tooltip text="Add Competence" position="top" bgColor="bg-black"> */}
                    <button
                        onClick={handleOpenAddPopup}
                        className=" fixed bottom-6 right-6 bg-indigo-500 text-white p-4 rounded-full shadow-lg 
                       hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 flex items-center"
                    >
                        <FaPlusCircle className="text-2xl" />
                    </button>
                    {/* </Tooltip> */}
                </div>
            }
            {(isAddPopupOpen || isEditPopupOpen) && (role == RoleEnum.ADMIN || role === RoleEnum.TEACHER) &&
                <SkillForm
                    isPopupOpen={isAddPopupOpen || isEditPopupOpen}
                    setIsPopupOpen={closePopup}
                    families={families}
                    newSkill={newSkill}
                    setNewSkill={setNewSkill}
                    handleAddSkill={handleAddSkill}
                    editSkill={editSkill}
                    setEditSkill={setEditSkill}
                    handleUpdateSkill={handleUpdateSkill}
                />
            }
        </PageLayout>
        // </div >

    );
};

export default Competences;