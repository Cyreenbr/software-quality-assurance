import React from 'react';
import { TbError404 } from 'react-icons/tb';

const NotFound404 = ({ title = 'No data found', iconSize = 60, textStyle = 'text-2xl text-gray-800', codeError = "404" }) => {
    return (
        <div className="flex flex-col items-center justify-center text-gray-700 p-6">
            {/* Error Icon */}
            {codeError === "404" &&
                <TbError404 size={iconSize} className="text-red-500 mb-4" />
            }
            {/* Title */}
            <p className={`mt-2 ${textStyle} text-center font-semibold`}>{title}</p>

            {/* Optional Message */}
            <p className="mt-4 text-lg text-center text-gray-600">The page or resource you're looking for could not be found.</p>
        </div>
    );
};

export default NotFound404;
