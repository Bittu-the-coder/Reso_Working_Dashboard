import React from "react";
import { X, Mail, User, Shield, Crown } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

interface MemberDetailModalProps {
  member: {
    _id: string;
    name: string;
    email: string;
    role: string;
    department?: string;
    joinedAt?: string;
  };
  onClose: () => void;
}

const MemberDetailModal: React.FC<MemberDetailModalProps> = ({
  member,
  onClose,
}) => {
  const { isDarkMode } = useTheme();

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case "admin":
        return <Shield className="w-4 h-4 text-blue-500" />;
      default:
        return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50">
      <div
        className={`w-full max-w-md p-6 rounded-lg shadow-xl ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Member Details</h3>
          <button
            onClick={onClose}
            className={`p-1 rounded-full ${
              isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div
              className={`w-12 h-12 rounded-full ${
                isDarkMode ? "bg-gray-700" : "bg-gray-200"
              } flex items-center justify-center`}
            >
              <span className="text-lg font-medium">
                {member.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="flex items-center">
                <p className="font-medium">{member.name}</p>
                <div className="ml-2">{getRoleIcon(member.role)}</div>
              </div>
              <p className="text-sm text-gray-500">{member.email}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <span>{member.email}</span>
            </div>
            {member.department && (
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-500" />
                <span>{member.department}</span>
              </div>
            )}
            {member.joinedAt && (
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-500" />
                <span>
                  Joined: {new Date(member.joinedAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDetailModal;
