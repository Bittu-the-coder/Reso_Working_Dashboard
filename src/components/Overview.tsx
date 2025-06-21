import React from "react";
import { motion } from "framer-motion";
import {
  Code,
  Calendar,
  FileText,
  CheckCircle,
  Activity,
  Clock,
  CheckSquare,
  BarChart,
} from "lucide-react";
import { useTheme } from "../contexts/useTheme";

interface Event {
  id: number;
  title: string;
  date: string;
  description: string;
}

interface Project {
  id: number;
  name: string;
  progress: number;
  members: number;
}

interface Task {
  id: number;
  title: string;
  assignee: string;
  deadline: string;
  status: string;
}

interface OverviewProps {
  events: Event[];
  projects: Project[];
  tasks: Task[];
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

const Overview: React.FC<OverviewProps> = ({ events, projects, tasks }) => {
  const { isDarkMode } = useTheme();

  const stats = [
    {
      title: "Active Projects",
      icon: <Code className="w-5 h-5" />,
      value: projects.length,
      color: "from-blue-600 to-indigo-600",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
    },
    {
      title: "Upcoming Events",
      icon: <Calendar className="w-5 h-5" />,
      value: events.length,
      color: "from-indigo-600 to-purple-600",
      bgColor: "bg-indigo-100",
      textColor: "text-indigo-600",
    },
    {
      title: "Pending Tasks",
      icon: <FileText className="w-5 h-5" />,
      value: tasks.filter((t) => t.status === "pending").length,
      color: "from-purple-600 to-pink-600",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
    },
    {
      title: "Completed Tasks",
      icon: <CheckCircle className="w-5 h-5" />,
      value: tasks.filter((t) => t.status === "completed").length,
      color: "from-green-600 to-emerald-600",
      bgColor: "bg-green-100",
      textColor: "text-green-600",
    },
  ];

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className={`${
              isDarkMode
                ? "bg-gray-800/80 border-gray-700"
                : "bg-white/80 border-blue-100"
            } backdrop-blur-lg p-6 rounded-2xl shadow-lg border relative overflow-hidden`}
            variants={itemVariants}
            whileHover={{
              y: -5,
              boxShadow: "0 8px 30px rgba(59, 130, 246, 0.15)",
              transition: { type: "spring", stiffness: 300, damping: 20 },
            }}
          >
            <div className="flex items-center z-10 relative">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <div className={stat.textColor}>{stat.icon}</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p
                  className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${stat.color}`}
                >
                  {stat.value}
                </p>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-r from-blue-100/50 to-purple-100/50 rounded-full opacity-50" />

            {/* Decorative corner elements */}
            <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-blue-200 rounded-tl-lg" />
            <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-blue-200 rounded-br-lg" />
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {" "}
        {/* Recent Activities */}
        <motion.div
          className={`${
            isDarkMode
              ? "bg-gray-800/80 border-gray-700"
              : "bg-white/80 border-blue-100"
          } backdrop-blur-lg p-6 rounded-2xl shadow-lg border relative overflow-hidden`}
          variants={itemVariants}
          whileHover={{
            boxShadow: `0 8px 30px ${
              isDarkMode
                ? "rgba(59, 130, 246, 0.2)"
                : "rgba(59, 130, 246, 0.15)"
            }`,
          }}
        >
          <div className="flex items-center gap-3 mb-6 z-10 relative">
            <div
              className={`p-2 ${
                isDarkMode ? "bg-indigo-900" : "bg-indigo-100"
              } rounded-lg`}
            >
              <Activity
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
              Recent Activities
            </h3>
          </div>
          <div className="space-y-6 z-10 relative">
            <div>
              <h4 className="text-md font-semibold text-blue-900 mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Recent Events
              </h4>
              <div className="space-y-3">
                {events
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  )
                  .slice(0, 3)
                  .map((event) => (
                    <motion.div
                      key={event.id}
                      className={`bg-gradient-to-r ${
                        isDarkMode
                          ? "from-blue-900/40 to-indigo-900/40 border-blue-800"
                          : "from-blue-50 to-indigo-50 border-blue-100"
                      } p-4 rounded-xl border shadow-sm`}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex justify-between mb-1">
                        {" "}
                        <h5
                          className={`font-medium ${
                            isDarkMode ? "text-blue-300" : "text-blue-900"
                          }`}
                        >
                          {event.title}
                        </h5>
                        <span
                          className={`text-sm ${
                            isDarkMode ? "text-blue-400" : "text-blue-700"
                          }`}
                        >
                          {event.date}
                        </span>
                      </div>{" "}
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-blue-400" : "text-blue-700"
                        }`}
                      >
                        {event.description}
                      </p>
                    </motion.div>
                  ))}
              </div>
            </div>
          </div>{" "}
          {/* Decorative corner elements */}
          <div
            className={`absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 ${
              isDarkMode ? "border-indigo-600" : "border-indigo-200"
            } rounded-tl-lg`}
          />
          <div
            className={`absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 ${
              isDarkMode ? "border-indigo-600" : "border-indigo-200"
            } rounded-tr-lg`}
          />
          <div
            className={`absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 ${
              isDarkMode ? "border-indigo-600" : "border-indigo-200"
            } rounded-bl-lg`}
          />
          <div
            className={`absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 ${
              isDarkMode ? "border-indigo-600" : "border-indigo-200"
            } rounded-br-lg`}
          />
        </motion.div>{" "}
        {/* Recent Projects */}
        <motion.div
          className={`${
            isDarkMode
              ? "bg-gray-800/80 border-gray-700"
              : "bg-white/80 border-blue-100"
          } backdrop-blur-lg p-6 rounded-2xl shadow-lg border relative overflow-hidden`}
          variants={itemVariants}
          whileHover={{
            boxShadow: `0 8px 30px ${
              isDarkMode
                ? "rgba(59, 130, 246, 0.2)"
                : "rgba(59, 130, 246, 0.15)"
            }`,
          }}
        >
          <div className="flex items-center gap-3 mb-6 z-10 relative">
            <div
              className={`p-2 ${
                isDarkMode ? "bg-purple-900" : "bg-purple-100"
              } rounded-lg`}
            >
              <BarChart
                className={`w-5 h-5 ${
                  isDarkMode ? "text-purple-400" : "text-purple-600"
                }`}
              />
            </div>
            <h3
              className={`text-xl font-bold ${
                isDarkMode ? "text-purple-300" : "text-purple-900"
              }`}
            >
              Project Status
            </h3>
          </div>
          <div className="space-y-4 z-10 relative">
            {projects.slice(0, 3).map((project) => (
              <motion.div
                key={project.id}
                className={`bg-gradient-to-r ${
                  isDarkMode
                    ? "from-purple-900/40 to-pink-900/40 border-purple-800"
                    : "from-purple-50 to-pink-50 border-purple-100"
                } p-4 rounded-xl border shadow-sm`}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex justify-between mb-2">
                  <h5 className="font-medium text-purple-900">
                    {project.name}
                  </h5>
                  <span className="text-sm bg-purple-100 text-purple-700 py-1 px-2 rounded-full">
                    {project.members} members
                  </span>
                </div>
                <div className="w-full bg-purple-100 rounded-full h-2.5">
                  <motion.div
                    className="h-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                    style={{ width: `${project.progress}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  ></motion.div>
                </div>{" "}
                <p
                  className={`text-right text-sm ${
                    isDarkMode ? "text-purple-400" : "text-purple-700"
                  } mt-1`}
                >
                  {project.progress}% complete
                </p>
              </motion.div>
            ))}
          </div>{" "}
          {/* Decorative corner elements */}
          <div
            className={`absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 ${
              isDarkMode ? "border-purple-600" : "border-purple-200"
            } rounded-tl-lg`}
          />
          <div
            className={`absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 ${
              isDarkMode ? "border-purple-600" : "border-purple-200"
            } rounded-tr-lg`}
          />
          <div
            className={`absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 ${
              isDarkMode ? "border-purple-600" : "border-purple-200"
            } rounded-bl-lg`}
          />
          <div
            className={`absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 ${
              isDarkMode ? "border-purple-600" : "border-purple-200"
            } rounded-br-lg`}
          />
        </motion.div>{" "}
        {/* Recent Tasks */}
        <motion.div
          className={`${
            isDarkMode
              ? "bg-gray-800/80 border-gray-700"
              : "bg-white/80 border-blue-100"
          } backdrop-blur-lg p-6 rounded-2xl shadow-lg border relative overflow-hidden lg:col-span-2`}
          variants={itemVariants}
          whileHover={{
            boxShadow: `0 8px 30px ${
              isDarkMode
                ? "rgba(59, 130, 246, 0.2)"
                : "rgba(59, 130, 246, 0.15)"
            }`,
          }}
        >
          <div className="flex items-center gap-3 mb-6 z-10 relative">
            <div
              className={`p-2 ${
                isDarkMode ? "bg-blue-900" : "bg-blue-100"
              } rounded-lg`}
            >
              <CheckSquare
                className={`w-5 h-5 ${
                  isDarkMode ? "text-blue-400" : "text-blue-600"
                }`}
              />
            </div>
            <h3
              className={`text-xl font-bold ${
                isDarkMode ? "text-blue-300" : "text-blue-900"
              }`}
            >
              Recent Tasks
            </h3>
          </div>

          <div className="overflow-x-auto z-10 relative">
            <table
              className={`min-w-full divide-y ${
                isDarkMode ? "divide-gray-700" : "divide-blue-100"
              }`}
            >
              <thead className="bg-blue-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider"
                  >
                    Task
                  </th>{" "}
                  <th
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-medium ${
                      isDarkMode ? "text-blue-300" : "text-blue-900"
                    } uppercase tracking-wider`}
                  >
                    Assignee
                  </th>
                  <th
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-medium ${
                      isDarkMode ? "text-blue-300" : "text-blue-900"
                    } uppercase tracking-wider`}
                  >
                    Deadline
                  </th>
                  <th
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-medium ${
                      isDarkMode ? "text-blue-300" : "text-blue-900"
                    } uppercase tracking-wider`}
                  >
                    Status
                  </th>
                </tr>
              </thead>{" "}
              <tbody
                className={`${
                  isDarkMode
                    ? "bg-gray-800 divide-y divide-gray-700"
                    : "bg-white divide-y divide-blue-100"
                }`}
              >
                {tasks.slice(0, 4).map((task) => (
                  <motion.tr
                    key={task.id}
                    whileHover={{
                      backgroundColor: isDarkMode
                        ? "rgba(55, 65, 81, 0.6)"
                        : "rgba(239, 246, 255, 0.6)",
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {" "}
                      <div
                        className={`text-sm font-medium ${
                          isDarkMode ? "text-blue-300" : "text-blue-900"
                        }`}
                      >
                        {task.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`text-sm ${
                          isDarkMode ? "text-blue-400" : "text-blue-700"
                        }`}
                      >
                        {task.assignee}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`text-sm ${
                          isDarkMode ? "text-blue-400" : "text-blue-700"
                        } flex items-center gap-1`}
                      >
                        <Clock
                          className={`w-4 h-4 ${
                            isDarkMode ? "text-blue-400" : ""
                          }`}
                        />{" "}
                        {task.deadline}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {" "}
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          task.status === "completed"
                            ? isDarkMode
                              ? "bg-green-900 text-green-300"
                              : "bg-green-100 text-green-800"
                            : task.status === "in-progress"
                            ? isDarkMode
                              ? "bg-blue-900 text-blue-300"
                              : "bg-blue-100 text-blue-800"
                            : isDarkMode
                            ? "bg-yellow-900 text-yellow-300"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Decorative corner elements */}
          <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-blue-200 rounded-tl-lg" />
          <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-blue-200 rounded-tr-lg" />
          <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-blue-200 rounded-bl-lg" />
          <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-blue-200 rounded-br-lg" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Overview;
