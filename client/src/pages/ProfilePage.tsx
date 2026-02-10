import React, { useState, useEffect, useCallback } from "react";
import { userAPI } from "../api/users/UserAPI";
import type { UserDTO } from "../models/user/UserDTO";
import type { UpdateProfileDTO } from "../api/users/IUserAPI";
import { ProfileViewCard } from "../components/profile/ProfileViewCard";
import { ProfileEditForm } from "../components/profile/ProfileEditForm";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { ErrorAlert } from "../components/ui/ErrorAlert";
import { SuccessAlert } from "../components/ui/SuccessAlert";

type ProfileMode = "view" | "edit";

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [mode, setMode] = useState<ProfileMode>("view");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      
      const data = await userAPI.getProfile();
      setUser(data);

      if (data.profileImage) {
        setProfileImageUrl(
          `${import.meta.env.VITE_API_URL}/users/profile-image/${data.id}?t=${Date.now()}`
        );
      }
    } catch (err: any) {
      console.error("Error loading profile:", err);
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSave = async (data: UpdateProfileDTO, imageFile: File | null) => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      // Update profile data
      const updatedUser = await userAPI.updateProfile(data);
      setUser(updatedUser);

      // Upload image if provided
      if (imageFile) {
        await userAPI.uploadProfileImage(imageFile);
        setProfileImageUrl(
          `${import.meta.env.VITE_API_URL}/users/profile-image/${updatedUser.id}?t=${Date.now()}`
        );
      }

      setSuccess("Profile updated successfully!");
      setMode("view");
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setMode("view");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-indigo-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
            {mode === "view" ? "My Profile" : "Edit Profile"}
          </h1>
          <p className="text-gray-500 mt-2">
            {mode === "view" 
              ? "View and manage your personal information" 
              : "Update your profile details"
            }
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <ErrorAlert 
            message={error} 
            onDismiss={() => setError("")} 
          />
        )}

        {success && (
          <SuccessAlert 
            message={success} 
            onDismiss={() => setSuccess("")} 
          />
        )}

        {/* Content */}
        {loading ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8">
            <LoadingSpinner message="Loading profile..." />
          </div>
        ) : user ? (
          mode === "view" ? (
            <ProfileViewCard
              user={user}
              profileImageUrl={profileImageUrl}
              onEditClick={() => setMode("edit")}
            />
          ) : (
            <ProfileEditForm
              user={user}
              profileImageUrl={profileImageUrl}
              onSave={handleSave}
              onCancel={handleCancel}
              isLoading={saving}
            />
          )
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 text-center">
            <p className="text-gray-500">No profile data available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;