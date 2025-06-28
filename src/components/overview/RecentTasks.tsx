// components/RecentTasks.js
import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { motion } from "framer-motion";
import { CheckSquare, Clock } from "lucide-react";

const RecentTasks = ({ tasks }) => {
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
            isDarkMode ? "bg-blue-900" : "bg-blue-100"
          } rounded-lg`}
        >
          <CheckSquare
            className={`w-5 h-5 ${
              isDarkMode ? "text-blue-400" : "text-blue-600"
            }`}
          />
        </div>
        <h3
          className={`text-xl font-bold ${
            isDarkMode ? "text-blue-300" : "text-blue-900"
          }`}
        >
          Recent Tasks
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table
          className={`min-w-full divide-y ${
            isDarkMode ? "divide-gray-700" : "divide-blue-100"
          }`}
        >
          <thead className="bg-blue-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider"
              >
                Task
              </th>
              <th
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium ${
                  isDarkMode ? "text-blue-300" : "text-blue-900"
                } uppercase tracking-wider`}
              >
                Assignee
              </th>
              <th
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium ${
                  isDarkMode ? "text-blue-300" : "text-blue-900"
                } uppercase tracking-wider`}
              >
                Deadline
              </th>
              <th
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium ${
                  isDarkMode ? "text-blue-300" : "text-blue-900"
                } uppercase tracking-wider`}
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody
            className={`${
              isDarkMode
                ? "bg-gray-800 divide-y divide-gray-700"
                : "bg-white divide-y divide-blue-100"
            }`}
          >
            {tasks.slice(0, 4).map((task) => (
              <motion.tr
                key={task.id}
                whileHover={{
                  backgroundColor: isDarkMode
                    ? "rgba(55, 65, 81, 0.6)"
                    : "rgba(239, 246, 255, 0.6)",
                }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div
                    className={`text-sm font-medium ${
                      isDarkMode ? "text-blue-300" : "text-blue-900"
                    }`}
                  >
                    {task.title}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div
                    className={`text-sm ${
                      isDarkMode ? "text-blue-400" : "text-blue-700"
                    }`}
                  >
                    {task.assignee}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div
                    className={`text-sm ${
                      isDarkMode ? "text-blue-400" : "text-blue-700"
                    } flex items-center gap-1`}
                  >
                    <Clock
                      className={`w-4 h-4 ${isDarkMode ? "text-blue-400" : ""}`}
                    />{" "}
                    {task.deadline}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      task.status === "completed"
                        ? isDarkMode
                          ? "bg-green-900 text-green-300"
                          : "bg-green-100 text-green-800"
                        : task.status === "in-progress"
                        ? isDarkMode
                          ? "bg-blue-900 text-blue-300"
                          : "bg-blue-100 text-blue-800"
                        : isDarkMode
                        ? "bg-yellow-900 text-yellow-300"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {task.status}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default RecentTasks;
