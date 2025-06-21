import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LearnMorePage from "./pages/LearnMorePage";
import DashboardWithAuth from "./pages/DashboardWithAuth";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import { useTheme } from "./contexts/useTheme";

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
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardWithAuth />} />
          <Route path="/learn-more" element={<LearnMorePage />} />
        </Routes>
      </AnimatePresence>
    </AuthProvider>
  );
};

export default App;
