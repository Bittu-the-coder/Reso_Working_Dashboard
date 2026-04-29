import { useTheme } from "../../contexts/ThemeContext";
import { motion } from "framer-motion";
import { CheckSquare, Clock } from "lucide-react";
import type { Task } from "../../types";
import { GlowingCard } from "../ui/aceternity";

interface RecentTasksProps {
  tasks: Task[];
}

const RecentTasks = ({ tasks }: RecentTasksProps) => {
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
            isDarkMode ? "bg-blue-900/40 text-blue-400" : "bg-blue-50 text-blue-600"
          } rounded-lg`}
        >
          <CheckSquare size={20} />
        </div>
        <h3
          className={`text-xl font-bold ${
            isDarkMode ? "text-white" : "text-slate-900"
          }`}
        >
          Recent Tasks
        </h3>
      </div>
      <div className="overflow-x-auto relative z-10">
        <table className="min-w-full">
          <thead>
            <tr className={`border-b ${isDarkMode ? "border-slate-800" : "border-slate-100"}`}>
              <th
                scope="col"
                className={`px-4 py-3 text-left text-xs font-semibold ${
                  isDarkMode ? "text-slate-400" : "text-slate-500"
                } uppercase tracking-wider`}
              >
                Task
              </th>
              <th
                scope="col"
                className={`px-4 py-3 text-left text-xs font-semibold ${
                  isDarkMode ? "text-slate-400" : "text-slate-500"
                } uppercase tracking-wider`}
              >
                Deadline
              </th>
              <th
                scope="col"
                className={`px-4 py-3 text-left text-xs font-semibold ${
                  isDarkMode ? "text-slate-400" : "text-slate-500"
                } uppercase tracking-wider`}
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? "divide-slate-800" : "divide-slate-100"}`}>
            {tasks && tasks.length > 0 ? (
              tasks.slice(0, 5).map((task) => (
                <motion.tr
                  key={task._id}
                  onClick={() => (window.location.href = `/dashboard/tasks/${task._id}`)}
                  whileHover={{
                    backgroundColor: isDarkMode
                      ? "rgba(30, 41, 59, 0.8)"
                      : "rgba(248, 250, 252, 0.8)",
                  }}
                  className="transition-colors cursor-pointer"
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div
                      className={`text-sm font-medium ${
                        isDarkMode ? "text-slate-200" : "text-slate-900"
                      }`}
                    >
                      {task.title}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div
                      className={`text-xs ${
                        isDarkMode ? "text-slate-400" : "text-slate-500"
                      } flex items-center gap-1.5`}
                    >
                      <Clock size={14} />
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString()
                        : "No date"}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-0.5 inline-flex text-[10px] leading-5 font-bold uppercase rounded-full ${
                        task.status === "done"
                          ? isDarkMode
                            ? "bg-emerald-900/30 text-emerald-400"
                            : "bg-emerald-50 text-emerald-700"
                          : task.status === "in_progress"
                          ? isDarkMode
                            ? "bg-blue-900/30 text-blue-400"
                            : "bg-blue-50 text-blue-700"
                          : isDarkMode
                          ? "bg-slate-800 text-slate-400"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {task.status === "done"
                        ? "Completed"
                        : task.status === "in_progress"
                        ? "In Progress"
                        : "Pending"}
                    </span>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-sm text-slate-500">
                  No recent tasks found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </GlowingCard>
  );
};

export default RecentTasks;
