// components/RecentActivities.js
import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

const RecentActivities = ({ events }) => {
  const { isDarkMode } = useTheme();

  return (
    <motion.div
      className={`${
        isDarkMode
          ? "bg-gray-800/80 border-gray-700"
          : "bg-white/80 border-blue-100"
      } backdrop-blur-lg p-6 rounded-2xl shadow-lg border relative overflow-hidden`}
      whileHover={{
        boxShadow: `0 8px 30px ${
          isDarkMode ? "rgba(59, 130, 246, 0.2)" : "rgba(59, 130, 246, 0.15)"
        }`,
      }}
    >
      <div className="flex items-center gap-3 mb-6 z-10 relative">
        <div
          className={`p-2 ${
            isDarkMode ? "bg-indigo-900" : "bg-indigo-100"
          } rounded-lg`}
        >
          <Calendar
            className={`w-5 h-5 ${
              isDarkMode ? "text-indigo-400" : "text-indigo-600"
            }`}
          />
        </div>
        <h3
          className={`text-xl font-bold ${
            isDarkMode ? "text-indigo-300" : "text-indigo-900"
          }`}
        >
          Recent Activities
        </h3>
      </div>
      <div className="space-y-3">
        {events
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .slice(0, 3)
          .map((event) => (
            <motion.div
              key={event.id}
              className={`bg-gradient-to-r ${
                isDarkMode
                  ? "from-blue-900/40 to-indigo-900/40 border-blue-800"
                  : "from-blue-50 to-indigo-50 border-blue-100"
              } p-4 rounded-xl border shadow-sm`}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex justify-between mb-1">
                <h5
                  className={`font-medium ${
                    isDarkMode ? "text-blue-300" : "text-blue-900"
                  }`}
                >
                  {event.title}
                </h5>
                <span
                  className={`text-sm ${
                    isDarkMode ? "text-blue-400" : "text-blue-700"
                  }`}
                >
                  {event.date}
                </span>
              </div>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-blue-400" : "text-blue-700"
                }`}
              >
                {event.description}
              </p>
            </motion.div>
          ))}
      </div>
    </motion.div>
  );
};

export default RecentActivities;
