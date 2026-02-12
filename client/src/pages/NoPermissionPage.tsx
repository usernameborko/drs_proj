import React from "react";
import { useNavigate } from "react-router-dom";

const NoPermissionPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-violet-50 to-indigo-50 px-6">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-md text-center border border-white/60">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Access Denied
        </h1>
        <p className="text-gray-600 mb-6">
          You do not have permission to access this page.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-semibold hover:scale-105 transition"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default NoPermissionPage;