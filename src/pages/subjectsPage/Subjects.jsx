import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import PageLayout from "../../components/skillsComponents/PageLayout";
import SubjectForm from "../../components/subjectsComponents/SubjectForm";
import SubjectList from "../../components/subjectsComponents/SubjectsList";
import matieresServices from "../../services/matieresServices/matieres.service";

const Subject = () => {
    const [showForm, setShowForm] = useState(false); // Controls whether to show the form or the list
    const [refresh, setRefresh] = useState(false); // Triggers a refresh for the subject list
    const [initialData, setInitialData] = useState(null); // For editing existing subjects

    // Toggle between the list and the form
    const toggleForm = () => setShowForm((prev) => !prev);

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

    // Header Actions (Add Subject Button)
    const headerActions = !showForm && (
        <button
            onClick={toggleForm}
            className="flex items-center bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-400"
        >
            <FaPlus className="text-lg mr-2" />
            Add Subject
        </button>
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