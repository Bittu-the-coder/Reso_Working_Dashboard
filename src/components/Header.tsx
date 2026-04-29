import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, LayoutDashboard } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../contexts/ThemeContext";

const Header: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const { isDarkMode } = useTheme();

  return (
    <motion.header
      className={`${
        isDarkMode
          ? "bg-slate-900/90 text-white border-slate-800"
          : "bg-white/90 text-slate-900 border-slate-200"
      } backdrop-blur-lg border-b shadow-sm z-50 relative`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div
            className={`p-2 ${
              isDarkMode ? "bg-blue-900/50" : "bg-blue-50"
            } rounded-lg`}
          >
            <LayoutDashboard
              className={`w-6 h-6 ${
                isDarkMode ? "text-blue-400" : "text-blue-600"
              }`}
            />
          </div>
          <h1
            className={`text-2xl font-bold ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          >
            MMMUT{" "}
            <span className={isDarkMode ? "text-blue-400" : "text-blue-600"}>
              RESO
            </span>{" "}
            Dashboard
          </h1>
        </motion.div>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          {!isHomePage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Link
                to="/"
                className={`flex items-center gap-2 ${
                  isDarkMode
                    ? "bg-slate-800 hover:bg-slate-700 text-white border-slate-700"
                    : "bg-white hover:bg-slate-50 text-slate-900 border-slate-200"
                } px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border group`}
              >
                <Home className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Home
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
