import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText,
  Plus,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  Users,
  Calendar,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useTaskStore } from "../../store/useTaskStore";
import { useTeamStore } from "../../store/useTeamStore";
import { toast } from "react-hot-toast";
import CreateTaskModal from "../../components/tasks/CreateTaskModal";
import { useAuthStore } from "../../store/useAuthStore";
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

const TasksPage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    team: "",
    status: "",
    priority: "",
    search: "",
  });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

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

  console.log("All Teams:", teams);

  useEffect(() => {
    const fetchUser = async () => {
      if (!user) {
        try {
          await getMe();
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
    };
    fetchUser();
  }, [user, getMe]);

  useEffect(() => {
    const loadTeams = async () => {
      try {
        await getMyTeams();
      } catch (error) {
        toast.error("Failed to load teams");
        console.error("Error loading teams:", error);
      }
    };

    loadTeams();
  }, [getMyTeams]);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        if (filters.team) {
          await getTeamTasks(filters.team);
        } else {
          await getUserTasks();
        }
      } catch (error) {
        toast.error("Failed to load tasks");
        console.error("Error loading tasks:", error);
      }
    };

    loadTasks();
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
    console.log("Filtered Tasks:", result);

    if (filters.status) {
      result = result.filter((task) => task.status === filters.status);
    }

    if (filters.priority) {
      result = result.filter((task) => task.priority === filters.priority);
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

  const handleUpdateTaskStatus = async (taskId: string, status: string) => {
    try {
      if (!selectedTask) return;

      const response = await updateTaskStatus(
        typeof selectedTask.teamId === "string"
          ? selectedTask.teamId
          : selectedTask.teamId?._id,
        taskId,
        status
      );

      if (response.success) {
        toast.success("Task status updated!");
        setSelectedTask({ ...selectedTask, status });
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update task"
      );
    }
  };

  const handleTaskClick = (task: Task) => {
    navigate(`/dashboard/tasks/${task._id}`);
  };

  const getStatusInfo = (status: string): StatusInfo => {
    switch (status.toLowerCase()) {
      case "done":
        return {
          bgClass: isDarkMode
            ? "bg-green-900/30 border-green-800"
            : "bg-green-50 border-green-100",
          textClass: isDarkMode ? "text-green-300" : "text-green-800",
          icon: (
            <CheckCircle
              className={`w-4 h-4 ${
                isDarkMode ? "text-green-400" : "text-green-600"
              }`}
            />
          ),
          label: "Done",
        };
      case "in_progress":
        return {
          bgClass: isDarkMode
            ? "bg-blue-900/30 border-blue-800"
            : "bg-blue-50 border-blue-100",
          textClass: isDarkMode ? "text-blue-300" : "text-blue-800",
          icon: (
            <Clock
              className={`w-4 h-4 ${
                isDarkMode ? "text-blue-400" : "text-blue-600"
              }`}
            />
          ),
          label: "In Progress",
        };
      default:
        return {
          bgClass: isDarkMode
            ? "bg-amber-900/30 border-amber-800"
            : "bg-amber-50 border-amber-100",
          textClass: isDarkMode ? "text-amber-300" : "text-amber-800",
          icon: (
            <AlertCircle
              className={`w-4 h-4 ${
                isDarkMode ? "text-amber-400" : "text-amber-600"
              }`}
            />
          ),
          label: "To Do",
        };
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case "High":
        return isDarkMode
          ? "text-red-400 bg-red-900/30"
          : "text-red-600 bg-red-50";
      case "Medium":
        return isDarkMode
          ? "text-yellow-400 bg-yellow-900/30"
          : "text-yellow-600 bg-yellow-50";
      case "Low":
        return isDarkMode
          ? "text-green-400 bg-green-900/30"
          : "text-green-600 bg-green-50";
      default:
        return isDarkMode
          ? "text-gray-400 bg-gray-800/50"
          : "text-gray-600 bg-gray-50";
    }
  };

  if (loading && !tasks.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div
          className={`animate-spin rounded-full h-8 w-8 border-b-2 ${
            isDarkMode ? "border-blue-400" : "border-blue-600"
          }`}
        ></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <FileText
            className={`w-6 h-6 ${
              isDarkMode ? "text-blue-400" : "text-blue-600"
            }`}
          />
          <h1
            className={`text-2xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Collaborative Tasks
          </h1>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className={`${
            isDarkMode
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white px-4 py-2 rounded-lg flex items-center space-x-2`}
        >
          <Plus className="w-4 h-4" />
          <span>Create Task</span>
        </button>
      </div>

      <div
        className={`${
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        } border rounded-lg p-4`}
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label
              className={`block text-sm font-medium ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              } mb-1`}
            >
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className={`pl-10 w-full ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500"
                    : "border-gray-300 focus:ring-blue-500"
                } border rounded-lg px-3 py-2 focus:outline-none focus:ring-2`}
                placeholder="Search tasks..."
              />
            </div>
          </div>

          <div>
            <label
              className={`block text-sm font-medium ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              } mb-1`}
            >
              Team
            </label>
            <select
              value={filters.team}
              onChange={(e) => setFilters({ ...filters, team: e.target.value })}
              className={`w-full ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500"
                  : "border-gray-300 focus:ring-blue-500"
              } border rounded-lg px-3 py-2 focus:outline-none focus:ring-2`}
            >
              <option value="">All Teams</option>
              {teams.map((team) => (
                <option key={team._id} value={team._id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              className={`block text-sm font-medium ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              } mb-1`}
            >
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className={`w-full ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500"
                  : "border-gray-300 focus:ring-blue-500"
              } border rounded-lg px-3 py-2 focus:outline-none focus:ring-2`}
            >
              <option value="">All Status</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div>
            <label
              className={`block text-sm font-medium ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              } mb-1`}
            >
              Priority
            </label>
            <select
              value={filters.priority}
              onChange={(e) =>
                setFilters({ ...filters, priority: e.target.value })
              }
              className={`w-full ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500"
                  : "border-gray-300 focus:ring-blue-500"
              } border rounded-lg px-3 py-2 focus:outline-none focus:ring-2`}
            >
              <option value="">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() =>
                setFilters({ team: "", status: "", priority: "", search: "" })
              }
              className={`w-full ${
                isDarkMode
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              } px-3 py-2 rounded-lg`}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => {
            const statusInfo = getStatusInfo(task.status);
            const priorityColor = getPriorityColor(task.priority || "Medium");
            return (
              <motion.div
                key={task._id}
                className={`${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700 hover:bg-gray-750"
                    : "bg-white border-gray-200 hover:shadow-lg"
                } border rounded-lg p-6 transition-all cursor-pointer`}
                onClick={() => handleTaskClick(task)}
                whileHover={{ scale: 1.02 }}
                role="button"
                tabIndex={0}
                aria-label={`Task ${task.title}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleTaskClick(task);
                  }
                }}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <h3
                      className={`text-lg font-semibold ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      } line-clamp-2`}
                    >
                      {task.title}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${priorityColor}`}
                    >
                      {task.priority}
                    </span>
                  </div>
                  {task.description && (
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      } line-clamp-2`}
                    >
                      {task.description}
                    </p>
                  )}
                  <div className="space-y-3">
                    {/* Team Info Section */}
                    <div
                      className={`flex items-center space-x-2 text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {teams.find((t) => t._id === task.teamId)?.name ||
                            "No team"}
                        </span>
                        <span className="text-xs">
                          Created by:{" "}
                          {teams
                            .find((t) => t._id === task.teamId)
                            ?.members.find(
                              (m) => String(m.userId) === String(task.createdBy)
                            )?.name || "Unknown"}
                        </span>
                      </div>
                    </div>

                    {/* Assigned Users Section */}
                    {task.assignedTo && task.assignedTo.length > 0 && (
                      <div className="flex flex-col space-y-2">
                        <span
                          className={`text-xs ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Assigned to:
                        </span>
                        <div className="flex items-center -space-x-2">
                          {task.assignedTo.slice(0, 3).map((user) => (
                            <div
                              key={typeof user === "string" ? user : user._id}
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                isDarkMode ? "bg-gray-700" : "bg-gray-200"
                              } border-2 ${
                                isDarkMode ? "border-gray-800" : "border-white"
                              }`}
                            >
                              <span className="text-xs font-medium">
                                {teams
                                  .find((t) => t._id === task.teamId)
                                  ?.members.find((m) => m.userId === user)
                                  ?.name?.charAt(0)
                                  ?.toUpperCase() || "?"}
                              </span>
                            </div>
                          ))}
                          {task.assignedTo.length > 3 && (
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                isDarkMode ? "bg-gray-700" : "bg-gray-200"
                              } border-2 ${
                                isDarkMode ? "border-gray-800" : "border-white"
                              }`}
                            >
                              <span
                                className={`text-xs ${
                                  isDarkMode ? "text-gray-300" : "text-gray-700"
                                }`}
                              >
                                +{task.assignedTo.length - 3}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Due Date Section */}
                    {task.dueDate && (
                      <div
                        className={`flex items-center space-x-2 text-sm ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        <Calendar className="w-4 h-4" />
                        <span>
                          Due:{" "}
                          {new Date(task.dueDate).toLocaleString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                  <div
                    className={`flex items-center justify-between pt-2 border-t ${
                      isDarkMode ? "border-gray-700" : "border-gray-100"
                    }`}
                  >
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.bgClass} ${statusInfo.textClass} border`}
                    >
                      {statusInfo.icon}
                      {statusInfo.label}
                    </span>
                    <select
                      value={task.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        handleUpdateTaskStatus(task._id, e.target.value)
                      }
                      className={`text-xs border ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500"
                          : "border-gray-300 focus:ring-blue-500"
                      } rounded px-2 py-1 focus:outline-none focus:ring-1`}
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div
            className={`col-span-full flex flex-col items-center justify-center p-8 ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            <FileText className="w-12 h-12 mb-3 opacity-50" />
            <h3 className="text-lg font-semibold mb-1">No tasks found</h3>
            <p className="text-sm">
              Try adjusting your filters or create a new task
            </p>
          </div>
        )}
      </div>

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
