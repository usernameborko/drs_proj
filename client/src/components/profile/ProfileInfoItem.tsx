import React from "react";

interface ProfileInfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | undefined;
  gradient?: string;
}

export const ProfileInfoItem: React.FC<ProfileInfoItemProps> = ({
  icon,
  label,
  value,
  gradient = "from-violet-500 to-indigo-500",
}) => {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50/80 hover:bg-gray-100/80 transition-colors">
      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} 
                      flex items-center justify-center shadow-md flex-shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">{label}</p>
        <p className="text-gray-800 font-medium truncate">{value || "—"}</p>
      </div>
    </div>
  );
};