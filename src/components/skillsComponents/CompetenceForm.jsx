import React, { useEffect, useState } from 'react';
import { FaEdit, FaPlusCircle } from 'react-icons/fa';
import { FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import Popup from './Popup'; // Assuming you have this Popup component
import Tooltip from './tooltip';

const SkillForm = ({ isAddPopupOpen, setIsAddPopupOpen, families, newSkill, setNewSkill, handleAddSkill, editSkill, setEditSkill, isEditPopupOpen, setIsEditPopupOpen, handleUpdateSkill }) => {
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile/tablet screen sizes
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768); // If the width is <= 768px, treat it as mobile
        };

        handleResize(); // Set initial state
        window.addEventListener('resize', handleResize); // Add resize listener

        return () => window.removeEventListener('resize', handleResize); // Clean up listener
    }, []);
    // Prevent form submit and handle add/update skill
    const handleSubmit = (e, action) => {
        e.preventDefault(); // Prevent default form submit
        action(); // Execute the passed action (handleAddSkill or handleUpdateSkill)
    };

    return (
        <form onSubmit={(e) => { handleSubmit(e, editSkill ? handleAddSkill : handleUpdateSkill) }} className="space-y-6 p-6 bg-white rounded-xl shadow-xl animate__animated animate__fadeIn">
            {/* Add Skill Popup */}
            <Popup
                showCloseButton={true}
                isOpen={isAddPopupOpen}
                onClose={() => setIsAddPopupOpen(false)}
                title="Add New Competence"
                position="center"
            >
                {/* Form Inputs */}
                <div className="mb-3">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        id="title"
                        type="text"
                        placeholder="Title"
                        className="border p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-300 mt-1 transition-transform transform hover:scale-105 focus:outline-none focus:shadow-lg"
                        value={newSkill.title}
                        onChange={(e) => setNewSkill({ ...newSkill, title: e.target.value })}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="frDescription" className="block text-sm font-medium text-gray-700">French Description</label>
                    <textarea
                        id="frDescription"
                        placeholder="French Description"
                        className="border p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-300 mt-1 transition-transform transform hover:scale-105 focus:outline-none focus:shadow-lg"
                        value={newSkill.frDescription}
                        onChange={(e) => setNewSkill({ ...newSkill, frDescription: e.target.value })}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="enDescription" className="block text-sm font-medium text-gray-700">English Description</label>
                    <textarea
                        id="enDescription"
                        placeholder="English Description"
                        className="border p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-300 mt-1 transition-transform transform hover:scale-105 focus:outline-none focus:shadow-lg"
                        value={newSkill.enDescription}
                        onChange={(e) => setNewSkill({ ...newSkill, enDescription: e.target.value })}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="familyId" className="block text-sm font-medium text-gray-700">Select Families</label>
                    <select
                        id="familyId"
                        multiple
                        value={newSkill.familyId || []}
                        onChange={(e) => {
                            const selectedValues = Array.from(e.target.selectedOptions, (option) => option.value);
                            setNewSkill({ ...newSkill, familyId: selectedValues });
                        }}
                        className="border p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-300 mt-1 transition-transform transform hover:scale-105 focus:outline-none focus:shadow-lg"
                    >
                        <option value="" disabled>Select families</option>
                        {families.map((family) => (
                            <option key={family._id} value={family._id}>
                                {family.title}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={handleAddSkill}
                    className="bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-green-700 transition transform duration-300 w-full flex items-center justify-center space-x-2"
                >
                    {isMobile && (
                        <Tooltip position="top" text={'Add Competence'}>
                            <FaPlusCircle className="text-xl" />
                        </Tooltip>
                    )}
                    {!isMobile && (
                        <span className="flex items-center">
                            <FaPlusCircle className="text-xl" />
                            <span>Add Competence</span>
                        </span>
                    )}
                </button>
            </Popup>

            {/* Edit Skill Popup */}
            {editSkill && (
                <Popup
                    showCloseButton={true}
                    isOpen={isEditPopupOpen}
                    onClose={() => setIsEditPopupOpen(false)}
                    title="Edit Competence"
                    position="center"
                >
                    {/* Form Inputs */}
                    <div className="mb-3">
                        <label htmlFor="editTitle" className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            id="editTitle"
                            type="text"
                            placeholder="Title"
                            className="border p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-300 mt-1 transition-transform transform hover:scale-105 focus:outline-none focus:shadow-lg"
                            value={editSkill.title}
                            onChange={(e) => setEditSkill({ ...editSkill, title: e.target.value })}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="editFrDescription" className="block text-sm font-medium text-gray-700">French Description</label>
                        <textarea
                            id="editFrDescription"
                            placeholder="French Description"
                            className="border p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-300 mt-1 transition-transform transform hover:scale-105 focus:outline-none focus:shadow-lg"
                            value={editSkill.frDescription}
                            onChange={(e) => setEditSkill({ ...editSkill, frDescription: e.target.value })}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="editEnDescription" className="block text-sm font-medium text-gray-700">English Description</label>
                        <textarea
                            id="editEnDescription"
                            placeholder="English Description"
                            className="border p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-300 mt-1 transition-transform transform hover:scale-105 focus:outline-none focus:shadow-lg"
                            value={editSkill.enDescription}
                            onChange={(e) => setEditSkill({ ...editSkill, enDescription: e.target.value })}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="editFamilyId" className="block text-sm font-medium text-gray-700">Select Families</label>
                        <select
                            id="editFamilyId"
                            multiple
                            value={editSkill.familyId.map(family => family._id) || []}
                            onChange={(e) => {
                                const selectedValues = Array.from(e.target.selectedOptions, (option) => option.value);
                                setEditSkill({ ...editSkill, familyId: selectedValues });
                            }}
                            className="border-2 border-gray-300 p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-500 focus:outline-none hover:border-blue-400 transition-all ease-in-out duration-200 mt-1"
                        >
                            <option value="" disabled>Select families</option>
                            {families.map((family) => (
                                <option key={family._id} value={family._id}>
                                    {family.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Force Update Checkbox */}
                    <div className="flex mb-4 justify-center">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setEditSkill({ ...editSkill, forced: !editSkill?.forced })
                            }}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition duration-300 shadow-md
                            ${editSkill?.forced ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-gray-300 text-gray-700 hover:bg-gray-400"}`}
                        >
                            {editSkill?.forced ? (
                                <>
                                    <FiCheckCircle className="text-white text-lg" /> <span>Force Update Enabled</span>
                                </>
                            ) : (
                                <>
                                    <FiAlertTriangle className="text-gray-700 text-lg" /> <span>Enable Force Update</span>
                                </>
                            )}
                        </button>
                    </div>

                    <button
                        onClick={handleUpdateSkill}
                        className="bg-yellow-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-yellow-700 transition transform duration-300 w-full flex items-center justify-center space-x-2"
                    >
                        {isMobile && (
                            <Tooltip position="top" text={'Update Competence'}>
                                <FaEdit className="text-xl" />
                            </Tooltip>
                        )}
                        {!isMobile && (
                            <span className="flex items-center">
                                <FaEdit className="text-xl" />
                                <span>Update Competence</span>
                            </span>
                        )}
                    </button>
                </Popup>
            )}
        </form>
    );
};

export default SkillForm;
