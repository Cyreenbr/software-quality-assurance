import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RoleEnum } from "../../utils/userRoles";

function ProtectedRoute({ element, roles = [], levels = [] }) {
  const role = useSelector((state) => state.auth.role);
  const levelUser = useSelector((state) => state.auth.user?.level || "UNKNOWN");

  console.log("Expected levels:", levels);
  console.log("User level:", levelUser);
  console.log("Expected roles:", roles);
  console.log("User role:", role);

  // Not logged in → redirect to signin
  if (!role) {
    return <Navigate to="/signin" replace />;
  }

  // Role check
  if (roles.length > 0 && !roles.includes(role)) {
    return <Navigate to="/error" replace />;
  }

  if (levels.length > 0 && !levels.includes(levelUser)) {
    return <Navigate to="/error" replace />;
  }

  return element;
}

export default ProtectedRoute;
