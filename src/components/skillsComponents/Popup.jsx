import React, { useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa'; // FontAwesome Close Icon

const Popup = ({
    isOpen,
    onClose,
    title,
    children,
    position = "top-right",
    showCloseButton = false,
    closeButtonStyle = "absolute top-2 right-2 text-gray-600 hover:text-gray-900 cursor-pointer",
    zindex = 'z-40',
    styles = ' cursor-auto '
}) => {
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
        'center': 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'  // Centered position
    };

    return (
        <div className={styles}>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black opacity-50 ${zindex ? zindex : 'z-40'} ${isOpen ? 'block' : 'hidden'}`}
                onClick={onClose}
            />

            {/* Popup */}
            <div
                ref={popupRef}
                className={`absolute ${positionClasses[position]} w-80 bg-white shadow-lg rounded-md p-6 z-50 transition-all duration-300 transform ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                role="dialog"
                aria-labelledby="popup-title"
                aria-hidden={!isOpen}
            >
                {/* Popup Header */}
                {title && (
                    <div id="popup-title" className="text-lg font-semibold text-gray-800 mb-3">
                        {title}
                    </div>
                )}

                {/* Close Button */}
                {showCloseButton && (
                    <div
                        className={`absolute top-2 right-2 text-gray-600 hover:text-gray-900 cursor-pointer ${closeButtonStyle}`}
                        onClick={onClose}
                        role="button"
                        aria-label="Close Popup"
                    >
                        <FaTimes size={20} />
                    </div>
                )}

                {/* Popup Content */}
                <div className="text-sm text-gray-700">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Popup;
