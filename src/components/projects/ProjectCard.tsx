import { motion } from "framer-motion";
import { CalendarDays, ChevronRight, Trash2, Users } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { GlowingCard } from "../ui/aceternity";

interface Project {
  _id: string;
  name: string;
  description: string;
  progress: number;
  members: string[];
  startDate?: string;
  endDate?: string;
}

interface ProjectCardProps {
  project: Project;
  onViewDetails: (project: Project) => void;
  onDelete: (id: string) => void;
}

const ProjectCard = ({
  project,
  onViewDetails,
  onDelete,
}: ProjectCardProps) => {
  const { isDarkMode } = useTheme();

  const getProgressColor = (progress: number) => {
    if (progress < 30) return "bg-rose-500";
    if (progress < 70) return "bg-amber-500";
    return "bg-emerald-500";
  };

  return (
    <GlowingCard className={`${isDarkMode ? "!bg-slate-900 !border-slate-800" : "!bg-white !border-slate-200"} p-5 group`}>
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-slate-900"} group-hover:text-blue-500 transition-colors`}>
              {project.name}
            </h4>
            <p className={`text-xs mt-1 line-clamp-1 ${isDarkMode ? "text-slate-500" : "text-slate-500"}`}>
              {project.description}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-1.5">
              <span className={isDarkMode ? "text-slate-500" : "text-slate-400"}>Progress</span>
              <span className={isDarkMode ? "text-slate-300" : "text-slate-700"}>{project.progress}%</span>
            </div>
            <div className={`w-full ${isDarkMode ? "bg-slate-800" : "bg-slate-100"} rounded-full h-1.5 overflow-hidden`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${project.progress}%` }}
                className={`h-full rounded-full ${getProgressColor(project.progress)}`}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-1 text-[11px] font-medium ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                <Users size={14} className="text-blue-500" />
                <span>{project.members.length}</span>
              </div>
              {project.endDate && (
                <div className={`flex items-center gap-1 text-[11px] font-medium ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                  <CalendarDays size={14} className="text-blue-500" />
                  <span>{new Date(project.endDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => onViewDetails(project)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-blue-600/10 hover:bg-blue-600 text-blue-500 hover:text-white text-xs font-bold transition-all"
            >
              Details
              <ChevronRight size={14} />
            </button>
            <button
              onClick={() => onDelete(project._id)}
              className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </GlowingCard>
  );
};

export default ProjectCard
