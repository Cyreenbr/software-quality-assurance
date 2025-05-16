import React, { useMemo, useState } from 'react';
import { FiAlertTriangle, FiArchive, FiCheck, FiCheckCircle, FiChevronDown, FiChevronUp, FiEdit, FiTrash, FiX } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { RoleEnum } from '../../utils/userRoles';
import Popup from './Popup';
import Tooltip from './tooltip';

const SkillCard = ({ skill, setEditSkill, setIsEditPopupOpen, handleDeleteSkill, families }) => {
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const [isDetailsPopupOpen, setIsDetailsPopupOpen] = useState(false);
    const [forced, setForced] = useState(false);
    const [archive, setArchive] = useState(false);
    const role = useSelector((state) => state.auth.role);
    const confirmDeleteMessage = `Are you sure you want to delete the skill "${skill?.title}"?`;


    const handleConfirmDelete = async () => {
        const deleteSuccess = await handleDeleteSkill(skill._id, { forced, archive });
        console.log(deleteSuccess);

        if (deleteSuccess === true) setIsDeletePopupOpen(false);
    };

    const familiesList = useMemo(() =>
        skill?.familyId?.map((family) => {
            const familyTitle = typeof family === 'object' ? family.title : families.find((f) => f._id === family)?.title;
            return (
                // <span key={family._id || family} className="bg-blue-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                <span key={family._id || family} className="flex items-center   bg-gray-200 px-3 py-0.5 rounded-full text-sm font-light text-gray-700 hover:bg-gray-300 transition-all">
                    {familyTitle}
                </span>
            );
        }) || [],
        [skill, families]);

    const [showAllFamilies, setShowAllFamilies] = useState(false);
    const displayedFamilies = showAllFamilies ? familiesList : familiesList.slice(0, 3);

    return (
        <div className="border border-gray-300 p-6 shadow-sm rounded-lg hover:shadow-xl hover:bg-gradient-to-r from-blue-50 to-purple-100 transition-all duration-300 overflow-auto">

            {/* Skill Details */}
            <div className="relative" onClick={() => setIsDetailsPopupOpen(true)}>

                {/* <h2 className="text-xl text-center mb-3 font-semibold text-blue-600  hover:cursor-pointer">{skill?.title || 'No Title'}</h2> */}
                <h2 className="text-xl sm:text-xl md:text-xl lg:text-2xl text-center mb-3 font-semibold text-blue-600 hover:cursor-pointer break-words">
                    {skill?.title || 'No Title'}
                </h2>
                {/* {role === RoleEnum.ADMIN && (
                    <p className="text-sm font-light break-words line-clamp-2">ID: {skill?._id || 'No ID'}</p>
                )} */}

                <p className="text-sm sm:text-base font-bold">Description (FR):</p>
                <p className="text-gray-700 mt-1 break-words line-clamp-2">
                    {skill?.frDescription || 'No Description'}
                </p>

                <p className="text-sm sm:text-base font-bold mt-2">Description (EN):</p>
                <p className="text-gray-700 mt-1 break-words line-clamp-2">
                    {skill?.enDescription || 'No Description'}
                </p>

            </div>

            <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                    {displayedFamilies.length > 0 ? displayedFamilies : <span className="text-gray-500 text-sm">No Family</span>}
                </div>

                {familiesList.length > 3 && (
                    <div className="flex justify-center">
                        <button
                            onClick={() => setShowAllFamilies(!showAllFamilies)}
                            className="flex items-center gap-1 text-blue-500 text-sm sm:text-base mt-4 mb-5 hover:text-blue-700 transition-all ease-in-out duration-300"
                        >
                            {showAllFamilies ? "Show Less" : "Load More"}
                            {showAllFamilies ? <FiChevronUp /> : <FiChevronDown />}
                        </button>
                    </div>
                )}
            </div>




            {/* Action Buttons */}
            {(role === RoleEnum.ADMIN) && (
                <>
                    <div className="flex justify-center mt-4 space-x-2">
                        <Tooltip text="Edit" position="top">
                            <button
                                onClick={() => {
                                    setEditSkill(skill);
                                    setIsEditPopupOpen(true);
                                }}
                                className="bg-blue-400 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
                            >
                                <FiEdit className="text-xl" />
                            </button>
                        </Tooltip>

                        <Tooltip text="Delete" position="top">
                            <button
                                onClick={() => setIsDeletePopupOpen(true)}
                                className="bg-red-400 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition duration-300"
                            >
                                <FiTrash className="text-xl" />
                            </button>
                        </Tooltip>
                    </div>
                    <Popup isOpen={isDeletePopupOpen} onClose={() => setIsDeletePopupOpen(false)} onConfirm={handleConfirmDelete} position="center">
                        <div className="max-w-md mx-auto text-center">
                            <h2 className="text-2xl font-semibold text-red-600 mb-4">{confirmDeleteMessage}</h2>
                            <div className="flex justify-center gap-4 mb-6">
                                <Tooltip text={archive ? 'Archive Enabled' : 'Archive'} position="bottom">
                                    <button
                                        onClick={() => setArchive(!archive)}
                                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-md ${archive ? "bg-black text-white hover:bg-gray-700" : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                                            }`}
                                    >
                                        {archive ? <FiAlertTriangle className="text-white text-lg" /> : <FiArchive className="text-gray-700 text-lg" />}
                                        {archive ? "Enabled" : "Archive"}
                                    </button>
                                </Tooltip>

                                <Tooltip text={forced ? 'Force Delete Enabled' : 'Enable Force Delete'} position="bottom">
                                    <button
                                        onClick={() => setForced(!forced)}
                                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-md ${forced ? "bg-red-600 text-white hover:bg-red-700" : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                                            }`}
                                    >
                                        {forced ? <FiCheckCircle className="text-white text-lg" /> : <FiAlertTriangle className="text-gray-700 text-lg" />}
                                        {forced ? "Enabled" : "Force Delete"}
                                    </button>
                                </Tooltip>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                                {[
                                    {
                                        label: "Confirm",
                                        action: handleConfirmDelete,
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
                                    // <Tooltip key={label} text={label} position="top" className="sm:hidden">
                                    <button
                                        key={label}
                                        onClick={action}
                                        className={`${bgColor} text-white px-6 py-3 rounded-lg transition flex items-center justify-center gap-2 w-full`}
                                    >
                                        {icon}
                                        <span className=" inline">{label}</span>

                                    </button>
                                    // </Tooltip>
                                ))}
                            </div>
                        </div>
                    </Popup>
                </>)
            }
            {/* Skill Details Popup */}
            <Popup showCloseButton isOpen={isDetailsPopupOpen} onClose={() => setIsDetailsPopupOpen(false)} position="center">

                <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                        {/* Title on the left */}
                        <h2 className="text-xl font-semibold text-blue-600">
                            {skill?.title || 'No Title'}
                        </h2>

                        {/* Badges on the right */}
                        {role === RoleEnum.ADMIN && (
                            <div className="flex flex-wrap items-center gap-2">
                                <span
                                    className={`text-sm font-semibold px-3 py-1 rounded-full ${skill.isPublish
                                            ? "bg-green-200 text-green-800"
                                            : "bg-red-200 text-red-800"
                                        }`}
                                >
                                    {skill.isPublish ? "Published" : "Hidden"}
                                </span>
                                <span
                                    className={`text-sm font-semibold px-3 py-1 rounded-full ${skill.archive
                                            ? "bg-orange-200 text-orange-800"
                                            : "bg-gray-200 text-gray-800"
                                        }`}
                                >
                                    {skill.archive ? "Archived" : "Not Archived"}
                                </span>
                            </div>
                        )}
                    </div>

                    {role === RoleEnum.ADMIN && (
                        <p className="text-sm font-light break-words line-clamp-2">ID: {skill?._id || 'No ID'}</p>
                    )}
                    <p className="text-gray-700 mt-4">
                        <span className="text-sm font-bold">Description (FR): </span>{skill?.frDescription || 'No Description'}
                    </p>
                    <p className="text-gray-700 mt-2">
                        <span className="text-sm font-bold">Description (EN): </span>{skill?.enDescription || 'No Description'}
                    </p>

                    {/* Families List */}
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold text-gray-600">Families</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {familiesList.length > 0 ? familiesList : <p className="text-gray-500">No Family</p>}
                        </div>
                    </div>
                </div>
            </Popup>
        </div>
    );
};

export default SkillCard;
