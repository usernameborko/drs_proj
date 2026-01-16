import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth?: string;
  gender?: string;
  country?: string;
  street?: string;
  number?: string;
}

const RegistrationPage: React.FC = () => {
  const [formData, setFormData] = useState<RegisterForm>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    dateOfBirth: "",
    gender: "",
    country: "",
    street: "",
    number: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errData = await response.json();
        setError(errData.message || "Registration failed");
        return;
      }

      const data = await response.json();
      setSuccess(data.message);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error("Registration error:", err);
      setError("Registration failed. Try again later.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #6a11cb, #2575fc)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "3rem",
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "1rem", color: "#333" }}>
          Create Account
        </h1>
        <p style={{ textAlign: "center", marginBottom: "2rem", color: "#666" }}>
          Fill in your details to register
        </p>

        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
            style={inputStyle}
          />
          <select name="gender" value={formData.gender} onChange={handleChange} style={inputStyle}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <input
            name="country"
            placeholder="Country"
            value={formData.country}
            onChange={handleChange}
            style={inputStyle}
          />
          <input
            name="street"
            placeholder="Street"
            value={formData.street}
            onChange={handleChange}
            style={inputStyle}
          />
          <input
            name="number"
            placeholder="Number"
            value={formData.number}
            onChange={handleChange}
            style={inputStyle}
          />

          {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
          {success && <p style={{ color: "green", textAlign: "center" }}>{success}</p>}

          <button
            type="submit"
            style={{
              padding: "0.75rem",
              border: "none",
              borderRadius: "8px",
              backgroundColor: "#2575fc",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "background 0.3s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1a5dcc")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#2575fc")}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  padding: "0.75rem",
  borderRadius: "8px",
  border: "1px solid #ccc",
  outline: "none",
  fontSize: "1rem",
};

export default RegistrationPage;
