import { useCallback, useEffect, useRef, useState } from "react";
import { MdNotifications } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import notifServices from "../services/notifServices/notif.service";
import humanizeDate from "../utils/humanizeDate";
import { SocketNames } from "../utils/socketNames";
import useNotificationSocket from "../utils/useNotificationSocket";


const NotificationDropdown = () => {
    const userId = useSelector((state) => state.auth?.user?.id);
    const role = useSelector((state) => state.auth?.role);

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const dropdownRef = useRef(null);

    const limit = 9;

    const fetchNotifications = async (pageToFetch = 1) => {
        try {
            const data = await notifServices.fetchUserNotifications(pageToFetch, limit);
            if (Array.isArray(data.notifications)) {
                if (pageToFetch === 1) {
                    setNotifications(data.notifications);
                } else {
                    setNotifications((prev) => [...prev, ...data.notifications]);
                }
                const unread = data.notifications.filter((notif) => !notif.isRead).length;
                if (pageToFetch === 1) setUnreadCount(unread);
                setTotalPages(data.totalPages);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    useNotificationSocket({
        socketEvents: [
            SocketNames.newNotification,
            SocketNames.sendNotificationToUser,
            SocketNames.notificationError,
        ],
        onNotification: (data) => {
            setNotifications((prev) => [data, ...prev]);
            setUnreadCount((prev) => prev + 1);
        },
        activateToast: false,
    });

    useEffect(() => {
        if (!userId || !role) return;
        fetchNotifications(1);
    }, [userId, role]);

    const markAllAsRead = async () => {
        try {
            const response = await notifServices.markAllNotificationsAsRead();
            if (response.modifiedCount > 0) {
                setNotifications((prev) =>
                    prev.map((notif) => ({ ...notif, isRead: true }))
                );
                setUnreadCount(0);
            }
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
        }
    };

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
        if (!isOpen && unreadCount > 0) {
            markAllAsRead();
        }
    };

    const loadMoreNotifications = () => {
        const nextPage = page + 1;
        fetchNotifications(nextPage);
        setPage(nextPage);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getNotificationBgColor = (type) => {
        switch (type) {
            case "reminder": return "bg-gray-100";
            case "warning": return "bg-yellow-100";
            case "success": return "bg-green-100";
            case "urgent": return "bg-red-100";
            case "info": return "bg-blue-100";
            default: return "bg-white";
        }
    };

    const handleMarkAsClicked = useCallback(async (notifId) => {
        try {
            await notifServices.markNotificationAsClicked(notifId);
            setNotifications((prev) =>
                prev.map((n) =>
                    n._id === notifId ? { ...n, isClicked: true } : n
                )
            );
        } catch (err) {
            console.error("Erreur lors du marquage du clic :", err);
        }
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                className="relative text-gray-600 hover:text-indigo-600 p-2 rounded-full hover:bg-gray-100 transition-all"
                onClick={toggleDropdown}
            >
                <MdNotifications size={24} />
                {unreadCount > 0 && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs font-semibold rounded-full px-1.5">
                        +{unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute -right-1/2 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="p-4 border-b border-gray-100">
                        <h4 className="text-sm font-semibold text-gray-700">Notifications</h4>
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <p className="p-4 text-gray-500 italic">No notification</p>
                        ) : (
                            <ul className="divide-y divide-gray-100">
                                {notifications.map((notif, idx) => {
                                    const bgColor = getNotificationBgColor(notif.type);
                                    const content = (
                                        <div
                                            className={`p-4 hover:bg-gray-50 transition duration-150 cursor-pointer border-l-4 ${notif.isRead ? 'border-transparent' : 'border-indigo-500'} ${bgColor}`}
                                            onClick={() => {
                                                if (!notif.isClicked) {
                                                    handleMarkAsClicked(notif._id);
                                                }
                                            }}
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1">
                                                    <p className={`text-sm font-medium ${notif.url ? 'text-blue-800 underline' : 'text-gray-800'}`}>
                                                        {notif.title}
                                                    </p>
                                                    <p className="text-sm text-gray-600">{notif.message}</p>
                                                    {notif?.from &&
                                                        <p className="text-[10px] text-gray-600">
                                                            By Mr/Ms <b>{`${notif?.from?.firstName} ${notif?.from?.lastName}`}</b>
                                                        </p>
                                                    }

                                                </div>
                                                <div className="flex flex-col items-end space-y-1">
                                                    {!notif.isRead && (
                                                        <span className="text-[10px] text-white bg-red-500 px-1 rounded-sm">Non lu</span>
                                                    )}
                                                    {notif?.url && (
                                                        notif.isClicked ? (
                                                            <span className="text-[10px] text-green-600 font-semibold">✔ Cliqué</span>
                                                        ) : (
                                                            <span className="text-[10px] text-gray-400">Non cliqué</span>
                                                        )
                                                    )}
                                                    <p className="text-[10px] text-gray-600">{humanizeDate(notif.createdAt, true)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );

                                    return (
                                        <li key={idx}>
                                            {notif.url ? (
                                                <Link to={notif.url}>
                                                    {content}
                                                </Link>
                                            ) : (
                                                content
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                        {(page < totalPages) && (
                            <div className="p-4 text-center">
                                <button
                                    className="text-indigo-600 text-sm font-semibold hover:underline"
                                    onClick={loadMoreNotifications}
                                >
                                    Charger plus...
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;