import { useTheme } from "../../contexts/ThemeContext";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  icon: ReactNode;
  value: string | number;
  color: string;
  bgColor: string;
  textColor: string;
}

const StatsCard = ({
  title,
  icon,
  value,
  color,
  bgColor,
  textColor,
}: StatsCardProps) => {
  const { isDarkMode } = useTheme();

  return (
    <motion.div
      className={`${
        isDarkMode
          ? "bg-gray-800/80 border-gray-700"
          : "bg-white/80 border-blue-100"
      } backdrop-blur-lg p-6 rounded-2xl shadow-lg border relative overflow-hidden`}
      whileHover={{
        y: -5,
        boxShadow: "0 8px 30px rgba(59, 130, 246, 0.15)",
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
    >
      <div className="flex items-center z-10 relative">
        <div className={`p-3 rounded-xl ${bgColor}`}>
          <div className={textColor}>{icon}</div>
        </div>
        <div className="ml-4">
          <p
            className={`text-sm font-medium ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {title}
          </p>
          <p
            className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${color}`}
          >
            {value}
          </p>
        </div>
      </div>
      <div
        className={`absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-r ${
          isDarkMode
            ? "from-blue-900/10 to-purple-900/10"
            : "from-blue-100/50 to-purple-100/50"
        } rounded-full opacity-50`}
      />
      <div
        className={`absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 ${
          isDarkMode ? "border-blue-400/30" : "border-blue-200"
        } rounded-tl-lg`}
      />
      <div
        className={`absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 ${
          isDarkMode ? "border-blue-400/30" : "border-blue-200"
        } rounded-br-lg`}
      />
    </motion.div>
  );
};

export default StatsCard;
