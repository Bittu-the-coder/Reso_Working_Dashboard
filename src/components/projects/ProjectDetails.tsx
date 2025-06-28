// components/ProjectDetails.js
import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { motion } from "framer-motion";

const ProjectDetails = ({ project, onClose }) => {
  const { isDarkMode } = useTheme();

  return (
    <motion.div
      className={`fixed inset-0 backdrop-blur-xs flex items-center justify-center p-4 ${
        isDarkMode ? "text-white" : "text-gray-900"
      }`}
      onClick={onClose}
    >
      <motion.div
        className={`p-6 rounded-lg shadow-lg max-w-lg w-full ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          className={`text-xl font-bold mb-4 ${
            isDarkMode ? "text-blue-300" : "text-blue-900"
          }`}
        >
          {project.name}
        </h2>
        <p className="mb-2">
          <strong>Description:</strong> {project.description}
        </p>
        <p className="mb-2">
          <strong>Start Date:</strong>{" "}
          {new Date(project.startDate).toLocaleDateString()}
        </p>
        <p className="mb-2">
          <strong>End Date:</strong>{" "}
          {new Date(project.endDate).toLocaleDateString()}
        </p>
        <p className="mb-2">
          <strong>Priority:</strong> {project.priority}
        </p>
        <p className="mb-2">
          <strong>Status:</strong> {project.status}
        </p>
        <p className="mb-2">
          <strong>Progress:</strong> {project.progress}%
        </p>
        <button
          onClick={onClose}
          className={`mt-4 px-4 py-2 rounded ${
            isDarkMode
              ? "bg-blue-600 hover:bg-blue-500"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white`}
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
};

export default ProjectDetails;
