import { useTheme } from "../../contexts/ThemeContext";
import { motion } from "framer-motion";
import { BarChart } from "lucide-react";

interface Project {
  id: string | number;
  name: string;
  members: number;
  progress: number;
}

interface ProjectStatusProps {
  projects: Project[];
}

const ProjectStatus = ({ projects }: ProjectStatusProps) => {
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
          <BarChart
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
          Project Status
        </h3>
      </div>
      <div className="space-y-4">
        {projects.slice(0, 3).map((project) => (
          <motion.div
            key={project.id}
            className={`bg-gradient-to-r ${
              isDarkMode
                ? "from-purple-900/40 to-pink-900/40 border-purple-800"
                : "from-purple-50 to-pink-50 border-purple-100"
            } p-4 rounded-xl border shadow-sm`}
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex justify-between mb-2">
              <h5 className="font-medium text-purple-900 dark:text-purple-200">
                {project.name}
              </h5>
              <span className="text-sm bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 py-1 px-2 rounded-full">
                {project.members} members
              </span>
            </div>
            <div className="w-full bg-purple-100 dark:bg-purple-900/30 rounded-full h-2.5">
              <motion.div
                className="h-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                style={{ width: `${project.progress}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${project.progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              ></motion.div>
            </div>
            <p
              className={`text-right text-sm ${
                isDarkMode ? "text-purple-400" : "text-purple-700"
              } mt-1`}
            >
              {project.progress}% complete
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProjectStatus;
