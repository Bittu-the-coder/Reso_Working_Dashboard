import React from "react";

type Priority = "High" | "Medium" | "Low" | string;

interface PriorityBadgeProps {
  priority: Priority;
  darkMode?: boolean;
  className?: string;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  darkMode = false,
  className = "",
}) => {
  const priorityConfig = {
    High: {
      bgColor: darkMode ? "bg-red-900/30" : "bg-red-50",
      textColor: darkMode ? "text-red-300" : "text-red-800",
    },
    Medium: {
      bgColor: darkMode ? "bg-yellow-900/30" : "bg-yellow-50",
      textColor: darkMode ? "text-yellow-300" : "text-yellow-800",
    },
    Low: {
      bgColor: darkMode ? "bg-green-900/30" : "bg-green-50",
      textColor: darkMode ? "text-green-300" : "text-green-800",
    },
  };

  const config = priorityConfig[priority as keyof typeof priorityConfig] || {
    bgColor: darkMode ? "bg-gray-700" : "bg-gray-100",
    textColor: darkMode ? "text-gray-300" : "text-gray-800",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor} ${className}`}
    >
      {priority || "Not set"}
    </span>
  );
};

export default PriorityBadge;
