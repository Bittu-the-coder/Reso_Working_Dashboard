import React from "react";
import Dashboard from "./Dashboard";
import { useTheme } from "../contexts/useTheme";
import { AuthHeader, useAuth } from "../contexts/AuthContext";
import { LoginPage } from "./auth/Login";

const DashboardWithAuth: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const { isDarkMode } = useTheme();
  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-gray-900" : "bg-white"
        }`}
      >
        <div
          className={`animate-spin rounded-full h-8 w-8 border-b-2 ${
            isDarkMode ? "border-blue-400" : "border-blue-600"
          }`}
        ></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }
  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-950"
          : "bg-gradient-to-br from-blue-50 to-indigo-100"
      }`}
    >
      <div className="fixed top-4 right-4 z-50">
        <AuthHeader />
      </div>
      <Dashboard />
    </div>
  );
};

export default DashboardWithAuth;
