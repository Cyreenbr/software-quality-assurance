import React, { useEffect, useState } from 'react';
import { FaQuestion } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { getMenuItems } from '../services/configs/menuHandler';
import useDeviceType from '../utils/useDeviceType';
import Tooltip from './skillsComponents/Tooltip';

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const role = useSelector((state) => state.auth.role);
    const menuItems = getMenuItems(role);
    const location = useLocation();

    // State for collapsed sidebar
    const [isCollapsed, setIsCollapsed] = useState(() => {
        return JSON.parse(localStorage.getItem('isSidebarCollapsed')) || false;
    });

    // Use the custom hook to get the device type
    const deviceType = useDeviceType();
    const isMobileOrTablet = deviceType === 'mobile' || deviceType === 'tablet'; // Check if mobile or tablet


    useEffect(() => {
        if (isMobileOrTablet) setIsCollapsed(false); // Automatically collapse on mobile/tablet
        localStorage.setItem('isSidebarCollapsed', JSON.stringify(isCollapsed));
    }, [isCollapsed, isMobileOrTablet]);

    const handleCollapseToggle = () => {
        if (!isMobileOrTablet) setIsCollapsed((prev) => !prev);
    };

    const handleLinkClick = () => {
        if (isMobileOrTablet) setIsSidebarOpen(false);
    };

    return (
        <>
            {/* Overlay (close sidebar when clicking outside on mobile/tablet) */}
            {isMobileOrTablet && isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-opacity-50 bg-transparent z-40"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            <div
                className={`bg-white fixed top-16 left-0 h-full shadow-lg transition-transform duration-300 ease-in-out z-40 
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:relative`}
                style={{
                    width: isCollapsed ? '85px' : '250px',
                }}
            >
                {/* Collapse Button (Only on Desktop) */}
                <div
                    className="flex items-center justify-center p-4 cursor-pointer bg-gray-100 hover:bg-gray-200 transition"
                    onClick={handleCollapseToggle}
                    role="button"
                    tabIndex={0}
                    aria-expanded={!isCollapsed}
                    aria-label="Toggle sidebar collapse"
                >
                    {!isMobileOrTablet && (
                        <svg
                            className={`text-indigo-600 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
                            height="24"
                            width="24"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                        </svg>
                    )}
                </div>

                {/* Navigation Menu */}
                <nav className="p-4">
                    <ul className="space-y-2">
                        {menuItems
                            .filter((item) => item.active)
                            .map(({ label, icon: Icon, path, tooltip, order }) => {
                                // Resolve dynamic paths (e.g., `/subjects/:id`)
                                const resolvedPath = typeof path === 'function' ? path(':id') : path;

                                return (
                                    <li key={order} className="relative group">
                                        <Link
                                            to={resolvedPath}
                                            className={`flex items-center p-3 rounded-lg transition ${location.pathname === resolvedPath
                                                ? 'bg-indigo-600 text-white'
                                                : 'hover:bg-indigo-100 text-gray-700'
                                                }`}
                                            onClick={handleLinkClick}
                                        >
                                            <span className="text-2xl">{Icon ? <Icon /> : <FaQuestion />}</span>
                                            {!isCollapsed && <span className="ml-4">{label || 'Unnamed Item'}</span>}
                                        </Link>
                                        {isCollapsed && (
                                            <Tooltip text={tooltip || label || 'Unnamed Item'} position="right" styles="" />
                                        )}
                                    </li>
                                );
                            })}
                    </ul>
                </nav>
            </div>
        </>
    );
};

export default Sidebar;