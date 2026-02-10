import React from "react";

interface ProfileAvatarProps {
  imageUrl: string | null;
  firstName: string;
  lastName: string;
  size?: "sm" | "md" | "lg" | "xl";
  editable?: boolean;
  onImageChange?: (file: File) => void;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  imageUrl,
  firstName,
  lastName,
  size = "lg",
  editable = false,
  onImageChange,
}) => {
  const sizeClasses = {
    sm: "w-12 h-12 text-lg",
    md: "w-20 h-20 text-2xl",
    lg: "w-32 h-32 text-4xl",
    xl: "w-40 h-40 text-5xl",
  };

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onImageChange) {
      onImageChange(e.target.files[0]);
    }
  };

  return (
    <div className="relative inline-block">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={`${firstName} ${lastName}`}
          className={`${sizeClasses[size]} rounded-full object-cover border-4 border-white shadow-xl`}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 
                      flex items-center justify-center text-white font-bold border-4 border-white shadow-xl`}
        >
          {initials}
        </div>
      )}

      {editable && (
        <label
          className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-white shadow-lg 
                     flex items-center justify-center cursor-pointer
                     hover:bg-gray-50 transition-colors border border-gray-200"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
};