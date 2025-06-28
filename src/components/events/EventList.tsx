// components/EventList.js
import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { motion } from "framer-motion";
import { CalendarCheck, Calendar } from "lucide-react";

const EventList = ({ events }) => {
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
          isDarkMode ? "rgba(79, 70, 229, 0.2)" : "rgba(59, 130, 246, 0.15)"
        }`,
      }}
    >
      <div className="flex items-center gap-3 mb-6 z-10 relative">
        <div
          className={`p-2 ${
            isDarkMode ? "bg-indigo-900" : "bg-indigo-100"
          } rounded-lg`}
        >
          <CalendarCheck
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
          Upcoming Events
        </h3>
      </div>

      <motion.div className="space-y-4 z-10 relative">
        {events.length > 0 ? (
          events
            .sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
            )
            .map((event) => (
              <motion.div
                key={event.id}
                className={`${
                  isDarkMode
                    ? "bg-gradient-to-r from-gray-700 to-gray-750 border-gray-600"
                    : "bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-100"
                } border p-4 rounded-xl shadow-sm`}
                whileHover={{
                  y: -5,
                  boxShadow: `0 4px 20px ${
                    isDarkMode
                      ? "rgba(79, 70, 229, 0.2)"
                      : "rgba(79, 70, 229, 0.15)"
                  }`,
                  transition: { type: "spring", stiffness: 300, damping: 20 },
                }}
              >
                <div className="flex flex-wrap justify-between items-start mb-2">
                  <h4
                    className={`font-bold ${
                      isDarkMode ? "text-indigo-300" : "text-indigo-900"
                    }`}
                  >
                    {event.title}
                  </h4>
                  <div
                    className={`flex items-center gap-1 px-3 py-1 ${
                      isDarkMode
                        ? "bg-gray-600/50 border-gray-500"
                        : "bg-white/50 border-indigo-100"
                    } backdrop-blur-sm rounded-full border shadow-sm`}
                  >
                    <Calendar
                      className={`w-4 h-4 ${
                        isDarkMode ? "text-indigo-400" : "text-indigo-600"
                      }`}
                    />
                    <span
                      className={`text-xs font-medium ${
                        isDarkMode ? "text-indigo-300" : "text-indigo-800"
                      }`}
                    >
                      {event.date}
                    </span>
                  </div>
                </div>
                <p
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-indigo-800"
                  }`}
                >
                  {event.description}
                </p>
              </motion.div>
            ))
        ) : (
          <motion.div
            className={`text-center py-8 ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Calendar
              className={`w-10 h-10 mx-auto mb-2 ${
                isDarkMode ? "text-gray-500" : "text-gray-400"
              }`}
            />
            <p>No events scheduled yet. Add your first event above!</p>
          </motion.div>
        )}
      </motion.div>

      <div
        className={`absolute -bottom-6 -right-6 w-32 h-32 ${
          isDarkMode ? "bg-indigo-800" : "bg-indigo-200"
        } rounded-full opacity-20`}
      />
    </motion.div>
  );
};

export default EventList;
