import React from "react";
import { Link, useLocation } from "react-router-dom";

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const NavLink: React.FC<NavLinkProps> = ({ to, children, icon }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200
                  ${isActive 
                    ? "bg-white/20 text-white" 
                    : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
    >
      {icon}
      {children}
    </Link>
  );
};