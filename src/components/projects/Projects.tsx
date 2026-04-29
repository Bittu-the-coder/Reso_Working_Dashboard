import { motion } from "framer-motion";
import { FolderKanban } from "lucide-react";
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
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg ${isDarkMode ? "bg-slate-800 text-blue-400" : "bg-slate-100 text-blue-600"}`}>
          <FolderKanban size={20} />
        </div>
        <h3 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
          Active Projects
        </h3>
      </div>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ProjectCard
                project={project}
                onViewDetails={onViewDetails}
                onDelete={onDelete}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className={`text-center py-12 rounded-2xl border-2 border-dashed ${isDarkMode ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"} `}>
          <p className={isDarkMode ? "text-slate-500" : "text-slate-400"}>
            No active projects found. Create one to get started.
          </p>
        </div>
      )}
    </div>
  );
};

export default Projects;
