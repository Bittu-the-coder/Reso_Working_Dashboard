import React from "react";
import { FiFileText } from "react-icons/fi";

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

const Tasks: React.FC<TasksProps> = ({
  tasks,
  newTask,
  setNewTask,
  handleAddTask,
}) => {
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/30 text-green-100";
      case "in-progress":
        return "bg-blue-500/30 text-blue-100";
      case "pending":
      default:
        return "bg-yellow-500/30 text-yellow-100";
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow border border-white/20">
        <h3 className="text-lg font-medium text-white mb-4">Add New Task</h3>
        <form onSubmit={handleAddTask} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="task-title"
                className="block text-sm font-medium text-white/80 mb-2"
              >
                Task Title
              </label>
              <input
                type="text"
                id="task-title"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label
                htmlFor="task-assignee"
                className="block text-sm font-medium text-white/80 mb-2"
              >
                Assignee
              </label>
              <input
                type="text"
                id="task-assignee"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                value={newTask.assignee}
                onChange={(e) =>
                  setNewTask({ ...newTask, assignee: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="task-deadline"
                className="block text-sm font-medium text-white/80 mb-2"
              >
                Deadline
              </label>
              <input
                type="date"
                id="task-deadline"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
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
                className="block text-sm font-medium text-white/80 mb-2"
              >
                Status
              </label>
              <select
                id="task-status"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
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
            <button
              type="submit"
              className="bg-white text-indigo-900 hover:bg-white/90 transition-colors py-3 px-6 rounded-lg font-semibold shadow-md"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow border border-white/20">
        <h3 className="text-lg font-medium text-white mb-4">Task List</h3>
        {tasks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/20">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider"
                  >
                    Task
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider"
                  >
                    Assignee
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider"
                  >
                    Deadline
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20">
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-white/20 text-white mr-3">
                          <FiFileText />
                        </div>
                        {task.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {task.assignee}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {task.deadline}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(
                          task.status
                        )}`}
                      >
                        {task.status.charAt(0).toUpperCase() +
                          task.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-white/70">No tasks found.</p>
        )}
      </div>
    </div>
  );
};

export default Tasks;
