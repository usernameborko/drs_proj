import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getToken } from "../services/authService";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute – stiti rute koje zahtevaju autentifikaciju.
 * Ako korisnik nema token, preusmerava ga na /login.
 * Ako postoji token, prikazuje decu (zasticeni sadrzaj).
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = getToken();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;