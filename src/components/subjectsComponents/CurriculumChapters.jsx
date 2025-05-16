import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";

export const CurriculumChapters = ({ curriculum }) => {
    const [expandedChapter, setExpandedChapter] = useState(null);

    if (!Array.isArray(curriculum?.chapitres) || curriculum.chapitres.length === 0) {
        return null;
    }

    const toggleChapter = (index, hasSections) => {
        if (!hasSections) return;
        setExpandedChapter(expandedChapter === index ? null : index);
    };

    return (
        <div className="mt-4">
            <p className="font-semibold mb-2 text-blue-600">📖 Chapters and Sections:</p>
            <ul className="space-y-3">
                {curriculum.chapitres.map((chapitre, index) => {
                    const hasSections = Array.isArray(chapitre.sections) && chapitre.sections.length > 0;
                    const isExpanded = expandedChapter === index;

                    return (
                        <li
                            key={chapitre._id || index}
                            className={`border border-gray-200 rounded-md p-3 shadow-sm bg-white transition ${hasSections ? 'hover:shadow-md cursor-pointer' : 'cursor-default opacity-70'
                                }`}
                            onClick={() => toggleChapter(index, hasSections)}
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-800">
                                    {index + 1}. {chapitre.title}
                                    {hasSections && (
                                        <span className="text-sm text-gray-500 ml-2">({chapitre.sections.length} section{chapitre.sections.length > 1 ? 's' : ''})</span>
                                    )}
                                </span>
                                {hasSections && (
                                    isExpanded ? <FiChevronDown size={18} /> : <FiChevronRight size={18} />
                                )}
                            </div>

                            {hasSections && isExpanded && (
                                <ul className="mt-2 ml-4 list-disc text-sm text-gray-700 space-y-1">
                                    {chapitre.sections.map((section, secIndex) => (
                                        <li key={section._id || secIndex}>
                                            {section.title}
                                            {section.status === true && (
                                                <span className="text-teal-500 italic ml-1 inline-flex items-center gap-1">
                                                    (Completed <FaCheckCircle />)
                                                </span>
                                            )}

                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};
