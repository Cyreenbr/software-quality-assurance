import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import matieresServices from "../../services/matieresServices/matieres.service";

const TeacherSearchDropdown = ({ onSelectTeacher, preselectedTeacher }) => {
    const [teachers, setTeachers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Fetch teachers based on search term
    const fetchTeachers = async (searchValue) => {
        setIsLoading(true);
        try {
            const data = await matieresServices.fetchTeachers({ page: 1, searchTerm: searchValue, limit: 5 });
            if (!data || !Array.isArray(data.teachers)) {
                throw new Error("Invalid response from server.");
            }
            setTeachers(data.teachers);
        } catch (error) {
            toast.error("Failed to load teachers: " + error.message);
        }
        setIsLoading(false);
    };

    // Handle search input changes
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setIsDropdownOpen(true); // Open dropdown on search
    };

    // Handle teacher selection
    const handleSelectTeacher = (teacher) => {
        setSelectedTeacher(teacher);
        console.log(teacher._id);

        setIsDropdownOpen(false); // Close dropdown on selection
        onSelectTeacher(teacher); // Pass selected teacher to parent via onSelectTeacher
    };

    // Clear selected teacher
    const handleClearSelection = () => {
        setSelectedTeacher(null);
        setSearchTerm("");
        setTeachers([]);
        onSelectTeacher(null); // Clear selection in parent
    };

    // Handle preselected teacher
    useEffect(() => {
        if (preselectedTeacher && preselectedTeacher._id !== selectedTeacher?._id) {
            setSelectedTeacher(preselectedTeacher); // Update state only if preselectedTeacher changes
            onSelectTeacher(preselectedTeacher); // Notify parent of the preselection
        } else if (!preselectedTeacher && selectedTeacher) {
            setSelectedTeacher(null); // Reset selected teacher if preselectedTeacher is cleared
            onSelectTeacher(null); // Clear selection in parent
        }
    }, [preselectedTeacher, selectedTeacher, onSelectTeacher]);

    // Fetch teachers when search term changes
    useEffect(() => {
        if (searchTerm.trim() === "") {
            setTeachers([]); // Reset teachers if search is cleared
            return;
        }
        fetchTeachers(searchTerm);
    }, [searchTerm]);

    return (
        <div className="relative w-full">
            {/* Search Input */}
            <input
                type="text"
                placeholder="Search for a teacher..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                onFocus={() => setIsDropdownOpen(true)}
            />

            {/* Dropdown List */}
            {isDropdownOpen && teachers.length > 0 && (
                <ul className="absolute w-full bg-white border rounded-md mt-1 shadow-lg max-h-60 overflow-auto z-10">
                    {teachers.map((teacher) => (
                        <li
                            key={teacher._id}
                            onClick={() => handleSelectTeacher(teacher)}
                            className="cursor-pointer px-4 py-2 hover:bg-blue-100 flex justify-between"
                        >
                            <span>{teacher.firstName} {teacher.lastName} ({teacher.email})</span>
                            {selectedTeacher?._id === teacher._id && <FaCheckCircle className="text-blue-600" />}
                        </li>
                    ))}
                </ul>
            )}

            {/* Loading Indicator */}
            {isLoading && (
                <div className="absolute w-full flex justify-center bg-white border rounded-md mt-1 shadow-lg py-2">
                    <ClipLoader size={20} color="#4A90E2" />
                </div>
            )}

            {/* Selected Teacher */}
            {selectedTeacher && (
                <div className="mt-4 p-2 bg-blue-50 border border-blue-300 rounded-md flex justify-between items-center">
                    <span>
                        Selected: {selectedTeacher.firstName} {selectedTeacher.lastName} ({selectedTeacher.email})
                    </span>
                    <button
                        onClick={handleClearSelection}
                        className="text-red-500 hover:text-red-700"
                    >
                        <FaTimesCircle size={18} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default TeacherSearchDropdown;