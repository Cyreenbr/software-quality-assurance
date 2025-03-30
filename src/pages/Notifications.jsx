import React from 'react';

const Notifications = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p>Here are your recent notifications:</p>
            <ul className="mt-4">
                <li className="flex items-center justify-between p-2 bg-white shadow rounded mb-2">
                    <span className="text-gray-700">CHBIIK AAA ?!</span>
                    <span className="text-xs text-gray-500">2 hours ago</span>
                </li>
                <li className="flex items-center justify-between p-2 bg-white shadow rounded mb-2">
                    <span className="text-gray-700">EEEE CHBIIIIKKK!!!???</span>
                    <span className="text-xs text-gray-500">3 hours ago</span>
                </li>
                <li className="flex items-center justify-between p-2 bg-white shadow rounded mb-2">
                    <span className="text-gray-700">3ICHA KA7LA</span>
                    <span className="text-xs text-gray-500">1 day ago</span>
                </li>
            </ul>
        </div>
    );
};

export default Notifications;