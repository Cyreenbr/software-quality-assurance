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
import competenceServices from "../../services/CompetencesServices/competences.service";

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
            // Appel du service pour récupérer les compétences
            const data = await competenceServices.fetchCompetences(page, searchTerm, sortBy, order, itemsPerPage);

            setSkills(data.skills);
            setSortedSkills(data.skills);
            setTotalItems(data.pagination.totalSkills);
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
        const fetchFamilies = async () => {
            try {
                const data = await competenceServices.fetchFamilies();
                setFamilies(data.families);
            } catch (error) {
                setError(error);
                toast.error("Failed to load families: " + error);
            }
        };
        fetchFamilies();
    }, []); // Le tableau de dépendances vide assure que cela ne s'exécute qu'une seule fois

    const handleSearch = debounce((query) => {
        setSearchQuery(query.trim());
        setCurrentPage(1);  // Reset page to 1 whenever the search query changes
        setHasSearched(true);
    }, 500);

    const handleAddSkill = useCallback(async (event) => {
        event.preventDefault();

        try {
            // Appel du service pour ajouter la compétence
            const data = await competenceServices.addCompetence(newSkill);

            setIsAddPopupOpen(false);
            setSearchQuery('');

            // Mise à jour du state avec la nouvelle compétence
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

            // Rafraîchir la liste des compétences
            await fetchCompetences(currentPage, searchQuery);

            toast.success(data.message || "Skill added successfully!");
        } catch (error) {
            setError(error);
            toast.error("Failed to add skill: " + error);
        }
    }, [newSkill, fetchCompetences, currentPage, searchQuery]);

    const handleUpdateSkill = useCallback(async (event) => {
        event.preventDefault();

        try {
            // Appel du service pour mettre à jour la compétence
            const data = await competenceServices.updateCompetence(editSkill);

            // Mise à jour du state avec la nouvelle liste
            const updatedSkillsList = skills.map(skill =>
                skill._id === editSkill._id ? data.skill : skill
            );
            setSkills(updatedSkillsList);
            setSortedSkills(updatedSkillsList);
            setIsEditPopupOpen(false);

            // Rafraîchir la liste des compétences
            await fetchCompetences(currentPage);

            toast.success(data.message || "Skill updated successfully!");
        } catch (error) {
            setError(error);
            toast.error("Failed to update skill: " + error);
        }
    }, [editSkill, skills, currentPage, fetchCompetences]);

    const handleDeleteSkill = useCallback(async (id, forced = false) => {
        try {
            await competenceServices.deleteCompetence(id, forced);

            // Met à jour la page actuelle si l'élément supprimé était le dernier de la page
            setCurrentPage(prevPage => (itemsOnPage === 1 && prevPage > 1 ? prevPage - 1 : prevPage));
            await fetchCompetences(currentPage, searchQuery);
            toast.success("Competence deleted successfully!");
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

    const handleOpenAddPopup = () => {
        setEditSkill(null); // Réinitialiser l'état d'édition
        setIsEditPopupOpen(false); // Fermer le popup d'édition au cas où
        setIsAddPopupOpen(true); // Ouvrir l'ajout
    };
    const closePopup = () => {
        setIsAddPopupOpen(false);
        setIsEditPopupOpen(false);
        setEditSkill(null); // Réinitialiser `editSkill` à la fermeture
    };
    return (
        <div className="container mx-auto p-6 bg-white shadow-l rounded-xl min-h-screen">
            <h1 className="text-4xl font-bold text-center mb-8 text-indigo-700">List of Competences</h1>

            {/* Search bar, Add Competence button, and Sorting buttons */}
            <div className="flex flex-col md:flex-row md:justify-between items-center mb-8 space-y-4 md:space-y-0 md:space-x-6">

                {/* Search Bar */}
                <SearchBar handleSearch={handleSearch} className="w-full md:max-w-xs" />

                {/* Add Competence Button */}
                <Tooltip text="Add Competence" position="top" bgColor="bg-black">
                    <button
                        onClick={handleOpenAddPopup}
                        className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 flex items-center w-full md:w-auto justify-center"
                    >
                        <FaPlusCircle className="mr-2" />
                        <span className="font-semibold">Add</span>
                    </button>
                </Tooltip>

                {/* Sorting Buttons */}
                <div className="flex space-x-4 w-full md:w-auto justify-center">
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
                <Pagination currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    styles={" bg-blue-600 text-white"}
                    hoverColor='bg-blue-500'
                />
            }

            {/* Use the SkillForm component for both Add and Edit popups */}
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
        </div >
    );
};

export default Competences;
