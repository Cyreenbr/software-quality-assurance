import React, { useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa"; // FontAwesome Close Icon

const Popup = ({
    isOpen,
    onClose,
    title,
    titlePosition = "left",
    children,
    position = "center",
    showCloseButton = false,
    closeButtonStyle = "absolute top-2 right-2 text-gray-600 hover:text-gray-900 cursor-pointer",
    zindex = "z-40",
    styles = "cursor-auto",
}) => {
    const popupRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const positionClasses = {
        "top-left": "top-4 left-4",
        "top-right": "top-4 right-4",
        "bottom-left": "bottom-4 left-4",
        "bottom-right": "bottom-4 right-4",
        center: "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
    };

    const titlePositions = {
        left: "text-left",
        right: "text-right",
        center: "text-center",
    };

    return (
        <div className={`fixed inset-0 flex items-center justify-center ${styles} ${zindex}`}>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black opacity-50"
                onClick={onClose}
            />

            {/* Popup Container */}
            {/* <div
                ref={popupRef}
                className={`absolute ${positionClasses[position]} 
                    bg-white shadow-lg rounded-md p-6 transition-all duration-300
                    transform scale-100 opacity-100
                    max-h-[90vh] overflow-auto
                    w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3`}
                role="dialog"
                aria-labelledby="popup-title"
                aria-hidden={!isOpen}
            > */}
            <div
                ref={popupRef}
                className={`absolute ${positionClasses[position]} 
        bg-white shadow-lg rounded-md p-6 transition-transform duration-300 ease-in-out
        scale-95 sm:scale-100 transform opacity-100
        w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3`} // max-h-[90vh] overflow-auto
                role="dialog"
                aria-labelledby="popup-title"
                aria-hidden={!isOpen}
            >

                {title && (
                    <div id="popup-title" className={`${titlePositions[titlePosition]} text-lg font-semibold text-gray-800 mb-3`}>
                        {title}
                    </div>
                )}

                {showCloseButton && (
                    <button
                        className={`absolute top-2 right-2 ${closeButtonStyle}`}
                        onClick={onClose}
                        aria-label="Close popup"
                    >
                        <FaTimes size={20} />
                    </button>
                )}

                <div className="text-sm text-gray-700">{children}</div>
            </div>
        </div>
    );
};

export default Popup;
