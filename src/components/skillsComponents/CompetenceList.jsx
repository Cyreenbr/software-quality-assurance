// CompetenceList.jsx
import React from 'react';
import { FaSortAlphaDown, FaSortAlphaUp } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';
import SkillCard from './CompetenceCard/';
import NotFound404 from './NotFound404';
import Pagination from './Pagination';
import Tooltip from './Tooltip';

const CompetenceList = ({
    skills,
    loading,
    handleDeleteSkill,
    handleSortByTitle,
    handleSortByFamily,
    titleSortOrder,
    familySortOrder,
    currentPage,
    totalPages,
    fetchCompetences,
    hasSearched,
    families,
    setEditSkill,
    setIsEditPopupOpen,
    enableSortingBtns = true,
    enableDefaultPaginationbtns = false,
    className = ''
}) => {
    return (
        <div className={className}>
            {/* Sorting Buttons */}
            {enableSortingBtns && (<div className="flex space-x-4 w-full md:w-auto justify-center mb-6">
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
            </div>)}


            {/* Competence Cards Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-6 mt-40">
                        <ClipLoader color="#4A90E2" size={50} />
                        <p>Loading...</p>
                    </div>
                ) : skills.length === 0 ? (
                    <div className="col-span-full text-center py-6">
                        <NotFound404 iconSize={250} />
                    </div>
                ) : (
                    skills.map((skill, index) => (
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
            {
                enableDefaultPaginationbtns && skills.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(pageNumber) => fetchCompetences(pageNumber)}
                        styles={" bg-blue-600 text-white"}
                        hoverColor='bg-blue-500'
                    />
                )
            }
        </div >
    );
};

export default CompetenceList;
