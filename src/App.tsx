import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LearnMorePage from "./pages/LearnMorePage";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Toaster } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import { useTheme } from "./contexts/useTheme";
import { LoginPage } from "./pages/auth/Login";
import { SignUpPage } from "./pages/auth/SignUp";
import DashboardLayout from "./layouts/DashboardLayout";
import PublicLayout from "./layouts/PublicLayout";

const ProtectedRoute = () => {
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

  return <DashboardLayout />;
};

const App = () => {
  const { isDarkMode } = useTheme();

  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: isDarkMode
              ? "rgba(31, 41, 55, 0.9)"
              : "rgba(255, 255, 255, 0.9)",
            color: isDarkMode ? "#f3f4f6" : "#1e40af",
            border: isDarkMode ? "1px solid #374151" : "1px solid #dbeafe",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            borderRadius: "0.75rem",
            backdropFilter: "blur(8px)",
          },
          success: {
            iconTheme: {
              primary: isDarkMode ? "#8b5cf6" : "#4f46e5",
              secondary: isDarkMode ? "#111827" : "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: isDarkMode ? "#111827" : "#ffffff",
            },
          },
        }}
      />
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <HomePage />
              </PublicLayout>
            }
          />
          <Route
            path="/learn-more"
            element={
              <PublicLayout>
                <LearnMorePage />
              </PublicLayout>
            }
          />
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />{" "}
          {/* Protected Routes */}
          <Route path="/dashboard/*" element={<ProtectedRoute />} />
        </Routes>
      </AnimatePresence>
    </AuthProvider>
  );
};

export default App;
