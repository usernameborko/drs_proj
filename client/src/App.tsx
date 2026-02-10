import React from "react";
import AppRoutes from "./routes";
import "./index.css";

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-violet-50 to-indigo-50">
      <AppRoutes />
    </div>
  );
};

export default App;