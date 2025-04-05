import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RoleEnum } from "../../utils/userRoles";

function ProtectedRoute({ element, roles = [], levels = [] }) {
  let role = useSelector((state) => state.auth.role);
  const levelUser = useSelector(
    (state) => state.auth.user?.level || "BARRAWA7"
  );

  console.log(levels);
  console.log(levelUser);

  if (!role) {
    return <Navigate to="/signin" replace />;
  }

  if (role === RoleEnum.STUDENT) {
    if (levels.length > 0 && !levels.includes(levelUser)) {
      return <Navigate to="/error" replace />;
    }
  }

  if (roles.length > 0 && !roles.includes(role)) {
    return <Navigate to="/error" replace />;
  }

  return element;
}

export default ProtectedRoute;
