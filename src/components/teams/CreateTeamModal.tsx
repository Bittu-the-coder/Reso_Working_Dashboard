import React, { useState, useRef } from "react";
import { X, Upload } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { motion } from "framer-motion";
import type { CreateTeamData } from "../../types";

interface CreateTeamModalProps {
  onClose: () => void;
  onSubmit: (formData: CreateTeamData) => Promise<void>;
  isCreating: boolean;
}

const CreateTeamModal: React.FC<CreateTeamModalProps> = ({
  onClose,
  onSubmit,
  isCreating,
}) => {
  const { isDarkMode } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    description: "",
  });

  // File state
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file type
      if (!file.type.match("image.*")) {
        setError("Please select an image file (JPEG, PNG)");
        return;
      }

      // Validate file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        setError("File size must be less than 2MB");
        return;
      }

      setAvatarFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Team name is required");
      return;
    }

    const formDataObj = new FormData();
    formDataObj.append("name", formData.name);
    formDataObj.append("department", formData.department);
    formDataObj.append("description", formData.description);

    // Append all files with field name 'upload'
    if (avatarFile) {
      formDataObj.append("avatar", avatarFile); // Note: field name must match multer's expectation
    }

    try {
      await onSubmit(formDataObj);
      onClose();
    } catch (err: any) {
      setError(`Failed to create team. Please try again. ${err.message || ""}`);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full max-w-md rounded-xl shadow-2xl overflow-hidden ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Create New Team</h3>
            <button
              onClick={onClose}
              className={`p-1 rounded-full transition-colors ${
                isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
              }`}
              disabled={isCreating}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div
                className={`p-3 rounded-lg ${
                  isDarkMode
                    ? "bg-red-900/30 text-red-300"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {error}
              </div>
            )}

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Team Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full rounded-lg px-4 py-2 border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
                placeholder="Marketing Team"
                required
                maxLength={50}
                disabled={isCreating}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Department
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className={`w-full rounded-lg px-4 py-2 border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
                placeholder="Marketing"
                maxLength={50}
                disabled={isCreating}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={`w-full rounded-lg px-4 py-2 border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
                placeholder="Our marketing team handles all promotional activities"
                rows={3}
                maxLength={200}
                disabled={isCreating}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Team Avatar
              </label>

              {avatarPreview ? (
                <div className="relative group">
                  <img
                    src={avatarPreview}
                    alt="Team preview"
                    className="w-24 h-24 rounded-lg object-cover border-2 border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="avatar-upload"
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer ${
                      isDarkMode
                        ? "border-gray-600 hover:border-indigo-500 bg-gray-700/50"
                        : "border-gray-300 hover:border-blue-500 bg-gray-50"
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload
                        className={`w-8 h-8 mb-3 ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      />
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p
                        className={`text-xs ${
                          isDarkMode ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        PNG, JPG (Max. 2MB)
                      </p>
                    </div>
                    <input
                      id="avatar-upload"
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept="image/png, image/jpeg"
                      onChange={handleFileChange}
                      disabled={isCreating}
                    />
                  </label>
                </div>
              )}
            </div>

            <div className="flex space-x-3 pt-4">
              <motion.button
                type="button"
                onClick={onClose}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 py-2.5 rounded-lg font-medium ${
                  isDarkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
                disabled={isCreating}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={isCreating}
              >
                {isCreating ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating...
                  </span>
                ) : (
                  "Create Team"
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateTeamModal;
