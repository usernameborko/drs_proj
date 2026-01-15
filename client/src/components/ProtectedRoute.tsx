import * as React from "react"; 
import { Navigate } from "react-router-dom";
import { getToken } from "../services/authService";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = getToken();

  if (!token) {
    // Ako korisnik nije ulogovan, preusmeri na login
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
