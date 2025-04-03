import React, { useEffect, useState } from 'react';
import { FaEdit, FaPlusCircle } from 'react-icons/fa';
import { ImPower } from "react-icons/im";
import { TiWarning } from "react-icons/ti";
import useDeviceType from '../../utils/useDeviceType';
import MultiSelectDropdownFamily from './MultiSelectDropdownFamily';
import Popup from './Popup';
import Tooltip from './Tooltip';

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
    const deviceType = useDeviceType(); // Utilisation du hook
    const isMobile = deviceType === "mobile"; // Vérification si c'est un mobile

    const [selectedFamilies, setSelectedFamilies] = useState(editSkill ? editSkill.familyId : []);

    useEffect(() => {
        if (editSkill && editSkill.familyId) {
            // Ensure familyId is in the correct format (array of IDs)
            setSelectedFamilies(editSkill.familyId.map(family => family._id || family)); // Assuming familyId is an array of family objects
        } else {
            setSelectedFamilies([]); // Reset to empty array if no editSkill or familyId is empty
        }
    }, [editSkill]);

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

    const handleSelectedFamiliesChange = (selectedFamiliesObjects) => {
        // console.log("Selected Families:", selectedFamiliesObjects);
        if (editSkill) {
            setEditSkill(prev => ({ ...prev, familyId: selectedFamiliesObjects }));
        } else {
            setNewSkill(prev => ({ ...prev, familyId: selectedFamiliesObjects }));
        }
    };

    // Handle submit logic for both Add and Edit
    const handleSubmit = (e) => {
        e.preventDefault();
        // Set familyId in either newSkill or editSkill based on the scenario
        if (editSkill) {
            setEditSkill({ ...editSkill, familyId: selectedFamilies });
            handleUpdateSkill(e);
        } else {
            setNewSkill({ ...newSkill, familyId: selectedFamilies });
            handleAddSkill(e);
        }
    };

    const size = isMobile ? 25 : 20;
    const buttonLabel = editSkill
        ? `Update Competence${editSkill?.forced ? ' (Forced)' : ''}`
        : 'Add Competence';
    const buttonIcon = editSkill ? <FaEdit size={size} className="text-xl" /> : <FaPlusCircle size={size} className="text-xl" />;

    const buttonClasses = `
        ${editSkill ? "bg-blue-600 hover:bg-blue-500" : "bg-gray-600 hover:bg-gray-500"} 
        mt-5 text-white px-6 py-3 rounded-lg shadow-md transition-all 
        transform active:scale-95 flex items-center justify-center space-x-3 
        w-full border border-transparent hover:border-gray-300`;

    const buttonContent = (
        <button type="submit" className={buttonClasses}>
            {buttonIcon}
            <span className="text-sm font-medium">{buttonLabel}</span>
        </button>
    );


    return (
        <Popup
            showCloseButton={true}
            isOpen={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
            title={editSkill ? "Edit Competence" : "Add New Competence"}
            position="center"
            titlePosition="center"
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
                    classNames: "border p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-300 mt-1 transition-transform transform hover:scale-103 hover:bg-blue-100 focus:outline-none focus:shadow-lg"
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
                    classNames: "border p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-300 mt-1 transition-transform transform hover:scale-103 hover:bg-blue-100 focus:outline-none focus:shadow-lg"
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
                    classNames: "border p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-300 mt-1 transition-transform transform hover:scale-103 hover:bg-blue-100 focus:outline-none focus:shadow-lg"
                })}

                {/* Select Families */}
                <div className="mb-3">
                    <label htmlFor={editSkill ? "editFamilyId" : "familyId"} className="block text-sm font-medium text-gray-700">
                        Families
                        {/* (
                        <span className="font-normal">
                            {editSkill ? editSkill.familyId.length : newSkill.familyId.length} selected
                        </span>
                        ) */}
                    </label>

                    <MultiSelectDropdownFamily
                        families={families}
                        selectedFamilies={selectedFamilies}
                        setSelectedFamilies={setSelectedFamilies}
                        onSelectionChange={handleSelectedFamiliesChange}
                    />
                </div>

                {/* Force Update Checkbox (only for Edit) */}
                {editSkill && (
                    <div className="flex mb-5 mt-5 justify-center">
                        <Tooltip text={editSkill?.forced ? 'Force Update Enabled' : 'Enable Force Update'} position='top'>
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
                                        <TiWarning className="text-white text-lg" /> <span>Enabled</span>
                                    </>
                                ) : (
                                    <>
                                        <ImPower className="text-gray-700 text-lg" /> <span>Force Update</span>
                                    </>
                                )}
                            </button>
                        </Tooltip>
                    </div>
                )}

                {/* Submit Button */}
                {buttonContent}

            </form>
        </Popup>
    );
};

export default SkillForm;
