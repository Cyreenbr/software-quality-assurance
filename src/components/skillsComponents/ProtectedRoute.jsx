import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ element, roles }) {
    const role = useSelector((state) => state.auth.role);

    // If the user is not authorized, redirect to the error page
    if (!roles.includes(role)) {
        return <Navigate to="/error" replace />;
    }

    // If authorized, render the component passed as a prop
    return element; // Directly render the element as a JSX element
}

export default ProtectedRoute;
