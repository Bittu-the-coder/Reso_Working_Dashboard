import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LearnMorePage from "./pages/LearnMorePage";
import DashboardWithAuth from "./pages/DashboardWithAuth";
import { AuthProvider } from "./components/Auth";
import { Toaster } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";

const App = () => {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "rgba(255, 255, 255, 0.9)",
            color: "#1e40af",
            border: "1px solid #dbeafe",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            borderRadius: "0.75rem",
            backdropFilter: "blur(8px)",
          },
          success: {
            iconTheme: {
              primary: "#4f46e5",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#ffffff",
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
