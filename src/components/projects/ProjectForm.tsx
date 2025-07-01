import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { motion } from "framer-motion";

interface Project {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  priority: "low" | "medium" | "high" | "critical";
}

interface ProjectFormProps {
  project?: Partial<Project>;
  onSubmit: (formData: Project) => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onSubmit }) => {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState<Project>({
    name: project?.name || "",
    description: project?.description || "",
    startDate: project?.startDate || "",
    endDate: project?.endDate || "",
    priority: project?.priority || "medium",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value } as Project));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.div
      className={`p-6 rounded-2xl shadow-lg border relative overflow-hidden ${
        isDarkMode
          ? "bg-gray-800/80 border-gray-700"
          : "bg-white/80 border-blue-100"
      }`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            className={`block text-sm font-medium ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          />
        </div>
        <div>
          <label
            className={`block text-sm font-medium ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          />
        </div>
        <div>
          <label
            className={`block text-sm font-medium ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Start Date
          </label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          />
        </div>
        <div>
          <label
            className={`block text-sm font-medium ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            End Date
          </label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          />
        </div>
        <div>
          <label
            className={`block text-sm font-medium ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Priority
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <button
          type="submit"
          className={`px-4 py-2 rounded ${
            isDarkMode
              ? "bg-blue-600 hover:bg-blue-500"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white`}
        >
          {project ? "Update Project" : "Create Project"}
        </button>
      </form>
    </motion.div>
  );
};

export default ProjectForm;
