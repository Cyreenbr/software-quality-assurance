import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { Fragment, useMemo } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Tooltip from '../Tooltip';

const MultiSelectDropdown = ({
    items,
    selectedItems,
    setSelectedItems,
    label = 'Select Items',
    placeholder = 'No items available',
    getKey = (item) => item._id, // Default key extractor
    getLabel = (item) => item.title, // Default label extractor
}) => {
    // Memoized function to get selected items
    const getSelectedItems = useMemo(() => {
        return items.filter((item) => selectedItems.includes(getKey(item)));
    }, [items, selectedItems, getKey]);

    // Toggle selection of items when clicked
    const handleItemSelect = (itemId) => {
        setSelectedItems((prevSelectedItems) => {
            const newSelection = prevSelectedItems.includes(itemId)
                ? prevSelectedItems.filter((id) => id !== itemId)
                : [...prevSelectedItems, itemId];
            return newSelection;
        });
    };

    // Clear all selected items
    const handleClearAll = () => {
        setSelectedItems([]);
    };

    return (
        <div className="relative mt-1">
            <Listbox as="div" className="w-full" multiple value={selectedItems} onChange={setSelectedItems}>
                {({ open }) => (
                    <>
                        {/* Button to toggle the Listbox */}
                        <div className="flex justify-between items-center">
                            <ListboxButton
                                className="w-full px-4 py-2 text-left bg-white border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none flex justify-between items-center cursor-pointer hover:bg-blue-100 hover:scale-105 hover:outline-1 transform transition-all duration-300 ease-in-out"
                            >
                                <span className={`text-sm ${selectedItems.length === 0 ? 'text-gray-400' : 'text-gray-700'}`}>
                                    {selectedItems.length === 0
                                        ? label
                                        : getSelectedItems.map((item) => getLabel(item)).join(', ') || label}
                                </span>
                                <span className="text-sm text-gray-500">
                                    {selectedItems.length} selected
                                </span>
                            </ListboxButton>

                            {/* Clear All Button */}
                            {selectedItems.length > 0 && (
                                <Tooltip text={`Clear all ${label.toLowerCase()}`} position="top">
                                    <button
                                        onClick={handleClearAll}
                                        className="ml-2 p-2 text-red-600 hover:bg-red-100 rounded-full"
                                        aria-label={`Clear all ${label.toLowerCase()}`}
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
                            {items.length > 0 ? (
                                items.map((item) => {
                                    const itemId = getKey(item);
                                    const isSelected = selectedItems.includes(itemId);

                                    return (
                                        <ListboxOption key={itemId} value={itemId} as={Fragment}>
                                            {({ active }) => (
                                                <li
                                                    onClick={() => handleItemSelect(itemId)}
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
                                                        {getLabel(item)}
                                                    </span>
                                                </li>
                                            )}
                                        </ListboxOption>
                                    );
                                })
                            ) : (
                                <li className="px-4 py-2 text-gray-500 cursor-not-allowed">
                                    {placeholder}
                                </li>
                            )}
                        </ListboxOptions>
                    </>
                )}
            </Listbox>
        </div>
    );
};

export default MultiSelectDropdown;