import React from "react";

export default function PeriodNotOpen() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg text-center transform transition-transform duration-300 hover:scale-105">
        <svg
          className="mx-auto h-16 w-16 text-yellow-600 animate-pulse"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h1 className="mt-4 text-3xl font-extrabold text-yellow-700">
          Option Selection Period Closed
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          The option selection period is not currently open. Please check back
          later.
        </p>
      </div>
    </div>
  );
}
