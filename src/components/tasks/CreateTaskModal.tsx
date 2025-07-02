import React, { useState, useEffect } from "react";
import { X, Upload, Check, ChevronDown } from "lucide-react";
import { useTaskStore } from "../../store/useTaskStore";
import toast from "react-hot-toast";
import type { TaskStep, Team } from "../../types";

interface FileData {
  file: File;
  name: string;
  size: number;
  type: string;
}

interface FormData {
  title: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  teamId: string;
  assignedTo: string[];
  files: FileData[];
  steps: TaskStep[];
}

interface CreateTaskModalProps {
  teams: Team[];
  onClose: () => void;
  isDarkMode?: boolean;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  teams,
  onClose,
  isDarkMode = false,
}) => {
  const { createTask, loading } = useTaskStore();
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    teamId: "",
    assignedTo: [],
    files: [],
    steps: [
      {
        title: "",
        isCompleted: false,
      },
    ],
  });
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isTeamDropdownOpen, setIsTeamDropdownOpen] = useState(false);

  useEffect(() => {
    if (formData.teamId) {
      const team = teams.find((t) => t._id === formData.teamId) || null;
      setSelectedTeam(team);
    }
  }, [formData.teamId, teams]);

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
      const response = await createTask(
        formData.teamId,
        {
          title: formData.title,
          description: formData.description,
          dueDate: formData.dueDate,
          priority: formData.priority,
          assignedTo: formData.assignedTo,
          steps: formData.steps,
        },
        formData.files.map((f) => f.file)
      );

      if (response.success) {
        toast.success("Task created successfully!");
        onClose();
      } else {
        toast.error(response.error || "Failed to create task");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create task");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        file,
        name: file.name,
        size: file.size,
        type: file.type,
      }));
      setFormData({
        ...formData,
        files: [...formData.files, ...newFiles],
      });
    }
  };

  const removeFile = (index: number) => {
    setFormData({
      ...formData,
      files: formData.files.filter((_, i) => i !== index),
    });
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
        {/* Header */}
        <div
          className={`sticky top-0 flex items-center justify-between p-4 border-b ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <h2 className="text-xl font-semibold">Create New Task</h2>
          <button
            onClick={onClose}
            className={`p-1 rounded-full ${
              isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
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
              } ${
                isDarkMode
                  ? "focus:ring-blue-500 focus:border-blue-500"
                  : "focus:ring-blue-500 focus:border-blue-500"
              }`}
              placeholder="Enter task title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className={`block mb-1 text-sm font-medium`}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className={`w-full p-2 rounded border ${
                isDarkMode ? "border-gray-700 bg-gray-700" : "border-gray-300"
              } ${
                isDarkMode
                  ? "focus:ring-blue-500 focus:border-blue-500"
                  : "focus:ring-blue-500 focus:border-blue-500"
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
              } ${
                isDarkMode
                  ? "focus:ring-blue-500 focus:border-blue-500"
                  : "focus:ring-blue-500 focus:border-blue-500"
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
                      setIsTeamDropdownOpen(false);
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
          {selectedTeam &&
            selectedTeam.members &&
            selectedTeam.members.length > 0 && (
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Assign to
                </label>
                <div
                  className={`p-2 rounded border ${
                    isDarkMode
                      ? "border-gray-700 bg-gray-700"
                      : "border-gray-300"
                  }`}
                >
                  {selectedTeam.members.map((member) => (
                    <div
                      key={member._id}
                      className="flex items-center mb-2 last:mb-0"
                    >
                      <input
                        type="checkbox"
                        id={`member-${member.userId.toString()}`}
                        checked={formData.assignedTo.includes(
                          member.userId.toString()
                        )}
                        onChange={(e) => {
                          const userId = member.userId.toString();
                          setFormData({
                            ...formData,
                            assignedTo: e.target.checked
                              ? [...formData.assignedTo, userId]
                              : formData.assignedTo.filter(
                                  (id) => id !== userId
                                ),
                          });
                        }}
                        className="mr-2"
                      />
                      <label
                        htmlFor={`member-${member.userId.toString()}`}
                        className="flex items-center"
                      >
                        <span>{member.name}</span>
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
              } ${
                isDarkMode
                  ? "focus:ring-blue-500 focus:border-blue-500"
                  : "focus:ring-blue-500 focus:border-blue-500"
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
                  onClick={() =>
                    setFormData({
                      ...formData,
                      priority: level as "low" | "medium" | "high",
                    })
                  }
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
                    } ${
                      isDarkMode
                        ? "focus:ring-blue-500 focus:border-blue-500"
                        : "focus:ring-blue-500 focus:border-blue-500"
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

          {/* File Upload */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Attachments
            </label>
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
                <span className="text-xs text-gray-500">or drag and drop</span>
              </div>
              <input
                type="file"
                onChange={handleFileChange}
                multiple
                className="hidden"
              />
            </label>
            {formData.files.length > 0 && (
              <div className="mt-2 space-y-2">
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
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700"
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
              disabled={loading || !formData.title || !formData.teamId}
              className={`px-4 py-2 rounded text-white ${
                loading || !formData.title || !formData.teamId
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
// import React, { useState, useEffect } from "react";
// import { X, Upload, Check, ChevronDown } from "lucide-react";
// import { useTaskStore } from "../../store/useTaskStore";
// import toast from "react-hot-toast";

// const CreateTaskModal = ({ teams, onClose, isDarkMode = false }) => {
//   const { createTask, loading } = useTaskStore();
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     dueDate: "",
//     priority: "medium",
//     teamId: "",
//     assignedTo: [],
//     files: [],
//     steps: [
//       {
//         title: "",
//         isCompleted: false,
//       },
//     ],
//   });
//   const [selectedTeam, setSelectedTeam] = useState(null);
//   const [errors, setErrors] = useState({});
//   const [isTeamDropdownOpen, setIsTeamDropdownOpen] = useState(false);

//   useEffect(() => {
//     if (formData.teamId) {
//       const team = teams.find((t) => t._id === formData.teamId);
//       setSelectedTeam(team);
//     }
//   }, [formData.teamId, teams]);

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
//       const response = await createTask(
//         formData.teamId,
//         {
//           title: formData.title,
//           description: formData.description,
//           dueDate: formData.dueDate,
//           priority: formData.priority,
//           assignedTo: formData.assignedTo,
//           steps: formData.steps,
//         },
//         formData.files
//       );

//       if (response.success) {
//         toast.success("Task created successfully!");
//         onClose();
//       } else {
//         toast.error(response.error || "Failed to create task");
//       }
//     } catch (error) {
//       toast.error(error.message || "Failed to create task");
//     }
//   };

//   const handleFileChange = (e) => {
//     const newFiles = Array.from(e.target.files).map((file) => ({
//       file, // Store the actual file object for upload
//       name: file.name,
//       size: file.size,
//       type: file.type,
//     }));
//     setFormData({
//       ...formData,
//       files: [...formData.files, ...newFiles],
//     });
//   };

//   const removeFile = (index) => {
//     setFormData({
//       ...formData,
//       files: formData.files.filter((_, i) => i !== index),
//     });
//   };

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
//           <h2 className="text-xl font-semibold">Create New Task</h2>
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
//               } ${
//                 isDarkMode
//                   ? "focus:ring-blue-500 focus:border-blue-500"
//                   : "focus:ring-blue-500 focus:border-blue-500"
//               }`}
//               placeholder="Enter task title"
//             />
//             {errors.title && (
//               <p className="mt-1 text-sm text-red-500">{errors.title}</p>
//             )}
//           </div>

//           {/* Description */}
//           <div>
//             <label className={`block mb-1 text-sm font-medium`}>
//               Description
//             </label>
//             <textarea
//               value={formData.description}
//               onChange={(e) =>
//                 setFormData({ ...formData, description: e.target.value })
//               }
//               className={`w-full p-2 rounded border ${
//                 isDarkMode ? "border-gray-700 bg-gray-700" : "border-gray-300"
//               } ${
//                 isDarkMode
//                   ? "focus:ring-blue-500 focus:border-blue-500"
//                   : "focus:ring-blue-500 focus:border-blue-500"
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
//               } ${
//                 isDarkMode
//                   ? "focus:ring-blue-500 focus:border-blue-500"
//                   : "focus:ring-blue-500 focus:border-blue-500"
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
//                       setIsTeamDropdownOpen(false);
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
//                       key={member._id}
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
//                           className={` flex items-center rounded-md justify-center mr-2 ${
//                             isDarkMode ? "bg-gray-600" : "bg-gray-200"
//                           }`}
//                         >
//                           {member.name}
//                         </div>
//                         <span>{member.userId.name}</span>
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
//               } ${
//                 isDarkMode
//                   ? "focus:ring-blue-500 focus:border-blue-500"
//                   : "focus:ring-blue-500 focus:border-blue-500"
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
//                     } ${
//                       isDarkMode
//                         ? "focus:ring-blue-500 focus:border-blue-500"
//                         : "focus:ring-blue-500 focus:border-blue-500"
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

//           {/* File Upload */}
//           <div>
//             <label className="block mb-1 text-sm font-medium">
//               Attachments
//             </label>
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
//                 <span className="text-xs text-gray-500">or drag and drop</span>
//               </div>
//               <input
//                 type="file"
//                 onChange={handleFileChange}
//                 multiple
//                 className="hidden"
//               />
//             </label>
//             {formData.files.length > 0 && (
//               <div className="mt-2 space-y-2">
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
//                       onClick={() => removeFile(index)}
//                       className="text-red-500 hover:text-red-700"
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
//               disabled={loading || !formData.title || !formData.teamId}
//               className={`px-4 py-2 rounded text-white ${
//                 loading || !formData.title || !formData.teamId
//                   ? "bg-blue-400 cursor-not-allowed"
//                   : "bg-blue-600 hover:bg-blue-700"
//               }`}
//             >
//               {loading ? "Creating..." : "Create Task"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateTaskModal;
