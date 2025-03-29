import React, { useState } from 'react';
import { FaBook } from 'react-icons/fa';
import { MdAccountCircle, MdDashboard, MdHome, MdNotifications } from 'react-icons/md';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [isCollapsed, setIsCollapsed] = useState(false); // State for collapse
    const location = useLocation();
    const isMobileOrTablet = windowWidth < 1024; // Mobile & Tablet
    const isDesktop = windowWidth >= 1024; // Desktop (PC)

    const handleLinkClick = () => {
        if (isMobileOrTablet) setIsSidebarOpen(false); // Close sidebar on mobile/tablet
    };

    // Disable collapsing on mobile/tablet
    const handleCollapseToggle = () => {
        if (isDesktop) {
            setIsCollapsed(!isCollapsed); // Only toggle collapse on desktop
        }
    };

    const menuItems = [
        { label: 'Home', icon: <MdHome />, path: '/', tooltip: 'Home' },
        { label: 'Dashboard', icon: <MdDashboard />, path: '/dashboard', tooltip: 'Dashboard' },
        { label: 'Profile', icon: <MdAccountCircle />, path: '/profile', tooltip: 'Profile' },
        { label: 'Subjects', icon: <FaBook />, path: '/subjects', tooltip: 'Subjects' },
        { label: 'Notifications', icon: <MdNotifications />, path: '/notifications', tooltip: 'Notifications' },
    ];

    return (
        <>
            {/* Overlay (close when clicked outside on mobile/tablet) */}
            {isMobileOrTablet && isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-opacity-50 z-40 bg-tr"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            <div
                className={`bg-white fixed top-16 left-0 h-full transition-transform duration-300 ease-in-out z-40 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:relative`}
                style={{
                    width: isCollapsed ? '85px' : '250px', // Adjusted collapsed width to 85px
                }}
            >
                {/* Branding - Only Collapse button for Desktop, but keep the same space */}
                <div
                    className={`flex flex-col items-center p-6 hover:bg-indigo-100 transition duration-300 relative cursor-pointer ${isDesktop ? '' : 'w-16'}`} // Space always occupied
                    onClick={handleCollapseToggle} // Set collapse on logo click
                >
                    {/* Arrow to indicate collapse/uncollapse */}
                    {isDesktop && (
                        <svg
                            stroke="currentColor"
                            fill="currentColor"
                            strokeWidth="0"
                            viewBox="0 0 24 24"
                            className={`text-indigo-600 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
                            height="24"
                            width="24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path fill="none" d="M0 0h24v24H0z"></path>
                            <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
                        </svg>
                    )}
                </div>

                {/* Navigation */}
                <nav className="p-4">
                    <ul className="space-y-4"> {/* Larger space between buttons */}
                        {menuItems.map(({ label, icon, path, tooltip }) => (
                            <li key={path}>
                                <Link
                                    to={path}
                                    className={`flex items-center w-full p-3 rounded-lg text-left cursor-pointer ${location.pathname === path
                                        ? 'bg-indigo-600 text-white'
                                        : 'hover:bg-indigo-100 text-gray-700'
                                        } transition duration-300 ease-in-out`}
                                    onClick={handleLinkClick}
                                    title={isCollapsed ? tooltip : ''} // Tooltip when collapsed
                                >
                                    <span className={`text-2xl ${isCollapsed ? 'text-3xl' : 'text-xl'}`}>{icon}</span>
                                    {/* Only show label if the sidebar is not collapsed */}
                                    {!isCollapsed && <span className="ml-4">{label}</span>}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </>
    );
};

export default Sidebar;
