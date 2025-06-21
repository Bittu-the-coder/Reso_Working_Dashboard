import React from "react";
import { useAuth, LoginPage, AuthHeader } from "../components/Auth";
import Dashboard from "./Dashboard";

const DashboardWithAuth: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="fixed top-4 right-4 z-50">
        <AuthHeader />
      </div>
      <Dashboard />
    </div>
  );
};

export default DashboardWithAuth;
