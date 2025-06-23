import React from "react";
import { motion } from "framer-motion";
import { Calendar, Plus, CalendarCheck } from "lucide-react";
import { useTheme } from "../contexts/useTheme";

interface Event {
  id: number;
  title: string;
  date: string;
  description: string;
}

interface EventsProps {
  events: Event[];
  newEvent: {
    title: string;
    date: string;
    description: string;
  };
  setNewEvent: React.Dispatch<
    React.SetStateAction<{
      title: string;
      date: string;
      description: string;
    }>
  >;
  handleAddEvent: (e: React.FormEvent) => void;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
    },
  },
};

const Events: React.FC<EventsProps> = ({
  events,
  newEvent,
  setNewEvent,
  handleAddEvent,
}) => {
  const { isDarkMode } = useTheme();
  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {" "}
      <motion.div
        className={`${
          isDarkMode
            ? "bg-gray-800/80 border-gray-700"
            : "bg-white/80 border-blue-100"
        } backdrop-blur-lg p-6 rounded-2xl shadow-lg border relative overflow-hidden`}
        variants={itemVariants}
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
              {" "}
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
                setNewEvent({
                  ...newEvent,
                  description: e.target.value,
                })
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

        {/* Decorative corner elements */}
        <div
          className={`absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 ${
            isDarkMode ? "border-purple-600" : "border-purple-400"
          } rounded-tl-lg`}
        />
        <div
          className={`absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 ${
            isDarkMode ? "border-purple-600" : "border-purple-400"
          } rounded-tr-lg`}
        />
        <div
          className={`absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 ${
            isDarkMode ? "border-purple-600" : "border-purple-400"
          } rounded-bl-lg`}
        />
        <div
          className={`absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 ${
            isDarkMode ? "border-purple-600" : "border-purple-400"
          } rounded-br-lg`}
        />

        {/* Decorative Elements */}
        <div
          className={`absolute -bottom-6 -right-6 w-32 h-32 ${
            isDarkMode ? "bg-purple-800" : "bg-purple-200"
          } rounded-full opacity-20`}
        />
        <div
          className={`absolute top-10 right-20 w-16 h-16 ${
            isDarkMode ? "bg-indigo-800" : "bg-indigo-200"
          } rounded-full opacity-30`}
        />
      </motion.div>
      <motion.div
        className={`${
          isDarkMode
            ? "bg-gray-800/80 border-gray-700"
            : "bg-white/80 border-blue-100"
        } backdrop-blur-lg p-6 rounded-2xl shadow-lg border relative overflow-hidden`}
        variants={itemVariants}
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

        <motion.div
          className="space-y-4 z-10 relative"
          variants={containerVariants}
        >
          {events
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
                variants={itemVariants}
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
            ))}

          {events.length === 0 && (
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

        {/* Decorative corner elements */}
        <div
          className={`absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 ${
            isDarkMode ? "border-indigo-600" : "border-indigo-400"
          } rounded-tl-lg`}
        />
        <div
          className={`absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 ${
            isDarkMode ? "border-indigo-600" : "border-indigo-400"
          } rounded-tr-lg`}
        />
        <div
          className={`absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 ${
            isDarkMode ? "border-indigo-600" : "border-indigo-400"
          } rounded-bl-lg`}
        />
        <div
          className={`absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 ${
            isDarkMode ? "border-indigo-600" : "border-indigo-400"
          } rounded-br-lg`}
        />

        {/* Decorative Elements */}
        <div
          className={`absolute -bottom-6 -right-6 w-32 h-32 ${
            isDarkMode ? "bg-indigo-800" : "bg-indigo-200"
          } rounded-full opacity-20`}
        />
      </motion.div>
    </motion.div>
  );
};

export default Events;
