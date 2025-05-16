import { useEffect, useState } from "react";

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
}) => {

    const parseStartYear = (val) => {
        const match = val?.match(/^(\d{4})-(\d{4})$/);
        return match ? parseInt(match[1]) : "";
    };

    const [startYear, setStartYear] = useState(parseStartYear(value));

    // Sync state with prop if it changes
    useEffect(() => {
        const newStartYear = parseStartYear(value);
        if (newStartYear && newStartYear !== startYear) {
            setStartYear(newStartYear);
        }
    }, [value]);

    // Update parent on internal change
    useEffect(() => {
        if (startYear) {
            onChange(`${startYear}-${startYear + 1}`);
        }
    }, [startYear]);

    const academicYears = getAcademicYears({ range, direction, includeCurrent, disableYears });

    return (
        <div className="mt-2">
            <select
                value={startYear || ""}
                onChange={(e) => setStartYear(parseInt(e.target.value))}
                className={`p-3 w-full border border-gray-300 rounded-md ${className}`}
                required={required}
            >
                <option value="" disabled>{label}</option>
                {academicYears.map(({ year, disabled }) => (
                    <option key={year} value={year} disabled={disabled}>
                        {year} - {year + 1}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default AcademicYearPicker;
