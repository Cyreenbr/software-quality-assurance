
import React from 'react';
import { useNotifications } from './NotificationContext';

const Notification = () => {
    const { notifications } = useNotifications();

    return (
        <div className="fixed top-0 right-0 p-4 z-50">
            {notifications.map((notification, index) => (
                <div
                    key={index}
                    className="bg-blue-500 text-white p-3 rounded mb-2 max-w-sm"
                >
                    <p>{notification.message}</p>
                </div>
            ))}
        </div>
    );
};

export default Notification;
