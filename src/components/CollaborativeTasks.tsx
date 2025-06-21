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
  UserIcon,
  Search,
} from "lucide-react";
import { taskAPI, teamAPI, type Task, type Team } from "../service/teams";
import { useAuth } from "./Auth";
import toast from "react-hot-toast";

const CollaborativeTasks: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState({
    team: "",
    status: "",
    priority: "",
    search: "",
  });

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    try {
      const [tasksResponse, teamsResponse] = await Promise.all([
        taskAPI.getTasks({
          teamId: filters.team || undefined,
          status: filters.status || undefined,
          priority: filters.priority || undefined,
        }),
        teamAPI.getTeams(),
      ]);

      let filteredTasks = tasksResponse.data.data;

      if (filters.search) {
        filteredTasks = filteredTasks.filter(
          (task) =>
            task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            task.description
              ?.toLowerCase()
              .includes(filters.search.toLowerCase())
        );
      }

      setTasks(filteredTasks);
      setTeams(teamsResponse.data.data);
    } catch (error) {
      console.error("Failed to load data:", error);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData: {
    title: string;
    description?: string;
    dueDate?: string;
    priority: "Low" | "Medium" | "High";
    teamId?: string;
    assignedTo: string[];
    tags: string[];
    estimatedHours?: number;
  }) => {
    try {
      const response = await taskAPI.createTask(taskData);
      setTasks([response.data.data, ...tasks]);
      setShowCreateModal(false);
      toast.success("Task created successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create task");
    }
  };

  const handleUpdateTaskStatus = async (
    taskId: string,
    status: "To Do" | "In Progress" | "Done"
  ) => {
    try {
      const response = await taskAPI.updateTask(taskId, { status });
      setTasks(
        tasks.map((task) => (task._id === taskId ? response.data.data : task))
      );
      toast.success("Task status updated!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update task");
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "Done":
        return {
          bgClass: "bg-green-50 border-green-100",
          textClass: "text-green-800",
          icon: <CheckCircle className="w-4 h-4 text-green-600" />,
          label: "Done",
        };
      case "In Progress":
        return {
          bgClass: "bg-blue-50 border-blue-100",
          textClass: "text-blue-800",
          icon: <Clock className="w-4 h-4 text-blue-600" />,
          label: "In Progress",
        };
      case "To Do":
      default:
        return {
          bgClass: "bg-amber-50 border-amber-100",
          textClass: "text-amber-800",
          icon: <AlertCircle className="w-4 h-4 text-amber-600" />,
          label: "To Do",
        };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-600 bg-red-50";
      case "Medium":
        return "text-yellow-600 bg-yellow-50";
      case "Low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <FileText className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            Collaborative Tasks
          </h1>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Task</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
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
                className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search tasks..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Team
            </label>
            <select
              value={filters.team}
              onChange={(e) => setFilters({ ...filters, team: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={filters.priority}
              onChange={(e) =>
                setFilters({ ...filters, priority: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => {
          const statusInfo = getStatusInfo(task.status);
          const priorityColor = getPriorityColor(task.priority);

          return (
            <motion.div
              key={task._id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
              whileHover={{ scale: 1.02 }}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {task.title}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${priorityColor}`}
                  >
                    {task.priority}
                  </span>
                </div>

                {/* Description */}
                {task.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {task.description}
                  </p>
                )}

                {/* Team and Creator */}
                <div className="space-y-2">
                  {task.teamId && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{task.teamId.name}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <UserIcon className="w-4 h-4" />
                    <span>Created by {task.createdBy.name}</span>
                  </div>
                </div>

                {/* Assigned Users */}
                {task.assignedTo.length > 0 && (
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Assigned to
                    </label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {task.assignedTo.map((assignee) => (
                        <span
                          key={assignee._id}
                          className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800"
                        >
                          {assignee.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Due Date */}
                {task.dueDate && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {/* Tags */}
                {task.tags.length > 0 && (
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {task.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status and Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.bgClass} ${statusInfo.textClass} border`}
                  >
                    {statusInfo.icon}
                    {statusInfo.label}
                  </span>

                  <select
                    value={task.status}
                    onChange={(e) =>
                      handleUpdateTaskStatus(task._id, e.target.value as any)
                    }
                    className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
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

      {tasks.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600">
            No tasks found. Create your first task to get started!
          </p>
        </div>
      )}

      {/* Create Task Modal */}
      {showCreateModal && (
        <CreateTaskModal
          teams={teams}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateTask}
        />
      )}
    </div>
  );
};

// Create Task Modal Component
const CreateTaskModal: React.FC<{
  teams: Team[];
  onClose: () => void;
  onSubmit: (data: any) => void;
}> = ({ teams, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium" as "Low" | "Medium" | "High",
    teamId: "",
    assignedTo: [] as string[],
    tags: [] as string[],
    estimatedHours: "",
  });

  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (formData.teamId) {
      const team = teams.find((t) => t._id === formData.teamId);
      setSelectedTeam(team || null);
    } else {
      setSelectedTeam(null);
    }
  }, [formData.teamId, teams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      estimatedHours: formData.estimatedHours
        ? parseInt(formData.estimatedHours)
        : undefined,
      teamId: formData.teamId || undefined,
    };
    onSubmit(submitData);
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Create New Task</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter task title"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter task description"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Team
              </label>
              <select
                value={formData.teamId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    teamId: e.target.value,
                    assignedTo: [],
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Personal Task</option>
                {teams.map((team) => (
                  <option key={team._id} value={team._id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value as any })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Hours
              </label>
              <input
                type="number"
                value={formData.estimatedHours}
                onChange={(e) =>
                  setFormData({ ...formData, estimatedHours: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter estimated hours"
                min="0"
                step="0.5"
              />
            </div>
          </div>

          {/* Assign to team members */}
          {selectedTeam && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assign to Team Members
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-2">
                {selectedTeam.members.map((member) => (
                  <label
                    key={member.userId._id}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      checked={formData.assignedTo.includes(member.userId._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            assignedTo: [
                              ...formData.assignedTo,
                              member.userId._id,
                            ],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            assignedTo: formData.assignedTo.filter(
                              (id) => id !== member.userId._id
                            ),
                          });
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">{member.userId.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add a tag"
              />
              <button
                type="button"
                onClick={addTag}
                className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded cursor-pointer"
                  onClick={() => removeTag(tag)}
                >
                  {tag} ×
                </span>
              ))}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CollaborativeTasks;
