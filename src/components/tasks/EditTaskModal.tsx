import React, { useState, useEffect } from "react";
import { X, Check, ChevronDown, Upload, FileIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useTaskStore } from "../../store/useTaskStore";

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

interface TaskStep {
  title: string;
  isCompleted: boolean;
}

interface FileUpload {
  fileId?: string;
  url: string;
  name: string;
  size?: string;
  fileType?: string;
}

interface Task {
  _id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority?: string;
  teamId?: {
    _id: string;
    name: string;
  };
  assignedTo?: Array<{
    _id: string;
    name: string;
  }>;
  steps?: TaskStep[];
  uploads?: FileUpload[];
}

interface FormData {
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  teamId: string;
  assignedTo: string[];
  steps: TaskStep[];
  files: Array<{
    file?: File;
    name: string;
    size: number;
    type: string;
  }>;
  existingUploads: FileUpload[];
  removedUploads: string[];
}

interface EditTaskModalProps {
  task: Task;
  teams: Team[];
  onClose: () => void;
  onUpdate?: () => void;
  isDarkMode?: boolean;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({
  task,
  teams,
  onClose,
  onUpdate,
  isDarkMode = false,
}) => {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    teamId: "",
    assignedTo: [],
    steps: [],
    files: [],
    existingUploads: [],
    removedUploads: [],
  });

  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isTeamDropdownOpen, setIsTeamDropdownOpen] = useState(false);
  const { updateTask } = useTaskStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || "",
        dueDate: task.dueDate
          ? new Date(task.dueDate).toISOString().split("T")[0]
          : "",
        priority: task.priority || "medium",
        teamId: task.teamId?._id || "",
        assignedTo: task.assignedTo?.map((user) => user._id) || [],
        steps: task.steps || [],
        files: [],
        existingUploads: task.uploads || [],
        removedUploads: [],
      });

      if (task.teamId?._id) {
        const team = teams.find((t) => t._id === task.teamId?._id);
        setSelectedTeam(team || null);
      }
    }
  }, [task, teams]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.teamId) newErrors.teamId = "Team is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const taskData = {
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate,
        priority: formData.priority,
        assignedTo: formData.assignedTo,
        steps: formData.steps.map((step) => ({
          title: step.title,
          isCompleted: step.isCompleted || false,
        })),
      };

      const filesToUpload = formData.files.map(
        (fileObj) => fileObj.file || fileObj
      );

      const response = await updateTask(
        formData.teamId,
        task._id,
        taskData,
        filesToUpload,
        formData.removedUploads
      );

      if (response.success) {
        toast.success("Task updated successfully!");
        onClose();
        onUpdate?.();
      } else {
        toast.error(response.error || "Failed to update task");
      }
    } catch (error: any) {
      console.error("Error updating task:", error);
      toast.error(error.message || "Failed to update task");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        file,
        name: file.name,
        size: file.size,
        type: file.type,
      }));
      setFormData((prev) => ({
        ...prev,
        files: [...prev.files, ...newFiles],
      }));
    }
  };

  const removeNewFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  const removeExistingUpload = (index: number, url: string) => {
    setFormData((prev) => ({
      ...prev,
      existingUploads: prev.existingUploads.filter((_, i) => i !== index),
      removedUploads: [...prev.removedUploads, url],
    }));
  };

  const addStep = () => {
    setFormData({
      ...formData,
      steps: [...formData.steps, { title: "", isCompleted: false }],
    });
  };

  const updateStep = (index: number, value: string) => {
    const newSteps = [...formData.steps];
    newSteps[index].title = value;
    if (value.trim() === "") {
      newSteps[index].isCompleted = false;
    }
    setFormData({
      ...formData,
      steps: newSteps,
    });
  };

  const removeStep = (index: number) => {
    if (formData.steps.length > 1) {
      setFormData({
        ...formData,
        steps: formData.steps.filter((_, i) => i !== index),
      });
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
        isDarkMode ? "bg-black bg-opacity-70" : "bg-black bg-opacity-50"
      }`}
    >
      <div
        className={`relative rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <div
          className={`sticky top-0 flex items-center justify-between p-4 border-b ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <h2 className="text-xl font-semibold">Edit Task</h2>
          <button
            onClick={onClose}
            className={`p-1 rounded-full ${
              isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
            }`}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Title */}
          <div>
            <label
              className={`block mb-1 text-sm font-medium ${
                errors.title ? "text-red-500" : ""
              }`}
            >
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (errors.title) setErrors({ ...errors, title: "" });
              }}
              className={`w-full p-2 rounded border ${
                errors.title
                  ? "border-red-500"
                  : isDarkMode
                  ? "border-gray-700 bg-gray-700"
                  : "border-gray-300"
              }`}
              placeholder="Enter task title"
              required
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className={`w-full p-2 rounded border ${
                isDarkMode ? "border-gray-700 bg-gray-700" : "border-gray-300"
              }`}
              rows={3}
              placeholder="Enter task description"
            />
          </div>

          {/* Team Selection */}
          <div className="relative">
            <label
              className={`block mb-1 text-sm font-medium ${
                errors.teamId ? "text-red-500" : ""
              }`}
            >
              Team *
            </label>
            <div
              className={`w-full p-2 rounded border flex items-center justify-between cursor-pointer ${
                errors.teamId
                  ? "border-red-500"
                  : isDarkMode
                  ? "border-gray-700 bg-gray-700"
                  : "border-gray-300"
              }`}
              onClick={() => setIsTeamDropdownOpen(!isTeamDropdownOpen)}
            >
              <span>{selectedTeam ? selectedTeam.name : "Select a team"}</span>
              <ChevronDown
                size={16}
                className={`transition-transform ${
                  isTeamDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </div>
            {isTeamDropdownOpen && (
              <div
                className={`absolute z-10 w-full mt-1 rounded-md shadow-lg ${
                  isDarkMode ? "bg-gray-700" : "bg-white"
                } border ${isDarkMode ? "border-gray-600" : "border-gray-200"}`}
              >
                {teams.map((team) => (
                  <div
                    key={team._id}
                    className={`p-2 hover:${
                      isDarkMode ? "bg-gray-600" : "bg-gray-100"
                    } cursor-pointer`}
                    onClick={() => {
                      setFormData({
                        ...formData,
                        teamId: team._id,
                        assignedTo: [],
                      });
                      setSelectedTeam(team);
                      setIsTeamDropdownOpen(false);
                      if (errors.teamId) setErrors({ ...errors, teamId: "" });
                    }}
                  >
                    {team.name}
                  </div>
                ))}
              </div>
            )}
            {errors.teamId && (
              <p className="mt-1 text-sm text-red-500">{errors.teamId}</p>
            )}
          </div>

          {/* Assigned Members */}
          {selectedTeam && selectedTeam.members.length > 0 && (
            <div>
              <label className="block mb-1 text-sm font-medium">
                Assign to
              </label>
              <div
                className={`p-2 rounded border ${
                  isDarkMode ? "border-gray-700 bg-gray-700" : "border-gray-300"
                }`}
              >
                {selectedTeam.members.map((member) => (
                  <div
                    key={member.userId}
                    className="flex items-center mb-2 last:mb-0"
                  >
                    <input
                      type="checkbox"
                      id={`member-${member.userId}`}
                      checked={formData.assignedTo.includes(member.userId)}
                      onChange={(e) => {
                        const userId = member.userId;
                        setFormData({
                          ...formData,
                          assignedTo: e.target.checked
                            ? [...formData.assignedTo, userId]
                            : formData.assignedTo.filter((id) => id !== userId),
                        });
                      }}
                      className="mr-2"
                    />
                    <label
                      htmlFor={`member-${member.userId}`}
                      className="flex items-center"
                    >
                      <div
                        className={`flex items-center rounded-md justify-center mr-2 ${
                          isDarkMode ? "bg-gray-600" : "bg-gray-200"
                        }`}
                      >
                        {member.name}
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Due Date */}
          <div>
            <label className="block mb-1 text-sm font-medium">Due Date</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
              className={`w-full p-2 rounded border ${
                isDarkMode ? "border-gray-700 bg-gray-700" : "border-gray-300"
              }`}
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block mb-1 text-sm font-medium">Priority</label>
            <div className="flex space-x-2">
              {["low", "medium", "high"].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: level })}
                  className={`px-3 py-1 rounded-full text-sm capitalize flex items-center ${
                    formData.priority === level
                      ? isDarkMode
                        ? "bg-blue-600 text-white"
                        : "bg-blue-100 text-blue-800"
                      : isDarkMode
                      ? "bg-gray-700 text-gray-300"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {formData.priority === level && (
                    <Check size={16} className="mr-1" />
                  )}
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div>
            <label className="block mb-1 text-sm font-medium">Steps</label>
            <div className="space-y-2">
              {formData.steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => updateStep(index, e.target.value)}
                    className={`flex-1 p-2 rounded border ${
                      isDarkMode
                        ? "border-gray-700 bg-gray-700"
                        : "border-gray-300"
                    }`}
                    placeholder={`Step ${index + 1}`}
                  />
                  {formData.steps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStep(index)}
                      className={`ml-2 p-2 rounded ${
                        isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                      }`}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addStep}
                className={`mt-2 px-3 py-1 rounded ${
                  isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                Add Step
              </button>
            </div>
          </div>

          {/* File Upload Section */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Attachments
            </label>

            {/* Existing Uploads Display */}
            {formData.existingUploads.length > 0 && (
              <div className="mb-4 space-y-2">
                <h4 className="text-sm font-medium">Current Attachments</h4>
                {formData.existingUploads.map((upload, index) => (
                  <div
                    key={upload.fileId || index}
                    className={`flex items-center justify-between p-2 rounded ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center">
                      {upload.fileType?.startsWith("image/") ? (
                        <img
                          src={upload.url}
                          alt={upload.name}
                          className="w-10 h-10 object-cover mr-2 rounded"
                        />
                      ) : (
                        <div className="w-10 h-10 flex items-center justify-center bg-gray-200 dark:bg-gray-600 mr-2 rounded">
                          <FileIcon className="w-5 h-5" />
                        </div>
                      )}
                      <div className="truncate max-w-xs">
                        <p className="text-sm truncate">
                          {upload.url.split("/").pop()}
                        </p>
                        {upload.size && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {upload.size}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeExistingUpload(index, upload.url)}
                      className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* New Files Upload Area */}
            <label
              className={`block w-full p-4 rounded border-2 border-dashed cursor-pointer ${
                isDarkMode
                  ? "border-gray-700 hover:border-gray-600"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <div className="flex flex-col items-center justify-center text-center">
                <Upload size={24} className="mb-2" />
                <span className="text-sm">Click to upload files</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  or drag and drop
                </span>
              </div>
              <input
                type="file"
                onChange={handleFileChange}
                multiple
                className="hidden"
              />
            </label>

            {/* New Files Preview */}
            {formData.files.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium">New Files to Upload</h4>
                {formData.files.map((file, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-2 rounded ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <span className="text-sm truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeNewFile(index)}
                      className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded ${
                isDarkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded text-white ${
                isDarkMode
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Update Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;

// import React, { useState, useEffect } from "react";
// import { X, Check, ChevronDown, Upload, FileIcon } from "lucide-react";
// import toast from "react-hot-toast";
// import { useTaskStore } from "../../store/useTaskStore";

// const EditTaskModal = ({
//   task,
//   teams,
//   onClose,
//   onUpdate,
//   isDarkMode = false,
// }) => {
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     dueDate: "",
//     priority: "medium",
//     teamId: "",
//     assignedTo: [],
//     steps: [],
//     files: [], // New files to upload
//     existingUploads: [], // Existing uploads from the task
//     removedUploads: [], // URLs of uploads to be removed
//   });

//   const [selectedTeam, setSelectedTeam] = useState(null);
//   const [isTeamDropdownOpen, setIsTeamDropdownOpen] = useState(false);
//   const { updateTask } = useTaskStore();
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     if (task) {
//       setFormData({
//         title: task.title,
//         description: task.description || "",
//         dueDate: task.dueDate
//           ? new Date(task.dueDate).toISOString().split("T")[0]
//           : "",
//         priority: task.priority || "medium",
//         teamId: task.teamId?._id || "",
//         assignedTo: task.assignedTo?.map((user) => user._id) || [],
//         steps: task.steps || [],
//         files: [], // Initialize as empty array
//         existingUploads: task.uploads || [], // Store existing uploads
//         removedUploads: [], // Initialize as empty array
//       });

//       if (task.teamId?._id) {
//         const team = teams.find((t) => t._id === task.teamId._id);
//         setSelectedTeam(team);
//       }
//     }
//   }, [task, teams]);

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.title.trim()) newErrors.title = "Title is required";
//     if (!formData.teamId) newErrors.teamId = "Team is required";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     try {
//       // Prepare the task data
//       const taskData = {
//         title: formData.title,
//         description: formData.description,
//         dueDate: formData.dueDate,
//         priority: formData.priority,
//         assignedTo: formData.assignedTo,
//         steps: formData.steps.map((step) => ({
//           title: step.title,
//           isCompleted: step.isCompleted || false,
//         })),
//       };

//       // Extract the actual File objects from the formData.files
//       const filesToUpload = formData.files.map(
//         (fileObj) => fileObj.file || fileObj
//       );

//       console.log("Files to upload:", filesToUpload);
//       console.log("Removed uploads:", formData.removedUploads);

//       // Call the update function with extracted files
//       const response = await updateTask(
//         formData.teamId,
//         task._id,
//         taskData,
//         filesToUpload, // Pass the extracted File objects
//         formData.removedUploads
//       );

//       if (response.success) {
//         toast.success("Task updated successfully!");
//         onClose();
//       } else {
//         toast.error(response.error || "Failed to update task");
//       }
//     } catch (error) {
//       console.error("Error updating task:", error);
//       toast.error(error.message || "Failed to update task");
//     }
//   };

//   // File handling functions
//   const handleFileChange = (e) => {
//     const newFiles = Array.from(e.target.files).map((file) => ({
//       file, // Store the actual file object for upload
//       name: file.name,
//       size: file.size,
//       type: file.type,
//     }));
//     if (e.target.files && e.target.files.length > 0) {
//       setFormData((prev) => ({
//         ...prev,
//         files: [...prev.files, ...newFiles],
//       }));
//     }
//   };

//   const removeNewFile = (index) => {
//     setFormData((prev) => ({
//       ...prev,
//       files: prev.files.filter((_, i) => i !== index),
//     }));
//   };
//   console.log("==========form data", formData);

//   const removeExistingUpload = (index, url) => {
//     setFormData((prev) => ({
//       ...prev,
//       existingUploads: prev.existingUploads.filter((_, i) => i !== index),
//       removedUploads: [...prev.removedUploads, url],
//     }));
//   };

//   // Step handling functions (unchanged from your original)
//   const addStep = () => {
//     setFormData({
//       ...formData,
//       steps: [...formData.steps, { title: "", isCompleted: false }],
//     });
//   };

//   const updateStep = (index, value) => {
//     const newSteps = [...formData.steps];
//     newSteps[index].title = value;
//     if (value.trim() === "") {
//       newSteps[index].isCompleted = false;
//     }
//     setFormData({
//       ...formData,
//       steps: newSteps,
//     });
//   };

//   const removeStep = (index) => {
//     if (formData.steps.length > 1) {
//       setFormData({
//         ...formData,
//         steps: formData.steps.filter((_, i) => i !== index),
//       });
//     }
//   };

//   return (
//     <div
//       className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
//         isDarkMode ? "bg-black bg-opacity-70" : "bg-black bg-opacity-50"
//       }`}
//     >
//       {/* Modal container */}
//       <div
//         className={`relative rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto ${
//           isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
//         }`}
//       >
//         {/* Header */}
//         <div
//           className={`sticky top-0 flex items-center justify-between p-4 border-b ${
//             isDarkMode ? "border-gray-700" : "border-gray-200"
//           }`}
//         >
//           <h2 className="text-xl font-semibold">Edit Task</h2>
//           <button
//             onClick={onClose}
//             className={`p-1 rounded-full ${
//               isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
//             }`}
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="p-4 space-y-4">
//           {/* Title */}
//           <div>
//             <label
//               className={`block mb-1 text-sm font-medium ${
//                 errors.title ? "text-red-500" : ""
//               }`}
//             >
//               Title *
//             </label>
//             <input
//               type="text"
//               value={formData.title}
//               onChange={(e) => {
//                 setFormData({ ...formData, title: e.target.value });
//                 if (errors.title) setErrors({ ...errors, title: "" });
//               }}
//               className={`w-full p-2 rounded border ${
//                 errors.title
//                   ? "border-red-500"
//                   : isDarkMode
//                   ? "border-gray-700 bg-gray-700"
//                   : "border-gray-300"
//               }`}
//               placeholder="Enter task title"
//               required
//             />
//             {errors.title && (
//               <p className="mt-1 text-sm text-red-500">{errors.title}</p>
//             )}
//           </div>

//           {/* Description */}
//           <div>
//             <label className="block mb-1 text-sm font-medium">
//               Description
//             </label>
//             <textarea
//               value={formData.description}
//               onChange={(e) =>
//                 setFormData({ ...formData, description: e.target.value })
//               }
//               className={`w-full p-2 rounded border ${
//                 isDarkMode ? "border-gray-700 bg-gray-700" : "border-gray-300"
//               }`}
//               rows={3}
//               placeholder="Enter task description"
//             />
//           </div>

//           {/* Team Selection */}
//           <div className="relative">
//             <label
//               className={`block mb-1 text-sm font-medium ${
//                 errors.teamId ? "text-red-500" : ""
//               }`}
//             >
//               Team *
//             </label>
//             <div
//               className={`w-full p-2 rounded border flex items-center justify-between cursor-pointer ${
//                 errors.teamId
//                   ? "border-red-500"
//                   : isDarkMode
//                   ? "border-gray-700 bg-gray-700"
//                   : "border-gray-300"
//               }`}
//               onClick={() => setIsTeamDropdownOpen(!isTeamDropdownOpen)}
//             >
//               <span>{selectedTeam ? selectedTeam.name : "Select a team"}</span>
//               <ChevronDown
//                 size={16}
//                 className={`transition-transform ${
//                   isTeamDropdownOpen ? "rotate-180" : ""
//                 }`}
//               />
//             </div>
//             {isTeamDropdownOpen && (
//               <div
//                 className={`absolute z-10 w-full mt-1 rounded-md shadow-lg ${
//                   isDarkMode ? "bg-gray-700" : "bg-white"
//                 } border ${isDarkMode ? "border-gray-600" : "border-gray-200"}`}
//               >
//                 {teams.map((team) => (
//                   <div
//                     key={team._id}
//                     className={`p-2 hover:${
//                       isDarkMode ? "bg-gray-600" : "bg-gray-100"
//                     } cursor-pointer`}
//                     onClick={() => {
//                       setFormData({
//                         ...formData,
//                         teamId: team._id,
//                         assignedTo: [],
//                       });
//                       setSelectedTeam(team);
//                       setIsTeamDropdownOpen(false);
//                       if (errors.teamId) setErrors({ ...errors, teamId: "" });
//                     }}
//                   >
//                     {team.name}
//                   </div>
//                 ))}
//               </div>
//             )}
//             {errors.teamId && (
//               <p className="mt-1 text-sm text-red-500">{errors.teamId}</p>
//             )}
//           </div>

//           {/* Assigned Members */}
//           {selectedTeam &&
//             selectedTeam.members &&
//             selectedTeam.members.length > 0 && (
//               <div>
//                 <label className="block mb-1 text-sm font-medium">
//                   Assign to
//                 </label>
//                 <div
//                   className={`p-2 rounded border ${
//                     isDarkMode
//                       ? "border-gray-700 bg-gray-700"
//                       : "border-gray-300"
//                   }`}
//                 >
//                   {selectedTeam.members.map((member) => (
//                     <div
//                       key={member.userId}
//                       className="flex items-center mb-2 last:mb-0"
//                     >
//                       <input
//                         type="checkbox"
//                         id={`member-${member.userId}`}
//                         checked={formData.assignedTo.includes(member.userId)}
//                         onChange={(e) => {
//                           const userId = member.userId;
//                           setFormData({
//                             ...formData,
//                             assignedTo: e.target.checked
//                               ? [...formData.assignedTo, userId]
//                               : formData.assignedTo.filter(
//                                   (id) => id !== userId
//                                 ),
//                           });
//                         }}
//                         className="mr-2"
//                       />
//                       <label
//                         htmlFor={`member-${member.userId}`}
//                         className="flex items-center"
//                       >
//                         <div
//                           className={`flex items-center rounded-md justify-center mr-2 ${
//                             isDarkMode ? "bg-gray-600" : "bg-gray-200"
//                           }`}
//                         >
//                           {member.name}
//                         </div>
//                       </label>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//           {/* Due Date */}
//           <div>
//             <label className="block mb-1 text-sm font-medium">Due Date</label>
//             <input
//               type="date"
//               value={formData.dueDate}
//               onChange={(e) =>
//                 setFormData({ ...formData, dueDate: e.target.value })
//               }
//               className={`w-full p-2 rounded border ${
//                 isDarkMode ? "border-gray-700 bg-gray-700" : "border-gray-300"
//               }`}
//             />
//           </div>

//           {/* Priority */}
//           <div>
//             <label className="block mb-1 text-sm font-medium">Priority</label>
//             <div className="flex space-x-2">
//               {["low", "medium", "high"].map((level) => (
//                 <button
//                   key={level}
//                   type="button"
//                   onClick={() => setFormData({ ...formData, priority: level })}
//                   className={`px-3 py-1 rounded-full text-sm capitalize flex items-center ${
//                     formData.priority === level
//                       ? isDarkMode
//                         ? "bg-blue-600 text-white"
//                         : "bg-blue-100 text-blue-800"
//                       : isDarkMode
//                       ? "bg-gray-700 text-gray-300"
//                       : "bg-gray-100 text-gray-800"
//                   }`}
//                 >
//                   {formData.priority === level && (
//                     <Check size={16} className="mr-1" />
//                   )}
//                   {level}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Steps */}
//           <div>
//             <label className="block mb-1 text-sm font-medium">Steps</label>
//             <div className="space-y-2">
//               {formData.steps.map((step, index) => (
//                 <div key={index} className="flex items-center">
//                   <input
//                     type="text"
//                     value={step.title}
//                     onChange={(e) => updateStep(index, e.target.value)}
//                     className={`flex-1 p-2 rounded border ${
//                       isDarkMode
//                         ? "border-gray-700 bg-gray-700"
//                         : "border-gray-300"
//                     }`}
//                     placeholder={`Step ${index + 1}`}
//                   />
//                   {formData.steps.length > 1 && (
//                     <button
//                       type="button"
//                       onClick={() => removeStep(index)}
//                       className={`ml-2 p-2 rounded ${
//                         isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
//                       }`}
//                     >
//                       <X size={16} />
//                     </button>
//                   )}
//                 </div>
//               ))}
//               <button
//                 type="button"
//                 onClick={addStep}
//                 className={`mt-2 px-3 py-1 rounded ${
//                   isDarkMode
//                     ? "bg-gray-700 hover:bg-gray-600"
//                     : "bg-gray-100 hover:bg-gray-200"
//                 }`}
//               >
//                 Add Step
//               </button>
//             </div>
//           </div>

//           {/* File Upload Section */}
//           <div>
//             <label className="block mb-1 text-sm font-medium">
//               Attachments
//             </label>

//             {/* Existing Uploads Display */}
//             {formData.existingUploads?.length > 0 && (
//               <div className="mb-4 space-y-2">
//                 <h4 className="text-sm font-medium">Current Attachments</h4>
//                 {formData.existingUploads.map((upload, index) => (
//                   <div
//                     key={upload.fileId || index}
//                     className={`flex items-center justify-between p-2 rounded ${
//                       isDarkMode ? "bg-gray-700" : "bg-gray-100"
//                     }`}
//                   >
//                     <div className="flex items-center">
//                       {upload.fileType?.startsWith("image/") ? (
//                         <img
//                           src={upload.url}
//                           alt={upload.name}
//                           className="w-10 h-10 object-cover mr-2 rounded"
//                         />
//                       ) : (
//                         <div className="w-10 h-10 flex items-center justify-center bg-gray-200 dark:bg-gray-600 mr-2 rounded">
//                           <FileIcon className="w-5 h-5" />
//                         </div>
//                       )}
//                       <div className="truncate max-w-xs">
//                         <p className="text-sm truncate">
//                           {upload.url.split("/").pop()}
//                         </p>
//                         {upload.size && (
//                           <p className="text-xs text-gray-500 dark:text-gray-400">
//                             {upload.size || "Unknown Size"}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                     <button
//                       type="button"
//                       onClick={() => removeExistingUpload(index, upload.url)}
//                       className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-1"
//                     >
//                       <X size={16} />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* New Files Upload Area */}
//             <label
//               className={`block w-full p-4 rounded border-2 border-dashed cursor-pointer ${
//                 isDarkMode
//                   ? "border-gray-700 hover:border-gray-600"
//                   : "border-gray-300 hover:border-gray-400"
//               }`}
//             >
//               <div className="flex flex-col items-center justify-center text-center">
//                 <Upload size={24} className="mb-2" />
//                 <span className="text-sm">Click to upload files</span>
//                 <span className="text-xs text-gray-500 dark:text-gray-400">
//                   or drag and drop
//                 </span>
//               </div>
//               <input
//                 type="file"
//                 onChange={handleFileChange}
//                 multiple
//                 className="hidden"
//               />
//             </label>

//             {/* New Files Preview */}
//             {formData.files?.length > 0 && (
//               <div className="mt-4 space-y-2">
//                 <h4 className="text-sm font-medium">New Files to Upload</h4>
//                 {formData.files.map((file, index) => (
//                   <div
//                     key={index}
//                     className={`flex items-center justify-between p-2 rounded ${
//                       isDarkMode ? "bg-gray-700" : "bg-gray-100"
//                     }`}
//                   >
//                     <span className="text-sm truncate">{file.name}</span>
//                     <button
//                       type="button"
//                       onClick={() => removeNewFile(index)}
//                       className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
//                     >
//                       <X size={16} />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Footer */}
//           <div className="flex justify-end space-x-2 pt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className={`px-4 py-2 rounded ${
//                 isDarkMode
//                   ? "bg-gray-700 hover:bg-gray-600"
//                   : "bg-gray-200 hover:bg-gray-300"
//               }`}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className={`px-4 py-2 rounded text-white ${
//                 isDarkMode
//                   ? "bg-blue-600 hover:bg-blue-700"
//                   : "bg-blue-600 hover:bg-blue-700"
//               }`}
//             >
//               Update Task
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditTaskModal;
