import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getToken, logout } from "../services/authService";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const token = getToken();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        backgroundColor: "#1976d2",
        color: "#fff",
      }}
    >
      <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
        Kviz platforma
      </div>

      <div style={{ display: "flex", gap: "1rem" }}>
        {!token && (
          <>
            <Link
              to="/login"
              style={{ color: "#fff", textDecoration: "none" }}
            >
              Login
            </Link>
            <Link
              to="/register"
              style={{ color: "#fff", textDecoration: "none" }}
            >
              Register
            </Link>
          </>
        )}

        {token && (
          <>
            <Link
              to="/profile"
              style={{ color: "#fff", textDecoration: "none" }}
            >
              Profil
            </Link>
            <Link
              to="/users"
              style={{ color: "#fff", textDecoration: "none" }}
            >
              Korisnici
            </Link>
            <button
              onClick={handleLogout}
              style={{
                padding: "0.3rem 0.8rem",
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
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
