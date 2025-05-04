import React from "react";

const Tooltip = ({
    text,
    position = "right",
    children,
    bgColor = "bg-gray-900",
    textColor = "text-white",
    styles = "relative group", // Ensure this class is added to the parent element
    alwaysOn = false
}) => {
    const positionClasses = {
        top: "bottom-full left-1/2 transform -translate-x-1/2 mb-1",
        bottom: "top-full left-1/2 transform -translate-x-1/2 mt-1",
        left: "right-full top-1/2 transform -translate-y-1/2 mr-1",
        right: "left-full top-1/2 transform -translate-y-1/2 ml-1", // Centered vertically next to the icon
    };

    return (
        <div className={styles}>
            {children} {/* Element that will trigger the tooltip */}
            <span
                className={`absolute ${positionClasses[position]}
                            ${bgColor} ${textColor} text-xs font-semibold py-1 px-2 rounded shadow-md
                            ${alwaysOn ? '' : 'opacity-0'}  group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap`}
            >
                {text}
            </span>
        </div>
    );
};

export default Tooltip;
