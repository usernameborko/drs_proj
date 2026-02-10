import React from "react";
import { Link, useLocation } from "react-router-dom";

interface MobileMenuProps {
  isOpen: boolean;
  isLoggedIn: boolean;
  userEmail?: string;
  onLogout: () => void;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  isLoggedIn,
  userEmail,
  onLogout,
  onClose,
}) => {
  const location = useLocation();

  if (!isOpen) return null;

  const MobileLink = ({ to, children, icon }: { to: string; children: React.ReactNode; icon: React.ReactNode }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        onClick={onClose}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors
                    ${isActive 
                      ? "bg-violet-100 text-violet-700" 
                      : "text-gray-700 hover:bg-gray-100"
                    }`}
      >
        {icon}
        {children}
      </Link>
    );
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div className="fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 md:hidden
                      animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <span className="text-lg font-bold text-transparent bg-clip-text 
                           bg-gradient-to-r from-violet-600 to-indigo-600">
            Menu
          </span>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User Info (if logged in) */}
        {isLoggedIn && (
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-violet-50 to-indigo-50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500
                              flex items-center justify-center text-white font-bold text-lg">
                {userEmail?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <p className="font-medium text-gray-800">{userEmail || "User"}</p>
                <p className="text-xs text-gray-500">Logged in</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <div className="p-4 space-y-2">
          {!isLoggedIn ? (
            <>
              <MobileLink 
                to="/login"
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>}
              >
                Login
              </MobileLink>
              <MobileLink 
                to="/register"
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>}
              >
                Register
              </MobileLink>
            </>
          ) : (
            <>
              <MobileLink 
                to="/profile"
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>}
              >
                My Profile
              </MobileLink>
              <MobileLink 
                to="/users"
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>}
              >
                User Management
              </MobileLink>
            </>
          )}
        </div>

        {/* Logout Button */}
        {isLoggedIn && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
            <button
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 
                         rounded-xl bg-red-50 text-red-600 font-medium
                         hover:bg-red-100 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
};