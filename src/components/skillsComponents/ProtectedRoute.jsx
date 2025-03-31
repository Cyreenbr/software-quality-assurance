import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ element, roles = [] }) {
    const role = useSelector((state) => state.auth.role);

    if (!role) {
        return <Navigate to="/signin" replace />;
    }

    if (roles.length > 0 && !roles.includes(role)) {
        return <Navigate to="/error" replace />;
    }

    return element;
}

export default ProtectedRoute;
