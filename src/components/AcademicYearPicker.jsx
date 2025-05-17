import { useEffect, useState } from "react";
import { FaCalendarAlt, FaChevronDown, FaTimes } from "react-icons/fa";

const getAcademicYears = ({
    range = 10,
    direction = "both",
    includeCurrent = true,
    disableYears = () => false
}) => {
    const currentYear = new Date().getFullYear();
    let years = [];
    const addYear = (y) => {
        if (!includeCurrent && y === currentYear) return;
        years.push({ year: y, disabled: disableYears(y) });
    };
    if (direction === "past") {
        for (let i = range; i >= 0; i--) addYear(currentYear - i);
    } else if (direction === "future") {
        for (let i = 0; i <= range; i++) addYear(currentYear + i);
    } else {
        for (let i = -range; i <= range; i++) addYear(currentYear + i);
    }
    return years.sort((a, b) => b.year - a.year);
};

const AcademicYearPicker = ({
    value,
    onChange,
    range = 10,
    direction = "both",
    includeCurrent = true,
    disableYears = () => false,
    className = "",
    label = "Select Academic Year",
    required = false,
    id = "academic-year-picker",
    placeholder = "Choose academic year...",
    variant = "primary", // primary, secondary, outlined
}) => {
    const parseStartYear = (val) => {
        const match = val?.match(/^(\d{4})-(\d{4})$/);
        return match ? parseInt(match[1]) : "";
    };

    const [startYear, setStartYear] = useState(parseStartYear(value));
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        const newStartYear = parseStartYear(value);
        if (newStartYear && newStartYear !== startYear) {
            setStartYear(newStartYear);
        }
    }, [value]);

    useEffect(() => {
        if (startYear) {
            onChange(`${startYear}-${startYear + 1}`);
        } else {
            onChange(""); // reset value
        }
    }, [startYear]);

    const academicYears = getAcademicYears({ range, direction, includeCurrent, disableYears });

    const handleReset = (e) => {
        e.stopPropagation();
        setStartYear("");
    };

    // Generate variant classes
    const getVariantClasses = () => {
        switch (variant) {
            case "secondary":
                return "border-gray-200 bg-gray-50 focus:border-indigo-400 focus:ring-indigo-300";
            case "outlined":
                return "border-indigo-200 bg-white focus:border-indigo-500 focus:ring-indigo-400";
            case "primary":
            default:
                return "border-gray-300 bg-white focus:border-indigo-500 focus:ring-indigo-400";
        }
    };

    const formattedValue = startYear ? `${startYear}-${startYear + 1}` : "";

    return (
        <div className="w-full">
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <div className={`relative ${isFocused ? "z-10" : ""}`}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                </div>

                <select
                    id={id}
                    value={startYear || ""}
                    onChange={(e) => setStartYear(parseInt(e.target.value) || "")}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`
                        appearance-none block w-full pl-10 pr-10 py-2.5 
                        rounded-lg shadow-sm text-base 
                        ${getVariantClasses()}
                        transition-all duration-200
                        focus:outline-none focus:ring-2
                        disabled:bg-gray-100 disabled:text-gray-500
                        ${className}
                    `}
                    required={required}
                    aria-label={label}
                >
                    <option value="">{placeholder}</option>
                    {academicYears.map(({ year, disabled }) => (
                        <option
                            key={year}
                            value={year}
                            disabled={disabled}
                            className={disabled ? "text-gray-400" : ""}
                        >
                            {year} - {year + 1}
                        </option>
                    ))}
                </select>

                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    {startYear ? (
                        <button
                            type="button"
                            onClick={handleReset}
                            className="h-5 w-5 text-gray-400 hover:text-red-500 focus:outline-none pointer-events-auto"
                            aria-label="Clear selection"
                        >
                            <FaTimes />
                        </button>
                    ) : (
                        <FaChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                </div>
            </div>

            {formattedValue && (
                <p className="mt-1 text-sm text-gray-500">
                    Selected: <span className="font-medium text-indigo-600">{formattedValue}</span>
                </p>
            )}
        </div>
    );
};

export default AcademicYearPicker;