import { useState, useEffect } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  Trash2,
  Edit,
  MessageSquare,
  FileText,
  File,
  Image,
  Download,
  Pencil,
  X,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import { useTaskStore } from "../../store/useTaskStore";
import { useTeamStore } from "../../store/useTeamStore";
import { toast } from "react-hot-toast";
import EditTaskModal from "../../components/tasks/EditTaskModal";
import StatusBadge from "../../components/tasks/StatusBadge";
import PriorityBadge from "../../components/tasks/PriorityBadge";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/tasks/EmptyState";
import ConfirmationModal from "../../components/ConfirmationModal";

interface User {
  _id: string;
  fullName: string;
  avatar?: string;
}

interface TaskStep {
  _id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
}

interface TaskMessage {
  _id: string;
  message: string;
  sender: string;
  timestamp: string;
}

interface FileUpload {
  fileId: string;
  url: string;
  name?: string;
  size?: string;
  fileType?: string;
}

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  teamId: {
    _id: string;
    name: string;
  };
  createdBy: User;
  assignedTo: User[];
  createdAt: string;
  dueDate?: string;
  steps: TaskStep[];
  messages: TaskMessage[];
  uploads: FileUpload[];
}

interface TeamMember {
  userId: string;
  name: string;
  email?: string;
}

interface Team {
  _id: string;
  name: string;
  members: TeamMember[];
}

const TaskManagementPage = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"details" | "phases" | "messages">(
    "details"
  );
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editedMessage, setEditedMessage] = useState("");

  const {
    currentTask,
    loading,
    getTaskById,
    updateTask,
    deleteTask,
    addTaskMessage,
    updateTaskStatus,
    updateTaskMessage,
    deleteTaskMessage,
  } = useTaskStore();
  const { teams, getMyTeams } = useTeamStore();

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
    const fetchData = async () => {
      if (taskId) {
        try {
          await getTaskById(taskId, taskId);
        } catch (error) {
          console.error("Error fetching task:", error);
          toast.error("Failed to fetch task details");
        }
      }
    };

    fetchData();
  }, [taskId, getTaskById]);

  const handleBack = () => {
    navigate("/dashboard/tasks");
  };

  const handleDeleteTask = async () => {
    if (!currentTask) return;
    try {
      const response = await deleteTask(
        currentTask.teamId._id,
        currentTask._id
      );
      if (response.success) {
        toast.success("Task deleted successfully");
        navigate("/dashboard/tasks");
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast.error("Failed to delete task");
    }
  };

  const handleUpdateTask = async (taskData: Partial<Task>) => {
    if (!currentTask) return;
    try {
      const response = await updateTask(
        currentTask.teamId._id,
        currentTask._id,
        taskData
      );
      if (response.success) {
        toast.success("Task updated successfully");
        setShowEditModal(false);
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error("Failed to update task:", error);
      toast.error("Failed to update task");
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!currentTask) return;
    try {
      const response = await updateTaskStatus(
        currentTask.teamId._id,
        currentTask._id,
        newStatus
      );
      if (response.success) {
        toast.success(`Task status updated to ${newStatus}`);
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error("Failed to update task status:", error);
      toast.error("Failed to update task status");
    }
  };

  const handleAddMessage = async () => {
    if (!currentTask || !message.trim()) return;
    try {
      const response = await addTaskMessage(
        currentTask.teamId._id,
        currentTask._id,
        message
      );
      if (response.success) {
        setMessage("");
        toast.success("Message added successfully");
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error("Failed to add message:", error);
      toast.error("Failed to add message");
    }
  };

  const handleEditMessage = (messageId: string) => {
    const messageToEdit = currentTask?.messages.find(
      (msg) => msg._id === messageId
    );
    if (messageToEdit) {
      setEditingMessageId(messageId);
      setEditedMessage(messageToEdit.message);
    }
  };

  const handleSaveMessage = async () => {
    if (!editedMessage.trim() || !editingMessageId || !currentTask) return;

    try {
      const response = await updateTaskMessage(
        currentTask.teamId._id,
        currentTask._id,
        editingMessageId,
        editedMessage
      );

      if (response.success) {
        toast.success("Message updated successfully");
        setEditingMessageId(null);
        setEditedMessage("");
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error("Failed to update message:", error);
      toast.error("Failed to update message");
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!currentTask) return;
    try {
      const response = await deleteTaskMessage(
        currentTask.teamId._id,
        currentTask._id,
        messageId
      );

      if (response.success) {
        toast.success("Message deleted successfully");
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error("Failed to delete message:", error);
      toast.error("Failed to delete message");
    }
  };

  const cancelEdit = () => {
    setEditingMessageId(null);
    setEditedMessage("");
  };

  const handleStepToggle = async (stepId: string, completed: boolean) => {
    if (!currentTask) return;
    try {
      const response = await updateTaskStatus(
        currentTask.teamId._id,
        currentTask._id,
        currentTask.status,
        stepId,
        completed
      );
      if (response.success) {
        toast.success(`Phase marked as ${completed ? "completed" : "pending"}`);
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error("Failed to update phase:", error);
      toast.error("Failed to update phase");
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return <FileText className="w-4 h-4" />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <Image className="w-4 h-4" />;
      default:
        return <File className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner darkMode={isDarkMode} size="lg" />
      </div>
    );
  }

  if (!currentTask && taskId) {
    return (
      <EmptyState
        icon={<AlertCircle size={48} />}
        title="Task Not Found"
        description="The task you're looking for doesn't exist or you don't have access to it."
        action={
          <button
            onClick={handleBack}
            className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            Back to Tasks
          </button>
        }
        darkMode={isDarkMode}
      />
    );
  }

  if (!currentTask || !taskId) {
    return (
      <EmptyState
        icon={<AlertCircle size={48} />}
        title="Task Not Found"
        description="The task you're looking for doesn't exist or you don't have access to it."
        action={
          <button
            onClick={handleBack}
            className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            Back to Tasks
          </button>
        }
        darkMode={isDarkMode}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className={`p-2 rounded-lg ${
              isDarkMode
                ? "hover:bg-gray-700 text-gray-300"
                : "hover:bg-gray-100 text-gray-600"
            } transition-colors`}
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1
            className={`text-2xl md:text-3xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {currentTask.title}
          </h1>
          <StatusBadge status={currentTask.status} darkMode={isDarkMode} />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEditModal(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              isDarkMode
                ? "hover:bg-gray-700 text-gray-300"
                : "hover:bg-gray-100 text-gray-600"
            } transition-colors`}
          >
            <Edit className="w-5 h-5" />
            <span className="hidden sm:inline">Edit</span>
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              isDarkMode
                ? "hover:bg-red-900/50 text-red-300"
                : "hover:bg-red-100 text-red-600"
            } transition-colors`}
          >
            <Trash2 className="w-5 h-5" />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Task Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {(["details", "phases", "messages"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === tab
                    ? isDarkMode
                      ? "text-blue-400 border-b-2 border-blue-400"
                      : "text-blue-600 border-b-2 border-blue-600"
                    : isDarkMode
                    ? "text-gray-400 hover:text-gray-300"
                    : "text-gray-500 hover:text-gray-700"
                } capitalize`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {/* Details Tab */}
            {activeTab === "details" && (
              <div
                className={`p-6 rounded-xl ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                } shadow`}
              >
                <h2
                  className={`text-xl font-semibold mb-4 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Task Description
                </h2>
                <div
                  className={`prose max-w-none ${
                    isDarkMode ? "prose-invert" : ""
                  }`}
                >
                  {currentTask.description || (
                    <p className="text-gray-500 dark:text-gray-400">
                      No description provided
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Phases Tab */}
            {activeTab === "phases" && (
              <div
                className={`p-6 rounded-xl ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                } shadow`}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2
                    className={`text-xl font-semibold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Task Phases
                  </h2>
                  <PriorityBadge
                    priority={currentTask.priority}
                    darkMode={isDarkMode}
                  />
                </div>

                {currentTask.steps?.length > 0 ? (
                  <div className="space-y-3">
                    {currentTask.steps.map((phase) => (
                      <div
                        key={phase._id}
                        className={`p-4 rounded-lg flex items-start gap-4 ${
                          isDarkMode ? "bg-gray-700" : "bg-gray-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={phase.isCompleted}
                          onChange={(e) =>
                            handleStepToggle(phase._id, e.target.checked)
                          }
                          className="mt-1 h-4 w-4 rounded"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h3
                              className={`font-medium ${
                                isDarkMode ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {phase.title}
                            </h3>
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                phase.isCompleted
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                              }`}
                            >
                              {phase.isCompleted ? "Completed" : "Pending"}
                            </span>
                          </div>
                          {phase.description && (
                            <p
                              className={`mt-1 text-sm ${
                                isDarkMode ? "text-gray-300" : "text-gray-600"
                              }`}
                            >
                              {phase.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={<FileText size={32} />}
                    title="No Phases"
                    description="This task doesn't have any phases yet."
                    small
                    darkMode={isDarkMode}
                  />
                )}

                {/* Status Update Section */}
                <div className="mt-6">
                  <h3
                    className={`text-lg font-semibold mb-3 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Update Status
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(["todo", "in_progress", "done"] as const).map(
                      (status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(status)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium ${
                            currentTask.status === status
                              ? "bg-blue-600 text-white"
                              : isDarkMode
                              ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          } transition-colors`}
                        >
                          {status === "todo" ? (
                            <>
                              <Clock className="inline w-4 h-4 mr-1" />
                              To Do
                            </>
                          ) : status === "in_progress" ? (
                            <>
                              <Clock className="inline w-4 h-4 mr-1 animate-spin" />
                              In Progress
                            </>
                          ) : (
                            <>
                              <CheckCircle className="inline w-4 h-4 mr-1" />
                              Done
                            </>
                          )}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === "messages" && (
              <div
                className={`p-6 rounded-xl ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                } shadow`}
              >
                <h2
                  className={`text-xl font-semibold mb-4 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Discussion
                </h2>

                {/* Message Input */}
                <div className="flex gap-2 mb-6">
                  <input
                    type="text"
                    value={message}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setMessage(e.target.value)
                    }
                    onKeyPress={(e: KeyboardEvent<HTMLInputElement>) =>
                      e.key === "Enter" && handleAddMessage()
                    }
                    placeholder="Type your message..."
                    className={`flex-1 px-4 py-2 rounded-lg ${
                      isDarkMode
                        ? "bg-gray-700 text-white placeholder-gray-400 border-gray-600"
                        : "bg-white text-gray-900 placeholder-gray-500 border-gray-300"
                    } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  <button
                    onClick={handleAddMessage}
                    disabled={!message.trim()}
                    className={`px-4 py-2 rounded-lg ${
                      message.trim()
                        ? "bg-blue-600 hover:bg-blue-700"
                        : isDarkMode
                        ? "bg-gray-700 text-gray-500"
                        : "bg-gray-200 text-gray-400"
                    } text-white transition-colors`}
                  >
                    <MessageSquare className="w-5 h-5" />
                  </button>
                </div>

                {/* Messages List */}
                {currentTask.messages?.length > 0 ? (
                  <div className="space-y-4">
                    {currentTask.messages.map((msg) => (
                      <motion.div
                        key={msg._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`p-4 rounded-lg mb-3 relative group ${
                          isDarkMode ? "bg-gray-700" : "bg-gray-50"
                        } shadow-sm`}
                      >
                        {editingMessageId === msg._id ? (
                          <div className="space-y-3">
                            <textarea
                              value={editedMessage}
                              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                                setEditedMessage(e.target.value)
                              }
                              className={`w-full p-3 rounded-lg ${
                                isDarkMode
                                  ? "bg-gray-600 text-white border-gray-500"
                                  : "bg-white text-gray-900 border-gray-300"
                              } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                              rows={3}
                              autoFocus
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={cancelEdit}
                                className={`px-3 py-1.5 rounded-lg flex items-center gap-1 ${
                                  isDarkMode
                                    ? "bg-gray-600 hover:bg-gray-500 text-gray-300"
                                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                                } transition-colors`}
                              >
                                <ArrowLeft className="w-4 h-4" />
                                Cancel
                              </button>
                              <button
                                onClick={handleSaveMessage}
                                className={`px-3 py-1.5 rounded-lg flex items-center gap-1 ${
                                  isDarkMode
                                    ? "bg-blue-600 hover:bg-blue-500 text-white"
                                    : "bg-blue-600 hover:bg-blue-700 text-white"
                                } transition-colors`}
                                disabled={!editedMessage.trim()}
                              >
                                <Check className="w-4 h-4" />
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex justify-between items-start">
                              <div className="flex items-start gap-3 w-full">
                                <div className="relative group">
                                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-medium shadow-sm">
                                    {teams
                                      .find(
                                        (t) => t._id === currentTask.teamId._id
                                      )
                                      ?.members.find(
                                        (m) => m.userId === msg.sender
                                      )
                                      ?.name?.charAt(0)
                                      .toUpperCase() || "U"}
                                  </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-baseline">
                                    <div className="flex items-center gap-2">
                                      <p
                                        className={`font-medium ${
                                          isDarkMode
                                            ? "text-white"
                                            : "text-gray-900"
                                        }`}
                                      >
                                        {teams
                                          .find(
                                            (t) =>
                                              t._id === currentTask.teamId._id
                                          )
                                          ?.members.find(
                                            (m) => m.userId === msg.sender
                                          )?.name || "Unknown"}
                                      </p>
                                      <span
                                        className={`text-xs ${
                                          isDarkMode
                                            ? "text-gray-400"
                                            : "text-gray-500"
                                        }`}
                                      >
                                        {new Date(
                                          msg.timestamp
                                        ).toLocaleTimeString([], {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button
                                        className={`p-1 rounded-full ${
                                          isDarkMode
                                            ? "hover:bg-gray-600 text-gray-300"
                                            : "hover:bg-gray-200 text-gray-500"
                                        } transition-colors`}
                                        onClick={() =>
                                          handleEditMessage(msg._id)
                                        }
                                        aria-label="Edit message"
                                      >
                                        <Pencil className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        className={`p-1 rounded-full ${
                                          isDarkMode
                                            ? "hover:bg-red-900/30 text-red-300"
                                            : "hover:bg-red-100 text-red-500"
                                        } transition-colors`}
                                        onClick={() =>
                                          handleDeleteMessage(msg._id)
                                        }
                                        aria-label="Delete message"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>

                                  <p
                                    className={`mt-1 ${
                                      isDarkMode
                                        ? "text-gray-300"
                                        : "text-gray-700"
                                    } whitespace-pre-wrap break-words`}
                                  >
                                    {msg.message}
                                  </p>

                                  <p
                                    className={`text-xs mt-2 ${
                                      isDarkMode
                                        ? "text-gray-500"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    {new Date(msg.timestamp).toLocaleDateString(
                                      "en-US",
                                      {
                                        weekday: "short",
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      }
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={<MessageSquare size={32} />}
                    title="No Messages"
                    description="Start the discussion by sending a message."
                    small
                    darkMode={isDarkMode}
                  />
                )}
              </div>
            )}
          </div>
          {/* Attachments Card */}
          {activeTab === "details" && currentTask.uploads?.length > 0 && (
            <div
              className={`p-6 rounded-xl ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } shadow`}
            >
              <h2
                className={`text-xl font-semibold mb-4 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Attachments
              </h2>
              <div className="space-y-2">
                {currentTask.uploads.map((file) => (
                  <a
                    key={file.fileId}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      isDarkMode
                        ? "hover:bg-gray-700 text-gray-300"
                        : "hover:bg-gray-100 text-gray-700"
                    } transition-colors`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded ${
                          isDarkMode ? "bg-gray-700" : "bg-gray-100"
                        }`}
                      >
                        {getFileIcon(file.url)}
                      </div>
                      <span className="text-sm truncate max-w-[180px]">
                        {file.url.split("/").pop()}
                      </span>
                    </div>
                    <Download className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Task Metadata */}
        <div className="space-y-6">
          {/* Task Info Card */}
          <div
            className={`p-6 rounded-xl ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } shadow`}
          >
            <h2
              className={`text-xl font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Task Information
            </h2>
            <div className="space-y-4">
              <div>
                <h3
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  } mb-1`}
                >
                  Created by
                </h3>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-medium">
                    {currentTask.createdBy.fullName?.charAt(0) || "U"}
                  </div>
                  <p
                    className={`${isDarkMode ? "text-white" : "text-gray-900"}`}
                  >
                    {currentTask.createdBy.fullName}
                  </p>
                </div>
              </div>

              <div>
                <h3
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  } mb-1`}
                >
                  Created at
                </h3>
                <p className={`${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {new Date(currentTask.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div>
                <h3
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  } mb-1`}
                >
                  Due Date
                </h3>
                <p
                  className={`${
                    currentTask.dueDate &&
                    new Date(currentTask.dueDate) < new Date()
                      ? "text-red-500"
                      : isDarkMode
                      ? "text-white"
                      : "text-gray-900"
                  }`}
                >
                  {currentTask.dueDate
                    ? new Date(currentTask.dueDate).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )
                    : "No due date"}
                </p>
              </div>

              <div>
                <h3
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  } mb-1`}
                >
                  Assigned To
                </h3>
                <div className="space-y-2">
                  {currentTask.assignedTo?.length > 0 ? (
                    currentTask.assignedTo.map((user) => (
                      <div key={user._id} className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-medium">
                          {user.fullName?.charAt(0) || "U"}
                        </div>
                        <p
                          className={`${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {user.fullName}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      No one assigned
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Task Modal */}
      {showEditModal && currentTask && (
        <EditTaskModal
          teams={teams}
          task={currentTask}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdateTask}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteTask}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        confirmColor="red"
        darkMode={isDarkMode}
      />
    </div>
  );
};

export default TaskManagementPage;

// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   ArrowLeft,
//   Clock,
//   CheckCircle,
//   AlertCircle,
//   Trash2,
//   Edit,
//   MessageSquare,
//   FileText,
//   File,
//   Image,
//   Download,
//   Pencil,
//   X,
//   Check,
// } from "lucide-react";
// import { motion } from "framer-motion";
// import { useTheme } from "../../contexts/ThemeContext";
// import { useTaskStore } from "../../store/useTaskStore";
// import { useTeamStore } from "../../store/useTeamStore";
// import { toast } from "react-hot-toast";
// import EditTaskModal from "../../components/tasks/EditTaskModal";
// import StatusBadge from "../../components/tasks/StatusBadge";
// import PriorityBadge from "../../components/tasks/PriorityBadge";
// import LoadingSpinner from "../../components/LoadingSpinner";
// import EmptyState from "../../components/tasks/EmptyState";
// import ConfirmationModal from "../../components/ConfirmationModal";

// const TaskManagementPage = () => {
//   const { taskId } = useParams();
//   const navigate = useNavigate();
//   const { isDarkMode } = useTheme();
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [message, setMessage] = useState("");
//   const [activeTab, setActiveTab] = useState("details");
//   const [editingMessageId, setEditingMessageId] = useState(null);
//   const [editedMessage, setEditedMessage] = useState("");

//   const {
//     currentTask,
//     loading,
//     getTaskById,
//     updateTask,
//     deleteTask,
//     addTaskMessage,
//     updateTaskStatus,
//     updateTaskMessage,
//     deleteTaskMessage,
//   } = useTaskStore();
//   const { teams, getMyTeams } = useTeamStore();

//   useEffect(() => {
//     const loadTeams = async () => {
//       try {
//         await getMyTeams();
//       } catch (error) {
//         toast.error("Failed to load teams");
//         console.error("Error loading teams:", error);
//       }
//     };

//     loadTeams();
//   }, [getMyTeams]);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (taskId) {
//         try {
//           await getTaskById(taskId, taskId);
//         } catch (error) {
//           console.error("Error fetching task:", error);
//           toast.error("Failed to fetch task details");
//         }
//       }
//     };

//     fetchData();
//   }, [taskId, getTaskById]);

//   console.log(
//     "Current task:",
//     currentTask,
//     teams.find((t) => t._id === currentTask?.teamId?._id)?.members
//   );

//   const handleBack = () => {
//     navigate("/dashboard/tasks");
//   };

//   const handleDeleteTask = async () => {
//     if (!currentTask) return;
//     try {
//       const response = await deleteTask(currentTask.teamId, currentTask._id);
//       if (response.success) {
//         toast.success("Task deleted successfully");
//         navigate("/dashboard/tasks");
//       } else {
//         throw new Error(response.error);
//       }
//     } catch (error) {
//       console.error("Failed to delete task:", error);
//       toast.error("Failed to delete task");
//     }
//   };

//   const handleUpdateTask = async (taskData) => {
//     if (!currentTask) return;
//     try {
//       const response = await updateTask(
//         currentTask.teamId,
//         currentTask._id,
//         taskData
//       );
//       if (response.success) {
//         toast.success("Task updated successfully");
//         setShowEditModal(false);
//       } else {
//         throw new Error(response.error);
//       }
//     } catch (error) {
//       console.error("Failed to update task:", error);
//       toast.error("Failed to update task");
//     }
//   };

//   const handleStatusChange = async (newStatus) => {
//     if (!currentTask) return;
//     try {
//       const response = await updateTaskStatus(
//         currentTask.teamId,
//         currentTask._id,
//         newStatus
//       );
//       if (response.success) {
//         toast.success(`Task status updated to ${newStatus}`);
//       } else {
//         throw new Error(response.error);
//       }
//     } catch (error) {
//       console.error("Failed to update task status:", error);
//       toast.error("Failed to update task status");
//     }
//   };

//   const handleAddMessage = async () => {
//     if (!currentTask || !message.trim()) return;
//     try {
//       const response = await addTaskMessage(
//         currentTask.teamId,
//         currentTask._id,
//         message
//       );
//       if (response.success) {
//         setMessage("");
//         toast.success("Message added successfully");
//       } else {
//         throw new Error(response.error);
//       }
//     } catch (error) {
//       console.error("Failed to add message:", error);
//       toast.error("Failed to add message");
//     }
//   };
//   const handleEditMessage = (messageId) => {
//     const messageToEdit = currentTask.messages.find(
//       (msg) => msg._id === messageId
//     );
//     if (messageToEdit) {
//       setEditingMessageId(messageId);
//       setEditedMessage(messageToEdit.message);
//     }
//   };

//   const handleSaveMessage = async () => {
//     if (!editedMessage.trim() || !editingMessageId) return;

//     try {
//       const response = await updateTaskMessage(
//         currentTask.teamId,
//         currentTask._id,
//         editingMessageId,
//         editedMessage
//       );

//       if (response.success) {
//         toast.success("Message updated successfully");
//         setEditingMessageId(null);
//         setEditedMessage("");
//       } else {
//         throw new Error(response.error);
//       }
//     } catch (error) {
//       console.error("Failed to update message:", error);
//       toast.error("Failed to update message");
//     }
//   };

//   const handleDeleteMessage = async (messageId) => {
//     try {
//       const response = await deleteTaskMessage(
//         currentTask.teamId._id,
//         currentTask._id,
//         messageId
//       );

//       if (response.success) {
//         toast.success("Message deleted successfully");
//       } else {
//         throw new Error(response.error);
//       }
//     } catch (error) {
//       console.error("Failed to delete message:", error);
//       toast.error("Failed to delete message");
//     }
//   };

//   const cancelEdit = () => {
//     setEditingMessageId(null);
//     setEditedMessage("");
//   };

//   const handleStepToggle = async (stepId, completed) => {
//     if (!currentTask) return;
//     console.log("step to update:", stepId, completed);
//     try {
//       const response = await updateTaskStatus(
//         currentTask.teamId,
//         currentTask._id,
//         currentTask.status,
//         stepId,
//         completed
//       );
//       if (response.success) {
//         toast.success(`Phase marked as ${completed ? "completed" : "pending"}`);
//       } else {
//         throw new Error(response.error);
//       }
//     } catch (error) {
//       console.error("Failed to update phase:", error);
//       toast.error("Failed to update phase");
//     }
//   };

//   const getFileIcon = (fileName) => {
//     const extension = fileName.split(".").pop().toLowerCase();
//     switch (extension) {
//       case "pdf":
//         return <FileText className="w-4 h-4" />;
//       case "jpg":
//       case "jpeg":
//       case "png":
//       case "gif":
//         return <Image className="w-4 h-4" />;
//       default:
//         return <File className="w-4 h-4" />;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <LoadingSpinner darkMode={isDarkMode} size="lg" />
//       </div>
//     );
//   }

//   if (!currentTask && taskId) {
//     return (
//       <EmptyState
//         icon={<AlertCircle size={48} />}
//         title="Task Not Found"
//         description="The task you're looking for doesn't exist or you don't have access to it."
//         action={
//           <button
//             onClick={handleBack}
//             className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
//           >
//             Back to Tasks
//           </button>
//         }
//         darkMode={isDarkMode}
//       />
//     );
//   }

//   if (!currentTask || !taskId) {
//     return (
//       <EmptyState
//         icon={<AlertCircle size={48} />}
//         title="Task Not Found"
//         description="The task you're looking for doesn't exist or you don't have access to it."
//         action={
//           <button
//             onClick={handleBack}
//             className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
//           >
//             Back to Tasks
//           </button>
//         }
//         darkMode={isDarkMode}
//       />
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-6">
//       {/* Header Section */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
//       >
//         <div className="flex items-center gap-4">
//           <button
//             onClick={handleBack}
//             className={`p-2 rounded-lg ${
//               isDarkMode
//                 ? "hover:bg-gray-700 text-gray-300"
//                 : "hover:bg-gray-100 text-gray-600"
//             } transition-colors`}
//             aria-label="Go back"
//           >
//             <ArrowLeft className="w-5 h-5" />
//           </button>
//           <h1
//             className={`text-2xl md:text-3xl font-bold ${
//               isDarkMode ? "text-white" : "text-gray-900"
//             }`}
//           >
//             {currentTask.title}
//           </h1>
//           <StatusBadge status={currentTask.status} darkMode={isDarkMode} />
//         </div>

//         <div className="flex items-center gap-2">
//           <button
//             onClick={() => setShowEditModal(true)}
//             className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
//               isDarkMode
//                 ? "hover:bg-gray-700 text-gray-300"
//                 : "hover:bg-gray-100 text-gray-600"
//             } transition-colors`}
//           >
//             <Edit className="w-5 h-5" />
//             <span className="hidden sm:inline">Edit</span>
//           </button>
//           <button
//             onClick={() => setShowDeleteConfirm(true)}
//             className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
//               isDarkMode
//                 ? "hover:bg-red-900/50 text-red-300"
//                 : "hover:bg-red-100 text-red-600"
//             } transition-colors`}
//           >
//             <Trash2 className="w-5 h-5" />
//             <span className="hidden sm:inline">Delete</span>
//           </button>
//         </div>
//       </motion.div>

//       {/* Main Content */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Left Column - Task Content */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* Navigation Tabs */}
//           <div className="flex border-b border-gray-200 dark:border-gray-700">
//             {["details", "phases", "messages"].map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`px-4 py-2 text-sm font-medium ${
//                   activeTab === tab
//                     ? isDarkMode
//                       ? "text-blue-400 border-b-2 border-blue-400"
//                       : "text-blue-600 border-b-2 border-blue-600"
//                     : isDarkMode
//                     ? "text-gray-400 hover:text-gray-300"
//                     : "text-gray-500 hover:text-gray-700"
//                 } capitalize`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>

//           {/* Tab Content */}
//           <div className="space-y-6">
//             {/* Details Tab */}
//             {activeTab === "details" && (
//               <div
//                 className={`p-6 rounded-xl ${
//                   isDarkMode ? "bg-gray-800" : "bg-white"
//                 } shadow`}
//               >
//                 <h2
//                   className={`text-xl font-semibold mb-4 ${
//                     isDarkMode ? "text-white" : "text-gray-900"
//                   }`}
//                 >
//                   Task Description
//                 </h2>
//                 <div
//                   className={`prose max-w-none ${
//                     isDarkMode ? "prose-invert" : ""
//                   }`}
//                 >
//                   {currentTask.description || (
//                     <p className="text-gray-500 dark:text-gray-400">
//                       No description provided
//                     </p>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Phases Tab */}
//             {activeTab === "phases" && (
//               <div
//                 className={`p-6 rounded-xl ${
//                   isDarkMode ? "bg-gray-800" : "bg-white"
//                 } shadow`}
//               >
//                 <div className="flex justify-between items-center mb-4">
//                   <h2
//                     className={`text-xl font-semibold ${
//                       isDarkMode ? "text-white" : "text-gray-900"
//                     }`}
//                   >
//                     Task Phases
//                   </h2>
//                   <PriorityBadge
//                     priority={currentTask.priority}
//                     darkMode={isDarkMode}
//                   />
//                 </div>

//                 {currentTask.steps?.length > 0 ? (
//                   <div className="space-y-3">
//                     {currentTask.steps.map((phase) => (
//                       <div
//                         key={phase._id}
//                         className={`p-4 rounded-lg flex items-start gap-4 ${
//                           isDarkMode ? "bg-gray-700" : "bg-gray-50"
//                         }`}
//                       >
//                         <input
//                           type="checkbox"
//                           checked={phase.isCompleted}
//                           onChange={(e) =>
//                             handleStepToggle(phase._id, e.target.checked)
//                           }
//                           className="mt-1 h-4 w-4 rounded"
//                         />
//                         <div className="flex-1">
//                           <div className="flex justify-between items-start">
//                             <h3
//                               className={`font-medium ${
//                                 isDarkMode ? "text-white" : "text-gray-900"
//                               }`}
//                             >
//                               {phase.title}
//                             </h3>
//                             <span
//                               className={`text-xs px-2 py-1 rounded ${
//                                 phase.isCompleted
//                                   ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
//                                   : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
//                               }`}
//                             >
//                               {phase.isCompleted ? "Completed" : "Pending"}
//                             </span>
//                           </div>
//                           {phase.description && (
//                             <p
//                               className={`mt-1 text-sm ${
//                                 isDarkMode ? "text-gray-300" : "text-gray-600"
//                               }`}
//                             >
//                               {phase.description}
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <EmptyState
//                     icon={<FileText size={32} />}
//                     title="No Phases"
//                     description="This task doesn't have any phases yet."
//                     small
//                     darkMode={isDarkMode}
//                   />
//                 )}

//                 {/* Status Update Section */}
//                 <div className="mt-6">
//                   <h3
//                     className={`text-lg font-semibold mb-3 ${
//                       isDarkMode ? "text-white" : "text-gray-900"
//                     }`}
//                   >
//                     Update Status
//                   </h3>
//                   <div className="flex flex-wrap gap-2">
//                     {["todo", "in_progress", "done"].map((status) => (
//                       <button
//                         key={status}
//                         onClick={() => handleStatusChange(status)}
//                         className={`px-4 py-2 rounded-lg text-sm font-medium ${
//                           currentTask.status === status
//                             ? "bg-blue-600 text-white"
//                             : isDarkMode
//                             ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
//                             : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//                         } transition-colors`}
//                       >
//                         {status === "todo" ? (
//                           <>
//                             <Clock className="inline w-4 h-4 mr-1" />
//                             To Do
//                           </>
//                         ) : status === "in_progress" ? (
//                           <>
//                             <Clock className="inline w-4 h-4 mr-1 animate-spin" />
//                             In Progress
//                           </>
//                         ) : (
//                           <>
//                             <CheckCircle className="inline w-4 h-4 mr-1" />
//                             Done
//                           </>
//                         )}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Messages Tab */}
//             {activeTab === "messages" && (
//               <div
//                 className={`p-6 rounded-xl ${
//                   isDarkMode ? "bg-gray-800" : "bg-white"
//                 } shadow`}
//               >
//                 <h2
//                   className={`text-xl font-semibold mb-4 ${
//                     isDarkMode ? "text-white" : "text-gray-900"
//                   }`}
//                 >
//                   Discussion
//                 </h2>

//                 {/* Message Input */}
//                 <div className="flex gap-2 mb-6">
//                   <input
//                     type="text"
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     onKeyPress={(e) => e.key === "Enter" && handleAddMessage()}
//                     placeholder="Type your message..."
//                     className={`flex-1 px-4 py-2 rounded-lg ${
//                       isDarkMode
//                         ? "bg-gray-700 text-white placeholder-gray-400 border-gray-600"
//                         : "bg-white text-gray-900 placeholder-gray-500 border-gray-300"
//                     } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
//                   />
//                   <button
//                     onClick={handleAddMessage}
//                     disabled={!message.trim()}
//                     className={`px-4 py-2 rounded-lg ${
//                       message.trim()
//                         ? "bg-blue-600 hover:bg-blue-700"
//                         : isDarkMode
//                         ? "bg-gray-700 text-gray-500"
//                         : "bg-gray-200 text-gray-400"
//                     } text-white transition-colors`}
//                   >
//                     <MessageSquare className="w-5 h-5" />
//                   </button>
//                 </div>

//                 {/* Messages List */}
//                 {currentTask.messages?.length > 0 ? (
//                   <div className="space-y-4">
//                     {currentTask.messages?.map((msg) => (
//                       <motion.div
//                         key={msg._id}
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.2 }}
//                         className={`p-4 rounded-lg mb-3 relative group ${
//                           isDarkMode ? "bg-gray-700" : "bg-gray-50"
//                         } shadow-sm`}
//                       >
//                         {editingMessageId === msg._id ? (
//                           <div className="space-y-3">
//                             <textarea
//                               value={editedMessage}
//                               onChange={(e) => setEditedMessage(e.target.value)}
//                               className={`w-full p-3 rounded-lg ${
//                                 isDarkMode
//                                   ? "bg-gray-600 text-white border-gray-500"
//                                   : "bg-white text-gray-900 border-gray-300"
//                               } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
//                               rows="3"
//                               autoFocus
//                             />
//                             <div className="flex justify-end gap-2">
//                               <button
//                                 onClick={cancelEdit}
//                                 className={`px-3 py-1.5 rounded-lg flex items-center gap-1 ${
//                                   isDarkMode
//                                     ? "bg-gray-600 hover:bg-gray-500 text-gray-300"
//                                     : "bg-gray-200 hover:bg-gray-300 text-gray-700"
//                                 } transition-colors`}
//                               >
//                                 <ArrowLeft className="w-4 h-4" />
//                                 Cancel
//                               </button>
//                               <button
//                                 onClick={handleSaveMessage}
//                                 className={`px-3 py-1.5 rounded-lg flex items-center gap-1 ${
//                                   isDarkMode
//                                     ? "bg-blue-600 hover:bg-blue-500 text-white"
//                                     : "bg-blue-600 hover:bg-blue-700 text-white"
//                                 } transition-colors`}
//                                 disabled={!editedMessage.trim()}
//                               >
//                                 <Check className="w-4 h-4" />
//                                 Save
//                               </button>
//                             </div>
//                           </div>
//                         ) : (
//                           <>
//                             <div className="flex justify-between items-start">
//                               <div className="flex items-start gap-3 w-full">
//                                 <div className="relative group">
//                                   <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-medium shadow-sm">
//                                     {teams
//                                       .find(
//                                         (t) =>
//                                           t._id === currentTask?.teamId?._id
//                                       )
//                                       ?.members.find(
//                                         (m) => m.userId === msg.sender
//                                       )
//                                       ?.name?.charAt(0)
//                                       .toUpperCase() || "U"}
//                                   </div>
//                                 </div>

//                                 <div className="flex-1 min-w-0">
//                                   <div className="flex justify-between items-baseline">
//                                     <div className="flex items-center gap-2">
//                                       <p
//                                         className={`font-medium ${
//                                           isDarkMode
//                                             ? "text-white"
//                                             : "text-gray-900"
//                                         }`}
//                                       >
//                                         {teams
//                                           .find(
//                                             (t) =>
//                                               t._id === currentTask?.teamId?._id
//                                           )
//                                           ?.members.find(
//                                             (m) => m.userId === msg.sender
//                                           )?.name || "Unknown"}
//                                       </p>
//                                       <span
//                                         className={`text-xs ${
//                                           isDarkMode
//                                             ? "text-gray-400"
//                                             : "text-gray-500"
//                                         }`}
//                                       >
//                                         {new Date(
//                                           msg.timestamp
//                                         ).toLocaleTimeString([], {
//                                           hour: "2-digit",
//                                           minute: "2-digit",
//                                         })}
//                                       </span>
//                                     </div>

//                                     <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                                       <button
//                                         className={`p-1 rounded-full ${
//                                           isDarkMode
//                                             ? "hover:bg-gray-600 text-gray-300"
//                                             : "hover:bg-gray-200 text-gray-500"
//                                         } transition-colors`}
//                                         onClick={() =>
//                                           handleEditMessage(msg._id)
//                                         }
//                                         aria-label="Edit message"
//                                       >
//                                         <Pencil className="w-3.5 h-3.5" />
//                                       </button>
//                                       <button
//                                         className={`p-1 rounded-full ${
//                                           isDarkMode
//                                             ? "hover:bg-red-900/30 text-red-300"
//                                             : "hover:bg-red-100 text-red-500"
//                                         } transition-colors`}
//                                         onClick={() =>
//                                           handleDeleteMessage(msg._id)
//                                         }
//                                         aria-label="Delete message"
//                                       >
//                                         <X className="w-3.5 h-3.5" />
//                                       </button>
//                                     </div>
//                                   </div>

//                                   <p
//                                     className={`mt-1 ${
//                                       isDarkMode
//                                         ? "text-gray-300"
//                                         : "text-gray-700"
//                                     } whitespace-pre-wrap break-words`}
//                                   >
//                                     {msg.message}
//                                   </p>

//                                   <p
//                                     className={`text-xs mt-2 ${
//                                       isDarkMode
//                                         ? "text-gray-500"
//                                         : "text-gray-400"
//                                     }`}
//                                   >
//                                     {new Date(msg.timestamp).toLocaleDateString(
//                                       "en-US",
//                                       {
//                                         weekday: "short",
//                                         month: "short",
//                                         day: "numeric",
//                                         year: "numeric",
//                                       }
//                                     )}
//                                   </p>
//                                 </div>
//                               </div>
//                             </div>
//                           </>
//                         )}
//                       </motion.div>
//                     ))}
//                   </div>
//                 ) : (
//                   <EmptyState
//                     icon={<MessageSquare size={32} />}
//                     title="No Messages"
//                     description="Start the discussion by sending a message."
//                     small
//                     darkMode={isDarkMode}
//                   />
//                 )}
//               </div>
//             )}
//           </div>
//           {/* Attachments Card */}
//           {activeTab === "details" && currentTask?.uploads?.length > 0 && (
//             <div
//               className={`p-6 rounded-xl ${
//                 isDarkMode ? "bg-gray-800" : "bg-white"
//               } shadow`}
//             >
//               <h2
//                 className={`text-xl font-semibold mb-4 ${
//                   isDarkMode ? "text-white" : "text-gray-900"
//                 }`}
//               >
//                 Attachments
//               </h2>
//               <div className="space-y-2">
//                 {currentTask?.uploads.map((file) => (
//                   <a
//                     key={file.fileId}
//                     href={file.url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className={`flex items-center justify-between p-3 rounded-lg ${
//                       isDarkMode
//                         ? "hover:bg-gray-700 text-gray-300"
//                         : "hover:bg-gray-100 text-gray-700"
//                     } transition-colors`}
//                   >
//                     <div className="flex items-center gap-3">
//                       <div
//                         className={`p-2 rounded ${
//                           isDarkMode ? "bg-gray-700" : "bg-gray-100"
//                         }`}
//                       >
//                         {getFileIcon(file.url)}
//                       </div>
//                       <span className="text-sm truncate max-w-[180px]">
//                         {file.url.split("/").pop()}
//                       </span>
//                     </div>
//                     <Download className="w-4 h-4" />
//                   </a>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Right Column - Task Metadata */}
//         <div className="space-y-6">
//           {/* Task Info Card */}
//           <div
//             className={`p-6 rounded-xl ${
//               isDarkMode ? "bg-gray-800" : "bg-white"
//             } shadow`}
//           >
//             <h2
//               className={`text-xl font-semibold mb-4 ${
//                 isDarkMode ? "text-white" : "text-gray-900"
//               }`}
//             >
//               Task Information
//             </h2>
//             <div className="space-y-4">
//               <div>
//                 <h3
//                   className={`text-sm font-medium ${
//                     isDarkMode ? "text-gray-400" : "text-gray-500"
//                   } mb-1`}
//                 >
//                   Created by
//                 </h3>
//                 <div className="flex items-center gap-2">
//                   <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-medium">
//                     {currentTask.createdBy?.fullName?.charAt(0) || "U"}
//                   </div>
//                   <p
//                     className={`${isDarkMode ? "text-white" : "text-gray-900"}`}
//                   >
//                     {currentTask.createdBy?.fullName || "Unknown"}
//                   </p>
//                 </div>
//               </div>

//               <div>
//                 <h3
//                   className={`text-sm font-medium ${
//                     isDarkMode ? "text-gray-400" : "text-gray-500"
//                   } mb-1`}
//                 >
//                   Created at
//                 </h3>
//                 <p className={`${isDarkMode ? "text-white" : "text-gray-900"}`}>
//                   {new Date(currentTask.createdAt).toLocaleDateString("en-US", {
//                     year: "numeric",
//                     month: "short",
//                     day: "numeric",
//                     hour: "2-digit",
//                     minute: "2-digit",
//                   })}
//                 </p>
//               </div>

//               <div>
//                 <h3
//                   className={`text-sm font-medium ${
//                     isDarkMode ? "text-gray-400" : "text-gray-500"
//                   } mb-1`}
//                 >
//                   Due Date
//                 </h3>
//                 <p
//                   className={`${
//                     currentTask.dueDate &&
//                     new Date(currentTask.dueDate) < new Date()
//                       ? "text-red-500"
//                       : isDarkMode
//                       ? "text-white"
//                       : "text-gray-900"
//                   }`}
//                 >
//                   {currentTask.dueDate
//                     ? new Date(currentTask.dueDate).toLocaleDateString(
//                         "en-US",
//                         {
//                           year: "numeric",
//                           month: "short",
//                           day: "numeric",
//                         }
//                       )
//                     : "No due date"}
//                 </p>
//               </div>

//               <div>
//                 <h3
//                   className={`text-sm font-medium ${
//                     isDarkMode ? "text-gray-400" : "text-gray-500"
//                   } mb-1`}
//                 >
//                   Assigned To
//                 </h3>
//                 <div className="space-y-2">
//                   {currentTask.assignedTo?.length > 0 ? (
//                     currentTask.assignedTo.map((user) => (
//                       <div key={user._id} className="flex items-center gap-2">
//                         <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-medium">
//                           {user.fullName?.charAt(0) || "U"}
//                         </div>
//                         <p
//                           className={`${
//                             isDarkMode ? "text-white" : "text-gray-900"
//                           }`}
//                         >
//                           {user.fullName}
//                         </p>
//                       </div>
//                     ))
//                   ) : (
//                     <p
//                       className={`text-sm ${
//                         isDarkMode ? "text-gray-400" : "text-gray-500"
//                       }`}
//                     >
//                       No one assigned
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Edit Task Modal */}
//       {showEditModal && currentTask && (
//         <EditTaskModal
//           teams={teams}
//           task={currentTask}
//           onClose={() => setShowEditModal(false)}
//           onUpdate={handleUpdateTask}
//           isDarkMode={isDarkMode}
//         />
//       )}

//       {/* Delete Confirmation Modal */}
//       <ConfirmationModal
//         isOpen={showDeleteConfirm}
//         onClose={() => setShowDeleteConfirm(false)}
//         onConfirm={handleDeleteTask}
//         title="Delete Task"
//         message="Are you sure you want to delete this task? This action cannot be undone."
//         confirmText="Delete"
//         confirmColor="red"
//         darkMode={isDarkMode}
//       />
//     </div>
//   );
// };

// export default TaskManagementPage;
