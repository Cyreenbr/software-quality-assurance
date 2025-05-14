import { useEffect, useState } from "react";

const currentYear = new Date().getFullYear();

const AcademicYearPicker = ({ value, onChange }) => {
    const [startYear, setStartYear] = useState(() => {
        const match = value?.match(/^(\d{4})-(\d{4})$/);
        return match ? parseInt(match[1]) : currentYear;
    });

    useEffect(() => {
        onChange(`${startYear}-${startYear + 1}`);
    }, [startYear]);

    return (
        <div className="mt-2">
            <select
                value={startYear}
                onChange={(e) => setStartYear(parseInt(e.target.value))}
                className="p-3 w-full border border-gray-300 rounded-md"
            >
                {Array.from({ length: 10 }, (_, i) => currentYear - i).map((year) => (
                    <option key={year} value={year}>
                        {year} - {year + 1}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default AcademicYearPicker;
