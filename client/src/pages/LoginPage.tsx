import React from "react";
import { LoginForm } from "../components/auth/LoginForm";

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">

      <div
        className="flex-1 flex items-center justify-center px-4 py-12"
        style={{
          background: `linear-gradient(135deg, #E0E7FF 0%, #F3E8FF 50%, #FCE7F3 100%)`,
        }}
      >
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;