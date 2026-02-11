import React, { useState } from "react";
import type { UserSummaryDTO } from "../../../models/user/UserSummaryDTO";

type UserRole = "PLAYER" | "MODERATOR" | "ADMIN";

interface UserTableRowProps {
  user: UserSummaryDTO;
  onRoleChange: (userId: number, newRole: UserRole) => Promise<void>;
  onDelete: (userId: number) => Promise<void>;
}

export const UserTableRow: React.FC<UserTableRowProps> = ({ 
  user, 
  onRoleChange, 
  onDelete 
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isChangingRole, setIsChangingRole] = useState(false);

  const handleRoleChange = async (newRole: UserRole) => {
    setIsChangingRole(true);
    try {
      await onRoleChange(user.id, newRole);
    } finally {
      setIsChangingRole(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    
    setIsDeleting(true);
    try {
      await onDelete(user.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-700 border-red-200";
      case "MODERATOR":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
    }
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-violet-50/50 hover:to-indigo-50/50 transition-all duration-200">
      {/* ID */}
      <td className="px-6 py-4">
        <span className="text-sm font-medium text-gray-500">#{user.id}</span>
      </td>

      {/* Full Name */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-indigo-400 
                          flex items-center justify-center text-white font-semibold text-sm shadow-md">
            {user.full_name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-800">{user.full_name || "N/A"}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      </td>

      {/* Country */}
      <td className="px-6 py-4">
        <span className="text-sm text-gray-600">{user.country || "—"}</span>
      </td>

      {/* Role */}
      <td className="px-6 py-4">
        <div className="relative">
          <select
            value={user.role}
            onChange={(e) => handleRoleChange(e.target.value as UserRole)}
            disabled={isChangingRole}
            className={`appearance-none px-4 py-2 pr-8 rounded-lg border text-sm font-medium
                       cursor-pointer transition-all duration-200 outline-none
                       focus:ring-2 focus:ring-violet-300 focus:border-violet-400
                       disabled:opacity-50 disabled:cursor-not-allowed
                       ${getRoleBadgeColor(user.role)}`}
          >
            <option value="PLAYER">PLAYER</option>
            <option value="MODERATOR">MODERATOR</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
            {isChangingRole ? (
              <svg className="animate-spin h-4 w-4 text-gray-400" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            ) : (
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </div>
        </div>
      </td>

      {/* Created At */}
      <td className="px-6 py-4">
        <span className="text-sm text-gray-500">
          {new Date(user.created_at).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })}
        </span>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 text-center">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
                     bg-red-50 text-red-600 border border-red-200
                     hover:bg-red-100 hover:border-red-300
                     transition-all duration-200 text-sm font-medium
                     disabled:opacity-50 disabled:cursor-not-allowed
                     cursor-pointer"
        >
          {isDeleting ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Deleting...
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </>
          )}
        </button>
      </td>
    </tr>
  );
};