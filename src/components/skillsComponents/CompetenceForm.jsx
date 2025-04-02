import React, { useEffect, useState } from 'react';
import { FaEdit, FaPlusCircle } from 'react-icons/fa';
import { FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import Popup from './Popup'; // Assuming you have this Popup component
import Tooltip from './tooltip';

const SkillForm = ({
    isPopupOpen,
    setIsPopupOpen,
    families,
    newSkill,
    setNewSkill,
    handleAddSkill,
    editSkill,
    setEditSkill,
    handleUpdateSkill
}) => {
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

    const renderInputField = ({ id, label, value, onChange, type = "text", placeholder, classNames }) => (
        <div className="mb-3">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
            {type === "textarea" ? (
                <textarea
                    id={id}
                    placeholder={placeholder}
                    className={classNames}
                    value={value || ""} // Assure que value n'est jamais undefined
                    onChange={onChange}
                />
            ) : (
                <input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    className={classNames}
                    value={value || ""} // Assure que value n'est jamais undefined
                    onChange={onChange}
                />
            )}
        </div>
    );


    // Handle submit logic for both Add and Edit
    const handleSubmit = (e) => {
        e.preventDefault();
        // If editSkill exists, it's an update, else it's an add
        if (editSkill) {
            handleUpdateSkill(e);
        } else {
            handleAddSkill(e);
        }
    };

    return (
        <Popup
            showCloseButton={true}
            isOpen={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
            title={editSkill ? "Edit Competence" : "Add New Competence"}
            position="center"
        >
            <form onSubmit={(e) => { handleSubmit(e) }} className="animate__animated animate__fadeIn">
                {/* Title Input */}
                {renderInputField({
                    id: editSkill ? "editTitle" : "title",
                    label: "Title",
                    placeholder: "Title",
                    value: editSkill ? editSkill.title : newSkill.title,
                    onChange: (e) => {
                        if (editSkill) {
                            setEditSkill({ ...editSkill, title: e.target.value });
                        } else {
                            setNewSkill({ ...newSkill, title: e.target.value });
                        }
                    },
                    classNames: "border p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-300 mt-1 transition-transform transform hover:scale-105 focus:outline-none focus:shadow-lg"
                })}

                {/* French Description */}
                {renderInputField({
                    id: editSkill ? "editFrDescription" : "frDescription",
                    label: "French Description",
                    placeholder: "French Description",
                    value: editSkill ? editSkill.frDescription : newSkill.frDescription,
                    onChange: (e) => {
                        if (editSkill) {
                            setEditSkill({ ...editSkill, frDescription: e.target.value });
                        } else {
                            setNewSkill({ ...newSkill, frDescription: e.target.value });
                        }
                    },
                    type: "textarea",
                    classNames: "border p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-300 mt-1 transition-transform transform hover:scale-105 focus:outline-none focus:shadow-lg"
                })}

                {/* English Description */}
                {renderInputField({
                    id: editSkill ? "editEnDescription" : "enDescription",
                    label: "English Description",
                    placeholder: "English Description",
                    value: editSkill ? editSkill.enDescription : newSkill.enDescription,
                    onChange: (e) => {
                        if (editSkill) {
                            setEditSkill({ ...editSkill, enDescription: e.target.value });
                        } else {
                            setNewSkill({ ...newSkill, enDescription: e.target.value });
                        }
                    },
                    type: "textarea",
                    classNames: "border p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-300 mt-1 transition-transform transform hover:scale-105 focus:outline-none focus:shadow-lg"
                })}

                {/* Select Families */}
                <div className="mb-3">
                    <label htmlFor={editSkill ? "editFamilyId" : "familyId"} className="block text-sm font-medium text-gray-700">Select Families</label>
                    <select
                        id={editSkill ? "editFamilyId" : "familyId"}
                        multiple
                        defaultValue={editSkill ? editSkill.familyId.map(family => family._id) || [] : newSkill.familyId || []}
                        onChange={(e) => {
                            const selectedValues = Array.from(e.target.selectedOptions, (option) => option.value);
                            if (editSkill) {
                                setEditSkill({ ...editSkill, familyId: selectedValues });
                            } else {
                                setNewSkill({ ...newSkill, familyId: selectedValues });
                            }
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

                {/* Force Update Checkbox (only for Edit) */}
                {editSkill && (
                    <div className="flex mb-4 justify-center">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setEditSkill({ ...editSkill, forced: !editSkill?.forced });
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
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    className={`${editSkill ? "bg-blue-600 hover:bg-blue-500" : "bg-green-600 hover:bg-green-700"
                        } text-white px-6 py-3 rounded-xl shadow-lg transition transform duration-300 w-full flex items-center justify-center space-x-2`}
                >
                    {isMobile && (
                        <Tooltip position="top" text={editSkill ? 'Update Competence' : 'Add Competence'}>
                            {editSkill ? <FaEdit className="text-xl" /> : <FaPlusCircle className="text-xl" />}
                        </Tooltip>
                    )}
                    {!isMobile && (
                        <span className="flex items-center">
                            {editSkill ? <FaEdit className="text-xl" /> : <FaPlusCircle className="text-xl" />}
                            <span>{editSkill ? 'Update Competence' : 'Add Competence'}</span>
                        </span>
                    )}
                </button>
            </form>
        </Popup>
    );
};

export default SkillForm;
