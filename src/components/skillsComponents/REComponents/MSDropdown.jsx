import { useEffect, useRef, useState } from 'react';
import { FaChevronDown, FaChevronUp, FaTimes } from 'react-icons/fa';

const MSDropdown = ({
    options,
    selectedOptions,
    setSelectedOptions,
    label,
    placeholder,
    loadMore,
    totalItems,
    loading,
    preSelectedOptions = []
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredOptions, setFilteredOptions] = useState(options);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Reference to the dropdown container
    const dropdownRef = useRef(null);

    // Initialize selectedOptions to include preSelectedOptions
    const [currentSelectedOptions, setCurrentSelectedOptions] = useState([
        ...new Set([...selectedOptions, ...preSelectedOptions.map(option => option._id)])
    ]);

    useEffect(() => {
        // Filter options based on search term
        if (searchTerm === '') {
            setFilteredOptions(options);
        } else {
            setFilteredOptions(
                options.filter(option => option.title.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
    }, [searchTerm, options]);

    useEffect(() => {
        // Automatically open the dropdown when there are filtered options
        if (filteredOptions.length > 0 && searchTerm.trim().length > 0) {
            setDropdownOpen(true);
        } else {
            setDropdownOpen(false);
        }
    }, [filteredOptions]);

    useEffect(() => {
        // Close dropdown when clicking outside of it
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };

        // Adding event listener
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup event listener on unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleOptionSelect = (option) => {
        const newSelectedOptions = currentSelectedOptions.includes(option._id)
            ? currentSelectedOptions.filter(id => id !== option._id)
            : [...currentSelectedOptions, option._id];

        setCurrentSelectedOptions(newSelectedOptions);
        setSelectedOptions(newSelectedOptions); // Update the parent selected options state
    };

    const handleToggleDropdown = () => {
        setDropdownOpen(prev => !prev);
    };

    const handleLoadMore = () => {
        loadMore(); // Function passed as a prop to load more items
    };

    const handleClearAll = () => {
        setCurrentSelectedOptions([]);
        setSelectedOptions([]); // Clear selected options in the parent component
        setSearchTerm(''); // Clear the search input
    };

    // Combine selectedOptions and preSelectedOptions
    const allSelectedOptions = [...new Set([...selectedOptions, ...preSelectedOptions.map(option => option._id)])];

    // Get titles of selected options (including pre-selected options)
    const selectedTitles = options
        .filter(option => allSelectedOptions.includes(option._id))
        .map(option => option.title)
        .join(', ') || "Select Skills";

    return (
        <div className="relative">
            <label className="block text-gray-700 font-semibold">{label}</label>

            {/* Search Input and Clear All Button Container */}
            <div className="flex items-center space-x-2 mb-2">
                {/* Search Input */}
                <input
                    type="text"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Dropdown Toggle Button with Clear All "X" Icon */}
            <div
                onClick={(e) => {
                    e.preventDefault();
                    handleToggleDropdown();
                }}
                className="w-full flex justify-between items-center p-2 bg-gray-200 rounded-lg text-left cursor-pointer"
            >
                <div className="flex items-center justify-between">

                    {/* Display selected titles */}
                    <span>{selectedTitles}</span>

                    {/* Clear All Button (X Icon) */}
                    {allSelectedOptions.length > 0 && (
                        <div
                            onClick={handleClearAll}
                            className="text-red-500 ml-2 cursor-pointer"
                            title="Clear All"
                        >
                            <FaTimes />
                        </div>
                    )}
                </div>

                <span>{dropdownOpen ? <FaChevronUp /> : <FaChevronDown />}</span>
            </div>

            {/* Dropdown Content */}
            {dropdownOpen && (
                <div ref={dropdownRef} className="absolute w-full mt-1 bg-white border rounded-lg shadow-md max-h-60 overflow-y-auto z-10">
                    <ul className="divide-y">
                        {filteredOptions.map((option) => (
                            <li
                                key={option._id}
                                className={`flex items-center p-2 cursor-pointer hover:bg-gray-100 ${allSelectedOptions.includes(option._id) ? 'bg-blue-100' : ''}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleOptionSelect(option);
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={allSelectedOptions.includes(option._id)}
                                    readOnly
                                    className="mr-2"
                                />
                                <span>{option.title}</span>
                            </li>
                        ))}
                    </ul>

                    {/* Load More Button */}
                    {/* {filteredOptions.length < totalItems && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                handleLoadMore();
                            }}
                            className="w-full py-2 bg-blue-500 text-white mt-2 rounded-lg"
                        >
                            {loading ? 'Loading...' : 'Load More'}
                        </button>
                    )} */}
                </div>
            )}

        </div>
    );
};

export default MSDropdown;
