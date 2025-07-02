import { motion } from "framer-motion";
import { Code } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import ProjectCard from "./ProjectCard";

type ProjectType = {
  _id: string;
  name: string;
  description: string;
  progress: number;
  members: string[];
};

interface ProjectsProps {
  projects: ProjectType[];
  onViewDetails: (project: ProjectType) => void;
  onDelete: (id: string) => void;
}

const Projects: React.FC<ProjectsProps> = ({
  projects,
  onViewDetails,
  onDelete,
}) => {
  const { isDarkMode } = useTheme();

  return (
    <motion.div className="space-y-6" initial="hidden" animate="visible">
      <motion.div
        className={`p-6 rounded-2xl shadow-lg border relative overflow-hidden ${
          isDarkMode
            ? "bg-gray-800/80 border-gray-700"
            : "bg-white/80 border-blue-100"
        }`}
      >
        <div className="flex items-center gap-3 mb-6 z-10 relative">
          <div
            className={`p-2 rounded-lg ${
              isDarkMode ? "bg-blue-900" : "bg-blue-100"
            }`}
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
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 z-10 relative">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onViewDetails={onViewDetails}
                onDelete={onDelete}
              />
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
      </motion.div>
    </motion.div>
  );
};

export default Projects;
