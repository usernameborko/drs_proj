import React from "react";
import type { UserDTO } from "../../models/user/UserDTO";
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileInfoItem } from "./ProfileInfoItem";

interface ProfileViewCardProps {
  user: UserDTO;
  profileImageUrl: string | null; 
  onEditClick: () => void;
}

export const ProfileViewCard: React.FC<ProfileViewCardProps> = ({
  user,
  profileImageUrl,
  onEditClick,
}) => {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getGenderDisplay = (gender: string | undefined) => {
    switch (gender?.toLowerCase()) {
      case 'male': return 'Male';
      case 'female': return 'Female';
      case 'other': return 'Other';
      default: return '—';
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden">
      {/* Header sa slikom */}
      <div className="relative h-32 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500">
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
          <ProfileAvatar
            imageUrl={profileImageUrl ?? null}
            firstName={user.firstName || ""}
            lastName={user.lastName || ""}
            size="lg"
          />
        </div>
      </div>

      {/* User info */}
      <div className="pt-20 pb-6 px-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800">
          {user.firstName} {user.lastName}
        </h2>
        <p className="text-gray-500 mt-1">{user.email}</p>
        
        {/* Role badge */}
        <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full 
                        bg-gradient-to-r from-violet-100 to-indigo-100 
                        text-violet-700 text-sm font-medium">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          {user.role || "User"}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-6" />

      {/* Details Grid */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProfileInfoItem
          icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>}
          label="Date of Birth"
          value={formatDate(user.dateOfBirth ?? undefined)}
          gradient="from-cyan-500 to-blue-500"
        />

        <ProfileInfoItem
          icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>}
          label="Gender"
          value={getGenderDisplay(user.gender ?? undefined)}
          gradient="from-pink-500 to-rose-500"
        />

        <ProfileInfoItem
          icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>}
          label="Country"
          value={user.country ?? undefined}
          gradient="from-emerald-500 to-teal-500"
        />

        <ProfileInfoItem
          icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>}
          label="Address"
          value={user.street && user.streetNumber ? `${user.street} ${user.streetNumber}` : undefined}
          gradient="from-amber-500 to-orange-500"
        />
      </div>

      {/* Edit Button */}
      <div className="p-6 pt-2">
        <button
          onClick={onEditClick}
          className="w-full py-3 px-6 rounded-xl font-semibold
                     bg-gradient-to-r from-violet-500 to-indigo-500 
                     hover:from-violet-600 hover:to-indigo-600
                     text-white shadow-lg hover:shadow-xl
                     transition-all duration-300 transform hover:scale-[1.02]
                     flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit Profile
        </button>
      </div>
    </div>
  );
};