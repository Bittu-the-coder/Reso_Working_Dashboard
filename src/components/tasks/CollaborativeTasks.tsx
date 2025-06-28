import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  Users,
  Calendar,
  User as UserIcon,
  Search,
  MessageCircle,
  Send,
} from "lucide-react";
import toast from "react-hot-toast";
import { useTheme } from "../../contexts/ThemeContext";
import { useTaskStore } from "../../store/useTaskStore";
import CreateTaskModal from "./CreateTaskModal";

interface CreateTaskData {
  title: string;
  description?: string;
  dueDate?: string;
  priority: "Low" | "Medium" | "High";
  teamId?: string;
  assignedTo: string[];
  tags: string[];
  estimatedHours?: number;
}

interface Filters {
  team: string;
  status: string;
  priority: string;
  search: string;
}

const CollaborativeTasks: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [tasks, setTasks] = useState([]);
  const [teams, setTeams] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    team: "",
    status: "",
    priority: "",
    search: "",
  });
  const [selectedTask, setSelectedTask] = useState(null);
  const [message, setMessage] = useState("");

  const {
    tasks: storeTasks,
    teams: storeTeams,
    loading,
    getUserTasks,
    getTeamTasks,
    createTask,
    updateTaskStatus,
    addTaskMessage,
  } = useTaskStore();

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    try {
      const filterParams = {
        teamId: filters.team || undefined,
        status: filters.status || undefined,
        priority: filters.priority || undefined,
      };

      await getUserTasks();
      if (filters.team) {
        await getTeamTasks(filters.team);
      }

      let filteredTasks = storeTasks;
      if (filters.search && filteredTasks.length > 0) {
        filteredTasks = filteredTasks.filter(
          (task) =>
            task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            (task.description || "")
              .toLowerCase()
              .includes(filters.search.toLowerCase())
        );
      }

      setTasks(filteredTasks);
      setTeams(storeTeams || []);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load tasks";
      console.error("Failed to load data:", error);
      toast.error(errorMessage);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const response = await createTask(taskData);
      if (response.success && response.data) {
        setTasks([response.data, ...tasks]);
        setShowCreateModal(false);
        toast.success("Task created successfully!");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create task";
      toast.error(errorMessage);
    }
  };

  const handleUpdateTaskStatus = async (taskId, status) => {
    try {
      const response = await updateTaskStatus(taskId, status);
      if (response.success && response.data) {
        setTasks(
          tasks.map((task) => (task._id === taskId ? response.data : task))
        );
        toast.success("Task status updated!");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update task";
      toast.error(errorMessage);
    }
  };

  const handleAddMessage = async (taskId, message) => {
    try {
      const response = await addTaskMessage(taskId, message);
      if (response.success) {
        setSelectedTask({
          ...selectedTask,
          messages: [...selectedTask.messages, response.message],
        });
        setMessage("");
        toast.success("Message added successfully!");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add message";
      toast.error(errorMessage);
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "Done":
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
      case "In Progress":
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

  const getPriorityColor = (priority) => {
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

  if (loading) {
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
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
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
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
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
        {tasks.map((task) => {
          const statusInfo = getStatusInfo(task.status);
          const priorityColor = getPriorityColor(task.priority);

          return (
            <motion.div
              key={task._id}
              className={`${
                isDarkMode
                  ? "bg-gray-800 border-gray-700 hover:shadow-lg hover:shadow-gray-900/40"
                  : "bg-white border-gray-200 hover:shadow-lg"
              } border rounded-lg p-6 transition-shadow`}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedTask(task)}
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
                <div className="space-y-2">
                  {task.teamId && (
                    <div
                      className={`flex items-center space-x-2 text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      <span>{task.teamId.name}</span>
                    </div>
                  )}
                  <div
                    className={`flex items-center space-x-2 text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>Created by {task.createdBy.name}</span>
                  </div>
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
                    onChange={(e) =>
                      handleUpdateTaskStatus(
                        task._id,
                        e.target.value as "To Do" | "In Progress" | "Done"
                      )
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
        })}
      </div>

      {selectedTask && (
        <div
          className={`fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50`}
        >
          <div
            className={`w-full max-w-2xl p-6 rounded-lg shadow-xl ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Task Details</h3>
              <button
                onClick={() => setSelectedTask(null)}
                className={`p-1 rounded-full ${
                  isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <h2 className="text-lg font-bold">{selectedTask.title}</h2>
              <p>{selectedTask.description}</p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Priority:</span>
                  <span className={getPriorityColor(selectedTask.priority)}>
                    {selectedTask.priority}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Status:</span>
                  <span
                    className={getStatusInfo(selectedTask.status).textClass}
                  >
                    {selectedTask.status}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-medium mb-2">Messages</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {selectedTask.messages?.map((msg) => (
                    <div
                      key={msg._id}
                      className={`p-2 rounded ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <UserIcon className="w-4 h-4" />
                        <span className="font-medium">{msg.sender.name}</span>
                      </div>
                      <p className="text-sm">{msg.message}</p>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2 mt-4">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={`flex-1 rounded-lg px-3 py-2 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "border-gray-300 text-gray-900"
                    } border`}
                    placeholder="Add a message..."
                  />
                  <button
                    onClick={() => handleAddMessage(selectedTask._id, message)}
                    className={`p-2 rounded-lg ${
                      isDarkMode
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    } text-white`}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <CreateTaskModal
          teams={teams}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateTask}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};

export default CollaborativeTasks;
