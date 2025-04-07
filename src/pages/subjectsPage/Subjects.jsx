import React, { useCallback, useState } from "react";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import PageLayout from "../../components/skillsComponents/PageLayout";
import SubjectForm from "../../components/subjectsComponents/SubjectForm";
import SubjectList from "../../components/subjectsComponents/SubjectsList";
import matieresServices from "../../services/matieresServices/matieres.service";
import useDeviceType from "../../utils/useDeviceType";
import { RoleEnum } from "../../utils/userRoles";

const Subject = () => {
    const [showForm, setShowForm] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [initialData, setInitialData] = useState(null);
    const [responseValue, setResponseValue] = useState('publish');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const deviceType = useDeviceType(); // Get the device type using the custom hook
    const isMobileOrTablet = deviceType === "mobile" || deviceType === "tablet"; // Check if the device is mobile or tablet

    const toggleForm = () => setShowForm((prev) => !prev);
    const role = useSelector((status) => status.auth.role);

    const handleEdit = (subject) => {
        setInitialData(JSON.parse(JSON.stringify(subject)));
        setShowForm(true);
    };

    const handleFormSubmit = async (updatedData) => {
        if (initialData) {
            try {
                const data = await matieresServices.updateMatieres(updatedData);
                setRefresh(!refresh);
                setInitialData(null);
                setShowForm(false);
                toast.success(data.message || "Subject updated successfully!");
            } catch (error) {
                toast.error("Failed to update subject: " + error);
            }
        } else {
            try {
                const data = await matieresServices.addMatieres(updatedData);
                setRefresh(!refresh);
                setInitialData(null);
                setShowForm(false);
                toast.success(data.message || "Subject Added successfully!");
            } catch (error) {
                toast.error("Failed to add subject: " + error);
            }
        }
    };

    const handlePublishSubjects = useCallback(async (res = null) => {
        try {
            const response = await matieresServices.publishMatieres(res ? res : responseValue);
            toast.success(response?.message || response?.data?.message || `Subjects ${responseValue} successfully!`);
            setRefresh(prev => !prev);
            return true;
        } catch (error) {
            console.error("Error publishing subjects:", error);
            toast.error("Failed to update subjects: " + (error?.message || error));
            return false;
        }
    }, [responseValue]);

    const headerActions = (
        <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
            {role === RoleEnum.ADMIN &&
                <>

                    {!showForm && <div className="flex gap-4">
                        <div className="relative">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-400 focus:outline-none"
                            >
                                <FiEye className="text-lg" />
                                Visibility
                            </button>
                            {isMenuOpen && (
                                <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-md z-10">
                                    <button
                                        onClick={() => { setResponseValue('publish'); handlePublishSubjects('publish'); setIsMenuOpen(false); }}
                                        className="w-full text-left mb-1 px-4 py-2 text-sm text-blue-800 hover:bg-blue-100 focus:outline-none"
                                    >
                                        <span className="inline-flex items-center">
                                            <FiEye className="text-sm mr-2" />
                                            Publish All
                                        </span>
                                    </button>
                                    <button
                                        onClick={() => { setResponseValue('masque'); handlePublishSubjects('masque'); setIsMenuOpen(false); }}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-red-100 focus:outline-none"
                                    >
                                        <span className="inline-flex items-center">
                                            <FiEyeOff className="text-sm mr-2" />Hide All
                                        </span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>}

                    {/* Button for large screens */}
                    {!isMobileOrTablet && (
                        <button
                            onClick={toggleForm}
                            className={`hidden sm:flex items-center px-4 py-2 rounded-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-400 text-sm sm:text-base ${showForm
                                ? "bg-red-500 hover:bg-red-600 text-white"
                                : "bg-green-500 hover:bg-green-600 text-white"
                                }`}
                        >
                            {showForm ? (
                                <>
                                    <FaArrowLeft className="text-lg mr-2" />
                                    Go Back
                                </>
                            ) : (
                                <>
                                    <FaPlus className="text-lg mr-2" />
                                    Add Subject
                                </>
                            )}
                        </button>
                    )}
                </>

            }
        </div>
    );

    return (
        <PageLayout title={showForm ? "Add a new subject" : "Subjects"} headerActions={headerActions}>
            {showForm ? (
                <SubjectForm
                    initialData={initialData}
                    onSubmit={handleFormSubmit}
                    onCancel={toggleForm}
                />
            ) : (
                <SubjectList onEdit={handleEdit} refresh={refresh} />
            )}

            {/* Button for mobile and tablet screens */}
            {role === RoleEnum.ADMIN && isMobileOrTablet && (
                <div className="fixed bottom-4 right-4">
                    <button
                        onClick={toggleForm}
                        className="bg-green-500 p-4 rounded-full shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                        {showForm ? (
                            <>
                                <FaArrowLeft className="text-white text-xl" />
                                <span className="sr-only">Go Back</span>
                            </>
                        ) : (
                            <>
                                <FaPlus className="text-white text-xl" />
                                <span className="sr-only">Add Subject</span>
                            </>
                        )}
                    </button>
                </div>
            )}
        </PageLayout>
    );
};

export default Subject;
