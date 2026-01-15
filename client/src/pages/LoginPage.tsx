import { useState } from "react";
import { useNavigate } from "react-router-dom"; // za redirect
import { login } from "../services/authService";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // hook za navigaciju

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // reset error

    try {
      const data = await login(email, password);
      localStorage.setItem("token", data.token);
      console.log("User logged in, token saved:", data.token);

      // redirect na profile posle uspešnog logina
      navigate("/profile");
    } catch (err) {
      console.error("Login failed:", err);
      setError("Login failed. Check your credentials.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label><br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" style={{ marginTop: "1rem" }}>Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
