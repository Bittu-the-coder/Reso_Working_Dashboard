import React, { useState } from "react";
import { X } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

interface CreateTaskModalProps {
  teams: any[];
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  teams,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
    teamId: "",
    assignedTo: [],
    tags: [],
    estimatedHours: "",
  });
  const { isDarkMode } = useTheme();

  const [tagInput, setTagInput] = useState("");

  const selectedTeam =
    teams.find((team) => team._id === formData.teamId) || null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      estimatedHours: formData.estimatedHours
        ? Number(formData.estimatedHours)
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

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  return (
    <div className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50 overflow-y-auto">
      <div
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2
            className={`text-xl font-semibold ${
              isDarkMode ? "text-white" : ""
            }`}
          >
            Create New Task
          </h2>
          <button
            onClick={onClose}
            className={`p-1 rounded-full ${
              isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                } mb-1`}
              >
                Task Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className={`w-full ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "border-gray-300 text-gray-900"
                } border rounded-lg px-3 py-2`}
                placeholder="Enter task title"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                } mb-1`}
              >
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className={`w-full ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "border-gray-300 text-gray-900"
                } border rounded-lg px-3 py-2`}
                placeholder="Enter task description"
                rows={3}
              />
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
                value={formData.teamId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    teamId: e.target.value,
                    assignedTo: [],
                  })
                }
                className={`w-full ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "border-gray-300 text-gray-900"
                } border rounded-lg px-3 py-2`}
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
              <label
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                } mb-1`}
              >
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priority: e.target.value as "Low" | "Medium" | "High",
                  })
                }
                className={`w-full ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "border-gray-300 text-gray-900"
                } border rounded-lg px-3 py-2`}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                } mb-1`}
              >
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                className={`w-full ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "border-gray-300 text-gray-900"
                } border rounded-lg px-3 py-2`}
              />
            </div>
            <div>
              <label
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                } mb-1`}
              >
                Estimated Hours
              </label>
              <input
                type="number"
                value={formData.estimatedHours}
                onChange={(e) =>
                  setFormData({ ...formData, estimatedHours: e.target.value })
                }
                className={`w-full ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "border-gray-300 text-gray-900"
                } border rounded-lg px-3 py-2`}
                placeholder="Enter estimated hours"
                min="0"
                step="0.5"
              />
            </div>
          </div>
          {selectedTeam && (
            <div>
              <label
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                } mb-1`}
              >
                Assign to Team Members
              </label>
              <div
                className={`space-y-2 max-h-32 overflow-y-auto border ${
                  isDarkMode ? "border-gray-600" : "border-gray-200"
                } rounded-lg p-2`}
              >
                {selectedTeam.members.map((member) =>
                  member.userId ? (
                    <label
                      key={member.userId._id}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        checked={
                          member.userId
                            ? formData.assignedTo.includes(member.userId._id)
                            : false
                        }
                        onChange={(e) => {
                          if (e.target.checked && member.userId) {
                            setFormData({
                              ...formData,
                              assignedTo: [
                                ...formData.assignedTo,
                                member.userId._id,
                              ],
                            });
                          } else if (member.userId) {
                            setFormData({
                              ...formData,
                              assignedTo: formData.assignedTo.filter(
                                (id) => id !== member.userId._id
                              ),
                            });
                          }
                        }}
                        className={`rounded ${
                          isDarkMode
                            ? "border-gray-600 bg-gray-700"
                            : "border-gray-300"
                        } text-blue-600 focus:ring-blue-500`}
                      />
                      <span
                        className={`text-sm ${
                          isDarkMode ? "text-gray-300" : ""
                        }`}
                      >
                        {member.userId.name}
                      </span>
                    </label>
                  ) : null
                )}
              </div>
            </div>
          )}
          <div>
            <label
              className={`block text-sm font-medium ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              } mb-1`}
            >
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
                className={`flex-1 ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "border-gray-300 text-gray-900"
                } border rounded-lg px-3 py-2`}
                placeholder="Add a tag"
              />
              <button
                type="button"
                onClick={addTag}
                className={`${
                  isDarkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                } px-3 py-2 rounded-lg`}
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className={`inline-flex items-center px-2 py-1 text-xs ${
                    isDarkMode
                      ? "bg-blue-900/50 text-blue-300"
                      : "bg-blue-100 text-blue-800"
                  } rounded cursor-pointer`}
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
              className={`flex-1 ${
                isDarkMode
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              } py-2 rounded-lg`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 ${
                isDarkMode
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              } py-2 rounded-lg`}
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
