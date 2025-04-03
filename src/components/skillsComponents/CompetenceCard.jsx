import React, { useState } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { FiAlertTriangle, FiArchive, FiCheck, FiCheckCircle, FiEdit, FiTrash, FiX } from 'react-icons/fi'; // Import icons
import useDeviceType from '../../utils/useDeviceType';
import Popup from './Popup';
import Tooltip from './Tooltip';

const SkillCard = ({ skill, setEditSkill, setIsEditPopupOpen, handleDeleteSkill, families }) => {
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const [skillToDelete, setSkillToDelete] = useState(null);
    const [isDetailsPopupOpen, setIsDetailsPopupOpen] = useState(false);
    const [forced, setForced] = useState(false);
    const [archive, setArchive] = useState(false);

    // Use the custom hook to get the device type
    const deviceType = useDeviceType();
    const isMobile = deviceType === 'mobile'; // || deviceType === 'tablet'; // Set isMobile based on the device type


    const handleConfirmDelete = async () => {
        if (skillToDelete) {
            const deleteSuccess = await handleDeleteSkill(skillToDelete._id, { forced, archive });
            console.log(deleteSuccess);

            // Fermer la popup si la suppression a réussi
            setIsDeletePopupOpen(deleteSuccess);
        }
    };


    const confirmDeleteMessage = `Are you sure you want to delete the skill "${skill?.title}"?`;

    return (
        <div
            // className="bg-white rounded-lg shadow-lg p-5 border border-gray-300 hover:shadow-xl transition transform hover:-translate-y-1"
            // className=" border border-gray-300 p-6 rounded-lg shadow-sm hover:shadow-xl hover:cursor-pointer hover:bg-gradient-to-r from-blue-50 to-purple-100  hover:-translate-y-1 transition-all duration-300 overflow-auto"

            className=" border border-gray-300 p-6 shadow-sm rounded-lg hover:shadow-xl hover:cursor-pointer  transition-all duration-300 overflow-auto hover:bg-gradient-to-r from-blue-50 to-purple-100 "
        >
            <div className="relative" onClick={() => setIsDetailsPopupOpen(true)}>
                <h2 className="text-xl text-center font-semibold text-blue-600">{skill?.title || 'No Title'}</h2>
                <span className="text-sm font-bold">Description(FR): </span>
                <p className="text-gray-700 mt-2 truncate max-w-full">
                    {skill?.frDescription ?
                        skill.frDescription
                        : 'No Description'}
                </p>
                <span className="text-sm font-bold">Description(EN): </span>
                <p className="text-gray-700 mt-2 truncate max-w-full">
                    {skill?.enDescription ?
                        skill.enDescription
                        : 'No Description'}
                </p>
            </div>

            <div className="relative mt-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-6">
                    <div className="flex flex-wrap gap-2">
                        {skill?.familyId?.length ? (
                            skill.familyId.map((family) => {
                                const familyTitle =
                                    typeof family === 'object'
                                        ? family.title
                                        : families.find((f) => f._id === family)?.title;

                                return (
                                    <span
                                        key={family._id || family}
                                        className="bg-blue-200 text-gray-700 px-3 py-1 rounded-full text-sm font-small"
                                    >
                                        {familyTitle}
                                    </span>
                                );
                            })
                        ) : (
                            <div className="flex flex-col items-center px-3 py-1 justify-center text-center text-sm text-gray-500">
                                No Family
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Buttons */}
            <div className="flex bottom-full justify-center mt-4 space-x-2 flex-wrap sm:flex-nowrap">
                {/* Edit Button */}
                <Tooltip text="Edit" position="top" bgColor="bg-black">
                    <button
                        onClick={() => {
                            setEditSkill(skill);
                            setIsEditPopupOpen(true);
                        }}
                        className="bg-blue-400 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition transform duration-300 mb-2 sm:mb-0"
                    >
                        <FiEdit className="text-xl" />
                    </button>
                </Tooltip>

                {/* Delete Button */}
                <Tooltip text="Delete" position="top" bgColor="bg-black">
                    <button
                        onClick={() => {
                            setSkillToDelete(skill);
                            setIsDeletePopupOpen(true);
                        }}
                        className=" bg-red-400 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition transform duration-300 mb-2 sm:mb-0"
                    >
                        <FiTrash className="text-xl" />
                    </button>
                </Tooltip>

                {/* View Details Button */}
                {/* <Tooltip text="View Details" position="top" bgColor="bg-black">
                    <button
                        onClick={() => setIsDetailsPopupOpen(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition transform duration-300 mb-2 sm:mb-0"
                    >
                        <FiEye className="text-xl" />
                    </button>
                </Tooltip> */}
            </div>



            {/* Confirm Delete Popup */}
            <Popup
                showCloseButton={true}
                isOpen={isDeletePopupOpen}
                onClose={() => setIsDeletePopupOpen(false)}
                onConfirm={handleConfirmDelete}
                position="center"
            >
                <div className="  max-w-md mx-auto">
                    <h2 className="text-2xl font-semibold text-red-600 text-center mb-4">
                        {confirmDeleteMessage || 'Are you sure?'}
                    </h2>

                    <div className="mb-6">
                        {/* <div className=" pb-0.5 text-lg text-center font-medium text-gray-700">Force Delete:</div> */}
                        <div className="flex justify-center gap-4 mt-2">
                            <Tooltip text={archive ? 'Archive Enabled' : 'Archive'} position='bottom'>
                                <button
                                    onClick={() => setArchive(!archive)}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-md 
                                    ${archive
                                            ? "bg-black text-white hover:bg-gray-700 shadow-lg"
                                            : "bg-gray-300 text-gray-700 hover:bg-gray-400 shadow-sm"
                                        }`}
                                >
                                    {archive ? (
                                        <>
                                            <FiAlertTriangle className="text-white text-lg" /> Enabled
                                        </>
                                    ) : (
                                        <>
                                            <FiArchive className="text-gray-700 text-lg" /> Archive
                                        </>
                                    )}
                                </button>
                            </Tooltip>
                            {/* Force Delete Button */}
                            <Tooltip text={forced ? 'Force Delete Enabled' : 'Enable Force Delete'} position='bottom'>
                                <button
                                    onClick={() => setForced(!forced)}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-md 
                                    ${forced
                                            ? "bg-red-600 text-white hover:bg-red-700 shadow-lg"
                                            : "bg-gray-300 text-gray-700 hover:bg-gray-400 shadow-sm"
                                        }`}
                                >
                                    {forced ? (
                                        <>
                                            <FiCheckCircle className="text-white text-lg" /> Enabled
                                        </>
                                    ) : (
                                        <>
                                            <FiAlertTriangle className="text-gray-700 text-lg" />Force Delete
                                        </>
                                    )}
                                </button>
                            </Tooltip>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between gap-4">
                        {/* Cancel Button */}
                        <button
                            onClick={() => setIsDeletePopupOpen(false)}
                            className="flex items-center gap-2 bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition duration-300 shadow-sm w-full sm:w-auto"
                        >
                            <FiX className="text-lg" />
                            <span>Cancel</span>
                        </button>

                        {/* Confirm Button */}
                        <button
                            onClick={handleConfirmDelete}
                            className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition duration-300 shadow-lg w-full sm:w-auto"
                        >
                            <FiCheck className="text-lg" />
                            <span>Confirm</span>
                        </button>
                    </div>
                </div>

            </Popup>

            {/* View Details Popup */}
            <Popup
                showCloseButton={true}
                isOpen={isDetailsPopupOpen}
                onClose={() => setIsDetailsPopupOpen(false)}
                position="center"
            >
                <h3 className="text-x3 text-center font-sm text-gray-400">Id: {skill?._id || 'No ID'}</h3>
                <div className="p-6">

                    <h2 className="text-xl font-semibold text-blue-600">{skill?.title || 'No Title'}</h2>
                    <p className="text-gray-700 mt-4">
                        <span className="text-sm font-bold">Description (FR): </span>{skill?.frDescription || 'No Description'}
                    </p>
                    <p className="text-gray-700 mt-2">
                        <span className="text-sm font-bold">Description (EN): </span>{skill?.enDescription || 'No Description'}
                    </p>

                    {/* Families */}
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold text-gray-600">Families</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {skill?.familyId?.length ? (
                                skill.familyId.map((family) => (
                                    <span
                                        key={family._id || family}
                                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                                    >
                                        {typeof family === 'object' ? family.title : families.find((f) => f._id === family)?.title}
                                    </span>
                                ))
                            ) : (
                                <p className="text-gray-500">No Family</p>
                            )}
                        </div>
                    </div>

                    {/* Edit and Delete Buttons */}
                    <div className="flex gap-4 justify-center mt-6">
                        <button
                            onClick={() => {
                                setEditSkill(skill);
                                setIsEditPopupOpen(true);
                                setIsDetailsPopupOpen(false);
                            }} // Handle Edit action
                            className="bg-blue-400 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2 hover:bg-blue-600 transition transform duration-300 mb-2 sm:mb-0"

                        // className="bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-yellow-600 transition"
                        >
                            {/* {!isMobile ? 'Edit' : ''}<FaEdit className="text-white" /> */}
                            {/* {!isMobile ? <FaEdit className="text-white" /> : 'Edit'} */}
                            {!isMobile ? <>
                                Edit
                                <FaEdit className="text-white" />
                            </> : ''}
                            {isMobile ? <Tooltip text={"Edit"} position='top'>
                                <FaEdit className="text-white" />
                            </Tooltip> : ''}
                        </button>
                        <button
                            onClick={() => {
                                setSkillToDelete(skill);
                                setIsDeletePopupOpen(true);
                                setIsDetailsPopupOpen(false);
                            }} // Handle Delete action
                            className=" bg-red-400 text-white px-4 py-2 rounded-lg shadow-md  flex items-center gap-2 hover:bg-red-600 transition transform duration-300 mb-2 sm:mb-0"

                        // className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                        >
                            {!isMobile ? <>
                                Delete
                                <FaTrashAlt className="text-white" />
                            </> : ''}
                            {isMobile ? <Tooltip text={"Delete"} position='top'>
                                <FaTrashAlt className="text-white" />
                            </Tooltip> : ''}
                        </button>
                    </div>

                    {/* Close Button */}
                    {/* <div className="flex justify-end mt-6">
                        <button
                            onClick={() => setIsDetailsPopupOpen(false)}
                            className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
                        >
                            Close
                        </button>
                    </div> */}
                </div>
            </Popup>
        </div>
    );
};

export default SkillCard;
