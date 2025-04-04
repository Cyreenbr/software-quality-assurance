import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { Fragment } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Tooltip from './Tooltip';

const MultiSelectDropdownFamily = ({ families, selectedFamilies, setSelectedFamilies, onSelectionChange }) => {
    // Function to get the selected families (objects) and display them in the input field
    const getSelectedFamilies = () => {
        return families.filter(family => selectedFamilies.includes(family._id));
    };

    // Toggle selection of families when clicked
    const handleFamilySelect = (familyId) => {
        setSelectedFamilies(prevSelectedFamilies => {
            const newSelection = prevSelectedFamilies.includes(familyId)
                ? prevSelectedFamilies.filter(id => id !== familyId)
                : [...prevSelectedFamilies, familyId];

            // Call onSelectionChange to pass the updated families
            onSelectionChange(families.filter(family => newSelection.includes(family._id)));

            return newSelection;
        });
    };

    // Clear all selected families
    const handleClearAll = () => {
        setSelectedFamilies([]);
        onSelectionChange([]);
    };


    return (
        <div className="relative mt-1">
            <Listbox as="div" className="w-full" multiple value={selectedFamilies} onChange={setSelectedFamilies}>
                {({ open }) => (
                    <>
                        <div className="flex justify-between items-center">
                            {/* Button to toggle the Listbox */}
                            <ListboxButton
                                className="w-full px-4 py-2 text-left bg-white border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none flex justify-between items-center cursor-pointer hover:bg-blue-100 hover:scale-105 hover:outline-1 transform transition-all duration-300 ease-in-out"
                            >
                                <span className={`text-sm ${selectedFamilies.length === 0 ? 'text-gray-400' : 'text-gray-700'}`}>
                                    {selectedFamilies.length === 0
                                        ? 'Select Skill Families'
                                        : getSelectedFamilies().map(family => family.title).join(', ') || 'Select Families'}
                                </span>
                                <span className="text-sm text-gray-500">
                                    {selectedFamilies.length} selected
                                </span>
                            </ListboxButton>

                            {/* Clear All Button */}
                            {selectedFamilies.length > 0 && (
                                <Tooltip text={"Clear All"} position="top">
                                    <button
                                        onClick={handleClearAll}
                                        className="ml-2 p-2 text-red-600 hover:bg-red-100 rounded-full"
                                        aria-label="Clear all selections"
                                    >
                                        <FaTimesCircle size={20} />
                                    </button>
                                </Tooltip>
                            )}
                        </div>

                        {/* Listbox options container */}
                        <ListboxOptions
                            className={`absolute mt-1 w-full bg-white border rounded-lg border-gray-300 shadow-lg z-10 transition-all ease-in-out duration-200 ${open ? 'block' : 'hidden'}`}
                        >
                            {families.length > 0 ? (
                                families.map((family) => (
                                    <ListboxOption key={family._id} value={family._id} as={Fragment}>
                                        {({ active }) => {
                                            const isSelected = selectedFamilies.includes(family._id);

                                            return (
                                                <li
                                                    onClick={() => handleFamilySelect(family._id)}
                                                    className={`px-4 py-2 cursor-pointer flex items-center space-x-2 
                                                        ${active ? 'bg-blue-200' : ''} 
                                                        ${isSelected ? 'bg-blue-200 font-semibold text-blue-700' : 'text-gray-700'}
                                                        hover:bg-blue-50 focus:outline-none transition-colors duration-200`}
                                                >
                                                    {/* If selected, show a check mark with blue font */}
                                                    {isSelected && (
                                                        <FaCheckCircle className="text-blue-600" size={16} />
                                                    )}
                                                    <span
                                                        className={`${isSelected ? 'font-bold text-blue-700' : 'text-gray-700'}`}
                                                    >
                                                        {family.title}
                                                    </span>
                                                </li>
                                            );
                                        }}
                                    </ListboxOption>
                                ))
                            ) : (
                                <ListboxOption disabled>
                                    <li className="px-4 py-2 text-gray-500">No families available</li>
                                </ListboxOption>
                            )}
                        </ListboxOptions>
                    </>
                )}
            </Listbox>
        </div>
    );
};

export default MultiSelectDropdownFamily;
