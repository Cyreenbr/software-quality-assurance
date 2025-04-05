import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ element, roles = [] }) {
    const role = useSelector((state) => state.auth.role);
    const level = useSelector((state) => state.auth.user?.level || null);
    // console.log(level);


    if (!role) {
        return <Navigate to="/signin" replace />;
    }

    if (roles.length > 0 && !roles.includes(role) && !roles.includes(level)) {
        return <Navigate to="/error" replace />;
    }

    return element;
}

export default ProtectedRoute;
