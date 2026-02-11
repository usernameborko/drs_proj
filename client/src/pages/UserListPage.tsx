import React, { useEffect, useState, useCallback } from "react";
import { userAPI } from "../api/users/UserAPI";
import type { UserSummaryDTO } from "../models/user/UserSummaryDTO";
import { UserTable } from "../components/admin/users/UserTable";
import { UserListHeader } from "../components/admin/users/UserListHeader";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { ErrorAlert } from "../components/ui/ErrorAlert";

type UserRole = "PLAYER" | "MODERATOR" | "ADMIN";

const UserListPage: React.FC = () => {
  const [users, setUsers] = useState<UserSummaryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchUsers = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError("");
      
      const data = await userAPI.getAllUsers();
      setUsers(data.users || []);
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (userId: number): Promise<void> => {
    try {
      await userAPI.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err: any) {
      console.error("Delete failed:", err);
      setError(err.message || "Failed to delete user");
      throw err;
    }
  };

  const handleRoleChange = async (userId: number, newRole: UserRole): Promise<void> => {
    try {
      await userAPI.changeUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err: any) {
      console.error("Role change failed:", err);
      setError(err.message || "Failed to change role");
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <UserListHeader
          userCount={users.length}
          onRefresh={() => fetchUsers(true)}
          isRefreshing={refreshing}
        />

        {/* Error Alert */}
        {error && (
          <ErrorAlert 
            message={error} 
            onDismiss={() => setError("")} 
          />
        )}

        {/* Main Content Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
          {loading ? (
            <LoadingSpinner message="Loading users..." />
          ) : (
            <UserTable
              users={users}
              onRoleChange={handleRoleChange}
              onDelete={handleDelete}
            />
          )}
        </div>

        {/* Footer Stats */}
        {!loading && users.length > 0 && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatsCard
              label="Total Users"
              value={users.length}
              icon="users"
              gradient="from-violet-500 to-indigo-500"
            />
            <StatsCard
              label="Admins"
              value={users.filter((u) => u.role === "ADMIN").length}
              icon="shield"
              gradient="from-red-500 to-pink-500"
            />
            <StatsCard
              label="Players"
              value={users.filter((u) => u.role === "PLAYER").length}
              icon="gamepad"
              gradient="from-emerald-500 to-teal-500"
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Stats Card Component (inline za jednostavnost)
interface StatsCardProps {
  label: string;
  value: number;
  icon: "users" | "shield" | "gamepad";
  gradient: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon, gradient }) => {
  const icons = {
    users: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    ),
    shield: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    ),
    gamepad: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    ),
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-white/50 
                    hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} 
                        flex items-center justify-center shadow-lg`}>
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {icons[icon]}
          </svg>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
      </div>
    </div>
  );
};

export default UserListPage;