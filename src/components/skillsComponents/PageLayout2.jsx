import React from "react";
import { FaBook } from "react-icons/fa";

const PageLayout = ({ title, headerActions, children }) => {
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                {/* Header */}
                <header className="flex justify-between items-center p-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <FaBook className="text-4xl" /> {title}
                    </h1>
                    {headerActions && <div>{headerActions}</div>}
                </header>

                {/* Main Content */}
                <div className="p-8">{children}</div>
            </div>
        </div>
    );
};

export default PageLayout;