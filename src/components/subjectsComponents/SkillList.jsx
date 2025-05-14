import { useState } from "react";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";

export const SkillList = ({ skills }) => {
    const [expandedIndex, setExpandedIndex] = useState(null);

    const toggle = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    if (!Array.isArray(skills) || skills.length === 0) {
        return <p className="text-sm text-gray-500">No skills available.</p>;
    }

    return (
        <ul className="space-y-3 mt-3">
            {skills.map((skill, index) => {
                const hasFamilies = Array.isArray(skill.familyId) && skill.familyId.length > 0;
                const isExpanded = expandedIndex === index;

                return (
                    <li
                        key={index}
                        className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-all"
                    >
                        <div className="flex items-center justify-between">
                            {hasFamilies ? (
                                <button
                                    onClick={() => toggle(index)}
                                    className="flex items-center space-x-2 text-sm text-blue-700 hover:text-blue-900 font-medium"
                                >
                                    {isExpanded ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
                                    <span>{skill.title}</span>
                                    <span className="ml-1 text-xs text-gray-500">({skill.familyId.length})</span>
                                </button>
                            ) : (
                                <div className="text-sm text-gray-700 font-medium flex items-center">
                                    <span>{skill.title}</span>
                                    <span className="ml-2 text-xs text-gray-400">(0)</span>
                                </div>
                            )}
                        </div>

                        {isExpanded && hasFamilies && (
                            <ul className="mt-2 ml-6 list-disc text-sm text-gray-600 space-y-1">
                                {skill.familyId.map((family, i) => (
                                    <li key={i}>{family.title}</li>
                                ))}
                            </ul>
                        )}
                    </li>
                );
            })}
        </ul>
    );
};
