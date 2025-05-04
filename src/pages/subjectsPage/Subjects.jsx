import React, { useCallback, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import PageLayout from "../../components/skillsComponents/PageLayout";
import SubjectForm from "../../components/subjectsComponents/SubjectForm";
import SubjectList from "../../components/subjectsComponents/SubjectsList";
import matieresServices from "../../services/matieresServices/matieres.service";
import { RoleEnum } from "../../utils/userRoles";

const Subject = () => {
    const [showForm, setShowForm] = useState(false); // Controls whether to show the form or the list
    const [refresh, setRefresh] = useState(false); // Triggers a refresh for the subject list
    const [initialData, setInitialData] = useState(null); // For editing existing subjects
    const [responseValue, setResponseValue] = useState('publish'); // For editing existing subjects
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // Toggle between the list and the form
    const toggleForm = () => setShowForm((prev) => !prev);
    const role = useSelector((status) => status.auth.role);
    // Handle edit action from the list
    const handleEdit = (subject) => {
        // Deep clone the subject to avoid mutation issues
        setInitialData(JSON.parse(JSON.stringify(subject)));
        setShowForm(true); // Show the form for editing
    };

    // Handle form submission (after adding/editing a subject)
    const handleFormSubmit = async (updatedData) => {
        if (initialData) {
            try {
                const data = await matieresServices.updateMatieres(updatedData);
                // Trigger a refresh of the subject list
                setRefresh(!refresh);
                // Reset form state
                setInitialData(null);
                setShowForm(false); // Hide the form after submission
                toast.success(data.message || "Subject updated successfully!");
            } catch (error) {
                toast.error("Failed to update subject: " + error);
            }
        } else {
            try {
                const data = await matieresServices.addMatieres(updatedData);
                console.log(data);
                setRefresh(!refresh);
                // Reset form state
                setInitialData(null);
                setShowForm(false); // Hide the form after submission
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
            // Ensure refresh triggers after the request
            setRefresh(prev => !prev);
            return true;
        } catch (error) {
            console.error("Error publishing subjects:", error);
            toast.error("Failed to update subjects: " + (error?.message || error));
            return false;
        }
    }, [responseValue]);


    // Header Actions (Add Subject Button)
    const headerActions = !showForm && (
        <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
            {role === RoleEnum.ADMIN &&
                <>
                    <div className="flex gap-4">
                        <div className="relative">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)} // Toggle dropdown visibility
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
                    </div>
                    <button
                        onClick={toggleForm}
                        className="flex items-center bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-400 text-sm sm:text-base"
                    >
                        <FaPlus className="text-lg mr-2" />
                        Add Subject
                    </button>
                </>
            }
        </div >
    );

    return (
        <PageLayout title="Subjects" headerActions={headerActions}>
            {/* Render either the list or the form */}
            {showForm ? (
                <SubjectForm
                    initialData={initialData}
                    onSubmit={handleFormSubmit} // Pass the updated handleFormSubmit
                    onCancel={toggleForm} // Allow canceling the form
                />
            ) : (
                <SubjectList onEdit={handleEdit} refresh={refresh} />
            )}
        </PageLayout>
    );
};

export default Subject;