import { useTheme } from "../../contexts/ThemeContext";
import { motion } from "framer-motion";
import { BarChart } from "lucide-react";
import { GlowingCard } from "../ui/aceternity";

interface Project {
  _id: string | number;
  name: string;
  membersCount?: number;
  progress: number;
}

interface ProjectStatusProps {
  projects: Project[];
}

const ProjectStatus = ({ projects }: ProjectStatusProps) => {
  const { isDarkMode } = useTheme();

  return (
    <GlowingCard
      className={`${
        isDarkMode
          ? "!bg-slate-900 !border-slate-800"
          : "!bg-white !border-slate-200"
      } p-6 h-full`}
    >
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div
          className={`p-2 ${
            isDarkMode ? "bg-amber-900/40 text-amber-400" : "bg-amber-50 text-amber-600"
          } rounded-lg`}
        >
          <BarChart size={20} />
        </div>
        <h3
          className={`text-xl font-bold ${
            isDarkMode ? "text-white" : "text-slate-900"
          }`}
        >
          Project Status
        </h3>
      </div>
      <div className="space-y-6 relative z-10">
        {projects && projects.length > 0 ? (
          projects.slice(0, 3).map((project) => (
            <div 
              key={project._id} 
              onClick={() => (window.location.href = "/dashboard/projects")}
              className="space-y-2 cursor-pointer group"
            >
              <div className="flex justify-between items-end">
                <div>
                  <h5 className={`font-semibold text-sm ${isDarkMode ? "text-slate-100 group-hover:text-blue-400" : "text-slate-900 group-hover:text-blue-600"} transition-colors`}>
                    {project.name}
                  </h5>
                  <p className={`text-[10px] ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                    {project.membersCount || 0} active members
                  </p>
                </div>
                <span className={`text-xs font-bold ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                  {project.progress}%
                </span>
              </div>
              <div className={`w-full ${isDarkMode ? "bg-slate-800" : "bg-slate-100"} rounded-full h-1.5 overflow-hidden`}>
                <motion.div
                  className={`h-full ${isDarkMode ? "bg-blue-500" : "bg-blue-600"}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${project.progress}%` }}
                  transition={{ duration: 1, ease: "circOut" }}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-sm text-slate-500">
            No active projects
          </div>
        )}
      </div>
    </GlowingCard>
  );
};

export default ProjectStatus;
