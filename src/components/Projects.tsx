import React from "react";
import { motion } from "framer-motion";
import { Code, ChevronRight, Users } from "lucide-react";
import { useTheme } from "../contexts/useTheme";

interface Project {
  id: number;
  name: string;
  progress: number;
  members: number;
}

interface ProjectsProps {
  projects: Project[];
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

const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  const { isDarkMode } = useTheme();

  const progressColorClass = (progress: number) => {
    if (progress < 30) return "from-red-500 to-red-600";
    if (progress < 70) return "from-yellow-500 to-orange-500";
    return "from-green-500 to-emerald-500";
  };

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
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
              isDarkMode ? "bg-blue-900" : "bg-blue-100"
            } rounded-lg`}
          >
            <Code
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
            Active Projects
          </h3>
        </div>

        {projects.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 z-10 relative"
            variants={containerVariants}
          >
            {projects.map((project) => (
              <motion.div
                key={project.id}
                className={`border rounded-xl p-5 shadow-sm relative overflow-hidden ${
                  isDarkMode
                    ? "border-gray-600 bg-gradient-to-r from-gray-700/80 to-gray-800/80"
                    : "border-blue-100 bg-gradient-to-r from-blue-50/80 to-indigo-50/80"
                }`}
                variants={itemVariants}
                whileHover={{
                  y: -5,
                  boxShadow: `0 8px 30px ${
                    isDarkMode
                      ? "rgba(59, 130, 246, 0.2)"
                      : "rgba(59, 130, 246, 0.15)"
                  }`,
                  transition: { type: "spring", stiffness: 300, damping: 20 },
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
                      className={`${
                        isDarkMode ? "text-blue-400" : "text-blue-700"
                      } font-medium`}
                    >
                      Progress
                    </span>
                    <span
                      className={`${
                        isDarkMode ? "text-blue-300" : "text-blue-900"
                      } font-bold`}
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
                      style={{ width: "0%" }}
                      animate={{ width: `${project.progress}%` }}
                      transition={{
                        duration: 1,
                        delay: 0.2,
                        ease: "easeOut",
                      }}
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

                  <motion.button
                    className={`ml-auto flex items-center gap-1 text-xs ${
                      isDarkMode
                        ? "text-blue-400 hover:text-blue-300"
                        : "text-blue-600 hover:text-blue-800"
                    }`}
                    whileHover={{ x: 3 }}
                  >
                    View Details <ChevronRight className="w-3 h-3" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div
            className={`text-center p-8 rounded-lg border ${
              isDarkMode
                ? "border-gray-700 bg-gray-800/40 text-gray-400"
                : "border-blue-100 bg-blue-50/40 text-gray-500"
            }`}
          >
            <p>No active projects found.</p>
          </div>
        )}

        <div
          className={`mt-6 text-right ${
            isDarkMode ? "text-blue-400" : "text-blue-600"
          }`}
        >
          <motion.button
            className={`inline-flex items-center gap-1 ${
              isDarkMode ? "hover:text-blue-300" : "hover:text-blue-800"
            }`}
            whileHover={{ x: 3 }}
          >
            <span>View All Projects</span>
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Projects;
