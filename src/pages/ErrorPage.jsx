import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

function ErrorPage({ title = '', message = '' }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-700 p-6">

            <FaExclamationTriangle
                size={100}
                className="mb-6 text-red-600"
            />

            <h1 className="text-4xl font-extrabold text-center text-gray-900">
                {title || 'Unauthorized Access'}
            </h1>


            <p className="mt-4 text-lg text-center text-gray-800">
                {message || 'You do not have permission to access this page.'}
            </p>
            <button
                onClick={() => window.location.href = '/'}
                className="mt-8 px-8 py-4 bg-red-700 text-white rounded-lg shadow-lg hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 transition duration-300"
            >
                Go to Home
            </button>
        </div>
    );
}

export default ErrorPage;
