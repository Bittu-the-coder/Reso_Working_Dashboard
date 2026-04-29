import { motion } from "framer-motion";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  Filter,
  Plus,
  Search,
  Users,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import CreateTaskModal from "../../components/tasks/CreateTaskModal";
import { GlowingCard, TextGenerateEffect } from "../../components/ui/aceternity";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuthStore } from "../../store/useAuthStore";
import { useTaskStore } from "../../store/useTaskStore";
import { useTeamStore } from "../../store/useTeamStore";
import type { Task } from "../../types";

interface Filters {
  team: string;
  status: string;
  priority: string;
  search: string;
}

interface StatusInfo {
  bgClass: string;
  textClass: string;
  icon: React.ReactNode;
  label: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

const TasksPage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    team: "",
    status: "",
    priority: "",
    search: "",
  });

  const {
    tasks,
    teamTasks,
    loading,
    getUserTasks,
    getTeamTasks,
    updateTaskStatus,
  } = useTaskStore();
  const { teams, getMyTeams } = useTeamStore();
  const { user, getMe } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      if (!user) await getMe();
      await getMyTeams();
    };
    init();
  }, [user, getMe, getMyTeams]);

  useEffect(() => {
    if (filters.team) {
      getTeamTasks(filters.team);
    } else {
      getUserTasks();
    }
  }, [filters.team, getTeamTasks, getUserTasks]);

  const filteredTasks = React.useMemo(() => {
    let result = filters.team
      ? teamTasks.filter(
          (task) =>
            task.createdBy === user?._id ||
            (user?._id &&
              task.assignedTo?.some(
                (id) => id?.toString() === user._id?.toString()
              ))
        )
      : tasks;

    if (filters.status) {
      result = result.filter((task) => task.status === filters.status);
    }

    if (filters.priority) {
      result = result.filter((task) => task.priority.toLowerCase() === filters.priority.toLowerCase());
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm) ||
          (task.description || "").toLowerCase().includes(searchTerm)
      );
    }

    return result;
  }, [tasks, teamTasks, filters, user?._id]);

  const handleUpdateTaskStatus = async (taskId: string, status: string, task: Task) => {
    try {
      const teamId = typeof task.teamId === "string" ? task.teamId : task.teamId?._id;
      if (!teamId) return;

      const response = await updateTaskStatus(teamId, taskId, status);

      if (response.success) {
        toast.success("Status updated");
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    }
  };

  const getStatusInfo = (status: string): StatusInfo => {
    switch (status.toLowerCase()) {
      case "done":
        return {
          bgClass: isDarkMode ? "bg-emerald-900/30" : "bg-emerald-50",
          textClass: isDarkMode ? "text-emerald-400" : "text-emerald-700",
          icon: <CheckCircle2 size={14} />,
          label: "Completed",
        };
      case "in_progress":
        return {
          bgClass: isDarkMode ? "bg-blue-900/30" : "bg-blue-50",
          textClass: isDarkMode ? "text-blue-400" : "text-blue-700",
          icon: <Clock size={14} />,
          label: "In Progress",
        };
      default:
        return {
          bgClass: isDarkMode ? "bg-slate-800/50" : "bg-slate-100",
          textClass: isDarkMode ? "text-slate-400" : "text-slate-600",
          icon: <AlertCircle size={14} />,
          label: "Pending",
        };
    }
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return isDarkMode ? "text-rose-400 bg-rose-900/20" : "text-rose-600 bg-rose-50";
      case "medium":
        return isDarkMode ? "text-amber-400 bg-amber-900/20" : "text-amber-600 bg-amber-50";
      default:
        return isDarkMode ? "text-blue-400 bg-blue-900/20" : "text-blue-600 bg-blue-50";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isDarkMode ? "bg-blue-900/30 text-blue-400" : "bg-blue-50 text-blue-600"}`}>
              <FileText size={24} />
            </div>
            <TextGenerateEffect
              words="Collaborative Tasks"
              className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}
            />
          </div>
          <p className={`mt-2 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
            Manage research tasks, track progress, and coordinate with your team.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition-all"
        >
          <Plus size={18} />
          New Task
        </motion.button>
      </div>

      {/* Filters Bar */}
      <div className={`p-4 rounded-2xl border ${isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200"} backdrop-blur-sm`}>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className={`w-full pl-10 pr-4 py-2 rounded-xl text-sm border focus:ring-2 focus:ring-blue-500 transition-all outline-none ${
                isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200"
              }`}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <Users size={16} className="text-slate-400" />
              <select
                value={filters.team}
                onChange={(e) => setFilters({ ...filters, team: e.target.value })}
                className="bg-slate-800 text-sm font-medium outline-none cursor-pointer"
              >
                <option value="">All Teams</option>
                {teams.map((team) => (
                  <option key={team._id} value={team._id}>{team.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <Filter size={16} className="text-slate-400" />
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="bg-slate-800 text-sm font-medium outline-none cursor-pointer"
              >
                <option value="">All Status</option>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <button
              onClick={() => setFilters({ team: "", status: "", priority: "", search: "" })}
              className={`p-2 rounded-xl transition-all ${isDarkMode ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}
              title="Clear Filters"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Tasks Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${isDarkMode ? "border-blue-400" : "border-blue-600"}`} />
        </div>
      ) : filteredTasks.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {filteredTasks.map((task) => {
            const status = getStatusInfo(task.status);
            return (
              <motion.div key={task._id} variants={itemVariants}>
                <GlowingCard
                  className={`h-full cursor-pointer flex flex-col ${
                    isDarkMode
                      ? "!bg-slate-900 !border-slate-800"
                      : "!bg-white !border-slate-200"
                  }`}
                  onClick={() => navigate(`/dashboard/tasks/${task._id}`)}
                >
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getPriorityStyles(task.priority || "Medium")}`}>
                      {task.priority || "Medium"}
                    </span>
                    <span className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${status.textClass}`}>
                      {status.icon}
                      {status.label}
                    </span>
                  </div>

                  <h3 className={`text-lg font-bold mb-2 line-clamp-2 relative z-10 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    {task.title}
                  </h3>

                  <p className={`text-sm line-clamp-2 mb-6 relative z-10 flex-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                    {task.description || "No description provided."}
                  </p>

                  <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/50 relative z-10">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <CalendarDays size={14} />
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No deadline"}
                      </div>
                      <div className="flex items-center -space-x-1.5">
                        {task.assignedTo?.slice(0, 3).map((userId, idx) => (
                          <div
                            key={idx}
                            className={`h-6 w-6 rounded-full border-2 ${isDarkMode ? "border-slate-900 bg-slate-800" : "border-white bg-slate-100"} flex items-center justify-center text-[8px] font-bold`}
                          >
                            U
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <select
                        value={task.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => handleUpdateTaskStatus(task._id, e.target.value, task)}
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg outline-none cursor-pointer transition-all border ${
                          isDarkMode ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-600"
                        }`}
                      >
                        <option value="todo">Pending</option>
                        <option value="in_progress">Working</option>
                        <option value="done">Completed</option>
                      </select>

                      <button className={`p-1.5 rounded-lg transition-all ${isDarkMode ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}>
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </GlowingCard>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <div className={`text-center py-20 rounded-3xl border-2 border-dashed ${isDarkMode ? "border-slate-800 bg-slate-900/20" : "border-slate-200 bg-slate-50"}`}>
          <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${isDarkMode ? "bg-slate-800 text-slate-500" : "bg-white text-slate-300"}`}>
            <FileText size={32} />
          </div>
          <h3 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>No Tasks Found</h3>
          <p className={`mt-2 max-w-xs mx-auto ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
            We couldn't find any tasks matching your current filters.
          </p>
          <button
            onClick={() => setFilters({ team: "", status: "", priority: "", search: "" })}
            className="mt-6 text-sm font-semibold text-blue-500 hover:text-blue-600"
          >
            Clear all filters
          </button>
        </div>
      )}

      {showCreateModal && (
        <CreateTaskModal
          teams={teams}
          onClose={() => setShowCreateModal(false)}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};

export default TasksPage;
