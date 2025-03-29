import React, { useState } from 'react';
import { MdSearch } from 'react-icons/md';

const SearchBar = ({ handleSearch }) => {
    const [query, setQuery] = useState('');

    const handleInputChange = (e) => {
        const newQuery = e.target.value;
        setQuery(newQuery);
        handleSearch(newQuery);  // Pass the query to the parent component
    };

    return (
        <div className="relative w-full max-w-xs sm:max-w-md">
            <input
                type="text"
                placeholder="Search..."
                className="border border-gray-300 rounded-full px-4 py-2 w-full focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                aria-label="Search"
                value={query}
                onChange={handleInputChange}
            />
            <MdSearch
                size={20}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            />
        </div>
    );
};

export default SearchBar;
