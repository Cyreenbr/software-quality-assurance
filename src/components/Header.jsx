import React, { useState } from 'react';
import {
    MdAccountCircle,
    MdExitToApp,
    MdLogin,
    MdMenu,
    MdMoreVert,
    MdNotifications,
    MdPersonAdd,
    MdSettings
} from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux'; // Import useDispatch and useSelector
import { Link, useLocation, useNavigate } from 'react-router-dom';
import isammLogo from '../assets/logo_isamm.png';
import { logoutUser } from '../redux/authSlice';
import { menuConfig } from '../services/configs/menuHandler';
import Popup from './skillsComponents/Popup';
// import SearchBar from './skillsComponents/SearchBar';

const Header = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const location = useLocation();
    const navigate = useNavigate(); // Hook to navigate
    const dispatch = useDispatch(); // Hook to dispatch actions
    const [isSettingsPopupOpen, setIsSettingsPopupOpen] = useState(false);
    const [isNotificationsPopupOpen, setIsNotificationsPopupOpen] = useState(false);
    // const [searchQuery, setSearchQuery] = useState('');

    const token = useSelector((state) => state.auth.token); // Access the token from Redux store

    const toggleSettingsPopup = () => setIsSettingsPopupOpen(!isSettingsPopupOpen);
    const toggleNotificationsPopup = () => setIsNotificationsPopupOpen(!isNotificationsPopupOpen);
    const getBreadcrumb = () => {
        const menuItem = menuConfig.find(item => item.path === location.pathname);
        return menuItem ? menuItem.label : 'Unknown';
    };
    // Method to handle search query
    // const handleSearch = (query) => {
    //     setSearchQuery(query);
    //     console.log('Search query:', query);
    // };

    const handleLogout = () => {
        dispatch(logoutUser());

        // Force the redirect after a small delay to make sure logout state is updated
        setTimeout(() => {
            navigate('/');
        }, 100);
    };
    return (
        <div className="fixed top-0 left-0 w-full bg-white shadow-lg p-4 flex justify-between items-center z-50 rounded-b-xl transition-all">
            {/* Left - ISAMM Logo & Sidebar Toggle & Breadcrumb */}
            <div className="flex items-center space-x-2 text-gray-700">
                {/* Sidebar Toggle Button */}
                <div className="group relative">
                    <button
                        className="lg:hidden text-gray-600 hover:text-indigo-600 p-2 rounded-full hover:bg-gray-100 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        aria-label="Toggle Sidebar"
                    >
                        <MdMenu size={24} />
                    </button>
                </div>

                {/* ISAMM Logo & "ING Parcours" Text */}
                <Link to="/" className="flex items-center space-x-2 mr-4">
                    <img
                        src={isammLogo}
                        alt="ISAMM Logo"
                        className="w-10 sm:w-12 sm:h-12"
                    />
                    <span className="font-bold text-sm text-gray-800 hidden sm:block">ING Parcours</span>
                </Link>

                {/* Breadcrumb Text */}
                <span className="text-sm sm:text-base font-semibold text-gray-800">
                    {location.pathname !== '/' && (
                        <Link to="/" className="hover:text-indigo-600">
                            Home
                        </Link>
                    )}
                    {getBreadcrumb() !== 'Home' && ` / ${getBreadcrumb()}`}
                </span>
            </div>

            {/* Right - Search & Actions */}
            <div className="flex items-center space-x-4">
                {/* Search Bar */}
                {/* <SearchBar handleSearch={handleSearch} /> */}

                {/* Actions for Larger Screens */}
                <div className="hidden sm:flex items-center space-x-4">
                    {token ? (
                        <>
                            {/* Profile, Notifications, and Settings Buttons */}
                            <div className="group relative" data-tooltip="Profile">
                                <Link to="/profile">
                                    <button
                                        className="text-gray-600 hover:text-indigo-600 p-2 rounded-full hover:bg-gray-100 transition-all focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                                        aria-label="Profile"
                                    >
                                        <MdAccountCircle size={24} />
                                    </button>
                                </Link>
                            </div>

                            <div className="group relative" data-tooltip="Notifications">
                                <button
                                    className="text-gray-600 hover:text-indigo-600 p-2 rounded-full hover:bg-gray-100 transition-all focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                                    onClick={toggleNotificationsPopup}
                                    aria-label="Notifications"
                                >
                                    <MdNotifications size={24} />
                                </button>
                            </div>

                            {/* Settings with Popup */}
                            <div className="group relative" data-tooltip="Settings">
                                <button
                                    className="text-gray-600 hover:text-indigo-600 p-2 rounded-full hover:bg-gray-100 transition-all focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                                    onClick={toggleSettingsPopup}
                                    aria-label="Settings"
                                >
                                    <MdSettings size={24} />
                                </button>
                            </div>

                            {/* Logout Button */}
                            <div className="group relative" title="Logout">
                                <button
                                    className="text-gray-600 hover:text-red-600 p-2 rounded-full hover:bg-gray-100 transition-all focus:ring-2 focus:ring-red-500 cursor-pointer"
                                    onClick={handleLogout}
                                >
                                    <MdExitToApp size={24} />
                                </button>
                            </div>
                        </>
                    ) : (
                        // Login & Sign Up Buttons when not logged in
                        <>
                            <Link to="/signin">
                                <div className="group relative" title="Sign In">
                                    <button
                                        className="text-gray-600 hover:text-indigo-600 p-2 rounded-full hover:bg-gray-100 transition-all focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                                    >
                                        <MdLogin size={24} />
                                    </button>
                                </div>
                            </Link>
                            <Link to="/signup">
                                <div className="group relative" title="Sign Up">
                                    <button
                                        className="text-gray-600 hover:text-indigo-600 p-2 rounded-full hover:bg-gray-100 transition-all focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                                    >
                                        <MdPersonAdd size={24} />
                                    </button>
                                </div>
                            </Link>
                        </>
                    )}
                </div>

                {/* More Options for Small Screens */}
                <div className="sm:hidden group relative" title="More Options">
                    <button
                        className="text-gray-600 hover:text-indigo-600 p-2 rounded-full hover:bg-gray-100 transition-all focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                        aria-label="More Options"
                    >
                        <MdMoreVert size={24} />
                    </button>
                </div>
            </div>

            {/* Popups for Settings and Notifications */}
            <Popup
                isOpen={isSettingsPopupOpen}
                onClose={toggleSettingsPopup}
                title="Settings"
                position="top-right"
            >
                <ul className="space-y-2">
                    <li className="text-gray-700 hover:text-indigo-600 cursor-pointer">
                        Profile Settings
                    </li>
                    <li className="text-gray-700 hover:text-indigo-600 cursor-pointer">
                        Account Settings
                    </li>
                    <li className="text-gray-700 hover:text-indigo-600 cursor-pointer">
                        Privacy Settings
                    </li>
                </ul>
            </Popup>

            <Popup
                isOpen={isNotificationsPopupOpen}
                onClose={toggleNotificationsPopup}
                title="Notifications"
                position="top-right"
            >
                <ul className="space-y-2">
                    <li className="text-gray-700 hover:text-indigo-600 cursor-pointer">
                        Notification 1
                    </li>
                    <li className="text-gray-700 hover:text-indigo-600 cursor-pointer">
                        Notification 2
                    </li>
                    <li className="text-gray-700 hover:text-indigo-600 cursor-pointer">
                        Notification 3
                    </li>
                </ul>
            </Popup>
        </div>
    );
};

export default Header;
