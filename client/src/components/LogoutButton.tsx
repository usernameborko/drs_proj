import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/authService";

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // briše token
    navigate("/login"); // preusmerava na login
  };

  return (
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
  );
};

export default LogoutButton;
