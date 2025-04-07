import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import competenceServices from "../../services/CompetencesServices/competences.service";
import matieresServices from "../../services/matieresServices/matieres.service";
import MSDropdown from "../skillsComponents/REComponents/MSDropdown";
import SearchDropdown from "./SearchDropdown";

const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const SubjectForm = ({ initialData = null, onSubmit }) => {


    const [formData, setFormData] = useState({
        _id: "",
        title: "",
        isPublish: false,
        isArchive: false,
        skillsId: [],
        teacherId: [],
        curriculum: {
            module: "",
            level: "",
            code: "",
            semestre: "",
            responsable: "",
            langue: "",
            relation: "",
            type_enseignement: "",
            volume_horaire_total: "",
            credit: "",
            prerequis_recommandes: [],
            chapitres: [],
        },
    });

    const [errorMessages, setErrorMessages] = useState({});

    // const [competences, setCompetences] = useState([]);
    const [limit, setLimit] = useState(100);
    // const [totalItems, setTotalItems] = useState(Infinity);
    const increment = 1;
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');  // État pour le terme de recherche
    const [competences, setCompetences] = useState([]);  // État pour les compétences récupérées
    const [totalItems, setTotalItems] = useState(0);  // Nombre total de compétences
    const [loading, setLoading] = useState(false);  // Indicateur de chargement
    //  
    const [competencesFiltered, setCompetencesFiltered] = useState([]); // Compétences filtrées par recherche
    const [selectedSkills, setSelectedSkills] = useState(formData.skillsId || []);
    const fetchCompetencesOptions = async (newLimit, searchTerm2 = '') => {
        try {
            setLoading(true);
            // Remplacez par votre propre service pour récupérer les compétences
            const data = await competenceServices.fetchCompetencesForForm({ searchTerm: searchTerm2, limit: newLimit });
            setCompetences((prev) => [
                ...prev,
                ...data.skills.filter((skill) => !prev.some((s) => s._id === skill._id)),
            ]);
            setTotalItems(data.pagination?.totalSkills || data.skills.length);
            setCompetencesFiltered(data.skills);
        } catch (error) {
            toast.error("Failed to load competences: " + error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setCompetencesFiltered(competences);  // Si aucun terme de recherche, afficher toutes les compétences
        } else {
            fetchCompetencesOptions(10, searchTerm);  // Appeler la fonction pour charger les compétences filtrées
        }
    }, [searchTerm, competences]);  // Effect se déclenche lorsque searchTerm change

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);  // Mettre à jour le terme de recherche
    };

    const handleLoadMore = () => {
        fetchCompetencesOptions(competences.length + 10, searchTerm);  // Charger plus de compétences
    };


    // 
    const [preselectedCompetences, setPreselectedCompetences] = useState([]);
    const handleSelectCompetence = (selectedCompetences) => {
        setPreselectedCompetences(selectedCompetences); // Store selected competences
        setCompetences(selectedCompetences);
        setFormData((prev) => ({
            ...prev,
            skillsId: competences ? competences : [], // Update teacherId with the teacher's _id
        }));
    };
    const handleSelectTeacher = (teacher) => {
        // Prevent setting the same teacher again to avoid re-rendering
        if (selectedTeacher?._id === teacher?._id) return;

        setSelectedTeacher(teacher); // Update selectedTeacher with the full teacher object
        setFormData((prev) => ({
            ...prev,
            teacherId: teacher ? [teacher._id] : [], // Update teacherId with the teacher's _id
        }));

        console.log('Selected Teacher:', teacher);
    };


    const fetchTeachers = async (searchTerm) => {
        try {
            const data = await matieresServices.fetchTeachers({ page: 1, searchTerm: searchTerm, limit: 5 });
            return data.teachers; // Ensure the response has the list of teachers
        } catch (error) {
            console.error("Error fetching teachers:", error);
            return [];
        }
    };



    // Utilisation de useEffect pour charger les compétences au changement de terme de recherche
    useEffect(() => {
        if (searchTerm.trim() !== '') {
            fetchCompetencesOptions(10, searchTerm);  // Récupérer les compétences en fonction de la recherche avec une limite
        } else {
            setCompetences([]);  // Réinitialiser la liste si le champ est vide
            setTotalItems(0);
        }
    }, [searchTerm]);  // Se déclenche chaque fois que searchTerm change


    const fetchCompetences = async (searchTerm2) => {
        try {
            const data = await competenceServices.fetchCompetencesForForm({ searchTerm: searchTerm2 });
            setCompetences((prev) => [
                ...prev,
                ...data.skills.filter((skill) => !prev.some((s) => s._id === skill._id)),
            ]);
            setTotalItems(data.pagination?.totalSkills || data.skills.length);
            return competences
        } catch (error) {
            toast.error("Failed to load competences: " + error);
        }
    };

    const stablePreselectedCompetences = useMemo(() => {
        return Array.isArray(initialData?.skillIds)
            ? initialData.skillIds.map((idOrObj) =>
                typeof idOrObj === "object"
                    ? { _id: idOrObj._id, title: idOrObj.title } // Si l'élément est déjà un objet
                    : { _id: idOrObj, title: `Title for ${idOrObj}` } // Si l'élément est un ID, assigner un titre par défaut
            )
            : [];
    }, [initialData?.skillIds]);



    // Update formData when initialData changes
    useEffect(() => {
        if (initialData) {
            // Extract skill IDs from initialData.skillIds
            const initialSkillIds =
                Array.isArray(initialData.skillIds) &&
                    initialData.skillIds.every((skill) => typeof skill === "object" && skill._id)
                    ? initialData.skillIds.map((skill) => skill._id) // Extract _id from each skill object
                    : [];

            setFormData((prev) => ({
                ...prev,
                _id: initialData._id,
                title: initialData.title,
                isPublish: initialData.isPublish,
                isArchive: initialData.isArchive,
                skillsId: initialSkillIds, // Populate skillsId with valid _id values
                teacherId: initialData.teacherId || [],
                curriculum: {
                    ...prev.curriculum,
                    ...initialData.curriculum,
                    chapitres: initialData.curriculum?.chapitres?.map((chapter) => ({
                        ...chapter,
                        sections: Array.isArray(chapter.sections) ? chapter.sections : [],
                    })),
                },
            }));
        }
    }, [initialData]);

    // Handle fetching teacher if initialData contains teacherId
    useEffect(() => {
        if (initialData?.teacherId) {
            const fetchTeacher = async () => {
                try {
                    let teacherId;

                    // Validate structure of teacherId
                    if (Array.isArray(initialData.teacherId) && initialData.teacherId.length > 0) {
                        teacherId = initialData.teacherId[0]._id; // Extract _id from array
                    } else if (typeof initialData.teacherId === "object" && initialData.teacherId?._id) {
                        teacherId = initialData.teacherId._id; // Use _id if teacherId is an object
                    } else if (typeof initialData.teacherId === "string") {
                        teacherId = initialData.teacherId; // Use directly if it's a string
                    } else {
                        console.warn("Invalid or missing teacherId:", initialData.teacherId);
                        return;
                    }

                    if (!teacherId || teacherId.trim() === "") {
                        console.warn("Teacher ID is missing or invalid.");
                        return;
                    }

                    // Fetch teacher by _id
                    const teacherResponse = await matieresServices.fetchTeacherById(teacherId);

                    // Ensure the response contains the expected structure
                    const teacher = teacherResponse?.teacher;
                    if (!teacher) {
                        throw new Error("Teacher not found.");
                    }

                    // Log success message
                    // toast.success(`${teacher.firstName} ${teacher.lastName} has been selected.`);

                    // Update state with fetched teacher data
                    setSelectedTeacher(teacher); // Store the full teacher object
                    setFormData((prev) => ({
                        ...prev,
                        teacherId: [teacher._id], // Store the teacher's _id in an array
                    }));
                } catch (error) {
                    console.error("Failed to fetch teacher:", error);
                    toast.error(`Failed to fetch teacher: ${error.message || "Unknown error"}`);
                }
            };
            fetchTeacher();
        }
    }, [initialData]);

    useEffect(() => {
        fetchCompetencesOptions(limit);
    }, [limit]);


    useEffect(() => {
        if (initialData) {
            setFormData((prev) => ({
                ...prev,
                _id: initialData._id,
                title: initialData.title,
                isPublish: initialData.isPublish,
                isArchive: initialData.isArchive,
                skillsId: initialData.skillsId,
                teacherId: initialData.teacherId || [],
                curriculum: {
                    ...prev.curriculum,
                    ...initialData.curriculum,
                    chapitres: initialData.curriculum?.chapitres?.map((chapter) => ({
                        ...chapter,
                        sections: Array.isArray(chapter.sections) ? chapter.sections : [],
                    })),
                },
            }));
        }
    }, [initialData]);

    const handleChange = (e, path) => {
        const { value, type, checked } = e.target;
        const newValue = type === "checkbox" ? checked : value;

        setFormData((prev) => {
            const updateNestedField = (obj, keys, val) => {
                const [key, ...rest] = keys;
                obj[key] = Array.isArray(obj[key]) ? [...obj[key]] : { ...obj[key] };
                if (rest.length) {
                    obj[key] = updateNestedField(obj[key], rest, val);
                    return obj;
                }
                obj[key] = val;
                return obj;
            };
            return updateNestedField({ ...prev }, path.split("."), newValue);
        });
    };

    const addChapter = () =>
        setFormData((prev) => ({
            ...prev,
            curriculum: {
                ...prev.curriculum,
                chapitres: [
                    ...(Array.isArray(prev.curriculum.chapitres) ? prev.curriculum.chapitres : []),
                    { title: "", status: false, sections: [] },
                ],
            },
        }));

    const deleteChapter = (index) =>
        setFormData((prev) => {
            const updatedChapters = [...prev.curriculum.chapitres];
            updatedChapters.splice(index, 1);
            return {
                ...prev,
                curriculum: { ...prev.curriculum, chapitres: updatedChapters },
            };
        });

    const addSection = (chapterIndex) =>
        setFormData((prev) => {
            const updatedChapters = prev.curriculum.chapitres.map((chapter, idx) =>
                idx === chapterIndex
                    ? { ...chapter, sections: [...chapter.sections, { title: "", status: false }] }
                    : chapter
            );
            return { ...prev, curriculum: { ...prev.curriculum, chapitres: updatedChapters } };
        });

    const deleteSection = (chapterIndex, sectionIndex) =>
        setFormData((prev) => {
            const updatedChapters = prev.curriculum.chapitres.map((chapter, idx) =>
                idx === chapterIndex
                    ? {
                        ...chapter,
                        sections: chapter.sections.filter((_, sIdx) => sIdx !== sectionIndex),
                    }
                    : chapter
            );
            return { ...prev, curriculum: { ...prev.curriculum, chapitres: updatedChapters } };
        });

    const handlePrerequisiteChange = (index, value) =>
        setFormData((prev) => {
            const updatedPrerequisites = [...prev.curriculum.prerequis_recommandes];
            updatedPrerequisites[index] = value;
            return {
                ...prev,
                curriculum: { ...prev.curriculum, prerequis_recommandes: updatedPrerequisites },
            };
        });

    const removePrerequisite = (index) =>
        setFormData((prev) => {
            const updatedPrerequisites = [...prev.curriculum.prerequis_recommandes];
            updatedPrerequisites.splice(index, 1);
            return {
                ...prev,
                curriculum: { ...prev.curriculum, prerequis_recommandes: updatedPrerequisites },
            };
        });

    const addPrerequisite = () =>
        setFormData((prev) => ({
            ...prev,
            curriculum: {
                ...prev.curriculum,
                prerequis_recommandes: [...prev.curriculum.prerequis_recommandes, ""],
            },
        }));

    const handleDragEnd = (result) => {
        const { source, destination, type } = result;
        if (!destination) return;

        if (type === "CHAPTER") {
            const items = [...formData.curriculum.chapitres];
            const [movedItem] = items.splice(source.index, 1);
            items.splice(destination.index, 0, movedItem);
            setFormData((prev) => ({ ...prev, curriculum: { ...prev.curriculum, chapitres: items } }));
        }

        if (type === "SECTION") {
            const sourceChapterIndex = parseInt(source.droppableId.split("-")[1]);
            const destChapterIndex = parseInt(destination.droppableId.split("-")[1]);
            const updatedChapitres = formData.curriculum.chapitres.map((chap) => ({
                ...chap,
                sections: [...chap.sections],
            }));
            const [movedSection] = updatedChapitres[sourceChapterIndex].sections.splice(source.index, 1);
            updatedChapitres[destChapterIndex].sections.splice(destination.index, 0, movedSection);
            setFormData((prev) => ({ ...prev, curriculum: { ...prev.curriculum, chapitres: updatedChapitres } }));
        }
    };

    const validateForm = () => {
        let valid = true;
        const newErrorMessages = {};

        ["module", "level", "code", "semestre", "langue", "type_enseignement", "volume_horaire_total", "credit"].forEach(
            (field) => {
                if (!formData.curriculum[field]) {
                    valid = false;
                    newErrorMessages[field] = `${capitalizeFirstLetter(field.replace("_", " "))} is required.`;
                    toast.error(newErrorMessages[field]);
                }
            }
        );

        if (formData.curriculum.module && !/^GM[1-5]\.[1-6]$/.test(formData.curriculum.module)) {
            valid = false;
            newErrorMessages.module =
                "Module must be in the format GMx.y, where x is between 1-5 and y is between 1-6.";
            toast.error(newErrorMessages.module);
        }

        if (
            formData.curriculum.volume_horaire_total &&
            !/^[1-9][0-9]*$/.test(formData.curriculum.volume_horaire_total)
        ) {
            valid = false;
            newErrorMessages.volume_horaire_total = "Volume Horaire Total must be a valid integer without decimals.";
            toast.error(newErrorMessages.volume_horaire_total);
        }

        if (formData.curriculum.credit && !/^[1-9][0-9]*$/.test(formData.curriculum.credit)) {
            valid = false;
            newErrorMessages.credit = "Crédit must be a valid integer without decimals.";
            toast.error(newErrorMessages.credit);
        }

        if (formData.skillsId.length === 0) {
            valid = false;
            newErrorMessages.skillsId = "At least one skill must be selected.";
            toast.error(newErrorMessages.skillsId);
        }

        setErrorMessages(newErrorMessages);
        return valid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const finalData = {
                _id: formData._id,
                title: formData.title,
                isPublish: formData.isPublish,
                isArchive: formData.isArchive,
                skillsId: formData.skillsId,
                teacherId: formData.teacherId,
                curriculum: {
                    module: formData.curriculum.module,
                    level: formData.curriculum.level,
                    code: formData.curriculum.code,
                    semestre: formData.curriculum.semestre,
                    responsable: formData.curriculum.responsable,
                    langue: formData.curriculum.langue,
                    relation: formData.curriculum.relation,
                    type_enseignement: formData.curriculum.type_enseignement,
                    volume_horaire_total: formData.curriculum.volume_horaire_total,
                    credit: formData.curriculum.credit,
                    prerequis_recommandes: formData.curriculum.prerequis_recommandes,
                    chapitres: formData.curriculum.chapitres.map((chapter) => ({
                        title: chapter.title,
                        status: chapter.status,
                        sections: chapter.sections.map((section) => ({
                            title: section.title,
                            status: section.status,
                        })),
                    })),
                },
            };
            onSubmit(finalData);
        }
    };
    const getCurrentAcademicYear = () => {
        const currentYear = new Date().getFullYear();
        const month = new Date().getMonth();
        return month >= 8
            ? `${currentYear}-${currentYear + 1}`
            : `${currentYear - 1}-${currentYear}`;
    };


    return (
        <div className="max-w-7xl mx-auto p-3 bg-white">
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Subject Title */}
                <div className="space-y-4">
                    <label className="block text-gray-700 font-semibold">Subject Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={(e) => handleChange(e, "title")}
                        className="mt-2 p-3 w-full border border-gray-300 rounded-md"
                        placeholder="Enter Subjet Title"
                        required
                    />
                </div>

                {/* Curriculum Fields */}
                <div className="grid grid-cols-2 gap-4">
                    {[
                        {
                            label: "Module",
                            key: "module",
                            placeholder: "Enter module name",
                            pattern: /^GM[1-5]\.[1-6]$/,
                            required: true,
                            errorMessage:
                                "Module must be in the format GMx.y, where x is between 1-5 and y is between 1-6.",
                        },
                        {
                            label: "Level",
                            key: "level",
                            type: "select",
                            options: ["1 year", "2 year", "3 year"],
                            required: true,
                        },
                        {
                            label: "Code", key: "code", required: true,
                            placeholder: "Enter subject Code",

                        },
                        {
                            label: "Semester",
                            key: "semestre",
                            type: "select",
                            options: ["semestre 1", "semestre 2"],
                            required: true,
                        },
                        {
                            label: "Responsible",
                            placeholder: "Enter Responsible email",
                            key: "responsable",
                            type: "email",
                            required: false,
                        },
                        {
                            label: "Language",
                            key: "langue",
                            type: "select",
                            options: ["Arabic", "English", "French"],
                            required: true,
                        },
                        {
                            label: "Relation", key: "relation", type: "text", defaultValue: "",
                            placeholder: "Enter Relation",
                        },
                        {
                            label: "Type of teaching",
                            key: "type_enseignement",
                            type: "select",
                            options: ["Presentiel", "En ligne", "Hybrid"],
                            required: true,
                        },
                        {
                            label: "Total Hours Volume",
                            key: "volume_horaire_total",
                            placeholder: "Enter Total Hours Volume",
                            type: "number",
                            min: 1,
                            step: "1",
                            required: true,
                            pattern: /^[1-9][0-9]*$/,
                            errorMessage: "Total Hours Volume must be a valid integer without decimals.",
                        },
                        {
                            label: "Credit",
                            key: "credit",
                            placeholder: "Enter Credit",
                            type: "number",
                            min: 1,
                            step: "1",
                            required: true,
                            pattern: /^[1-9][0-9]*$/,
                            errorMessage: "Credit must be a valid integer without decimals.",
                        },
                        {
                            label: "Academic Year",
                            key: "academicYear",
                            type: "academicYear",
                            // required: true,
                            pattern: /^(19|20)\d{2}-(19|20)\d{2}$/,
                            errorMessage: `Valid Format : AAAA-AAAA (ex: ${getCurrentAcademicYear()})`
                        }
                    ].map(({ label, key, type, options, min, step, required, defaultValue, pattern, placeholder, errorMessage }) => (
                        <div key={key} className="relative">
                            <label className="block text-gray-700 font-semibold">
                                {label} {required && <span className="text-red-500">*</span>}
                            </label>
                            {type === "select" ? (
                                <select
                                    name={key}
                                    value={formData.curriculum[key] || ""}
                                    onChange={(e) => handleChange(e, `curriculum.${key}`)}
                                    className="mt-2 p-3 w-full border border-gray-300 rounded-md"
                                    required={required}
                                >
                                    <option value="" disabled>
                                        Select {label}
                                    </option>
                                    {options?.map((option) => (
                                        <option key={option} value={option.replace(/\s+/g, "")}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            ) : type === "email" ? (
                                <input
                                    type="email"
                                    placeholder={placeholder}
                                    name={key}
                                    value={formData.curriculum[key] || ""}
                                    onChange={(e) => handleChange(e, `curriculum.${key}`)}
                                    className="mt-2 p-3 w-full border border-gray-300 rounded-md"
                                />
                            ) : type === "number" ? (
                                <input
                                    type="number"
                                    name={key}
                                    value={formData.curriculum[key] || ""}
                                    onChange={(e) => handleChange(e, `curriculum.${key}`)}
                                    className="mt-2 p-3 w-full border border-gray-300 rounded-md"
                                    min={min}
                                    step={step}
                                    placeholder={placeholder}
                                    required={required}
                                />
                            ) : type === "academicYear" ?
                                <input
                                    type="text"
                                    name={key}
                                    value={formData.curriculum[key] || defaultValue || ""}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^[0-9-]*$/.test(value)) {
                                            handleChange(e, `curriculum.${key}`);
                                        }
                                    }}
                                    inputMode="numeric"
                                    className="mt-2 p-3 w-full border border-gray-300 rounded-md"
                                    placeholder={`ex: ${getCurrentAcademicYear()}`}
                                    pattern="^(19|20)\d{2}-(19|20)\d{2}$"
                                    // pattern={pattern}
                                    title={`Valid Format : AAAA-AAAA (ex: ${getCurrentAcademicYear()})`}
                                // required={required}
                                />


                                :
                                (
                                    <input
                                        type="text"
                                        name={key}
                                        value={formData.curriculum[key] || defaultValue || ""}
                                        onChange={(e) => handleChange(e, `curriculum.${key}`)}
                                        className="mt-2 p-3 w-full border border-gray-300 rounded-md"
                                        placeholder={placeholder}
                                        required={required}
                                    />
                                )}
                            {errorMessages[key] && (
                                <p className="text-red-500 text-sm mt-1">{errorMessages[key]}</p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Skills Selection */}
                {/* <div className="relative">

                    <label className="block text-gray-700 font-semibold">
                        Skills <span className="text-red-500">*</span>
                    </label>




                    <MultiSelectDropdownOLD
                        options={competencesFiltered}
                        selectedOptions={formData.skillsId}
                        setSelectedOptions={(selectedSkills) =>
                            setFormData({ ...formData, skillsId: selectedSkills })
                        }
                        onSelectionChange={() => { }}
                        label="Select Skills"
                        icon={FaCheckCircle}
                        tooltipText="Clear All Skills"
                        showClearAll={true}
                        styling="flex justify-between items-center cursor-pointer hover:outline-1 transform transition-all duration-300 ease-in-out"
                    />


                    {competencesFiltered.length < totalItems && (
                        <button
                            type="button"
                            onClick={handleLoadMore}
                            className="mt-2 bg-blue-500 text-white p-2 rounded"
                        >
                            {loading ? 'Loading...' : 'Load More'}
                        </button>
                    )}

                 
                    {errorMessages.skillsId && (
                        <p className="text-red-500 text-sm mt-1">{errorMessages.skillsId}</p>
                    )}
                </div> */}

                <div className="relative">
                    <label className="block text-gray-700 font-semibold">
                        Skills <span className="text-red-500">*</span>
                    </label>
                    <MSDropdown
                        options={competences}
                        preSelectedOptions={formData?.skillsId}
                        selectedOptions={selectedSkills}
                        setSelectedOptions={(newSkills) => {
                            setSelectedSkills(newSkills);
                            setFormData({ ...formData, skillsId: newSkills });
                        }}
                        label="Select Skills"
                        placeholder="Search for skills..."
                        loadMore={handleLoadMore}
                        totalItems={totalItems}
                        loading={loading}
                    />
                    {errorMessages.skillsId && (
                        <p className="text-red-500 text-sm mt-1">{errorMessages.skillsId}</p>
                    )}
                </div>

                {/* Teacher Selection */}
                <div className="relative">
                    <label className="block text-gray-700 font-semibold mb-2">
                        Teacher <span className="text-blue-500">(Optional)</span>
                    </label>
                    {/* <TeacherSearchDropdown onSelectTeacher={handleSelectTeacher} /> */}
                    {/* <TeacherSearchDropdown
                        onSelectTeacher={handleSelectTeacher}
                        preselectedTeacher={selectedTeacher} // Pass the full teacher object
                    /> */}

                    <SearchDropdown
                        fetchData={fetchTeachers}
                        onSelectItem={handleSelectTeacher}
                        preselectedItem={selectedTeacher}
                        // itemLabel={selectedTeacher?.firstName ? "firstName" : selectedTeacher?.lastName ? "lastName" : "_id"}
                        itemLabels={["firstName", "lastName"]}
                        selectedItem={`${selectedTeacher?.firstName && selectedTeacher?.lastName ?
                            `${selectedTeacher.firstName} ${selectedTeacher.lastName}` :
                            selectedTeacher?.firstName || selectedTeacher?.lastName || ''}`.trim()}
                        itemValue="_id"
                        placeholder="Search for a teacher..."
                    />

                </div>

                {/* Prerequisites */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-700">Prerequisites</h3>
                    {formData.curriculum.prerequis_recommandes.map((prereq, index) => (
                        <div key={index} className="flex items-center space-x-2 mt-2">
                            <input
                                type="text"
                                required
                                value={prereq}
                                onChange={(e) => handlePrerequisiteChange(index, e.target.value)}
                                className="p-3 w-full border border-gray-300 rounded-md"
                            />
                            <button
                                type="button"
                                onClick={() => removePrerequisite(index)}
                                className="text-red-500 font-bold"
                            >
                                ✖
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addPrerequisite}
                        className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md shadow"
                    >
                        Add Prerequisite
                    </button>
                </div>

                {/* Chapters & Sections */}
                <div className="space-y-4 bg-gray-200 p-2 rounded-md">
                    <h3 className="text-lg font-semibold text-gray-700">Chapters</h3>
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="chapters" type="CHAPTER">
                            {(provided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-4">
                                    {formData.curriculum.chapitres.map((chapter, chapterIndex) => (
                                        <Draggable
                                            key={chapterIndex}
                                            draggableId={`chapter-${chapterIndex}`}
                                            index={chapterIndex}
                                        >
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="border p-6 rounded-lg bg-gray-50 shadow-sm"
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <label className="block text-gray-700">
                                                            Chapter {chapterIndex + 1} Title
                                                        </label>
                                                        <button
                                                            type="button"
                                                            onClick={() => deleteChapter(chapterIndex)}
                                                            className="text-red-500 font-bold"
                                                        >
                                                            ✖
                                                        </button>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        required
                                                        placeholder="Enter chapter title"
                                                        value={chapter.title}
                                                        onChange={(e) =>
                                                            handleChange(e, `curriculum.chapitres.${chapterIndex}.title`)
                                                        }
                                                        className="mt-2 p-3 w-full border border-gray-300 rounded-md"
                                                    />
                                                    <Droppable droppableId={`chapter-${chapterIndex}`} type="SECTION">
                                                        {(provided) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.droppableProps}
                                                                className="mt-4"
                                                            >
                                                                {chapter.sections.map((section, sectionIndex) => (
                                                                    <Draggable
                                                                        key={`section-${chapterIndex}-${sectionIndex}`}
                                                                        draggableId={`section-${chapterIndex}-${sectionIndex}`}
                                                                        index={sectionIndex}
                                                                    >
                                                                        {(provided) => (
                                                                            <div
                                                                                ref={provided.innerRef}
                                                                                {...provided.draggableProps}
                                                                                {...provided.dragHandleProps}
                                                                                className="border p-4 mt-3 rounded-lg bg-gray-100 shadow-sm flex justify-between items-center hover:bg-gray-200 transition-colors duration-300 ease-in-out"
                                                                            >
                                                                                <span className="text-sm text-gray-700 font-semibold">
                                                                                    Section {sectionIndex + 1}
                                                                                </span>
                                                                                <input
                                                                                    type="text"
                                                                                    value={section.title}
                                                                                    required
                                                                                    onChange={(e) =>
                                                                                        handleChange(
                                                                                            e,
                                                                                            `curriculum.chapitres.${chapterIndex}.sections.${sectionIndex}.title`
                                                                                        )
                                                                                    }
                                                                                    className="p-3 w-3/4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                                    placeholder="Enter section title"
                                                                                />
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() =>
                                                                                        deleteSection(chapterIndex, sectionIndex)
                                                                                    }
                                                                                    className="ml-2 text-red-500 font-bold hover:text-red-700 transition duration-300"
                                                                                >
                                                                                    ✖
                                                                                </button>
                                                                            </div>
                                                                        )}
                                                                    </Draggable>
                                                                ))}
                                                                {provided.placeholder}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => addSection(chapterIndex)}
                                                                    className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md shadow"
                                                                >
                                                                    Add Section
                                                                </button>
                                                            </div>
                                                        )}
                                                    </Droppable>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                    <button
                                        type="button"
                                        onClick={addChapter}
                                        className="mt-3 px-4 py-2 bg-green-500 text-white rounded-md shadow"
                                    >
                                        Add Chapter
                                    </button>
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>

                <div className="text-center mt-6">
                    <button
                        type="submit"
                        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow"
                    >
                        Submit
                    </button>
                </div>
            </form >
        </div >
    );
};

export default SubjectForm;