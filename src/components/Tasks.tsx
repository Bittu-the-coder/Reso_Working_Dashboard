import React from "react";
import { motion } from "framer-motion";
import { FileText, Plus, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useTheme } from "../contexts/useTheme";

interface Task {
  id: number;
  title: string;
  assignee: string;
  deadline: string;
  status: string;
}

interface TasksProps {
  tasks: Task[];
  newTask: {
    title: string;
    assignee: string;
    deadline: string;
    status: string;
  };
  setNewTask: React.Dispatch<
    React.SetStateAction<{
      title: string;
      assignee: string;
      deadline: string;
      status: string;
    }>
  >;
  handleAddTask: (e: React.FormEvent) => void;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
    },
  },
};

const Tasks: React.FC<TasksProps> = ({
  tasks,
  newTask,
  setNewTask,
  handleAddTask,
}) => {
  const { isDarkMode } = useTheme();
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "completed":
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
          label: "Completed",
        };
      case "in-progress":
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
      case "pending":
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
          label: "Pending",
        };
    }
  };

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-blue-100 relative overflow-hidden"
        variants={itemVariants}
        whileHover={{
          boxShadow: "0 8px 30px rgba(59, 130, 246, 0.15)",
        }}
      >
        <div className="flex items-center gap-3 mb-6 z-10 relative">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Plus className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-blue-900">Add New Task</h3>
        </div>

        <form onSubmit={handleAddTask} className="space-y-4 z-10 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="task-title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Task Title
              </label>
              <input
                type="text"
                id="task-title"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                placeholder="Enter task title"
                required
              />
            </div>
            <div>
              <label
                htmlFor="task-assignee"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Assignee
              </label>
              <input
                type="text"
                id="task-assignee"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                value={newTask.assignee}
                onChange={(e) =>
                  setNewTask({ ...newTask, assignee: e.target.value })
                }
                placeholder="Enter assignee name"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="task-deadline"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Deadline
              </label>
              <input
                type="date"
                id="task-deadline"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                value={newTask.deadline}
                onChange={(e) =>
                  setNewTask({ ...newTask, deadline: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label
                htmlFor="task-status"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Status
              </label>
              <select
                id="task-status"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                value={newTask.status}
                onChange={(e) =>
                  setNewTask({ ...newTask, status: e.target.value })
                }
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <motion.button
              type="submit"
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600 text-white px-5 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FileText className="w-5 h-5" />
              Add Task
            </motion.button>
          </div>
        </form>

        {/* Decorative corner elements */}
        <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-blue-400 rounded-tl-lg" />
        <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-blue-400 rounded-tr-lg" />
        <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-blue-400 rounded-bl-lg" />
        <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-blue-400 rounded-br-lg" />

        {/* Decorative Elements */}
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-200 rounded-full opacity-20" />
        <div className="absolute top-10 right-20 w-16 h-16 bg-indigo-200 rounded-full opacity-30" />
      </motion.div>{" "}
      <motion.div
        className={`${
          isDarkMode
            ? "bg-gray-800/80 border-gray-700"
            : "bg-white/80 border-blue-100"
        } backdrop-blur-lg p-6 rounded-2xl shadow-lg border relative overflow-hidden`}
        variants={itemVariants}
        whileHover={{
          boxShadow: `0 8px 30px ${
            isDarkMode ? "rgba(59, 130, 246, 0.2)" : "rgba(59, 130, 246, 0.15)"
          }`,
        }}
      >
        <div className="flex items-center gap-3 mb-6 z-10 relative">
          <div
            className={`p-2 ${
              isDarkMode ? "bg-indigo-900" : "bg-indigo-100"
            } rounded-lg`}
          >
            <FileText
              className={`w-5 h-5 ${
                isDarkMode ? "text-indigo-400" : "text-indigo-600"
              }`}
            />
          </div>
          <h3
            className={`text-xl font-bold ${
              isDarkMode ? "text-indigo-300" : "text-indigo-900"
            }`}
          >
            Task List
          </h3>
        </div>

        {tasks.length > 0 ? (
          <div className="overflow-x-auto relative z-10">
            {" "}
            <table
              className={`min-w-full divide-y ${
                isDarkMode ? "divide-gray-700" : "divide-gray-200"
              } rounded-xl overflow-hidden`}
            >
              <thead
                className={`${
                  isDarkMode
                    ? "bg-gradient-to-r from-blue-900/30 to-indigo-900/30"
                    : "bg-gradient-to-r from-blue-50 to-indigo-50"
                }`}
              >
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-bold text-blue-900 uppercase tracking-wider"
                  >
                    Task
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-bold text-blue-900 uppercase tracking-wider"
                  >
                    Assignee
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-bold text-blue-900 uppercase tracking-wider"
                  >
                    Deadline
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-bold text-blue-900 uppercase tracking-wider"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody
                className={`${
                  isDarkMode
                    ? "bg-gray-800 divide-y divide-gray-700"
                    : "bg-white divide-y divide-gray-200"
                }`}
              >
                {tasks.map((task) => {
                  const statusInfo = getStatusInfo(task.status);

                  return (
                    <motion.tr
                      key={task.id}
                      className="hover:bg-gray-50 transition-colors"
                      variants={itemVariants}
                      whileHover={{
                        scale: 1.01,
                        backgroundColor: "#f9fafb",
                      }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {task.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">
                          {task.assignee}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">
                          {task.deadline}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <motion.span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.bgClass} ${statusInfo.textClass} border`}
                          whileHover={{ scale: 1.05 }}
                        >
                          {statusInfo.icon}
                          {statusInfo.label}
                        </motion.span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <motion.div
            className="text-center py-12 bg-blue-50/50 rounded-xl border border-blue-100"
            variants={itemVariants}
          >
            <FileText className="w-16 h-16 mx-auto text-blue-300 mb-4" />
            <p className="text-blue-700">
              No tasks found. Add your first task above!
            </p>
          </motion.div>
        )}

        {/* Decorative corner elements */}
        <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-indigo-400 rounded-tl-lg" />
        <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-indigo-400 rounded-tr-lg" />
        <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-indigo-400 rounded-bl-lg" />
        <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-indigo-400 rounded-br-lg" />
      </motion.div>
    </motion.div>
  );
};

export default Tasks;
