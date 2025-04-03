import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { Fragment } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Tooltip from './Tooltip';

const MultiSelectDropdown = ({
    options,
    selectedOptions,
    setSelectedOptions,
    onSelectionChange,
    label = "Select Options",  // Custom label
    placeholder = "Select Options",  // Placeholder text when nothing is selected
    icon: Icon = FaCheckCircle,  // Custom icon for selected options
    showClearAll = true,  // Option to show "Clear All" button
    tooltipText = "Clear All",  // Tooltip text for Clear All button
    optionLabelKey = "title",  // Key to display option text
    optionValueKey = "_id",  // Key to identify option uniquely
    buttonClassName = "w-full px-4 py-2 text-left bg-white border rounded-lg border-gray-300",  // Default button styles
    optionClassName = "px-4 py-2 cursor-pointer flex items-center space-x-2"  // Default option item styles
}) => {
    // Function to get the selected options (objects) and display them in the input field
    const getSelectedOptions = () => {
        return options.filter(option => selectedOptions.includes(option[optionValueKey]));
    };

    // Toggle selection of options when clicked
    const handleOptionSelect = (optionId) => {
        setSelectedOptions(prevSelectedOptions => {
            const newSelection = prevSelectedOptions.includes(optionId)
                ? prevSelectedOptions.filter(id => id !== optionId)
                : [...prevSelectedOptions, optionId];

            // Call onSelectionChange to pass the updated options
            onSelectionChange(options.filter(option => newSelection.includes(option[optionValueKey])));

            return newSelection;
        });
    };

    // Clear all selected options
    const handleClearAll = () => {
        setSelectedOptions([]);
        onSelectionChange([]);
    };

    return (
        <div className="relative mt-1">
            <Listbox as="div" className="w-full" multiple value={selectedOptions} onChange={setSelectedOptions}>
                {({ open }) => (
                    <>
                        <div className="flex justify-between items-center">
                            {/* Button to toggle the Listbox */}
                            <ListboxButton
                                className={`${buttonClassName} flex justify-between items-center cursor-pointer hover:bg-blue-100 hover:scale-105 hover:outline-1 transform transition-all duration-300 ease-in-out`}
                            >
                                <span className={`text-sm ${selectedOptions.length === 0 ? 'text-gray-400' : 'text-gray-700'}`}>
                                    {selectedOptions.length === 0
                                        ? label
                                        : getSelectedOptions().map(option => option[optionLabelKey]).join(', ') || placeholder}
                                </span>
                                <span className="text-sm text-gray-500">
                                    {selectedOptions.length} selected
                                </span>
                            </ListboxButton>

                            {/* Clear All Button */}
                            {showClearAll && selectedOptions.length > 0 && (
                                <Tooltip text={tooltipText} position="top">
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
                            {options.length > 0 ? (
                                options.map((option) => (
                                    <ListboxOption key={option[optionValueKey]} value={option[optionValueKey]} as={Fragment}>
                                        {({ active }) => {
                                            const isSelected = selectedOptions.includes(option[optionValueKey]);

                                            return (
                                                <li
                                                    onClick={() => handleOptionSelect(option[optionValueKey])}
                                                    className={`${optionClassName} 
                                                        ${active ? 'bg-blue-200' : ''} 
                                                        ${isSelected ? 'bg-blue-200 font-semibold text-blue-700' : 'text-gray-700'} 
                                                        hover:bg-blue-50 focus:outline-none transition-colors duration-200`}
                                                >
                                                    {/* If selected, show a custom icon */}
                                                    {isSelected && (
                                                        <Icon className="text-blue-600" size={16} />
                                                    )}
                                                    <span
                                                        className={`${isSelected ? 'font-bold text-blue-700' : 'text-gray-700'}`}
                                                    >
                                                        {option[optionLabelKey]}
                                                    </span>
                                                </li>
                                            );
                                        }}
                                    </ListboxOption>
                                ))
                            ) : (
                                <ListboxOption disabled>
                                    <li className="px-4 py-2 text-gray-500">No options available</li>
                                </ListboxOption>
                            )}
                        </ListboxOptions>
                    </>
                )}
            </Listbox>
        </div>
    );
};

export default MultiSelectDropdown;
