import React from "react";
import { useTheme } from "../contexts/useTheme.ts";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = "" }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <motion.button
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggleTheme}
      className={`relative p-2 rounded-lg ${
        isDarkMode
          ? "bg-gray-800 text-yellow-300 hover:bg-gray-700"
          : "bg-blue-100 text-blue-800 hover:bg-blue-200"
      } transition-colors duration-200 ${className}`}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="relative w-6 h-6">
        {isDarkMode ? (
          <Sun className="absolute inset-0 w-6 h-6 transition-all transform" />
        ) : (
          <Moon className="absolute inset-0 w-6 h-6 transition-all transform" />
        )}
      </div>
    </motion.button>
  );
};

export default ThemeToggle;
