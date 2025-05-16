import { useEffect, useRef, useState } from "react";
import {
  MdAccountCircle,
  MdExitToApp,
  MdMenu,
  MdMoreVert,
  MdSettings
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import isammLogo from "../assets/logo_isamm.png";
import { logoutUser } from "../redux/authSlice";
import Breadcrumb from "./Breadcrumb";
import NotificationDropdown from "./NotificationDropdown";
import Tooltip from "./skillsComponents/tooltip";

const Header = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.auth.token);
  // Gestion unifiée des popups
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    setLoading(true);
    setTimeout(() => {
      navigate("/");
      setLoading(false);
    }, 100);
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-white shadow-lg p-4 flex justify-between items-center z-50 rounded-b-xl transition-all">
      {/* Left - ISAMM Logo & Sidebar Toggle */}
      <div className="flex items-center space-x-3 text-gray-700">
        <button
          className="lg:hidden text-gray-600 hover:text-indigo-600 p-2 rounded-full hover:bg-gray-100 transition-all focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label="Toggle Sidebar"
        >
          <MdMenu size={24} />
        </button>

        <Link to="/" className="flex items-center space-x-2">
          <img
            src={isammLogo}
            alt="ISAMM Logo"
            className="w-10 sm:w-12 sm:h-12"
          />
          <span className="font-bold text-sm text-gray-800 hidden sm:block">
            ING Parcours
          </span>
        </Link>
        <Breadcrumb />
      </div>

      {/* Right - Actions */}
      <div className="flex items-center space-x-4" ref={menuRef}>
        {token ? (
          <>
            {/* Notifications */}
            <div className="relative">
              <Tooltip text="Notifications" position="bottom">
                {/* <button
                  className="text-gray-600 hover:text-indigo-600 p-2 rounded-full hover:bg-gray-100 transition-all"
                  onClick={() => toggleMenu("notifications")}
                >
                  <MdNotifications size={24} />
                </button> */}
                <NotificationDropdown />
              </Tooltip>

              {openMenu === "notifications" && (
                <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-48 p-2 z-50">
                  <ul className="space-y-2">
                    <li className="text-gray-700 hover:text-indigo-600 cursor-pointer p-2">
                      Notification 1
                    </li>
                    <li className="text-gray-700 hover:text-indigo-600 cursor-pointer p-2">
                      Notification 2
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {/* Profile */}
              <Tooltip text="Profile" position="bottom">
                <Link to="/profile">
                  <button className="text-gray-600 hover:text-indigo-600 p-2 rounded-full hover:bg-gray-100 transition-all">
                    <MdAccountCircle size={24} />
                  </button>
                </Link>
              </Tooltip>

              {/* Settings */}
              <div className="relative">
                <Tooltip text="Settings" position="bottom">
                  <button
                    className="text-gray-600 hover:text-indigo-600 p-2 rounded-full hover:bg-gray-100 transition-all"
                    onClick={() => toggleMenu("settings")}
                  >
                    <MdSettings size={24} />
                  </button>
                </Tooltip>

                {openMenu === "settings" && (
                  <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-48 p-2 z-50">
                    <ul className="space-y-2">
                      <li className="text-gray-700 hover:text-indigo-600 cursor-pointer p-2">
                        Profile Settings
                      </li>
                      <li className="text-gray-700 hover:text-indigo-600 cursor-pointer p-2">
                        Account Settings
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Logout */}
              <Tooltip text="Logout" position="bottom">
                <button
                  className="text-gray-600 hover:text-red-600 p-2 rounded-full hover:bg-gray-100 transition-all"
                  onClick={handleLogout}
                >
                  {!loading ? (
                    <MdExitToApp size={24} />
                  ) : (
                    <ClipLoader color="#3B82F6" size={24} />
                  )}
                </button>
              </Tooltip>
            </div>
          </>
        ) : (
          <>
            <Link to="/signin">
              <Tooltip text="Login" position="bottom">
                <button className="text-gray-600 hover:text-indigo-600 p-2 rounded-full hover:bg-blue-100 transition-all">
                  Sign In
                </button>
              </Tooltip>
            </Link>
          </>
        )}

        {/* More Options for Small Screens */}
        {token && (
          <div className="md:hidden relative">
            <button
              className="text-gray-600 hover:text-indigo-600 p-2 rounded-full hover:bg-gray-100"
              onClick={() => toggleMenu("more")}
            >
              <MdMoreVert size={24} />
            </button>
            {openMenu === "more" && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-48 p-2 z-50">
                <Link to="/profile">
                  <button className="w-full text-left text-gray-700 hover:text-gray-500 p-2">
                    <MdAccountCircle size={20} className="mr-2" /> Profile
                  </button>
                </Link>
                <button
                  className="w-full text-left text-gray-700 hover:text-red-600 p-2"
                  onClick={handleLogout}
                >
                  <MdExitToApp size={20} className="mr-2" /> Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
