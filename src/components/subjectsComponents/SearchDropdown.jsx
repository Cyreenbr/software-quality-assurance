import React, { useEffect, useRef, useState } from "react";
import { FaCheckCircle, FaExclamationCircle, FaTimesCircle } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

const SearchDropdown = ({
    fetchData,
    onSelectItem,
    preselectedItem, // Receive preselectedItem from parent
    itemLabels, // Accept an array of itemLabels
    itemValue,
    placeholder = "Search...",
    multiple = false,
    showSelectedZone = true,
    children, // Add support for children
}) => {
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedItems, setSelectedItems] = useState(multiple ? [] : null); // Store full objects
    const [isLoading, setIsLoading] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const dropdownRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                inputRef.current &&
                !inputRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const fetchItems = async (searchValue) => {
        if (searchValue.trim() === "") {
            setItems([]);
            return;
        }
        setIsLoading(true);
        try {
            const data = await fetchData(searchValue);
            if (!data || !Array.isArray(data)) throw new Error("Invalid response from server.");
            setItems(data);
        } catch (error) {
            toast.error("Failed to load items: " + error.message);
        }
        setIsLoading(false);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setIsDropdownOpen(true);
    };

    useEffect(() => {
        const enrichItemsWithPreselected = async () => {
            if (!preselectedItem) return;
            let preselectedArray = multiple ? preselectedItem : [preselectedItem];
            const missingItems = preselectedArray.filter(
                (item) => !items.some((i) => i[itemValue] === item[itemValue])
            );
            if (missingItems.length > 0) {
                setItems((prevItems) => {
                    const existingIds = new Set(prevItems.map((i) => i[itemValue]));
                    const newItems = [...prevItems, ...missingItems.filter(i => !existingIds.has(i[itemValue]))];
                    return newItems;
                });
            }
        };
        enrichItemsWithPreselected();
    }, [preselectedItem, items, itemValue, multiple]);

    const handleSelectItem = (item) => {
        if (multiple) {
            setSelectedItems((prevSelectedItems) => {
                const isSelected = Array.isArray(prevSelectedItems) && prevSelectedItems.some((i) => i[itemValue] === item[itemValue]);
                const newSelectedItems = isSelected
                    ? prevSelectedItems.filter((i) => i[itemValue] !== item[itemValue]) // Deselect
                    : [...prevSelectedItems, item]; // Select
                onSelectItem(newSelectedItems); // Notify parent with full objects
                return newSelectedItems;
            });
        } else {
            setSelectedItems(item); // Single selection: store the full object
            onSelectItem(item); // Notify parent with the full object
            setIsDropdownOpen(false);
        }
    };

    const handleClearSelection = () => {
        setSelectedItems(multiple ? [] : null);
        setSearchTerm("");
        setItems([]);
        onSelectItem(multiple ? [] : null); // Notify parent of cleared selection
    };

    useEffect(() => {
        if (preselectedItem) {
            if (multiple && Array.isArray(preselectedItem)) {
                setSelectedItems(preselectedItem); // Set full objects for multiple selections
                onSelectItem(preselectedItem); // Notify parent with full objects
            } else if (!multiple && preselectedItem) {
                setSelectedItems(preselectedItem); // Set full object for single selection
                onSelectItem(preselectedItem); // Notify parent with the full object
            }
        } else {
            setSelectedItems(multiple ? [] : null);
            onSelectItem(multiple ? [] : null); // Notify parent of no selection
        }
    }, [preselectedItem, multiple]);

    useEffect(() => {
        if (searchTerm.trim() !== "") {
            fetchItems(searchTerm);
        } else {
            setItems([]);
            setIsDropdownOpen(false);
        }
    }, [searchTerm]);

    return (
        <div className="relative w-full">
            {/* Input Field */}
            <input
                ref={inputRef}
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                onFocus={() => setIsDropdownOpen(true)}
            />

            {/* Dropdown Options */}
            {isDropdownOpen && (
                <ul
                    ref={dropdownRef}
                    className="absolute w-full bg-white border rounded-md mt-1 shadow-lg max-h-60 overflow-auto z-10"
                >
                    {isLoading ? (
                        <div className="w-full flex justify-center py-2">
                            <ClipLoader size={20} color="#4A90E2" />
                        </div>
                    ) : items.length > 0 ? (
                        items.map((item) => {
                            const itemId = item[itemValue];
                            return (
                                <li
                                    key={itemId}
                                    onClick={() => handleSelectItem(item)} // Pass the full object
                                    className="cursor-pointer px-4 py-2 hover:bg-blue-100 flex justify-between"
                                >
                                    <span>
                                        {itemLabels.map((label, idx) => (
                                            <span key={idx}>
                                                {item[label]}{idx < itemLabels.length - 1 && " "}
                                            </span>
                                        ))}
                                    </span>
                                    {selectedItems === item || (multiple && selectedItems.some((i) => i[itemValue] === itemId)) ? (
                                        <FaCheckCircle className="text-blue-600" />
                                    ) : null}
                                </li>
                            );
                        })
                    ) : (
                        <li className="cursor-default px-4 py-2 text-gray-500 flex justify-between">
                            <span>No results found</span>
                            <FaExclamationCircle className="text-yellow-500" />
                        </li>
                    )}
                </ul>
            )}

            {/* Render Children */}
            {children}

            {/* Selected Items Zone (optional) */}
            {showSelectedZone && (multiple ? selectedItems.length > 0 : selectedItems) && (
                <div className="mt-4 p-2 bg-blue-50 border border-blue-300 rounded-md flex flex-wrap gap-2">
                    {multiple ? (
                        selectedItems.map((item) => (
                            <div key={item[itemValue]} className="flex items-center space-x-2 bg-blue-100 p-1 rounded-md">
                                <span>
                                    {itemLabels.map((label, idx) => (
                                        <span key={idx}>
                                            {item[label]}{idx < itemLabels.length - 1 && " "}
                                        </span>
                                    ))}
                                </span>
                                <button
                                    onClick={() => handleSelectItem(item)} // Pass the full object
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <FaTimesCircle size={16} />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="flex items-center space-x-2 bg-blue-100 p-1 rounded-md">
                            <span>
                                {itemLabels.map((label, idx) => (
                                    <span key={idx}>
                                        {selectedItems[label]}{idx < itemLabels.length - 1 && " "}
                                    </span>
                                ))}
                            </span>
                            <button
                                onClick={handleClearSelection}
                                className="text-red-500 hover:text-red-700"
                            >
                                <FaTimesCircle size={16} />
                            </button>
                        </div>
                    )}
                    {multiple && (
                        <button
                            onClick={handleClearSelection}
                            className="text-red-500 hover:text-red-700 mt-2"
                        >
                            Clear Selection
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchDropdown;