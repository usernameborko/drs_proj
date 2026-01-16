import React, { useEffect, useState } from "react";
import type { UserProfile } from "../services/userService";
import { getAllUsers, deleteUser, changeUserRole } from "../services/userService";

const UserListPage: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId: number) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(userId);
      setUsers(users.filter((u) => u.id !== userId));
    } catch (err) {
      console.error("Delete failed:", err);
      setError("Failed to delete user");
    }
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      await changeUserRole(userId, newRole);
      setUsers(users.map((u) => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      console.error("Role change failed:", err);
      setError("Failed to change role");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "1.5rem", color: "#333" }}>User List</h2>
      {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}
      {loading ? <p>Loading users...</p> :
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "#fff",
          boxShadow: "0 0 10px rgba(0,0,0,0.05)",
          borderRadius: "8px",
          overflow: "hidden"
        }}>
          <thead style={{ backgroundColor: "#f5f5f5" }}>
            <tr>
              <th style={{ padding: "0.8rem", textAlign: "left" }}>ID</th>
              <th style={{ padding: "0.8rem", textAlign: "left" }}>Email</th>
              <th style={{ padding: "0.8rem", textAlign: "left" }}>Role</th>
              <th style={{ padding: "0.8rem", textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "0.8rem" }}>{user.id}</td>
                <td style={{ padding: "0.8rem" }}>{user.email}</td>
                <td style={{ padding: "0.8rem" }}>
                  <select value={user.role} onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    style={{ padding: "0.3rem 0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}>
                    <option value="PLAYER">PLAYER</option>
                    <option value="MODERATOR">MODERATOR</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td style={{ padding: "0.8rem", textAlign: "center" }}>
                  <button onClick={() => handleDelete(user.id)}
                    style={{
                      backgroundColor: "#f44336",
                      color: "#fff",
                      border: "none",
                      padding: "0.4rem 0.8rem",
                      cursor: "pointer",
                      borderRadius: "4px",
                      transition: "background 0.2s"
                    }}
                    onMouseOver={(e) =>
                      ((e.target as HTMLButtonElement).style.backgroundColor = "#d32f2f")}
                    onMouseOut={(e) =>
                      ((e.target as HTMLButtonElement).style.backgroundColor = "#f44336")}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    </div>
  );
};

export default UserListPage;
