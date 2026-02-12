import React from "react";
import { Navigate } from "react-router-dom";
import { getToken } from "../services/authService";

interface RoleProtectedRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

/**
 * RoleProtectedRoute – dodatna zastita po ulozi.
 * Koristi se unutar ProtectedRoute (za vec autentifikovane korisnike).
 */
export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  allowedRoles,
  children,
}) => {
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const userRole = payload.role;

    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/no-permission" replace />;
    }
  } catch {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};