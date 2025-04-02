import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import React, { useEffect, useState } from "react";

// Helper function to capitalize the first letter of a string
const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const SubjectForm = ({ initialData = null, onSubmit }) => {

    useEffect(() => {
        if (initialData) setFormData(initialData);
    }, [initialData]);


    // Add a prerequisite
    const addPrerequisite = () =>
        setFormData((prev) => ({
            ...prev,
            curriculum: {
                ...prev.curriculum,
                prerequis_recommandes: [...prev.curriculum.prerequis_recommandes, ""],
            },
        }));

    // Handle prerequisite change
    const handlePrerequisiteChange = (index, value) =>
        setFormData((prev) => {
            const updatedPrerequisites = [...prev.curriculum.prerequis_recommandes];
            updatedPrerequisites[index] = value;
            return {
                ...prev,
                curriculum: { ...prev.curriculum, prerequis_recommandes: updatedPrerequisites },
            };
        });

    // Remove a prerequisite
    const removePrerequisite = (index) =>
        setFormData((prev) => {
            const updatedPrerequisites = [...prev.curriculum.prerequis_recommandes];
            updatedPrerequisites.splice(index, 1);
            return {
                ...prev,
                curriculum: { ...prev.curriculum, prerequis_recommandes: updatedPrerequisites },
            };
        });

    // Handle drag and drop
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
            const updatedChapitres = formData.curriculum.chapitres.map((chap) => ({ ...chap, sections: [...chap.sections] }));
            const [movedSection] = updatedChapitres[sourceChapterIndex].sections.splice(source.index, 1);
            updatedChapitres[destChapterIndex].sections.splice(destination.index, 0, movedSection);
            setFormData((prev) => ({ ...prev, curriculum: { ...prev.curriculum, chapitres: updatedChapitres } }));
        }
    };



    // Delete a section

    // Handle skills change
    const handleSkillsChange = (e) => {
        const selectedSkills = Array.from(e.target.selectedOptions, (option) => option.value);
        setFormData((prev) => ({ ...prev, skillsId: selectedSkills }));
    };
    // Handle blur for validation
    const handleBlur = (e, key, pattern, errorMessage) => {
        const value = formData.curriculum[key]; // Get the current value of the field
        if (!value && key !== "responsable") {
            // If the field is empty and required, set an error message
            setErrorMessages((prev) => ({
                ...prev,
                [key]: errorMessage || `${capitalizeFirstLetter(key.replace("_", " "))} is required.`,
            }));
        } else if (pattern && value && !pattern.test(value)) {
            // If the field has a pattern and the value doesn't match, set an error message
            setErrorMessages((prev) => ({
                ...prev,
                [key]: errorMessage || `${capitalizeFirstLetter(key.replace("_", " "))} is invalid.`,
            }));
        } else {
            // Clear the error message if the input is valid
            setErrorMessages((prev) => {
                const newMessages = { ...prev };
                delete newMessages[key];
                return newMessages;
            });
        }
    };

    // const handleSubmit = (e) => {
    //     e.preventDefault();

    //     // Validate the form (if needed)
    //     const valid = validateForm(); // Implement this function if necessary

    //     if (valid) {
    //         onSubmit(formData); // Pass the updated formData to the parent
    //     }
    // };

    // *********************

    // Validate the form


    // ********************
    // Handle form submission
    // Handle form submission


    // Save JSON data
    // const saveJson = () => {
    //     const formDataJson = JSON.stringify(formData, null, 2);
    //     const blob = new Blob([formDataJson], { type: "application/json" });
    //     const link = document.createElement("a");
    //     link.href = URL.createObjectURL(blob);
    //     link.download = "formData.json";
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    // };
    // ************************

    const [formData, setFormData] = useState({
        _id: "", // Include _id in the initial state
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
            chapitres: [{ title: "", status: false, sections: [{ title: "", status: false }] }],
        },
    });

    const [errorMessages, setErrorMessages] = useState({});

    // Update formData when initialData changes
    useEffect(() => {
        if (initialData) {
            setFormData((prev) => ({
                ...prev,
                _id: initialData._id, // Include _id
                title: initialData.title,
                isPublish: initialData.isPublish,
                isArchive: initialData.isArchive,
                skillsId: initialData.skillsId,
                teacherId: initialData.teacherId,
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

    // Handle input changes
    const handleChange = (e, path) => {
        const { value, type, checked, multiple } = e.target;
        const newValue = type === "checkbox" ? checked : multiple ? Array.from(e.target.selectedOptions, (option) => option.value) : value;

        setFormData((prev) => {
            const updateNestedField = (obj, keys, val) => {
                const [key, ...rest] = keys;
                return rest.length
                    ? { ...obj, [key]: updateNestedField(obj[key], rest, val) }
                    : { ...obj, [key]: val };
            };
            return updateNestedField(prev, path.split("."), newValue);
        });
    };

    // Add a chapter
    const addChapter = () =>
        setFormData((prev) => ({
            ...prev,
            curriculum: {
                ...prev.curriculum,
                chapitres: [...prev.curriculum.chapitres, { title: "", status: false, sections: [] }],
            },
        }));

    // Delete a chapter
    const deleteChapter = (index) =>
        setFormData((prev) => {
            const updatedChapters = [...prev.curriculum.chapitres];
            updatedChapters.splice(index, 1);
            return {
                ...prev,
                curriculum: {
                    ...prev.curriculum,
                    chapitres: updatedChapters,
                },
            };
        });

    // Add a section to a chapter
    const addSection = (chapterIndex) =>
        setFormData((prev) => {
            const updatedChapters = prev.curriculum.chapitres.map((chapter, idx) =>
                idx === chapterIndex
                    ? { ...chapter, sections: [...chapter.sections, { title: "", status: false }] }
                    : chapter
            );
            return {
                ...prev,
                curriculum: {
                    ...prev.curriculum,
                    chapitres: updatedChapters,
                },
            };
        });

    // Delete a section from a chapter
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
            return {
                ...prev,
                curriculum: {
                    ...prev.curriculum,
                    chapitres: updatedChapters,
                },
            };
        });

    // Validate the form
    const validateForm = () => {
        let valid = true;
        const newErrorMessages = {};

        // Validate required fields
        ["module", "level", "code", "semestre", "langue", "type_enseignement", "volume_horaire_total", "credit"].forEach(
            (field) => {
                if (!formData.curriculum[field]) {
                    valid = false;
                    newErrorMessages[field] = `${capitalizeFirstLetter(field.replace("_", " "))} is required.`;
                }
            }
        );

        // Validate specific formats
        if (formData.curriculum.module && !/^GM[1-5]\.[1-6]$/.test(formData.curriculum.module)) {
            valid = false;
            newErrorMessages.module = "Module must be in the format GMx.y, where x is between 1-5 and y is between 1-6.";
        }

        if (formData.curriculum.volume_horaire_total && !/^[1-9][0-9]*$/.test(formData.curriculum.volume_horaire_total)) {
            valid = false;
            newErrorMessages.volume_horaire_total = "Volume Horaire Total must be a valid integer without decimals.";
        }

        if (formData.curriculum.credit && !/^[1-9][0-9]*$/.test(formData.curriculum.credit)) {
            valid = false;
            newErrorMessages.credit = "Crédit must be a valid integer without decimals.";
        }

        if (formData.skillsId.length === 0) {
            valid = false;
            newErrorMessages.skillsId = "At least one skill must be selected.";
        }

        setErrorMessages(newErrorMessages);
        return valid;
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            // Ensure the data matches the required format
            const finalData = {
                _id: formData._id, // Include _id
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

            onSubmit(finalData); // Pass the validated and structured data to the parent
        }
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
                        required
                    />
                </div>

                {/* Curriculum Fields */}
                <div className="grid grid-cols-2 gap-4">
                    {[
                        {
                            label: "Module",
                            key: "module",
                            pattern: /^GM[1-5]\.[1-6]$/,
                            required: true,
                            errorMessage: "Module must be in the format GMx.y, where x is between 1-5 and y is between 1-6.",
                        },
                        { label: "Level", key: "level", type: "select", options: ["1 year", "2 year", "3 year"], required: true },
                        { label: "Code", key: "code", required: true },
                        {
                            label: "Semestre",
                            key: "semestre",
                            type: "select",
                            options: ["semestre 1", "semestre 2"],
                            required: true,
                        },
                        {
                            label: "Responsable",
                            key: "responsable",
                            type: "email",
                            required: false,
                        },
                        {
                            label: "Langue",
                            key: "langue",
                            type: "select",
                            options: ["Arabic", "English", "French"],
                            required: true,
                        },
                        { label: "Relation", key: "relation", type: "text", defaultValue: "" },
                        {
                            label: "Type d'enseignement",
                            key: "type_enseignement",
                            type: "select",
                            options: ["Presentiel", "En ligne", "Hybrid"],
                            required: true,
                        },
                        {
                            label: "Volume Horaire Total",
                            key: "volume_horaire_total",
                            type: "number",
                            min: 1,
                            step: "1",
                            required: true,
                            pattern: /^[1-9][0-9]*$/,
                            errorMessage: "Volume Horaire Total must be a valid integer without decimals.",
                        },
                        {
                            label: "Crédit",
                            key: "credit",
                            type: "number",
                            min: 1,
                            step: "1",
                            required: true,
                            pattern: /^[1-9][0-9]*$/,
                            errorMessage: "Crédit must be a valid integer without decimals.",
                        },
                    ].map(({ label, key, type, options, min, step, required, defaultValue, pattern, errorMessage }) => (
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
                                    name={key}
                                    value={formData.curriculum[key] || ""}
                                    onChange={(e) => handleChange(e, `curriculum.${key}`)}
                                    onBlur={(e) => handleBlur(e, key, pattern, errorMessage)}
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
                                    onBlur={(e) => handleBlur(e, key, pattern, errorMessage)}
                                    required={required}
                                />
                            ) : (
                                <input
                                    type="text"
                                    name={key}
                                    value={formData.curriculum[key] || defaultValue || ""}
                                    onChange={(e) => handleChange(e, `curriculum.${key}`)}
                                    onBlur={(e) => handleBlur(e, key, pattern, errorMessage)}
                                    className="mt-2 p-3 w-full border border-gray-300 rounded-md"
                                    required={required}
                                />
                            )}
                            {errorMessages[key] && <p className="text-red-500 text-sm mt-1">{errorMessages[key]}</p>}
                        </div>
                    ))}
                </div>

                {/* Skills Selection */}
                <div className="relative">
                    <label className="block text-gray-700 font-semibold">
                        Skills <span className="text-red-500">*</span>
                    </label>
                    <select
                        required
                        name="skills"
                        value={formData.skillsId}
                        onChange={handleSkillsChange}
                        multiple
                        className="mt-2 p-3 w-full border border-gray-300 rounded-md"
                    >
                        {["Communication", "Development", "Action", "Teamwork", "Problem Solving"].map((skill) => (
                            <option key={skill} value={skill}>
                                {skill}
                            </option>
                        ))}
                    </select>
                    {errorMessages.skillsId && <p className="text-red-500 text-sm mt-1">{errorMessages.skillsId}</p>}
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
                            <button type="button" onClick={() => removePrerequisite(index)} className="text-red-500 font-bold">
                                ✖
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={addPrerequisite} className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md shadow">
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
                                        <Draggable key={chapterIndex} draggableId={`chapter-${chapterIndex}`} index={chapterIndex}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="border p-6 rounded-lg bg-gray-50 shadow-sm"
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <label className="block text-gray-700">Chapter {chapterIndex + 1} Title</label>
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
                                                        onChange={(e) => handleChange(e, `curriculum.chapitres.${chapterIndex}.title`)}
                                                        className="mt-2 p-3 w-full border border-gray-300 rounded-md"
                                                    />
                                                    <Droppable droppableId={`chapter-${chapterIndex}`} type="SECTION">
                                                        {(provided) => (
                                                            <div ref={provided.innerRef} {...provided.droppableProps} className="mt-4">
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
                                                                                    onClick={() => deleteSection(chapterIndex, sectionIndex)}
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
                                    <button type="button" onClick={addChapter} className="mt-3 px-4 py-2 bg-green-500 text-white rounded-md shadow">
                                        Add Chapter
                                    </button>
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>

                <div className="text-center mt-6">
                    <button type="submit" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SubjectForm;