import React from 'react';

const MultiSelectDropdownFamily = ({ families, selectedFamilies, setSelectedFamilies }) => {
    const toggleFamily = (id) => {
        setSelectedFamilies(prev =>
            prev.includes(id)
                ? prev.filter(f => f !== id)
                : [...prev, id]
        );
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            {families.map(fam => {
                const isSelected = selectedFamilies.includes(fam._id.toString());
                return (
                    <button
                        key={fam._id}
                        type="button"
                        onClick={() => toggleFamily(fam._id.toString())}
                        className={`px-4 py-2 rounded-full text-sm border shadow transition 
                            ${isSelected
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300'}`}
                    >
                        {fam.title}
                    </button>
                );
            })}
        </div>
    );
};

export default MultiSelectDropdownFamily;
