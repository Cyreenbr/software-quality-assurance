import React, { useEffect, useRef } from 'react';

const Popup = ({ isOpen, onClose, title, children, position = "top-right" }) => {
    const popupRef = useRef(null);

    // Close the popup when clicking outside
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null; // Don't render the popup if it's not open

    // Define position classes based on the `position` prop
    const positionClasses = {
        'top-left': 'top-0 left-0 mt-12 ml-4',
        'top-right': 'top-0 right-0 mt-12 mr-4',
        'bottom-left': 'bottom-0 left-0 mb-12 ml-4',
        'bottom-right': 'bottom-0 right-0 mb-12 mr-4',
    };

    return (
        <div
            ref={popupRef}
            className={`absolute ${positionClasses[position]} w-64 bg-white shadow-lg rounded-md p-4 z-50`}
        >
            {/* Popup Header (optional) */}
            {title && (
                <div className="text-lg font-semibold text-gray-800 mb-3">{title}</div>
            )}

            {/* Popup Content */}
            <div className="text-sm text-gray-700">
                {children}
            </div>
        </div>
    );
};

export default Popup;
