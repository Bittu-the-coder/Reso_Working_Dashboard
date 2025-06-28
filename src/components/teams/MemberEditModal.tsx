import React, { useState, useEffect } from "react";
import { X, User, Mail, Users, Shield } from "lucide-react";

interface Member {
  _id: string;
  name: string;
  email: string;
  department?: string;
  role: string;
}

interface MemberEditModalProps {
  member: Member;
  onClose: () => void;
  onUpdate: (updatedData: {
    name?: string;
    email?: string;
    department?: string;
    role?: "admin" | "member";
  }) => void;
  isDarkMode: boolean;
}

const MemberEditModal: React.FC<MemberEditModalProps> = ({
  member,
  onClose,
  onUpdate,
  isDarkMode,
}) => {
  const [name, setName] = useState(member.name);
  const [email, setEmail] = useState(member.email);
  const [department, setDepartment] = useState(member.department || "");
  const [role, setRole] = useState<"admin" | "member">(
    member.role as "admin" | "member"
  );

  // Close modal when escape key is pressed
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedData = {
      name,
      email,
      department,
      role,
    };

    onUpdate(updatedData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`w-full max-w-md rounded-xl p-6 ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        } shadow-xl`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Edit Team Member</h3>
          <button
            onClick={onClose}
            className={`p-1 rounded-full ${
              isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="relative">
              <label
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                } mb-1`}
              >
                Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full rounded-lg px-3 py-2 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "border-gray-300 text-gray-900"
                  } border pl-9`}
                  required
                />
                <User
                  className={`absolute top-2.5 left-3 w-4 h-4 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                />
              </div>
            </div>

            <div>
              <label
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                } mb-1`}
              >
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full rounded-lg px-3 py-2 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "border-gray-300 text-gray-900"
                  } border pl-9`}
                  required
                />
                <Mail
                  className={`absolute top-2.5 left-3 w-4 h-4 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                />
              </div>
            </div>

            <div>
              <label
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                } mb-1`}
              >
                Department
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className={`w-full rounded-lg px-3 py-2 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "border-gray-300 text-gray-900"
                  } border pl-9`}
                />
                <Users
                  className={`absolute top-2.5 left-3 w-4 h-4 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                />
              </div>
            </div>

            <div>
              <label
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                } mb-1`}
              >
                Role
              </label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) =>
                    setRole(e.target.value as "admin" | "member")
                  }
                  className={`w-full rounded-lg px-3 py-2 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "border-gray-300 text-gray-900"
                  } border pl-9 appearance-none`}
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
                <Shield
                  className={`absolute top-2.5 left-3 w-4 h-4 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-2 rounded-lg ${
                isDarkMode
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              } transition-colors`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberEditModal;
