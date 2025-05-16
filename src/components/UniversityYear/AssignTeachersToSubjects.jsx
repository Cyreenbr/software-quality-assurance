import { useEffect, useState } from "react";
import { FaChalkboardTeacher, FaCheckCircle } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import matieresServices from "../../services/matieresServices/matieres.service";
import SearchDropdown from "../subjectsComponents/SearchDropdown";

const AssignTeachersStep = ({
    currentStep,
    subjects,
    fetchTeachers,
    fetchingSubjects,
    teachers,
    step = 4,
    onSubmitAssignments,
}) => {
    const [selectedTeachers, setSelectedTeachers] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (subjects.length > 0) {
            setSelectedTeachers((prev) => {
                const updated = { ...prev };
                subjects.forEach((subject) => {
                    if (!updated[subject._id]) {
                        const defaultTeacherId = subject.teacherId?.[0]?._id || null;
                        updated[subject._id] = defaultTeacherId;
                    }
                });
                return updated;
            });
        }
    }, [subjects]);

    const handleSelectTeacher = (subjectId, teacher) => {
        setSelectedTeachers((prev) => ({
            ...prev,
            [subjectId]: teacher?._id || null,
        }));
    };

    const handleSubmitAssignments = async () => {
        setLoading(true);
        const assignments = Object.entries(selectedTeachers).map(
            ([subjectId, teacherId]) => ({ subjectId, teacherId })
        );

        if (onSubmitAssignments) {
            onSubmitAssignments(assignments);
        }

        try {
            const response = await matieresServices.affectTeachersToSubjects(assignments);
            toast.success(response.message || "Teachers assigned successfully.");
        } catch (error) {
            console.error("Failed to assign teachers", error);
            toast.error(error.message || "An error occurred while assigning teachers.");
        }
        setLoading(false);
    };

    const assignedCount = Object.values(selectedTeachers).filter(Boolean).length;

    return (
        currentStep === step && (
            <div>
                <h2 className="text-2xl font-bold mb-3">Step 4: Assign Teachers</h2>
                <p className="mb-6 text-gray-600">Select a teacher for each subject.</p>

                {fetchingSubjects ? (
                    <div className="text-center py-8">
                        <div className="inline-block animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                        <p className="mt-2 text-gray-600">Loading subjects...</p>
                    </div>
                ) : subjects.length > 0 ? (
                    <div className="space-y-4">
                        <div className="text-sm text-gray-600 font-medium text-right">
                            Assigned {assignedCount} / {subjects.length} subjects
                        </div>

                        <div className="overflow-x-auto border rounded bg-white shadow">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Subject Title</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Teacher</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {subjects.map((subject) => {
                                        const selectedTeacherId = selectedTeachers[subject._id];
                                        const selectedTeacherObj = teachers.find(
                                            (t) => t._id === selectedTeacherId
                                        ) || null;

                                        const isAssigned = Boolean(selectedTeacherId);

                                        return (
                                            <tr
                                                key={subject._id}
                                                className={`transition ${isAssigned ? "bg-green-50" : "bg-white"}`}
                                            >
                                                <td className="px-4 py-3 text-sm font-medium text-gray-800">{subject.title}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <SearchDropdown
                                                            fetchData={fetchTeachers}
                                                            onSelectItem={(teacher) =>
                                                                handleSelectTeacher(subject._id, teacher)
                                                            }
                                                            preselectedItem={selectedTeacherObj}
                                                            itemLabels={["firstName", "lastName"]}
                                                            selectedItem={
                                                                selectedTeacherObj
                                                                    ? `${selectedTeacherObj.firstName} ${selectedTeacherObj.lastName}`
                                                                    : ""
                                                            }
                                                            itemValue="_id"
                                                            placeholder="Search for a teacher..."
                                                            required
                                                            requiredMissMessage="This subject is without a Teacher"
                                                        />
                                                        {isAssigned && (
                                                            <FaCheckCircle className="text-green-500" />
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {!onSubmitAssignments && (
                            <div className="mt-6 flex justify-center">
                                <button
                                    onClick={handleSubmitAssignments}
                                    disabled={loading}
                                    className={`flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-semibold bg-teal-600 text-white transition ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-teal-700"
                                        }`}
                                >
                                    {loading ? (
                                        <ClipLoader color="#ffffff" size={20} />
                                    ) : (
                                        "Submit Assignments"
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <FaChalkboardTeacher className="mx-auto text-gray-400 text-4xl mb-4" />
                        <p>No subjects found.</p>
                    </div>
                )}
            </div>
        )
    );
};

export default AssignTeachersStep;
