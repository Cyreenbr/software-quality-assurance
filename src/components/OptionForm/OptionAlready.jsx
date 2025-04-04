import React from "react";

export default function OptionAlready() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg text-center transform transition-transform duration-300 hover:scale-105">
        <svg
          className="mx-auto h-16 w-16 text-red-600 animate-bounce"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h1 className="mt-4 text-3xl font-extrabold text-red-700">
          You Already Made Your Choice
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          You have already selected your option and cannot make another choice.
        </p>
      </div>
    </div>
  );
}
