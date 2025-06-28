// components/EventForm.js
import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { motion } from "framer-motion";
import { Calendar, Plus } from "lucide-react";

const EventForm = ({ newEvent, setNewEvent, handleAddEvent }) => {
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
            isDarkMode ? "bg-purple-900" : "bg-purple-100"
          } rounded-lg`}
        >
          <Plus
            className={`w-5 h-5 ${
              isDarkMode ? "text-purple-400" : "text-purple-600"
            }`}
          />
        </div>
        <h3
          className={`text-xl font-bold ${
            isDarkMode ? "text-purple-300" : "text-purple-900"
          }`}
        >
          Add New Event
        </h3>
      </div>

      <form onSubmit={handleAddEvent} className="space-y-4 z-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="event-title"
              className={`block text-sm font-medium ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              } mb-2`}
            >
              Event Title
            </label>
            <input
              type="text"
              id="event-title"
              className={`w-full ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-200 text-gray-800 placeholder-gray-400"
              } border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow`}
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent({ ...newEvent, title: e.target.value })
              }
              placeholder="Enter event title"
              required
            />
          </div>
          <div>
            <label
              htmlFor="event-date"
              className={`block text-sm font-medium ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              } mb-2`}
            >
              Date
            </label>
            <input
              type="date"
              id="event-date"
              className={`w-full ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-200 text-gray-800 placeholder-gray-400"
              } border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow`}
              value={newEvent.date}
              onChange={(e) =>
                setNewEvent({ ...newEvent, date: e.target.value })
              }
              required
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="event-description"
            className={`block text-sm font-medium ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            } mb-2`}
          >
            Description
          </label>
          <textarea
            id="event-description"
            rows={3}
            className={`w-full ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                : "bg-white border-gray-200 text-gray-800 placeholder-gray-400"
            } border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow`}
            value={newEvent.description}
            onChange={(e) =>
              setNewEvent({ ...newEvent, description: e.target.value })
            }
            placeholder="Enter event description"
            required
          />
        </div>
        <div className="flex justify-end">
          <motion.button
            type="submit"
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-600 text-white px-5 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Calendar className="w-5 h-5" />
            Add Event
          </motion.button>
        </div>
      </form>

      <div
        className={`absolute -bottom-6 -right-6 w-32 h-32 ${
          isDarkMode ? "bg-purple-800" : "bg-purple-200"
        } rounded-full opacity-20`}
      />
    </motion.div>
  );
};

export default EventForm;
