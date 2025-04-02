import React, { useEffect, useState } from 'react';
import { FaQuestion } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const location = useLocation(); 
    const isDesktop = !isMobileOrTablet;

    // Retrieve collapsed state from localStorage (persist across reloads)
    const [isCollapsed, setIsCollapsed] = useState(() => {
        return JSON.parse(localStorage.getItem("isSidebarCollapsed")) || false;
    });
    // State for mobile/tablet and desktop detection
    const [isMobileOrTablet, setIsMobileOrTablet] = useState(window.innerWidth < 1024);

    useEffect(() => {
        const handleResize = () => {
            setIsMobileOrTablet(window.innerWidth < 1024);
        };
        // Listen to resize events to adjust the screen size on window change
        window.addEventListener('resize', handleResize);
        // Cleanup the event listener on component unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (isMobileOrTablet) {
            setIsCollapsed(false);
        }
        localStorage.setItem("isSidebarCollapsed", JSON.stringify(isCollapsed));

    }, [isCollapsed, isMobileOrTablet]);

    // Toggle collapse only on desktop
    const handleCollapseToggle = () => {
        if (isDesktop) {
            setIsCollapsed(prev => !prev);
        }
    };

    // Close sidebar on mobile/tablet when clicking a link
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
                    width: isCollapsed ? '85px' : '250px', // Collapsed width is 85px, otherwise 250px
                }}
            >
                {/* Collapse Button (Only on Desktop) */}
                <div
                    className={`flex items-center justify-center p-4 ${isDesktop ? 'cursor-pointer bg-gray-100 hover:bg-gray-200 transition' : ''}`}
                    onClick={handleCollapseToggle}
                >
                    {isDesktop && (
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
                        {menuItems.map(({ label, icon: Icon, path, tooltip, order }) => (
                            <li key={order} className="relative group">
                                <Link
                                    to={path}
                                    className={`flex items-center p-3 rounded-lg transition 
                                        ${location.pathname === path ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-100 text-gray-700'}`}
                                    onClick={handleLinkClick}
                                >
                                    <span className="text-2xl">{Icon ? <Icon /> : <FaQuestion />}</span>
                                    {/* Only show label if not collapsed */}
                                    {!isCollapsed && <span className="ml-4">{label ? label : 'zid label fel menuHandler.js'}</span>}
                                </Link>

                                {/* Tooltip (Show only when collapsed) */}
                                {/* {isCollapsed && tooltip && ( */}
                                {isCollapsed && (
                                    <Tooltip text={tooltip ? tooltip : label} position="right" styles='' />
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </>
    );
};

export default Sidebar;
