import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Sparkles } from "lucide-react";
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
          ? "bg-gray-800/90 text-white border-gray-700"
          : "bg-white/80 text-blue-900 border-blue-100"
      } backdrop-blur-lg border-b shadow-lg z-50 relative`}
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
              isDarkMode
                ? "bg-gradient-to-r from-blue-900 to-purple-900"
                : "bg-gradient-to-r from-blue-100 to-purple-100"
            } rounded-lg`}
          >
            <Sparkles
              className={`w-6 h-6 ${
                isDarkMode ? "text-blue-400" : "text-blue-600"
              }`}
            />
          </div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            MMMUT RESO Dashboard
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
                    ? "bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                    : "bg-white hover:bg-gray-50 text-blue-900 border-blue-100"
                } px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border group`}
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
