import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getToken, logout } from "../../services/authService";
import { NavLink } from "./NavLink";
import { UserMenu } from "./UserMenu";
import { MobileMenu } from "./MobileMenu";

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("PLAYER");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  const handleLogin = () => {
    const token = getToken();
    setIsLoggedIn(!!token);

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserEmail(payload.email || payload.sub || "");
        setUserRole(payload.role || "PLAYER");

        const userId = payload.sub || payload.id;
        if (userId) {
          setProfileImageUrl(
            `${import.meta.env.VITE_API_URL}/users/profile-image/${userId}?t=${Date.now()}`
          );
        }
      } catch {
        setUserEmail("");
        setUserRole("PLAYER");
        setProfileImageUrl(null);
      }
    }
  };

  useEffect(() => {
    const token = getToken();
    setIsLoggedIn(!!token);

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserEmail(payload.email || payload.sub || "");
        setUserRole(payload.role || "PLAYER");
      } catch {
        setUserEmail("");
        setUserRole("PLAYER");
      }
    }

    window.addEventListener("login", handleLogin);
    return () => window.removeEventListener("login", handleLogin);
  }, []);

  useEffect(() => {
    const handleLogoutEvent = () => {
      setIsLoggedIn(false);
      setUserEmail("");
      setUserRole("PLAYER");
    };

    window.addEventListener("logout", handleLogoutEvent);
    return () => window.removeEventListener("logout", handleLogoutEvent);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    window.dispatchEvent(new Event("logout"));
    setIsLoggedIn(false);
    setUserEmail("");
    setUserRole("PLAYER");
    navigate("/login");
  };

  const getUserInitials = () => {
    if (userEmail && isNaN(Number(userEmail))) {
      return userEmail.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300
                    ${
                      isScrolled
                        ? "bg-gradient-to-r from-violet-600/95 to-indigo-600/95 backdrop-blur-lg shadow-lg"
                        : "bg-gradient-to-r from-violet-600 to-indigo-600"
                    }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div
                className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm
                              flex items-center justify-center
                              group-hover:bg-white/30 transition-colors"
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold text-white hidden sm:block">
                Quiz Platform
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              {!isLoggedIn ? (
                <>
                  {/* Login / Register */}
                  <NavLink
                    to="/login"
                    icon={
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                        />
                      </svg>
                    }
                  >
                    Login
                  </NavLink>
                  <Link
                    to="/register"
                    className="flex items-center gap-2 px-5 py-2 rounded-xl font-medium
                               bg-white text-violet-600 hover:bg-violet-50
                               transition-all duration-200 shadow-lg hover:shadow-xl
                               transform hover:scale-105"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      />
                    </svg>
                    Register
                  </Link>
                </>
              ) : (
                <>
                  {/* Profile link */}
                  <NavLink
                    to="/profile"
                    icon={
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    }
                  >
                    Profile
                  </NavLink>

                  {/* ADMIN - Users + Review Quizzes */}
                  {userRole === "ADMIN" && (
                    <>
                      <NavLink
                        to="/users"
                        icon={
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                          </svg>
                        }
                      >
                        Users
                      </NavLink>

                      <NavLink
                        to="/admin/quizzes"
                        icon={
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m2 0a2 2 0 012 2v4a2 2 0 01-2 2H7a2 2 0 01-2-2v-4a2 2 0 012-2m2 0V8a2 2 0 112 0v4"
                            />
                          </svg>
                        }
                      >
                        Review Quizzes
                      </NavLink>
                    </>
                  )}

                  {/* MODERATOR - Create Quiz */}
                  {userRole === "MODERATOR" && (
                    <NavLink
                      to="/moderator/create-quiz"
                      icon={
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      }
                    >
                      Create Quiz
                    </NavLink>
                  )}

                  {/* USER - Quizzes List */}
                  {userRole === "PLAYER" && (
                    <NavLink
                      to="/quizzes"
                      icon={
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                          />
                        </svg>
                      }
                    >
                      Quizzes
                    </NavLink>
                  )}

                  {/* User Menu */}
                  <div className="ml-2 pl-4 border-l border-white/20">
                    <UserMenu
                      userEmail={userEmail}
                      userInitials={getUserInitials()}
                      profileImageUrl={profileImageUrl}
                      onLogout={handleLogout}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        isLoggedIn={isLoggedIn}
        userEmail={userEmail}
        onLogout={handleLogout}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
};

export default Navbar;