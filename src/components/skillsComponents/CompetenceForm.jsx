import React, { useEffect, useState } from 'react';
import { FaPlusCircle } from 'react-icons/fa';
import { FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import Popup from './Popup'; // Assuming you have this Popup component

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
        <form onSubmit={(e) => { handleSubmit(e, editSkill ? handleAddSkill : handleUpdateSkill) }}>
            {/* Add Skill Popup */}
            <Popup
                showCloseButton={true}
                isOpen={isAddPopupOpen}
                onClose={() => setIsAddPopupOpen(false)}
                title="Add New Competence"
                position="center"
            >
                {/* Form Inputs */}
                <input
                    type="text"
                    placeholder="Title"
                    className="border p-3 rounded-xl mb-3 w-full focus:ring-2 focus:ring-blue-300"
                    value={newSkill.title}
                    onChange={(e) => setNewSkill({ ...newSkill, title: e.target.value })}
                />
                <textarea
                    placeholder="French Description"
                    className="border p-3 rounded-xl mb-3 w-full focus:ring-2 focus:ring-blue-300"
                    value={newSkill.frDescription}
                    onChange={(e) => setNewSkill({ ...newSkill, frDescription: e.target.value })}
                />
                <textarea
                    placeholder="English Description"
                    className="border p-3 rounded-xl mb-3 w-full focus:ring-2 focus:ring-blue-300"
                    value={newSkill.enDescription}
                    onChange={(e) => setNewSkill({ ...newSkill, enDescription: e.target.value })}
                />
                <div className="mb-3">
                    <select
                        multiple
                        value={newSkill.familyId || []} // Ensure it's always an array
                        onChange={(e) => {
                            const selectedValues = Array.from(e.target.selectedOptions, (option) => option.value);
                            setNewSkill({ ...newSkill, familyId: selectedValues });
                        }}
                        className="border p-3 rounded-xl mb-3 w-full focus:ring-2 focus:ring-blue-300"
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
                    <FaPlusCircle className="text-xl" />
                    {!isMobile && <span>Add Competence</span>}
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
                    <input
                        type="text"
                        placeholder="Title"
                        className="border p-3 rounded-xl mb-3 w-full focus:ring-2 focus:ring-blue-300"
                        value={editSkill.title}
                        onChange={(e) => setEditSkill({ ...editSkill, title: e.target.value })}
                    />
                    <textarea
                        placeholder="French Description"
                        className="border p-3 rounded-xl mb-3 w-full focus:ring-2 focus:ring-blue-300"
                        value={editSkill.frDescription}
                        onChange={(e) => setEditSkill({ ...editSkill, frDescription: e.target.value })}
                    />
                    <textarea
                        placeholder="English Description"
                        className="border p-3 rounded-xl mb-3 w-full focus:ring-2 focus:ring-blue-300"
                        value={editSkill.enDescription}
                        onChange={(e) => setEditSkill({ ...editSkill, enDescription: e.target.value })}
                    />
                    <div className="mb-3">
                        <select
                            multiple
                            defaultValue={editSkill.familyId.map(family => family._id) || []}
                            onChange={(e) => {
                                const selectedValues = Array.from(e.target.selectedOptions, (option) => option.value);
                                setEditSkill({ ...editSkill, familyId: selectedValues });
                            }}
                            className="border-2 border-gray-300 p-3 rounded-xl mb-3 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none hover:border-blue-400 transition-all ease-in-out duration-200"
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
                            onClick={() => setEditSkill({ ...editSkill, forced: !editSkill?.forced })}
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
                        className="bg-yellow-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-yellow-700 transition transform duration-300 w-full"
                    >
                        Update Competence
                    </button>
                </Popup>
            )}
        </form>
    );
};

export default SkillForm;
