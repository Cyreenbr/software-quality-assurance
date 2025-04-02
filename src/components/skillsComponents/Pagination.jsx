import debounce from "lodash.debounce";
import { useEffect, useMemo, useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md"; // Importing the icons

const Pagination = ({ currentPage, totalPages, onPageChange, styles = "bg-gray-600 text-white" }) => {
    const [inputPage, setInputPage] = useState(currentPage);

    // Create a debounced version of the page change function
    const debouncedPageChange = useMemo(
        () =>
            debounce((page) => {
                if (page >= 1 && page <= totalPages) {
                    onPageChange(page);
                }
            }, 700),
        [onPageChange, totalPages] // Dependencies, changes if `onPageChange` or `totalPages` change
    );

    const handlePageInputChange = (e) => {
        const page = Math.max(1, Math.min(totalPages, e.target.value)); // Ensure page is between 1 and totalPages
        setInputPage(page);
        debouncedPageChange(page);
    };

    // Update the input page when the current page changes
    useEffect(() => {
        if (currentPage > 0 && currentPage <= totalPages) {
            setInputPage(currentPage);
        }
    }, [currentPage, totalPages]);

    const handlePageInputBlur = () => {
        debouncedPageChange(inputPage); // When the input field loses focus, update the current page immediately
    };

    const handlePreviousClick = () => {
        const newPage = Math.max(1, currentPage - 1); // Prevent going below 1
        onPageChange(newPage);
    };

    const handleNextClick = () => {
        const newPage = Math.min(totalPages, currentPage + 1); // Prevent going above totalPages
        onPageChange(newPage);
    };

    // Ensure that the component does not render when the totalPages is zero or invalid
    if (totalPages <= 0) {
        return null; // You can show an empty state or a message here if needed
    }

    return (
        <div className="flex justify-center mt-6 space-x-4 items-center">
            {/* Previous Button with Icon */}
            <button
                onClick={handlePreviousClick}
                className={`${styles} px-4 py-2 rounded-lg ${currentPage <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'} transition`}
                disabled={currentPage <= 1}
            >
                <MdChevronLeft className="inline-block mr-2" /> {/* Previous icon */}
                Previous
            </button>

            {/* Page Input */}
            <div className="flex items-center space-x-2">
                <span className="text-lg text-gray-700">Page</span>
                <input
                    type="number"
                    value={Math.floor(Number(inputPage))} // Ensure the value is an integer
                    onChange={handlePageInputChange}
                    onBlur={handlePageInputBlur}
                    min={1}
                    max={totalPages}
                    className="w-12 text-center text-lg px-2 py-1 border rounded-md border-gray-300"
                    pattern="\d+"  // Allow only integer input (for browsers that support it)
                    step="1"  // This ensures that only integers are allowed by default
                    inputMode="numeric"  // On mobile devices, this helps to show the numeric keypad
                />
                <span className="text-lg text-gray-700">of {totalPages}</span>
            </div>

            {/* Next Button with Icon */}
            <button
                onClick={handleNextClick}
                className={`${styles}  text-white px-4 py-2 rounded-lg ${currentPage === totalPages || totalPages === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'} transition`}
                disabled={currentPage === totalPages || totalPages === 0}
            >
                Next
                <MdChevronRight className="inline-block ml-2" /> {/* Next icon */}
            </button>
        </div>
    );
};

export default Pagination;
