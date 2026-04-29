import { motion } from "framer-motion";
import { AlertCircle, BarChart3, Calendar, Info, X } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { GlowingCard } from "../ui/aceternity";

interface Project {
  name: string;
  description: string;
  startDate: string | Date;
  endDate: string | Date;
  priority: string;
  status: string;
  progress: number;
}

interface ProjectDetailsProps {
  project: Project;
  onClose: () => void;
}

const ProjectDetails = ({ project, onClose }: ProjectDetailsProps) => {
  const { isDarkMode } = useTheme();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-2xl relative z-10"
      >
        <GlowingCard className={`${isDarkMode ? "!bg-slate-900 !border-slate-800" : "!bg-white !border-slate-200"} p-8 overflow-hidden`}>
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
              <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                {project.name}
              </h2>
              <div className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                project.status === "completed" ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"
              }`}>
                {project.status}
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-all ${isDarkMode ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div className="space-y-6">
              <div>
                <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                  <Info size={14} className="text-blue-500" />
                  Description
                </h3>
                <p className={`text-sm leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                  {project.description}
                </p>
              </div>

              <div>
                <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                  <AlertCircle size={14} className="text-blue-500" />
                  Priority Level
                </h3>
                <p className={`text-sm font-bold capitalize ${
                  project.priority === "high" ? "text-rose-500" :
                  project.priority === "medium" ? "text-amber-500" : "text-blue-500"
                }`}>
                  {project.priority}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                  <BarChart3 size={14} className="text-blue-500" />
                  Project Progress
                </h3>
                <div className="flex items-center gap-4">
                  <div className={`flex-1 ${isDarkMode ? "bg-slate-800" : "bg-slate-100"} h-2 rounded-full overflow-hidden`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${project.progress}%` }}
                      className="h-full bg-blue-600"
                    />
                  </div>
                  <span className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    {project.progress}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                    <Calendar size={14} className="text-blue-500" />
                    Start Date
                  </h3>
                  <p className={`text-sm font-medium ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>
                    {new Date(project.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                    <Calendar size={14} className="text-blue-500" />
                    End Date
                  </h3>
                  <p className={`text-sm font-medium ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>
                    {new Date(project.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 relative z-10 flex justify-end">
            <button
              onClick={onClose}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20"
            >
              Close Details
            </button>
          </div>
        </GlowingCard>
      </motion.div>
    </div>
  );
};

export default ProjectDetails;
