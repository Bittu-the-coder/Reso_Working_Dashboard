// components/ProjectCard.js
import React from "react";
import { motion } from "framer-motion";
import { Users, ChevronRight } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

const ProjectCard = ({ project, onViewDetails, onDelete }) => {
  const { isDarkMode } = useTheme();

  const progressColorClass = (progress) => {
    if (progress < 30) return "from-red-500 to-red-600";
    if (progress < 70) return "from-yellow-500 to-orange-500";
    return "from-green-500 to-emerald-500";
  };

  return (
    <motion.div
      className={`border rounded-xl p-5 shadow-sm relative overflow-hidden ${
        isDarkMode
          ? "border-gray-600 bg-gradient-to-r from-gray-700/80 to-gray-800/80"
          : "border-blue-100 bg-gradient-to-r from-blue-50/80 to-indigo-50/80"
      }`}
      whileHover={{
        y: -5,
        boxShadow: `0 8px 30px ${
          isDarkMode ? "rgba(59, 130, 246, 0.2)" : "rgba(59, 130, 246, 0.15)"
        }`,
      }}
    >
      <div className="flex justify-between items-start">
        <h4
          className={`text-lg font-bold ${
            isDarkMode ? "text-blue-300" : "text-blue-900"
          }`}
        >
          {project.name}
        </h4>
      </div>
      <div className="mt-4">
        <div className="flex justify-between text-sm mb-1">
          <span
            className={`font-medium ${
              isDarkMode ? "text-blue-400" : "text-blue-700"
            }`}
          >
            Progress
          </span>
          <span
            className={`font-bold ${
              isDarkMode ? "text-blue-300" : "text-blue-900"
            }`}
          >
            {project.progress}%
          </span>
        </div>
        <div
          className={`w-full ${
            isDarkMode ? "bg-gray-700" : "bg-gray-200"
          } rounded-full h-2.5`}
        >
          <motion.div
            className={`h-2.5 rounded-full bg-gradient-to-r ${progressColorClass(
              project.progress
            )}`}
            style={{ width: `${project.progress}%` }}
          ></motion.div>
        </div>
      </div>
      <div className="flex items-center mt-3 pt-3">
        <div
          className={`p-1.5 ${
            isDarkMode ? "bg-gray-600" : "bg-blue-100"
          } rounded mr-2`}
        >
          <Users
            className={`w-3 h-3 ${
              isDarkMode ? "text-blue-300" : "text-blue-600"
            }`}
          />
        </div>
        <span
          className={`text-xs ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {project.members} team members
        </span>
        <div className="ml-auto flex gap-2">
          <motion.button
            className={`flex items-center gap-1 text-xs ${
              isDarkMode
                ? "text-blue-400 hover:text-blue-300"
                : "text-blue-600 hover:text-blue-800"
            }`}
            whileHover={{ x: 3 }}
            onClick={() => onViewDetails(project)}
          >
            View Details <ChevronRight className="w-3 h-3" />
          </motion.button>
          <motion.button
            className={`flex items-center gap-1 text-xs ${
              isDarkMode
                ? "text-red-400 hover:text-red-300"
                : "text-red-600 hover:text-red-800"
            }`}
            whileHover={{ x: 3 }}
            onClick={() => onDelete(project._id)}
          >
            Delete
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
