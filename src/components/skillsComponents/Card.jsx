
import React from 'react';

const Card = ({ title, value, change, icon }) => {
    return (
        <div className="bg-white shadow rounded p-4 flex items-center justify-between">
            <div>
                <span className="text-gray-600">{title}</span>
                <h3 className="text-xl font-bold mt-1">${value}</h3>
                <span className={`text-xs ${change > 0 ? 'text-green-500' : 'text-red-500'} mt-1`}>
                    {change > 0 ? `+${change}%` : `${change}%`} than last week
                </span>
            </div>
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {icon}
                </svg>
            </div>
        </div>
    );
};

export default Card;