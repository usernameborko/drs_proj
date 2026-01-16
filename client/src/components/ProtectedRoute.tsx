import * as React from "react";
import { Navigate } from "react-router-dom";
import { getToken, logout } from "../services/authService";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = getToken();

  const handleLogout = () => {
    logout();
    window.location.href = "/login"; // redirect na login
  };

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      {/* Logout dugme na vrhu */}
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "1rem" }}>
        <button
          onClick={handleLogout}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#f44336",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseOver={(e) =>
            ((e.target as HTMLButtonElement).style.backgroundColor = "#d32f2f")
          }
          onMouseOut={(e) =>
            ((e.target as HTMLButtonElement).style.backgroundColor = "#f44336")
          }
        >
          Logout
        </button>
      </div>

      {/* Sadržaj zaštićene stranice */}
      {children}
    </div>
  );
};

export default ProtectedRoute;
