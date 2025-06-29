import React from "react";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

const StatusBadge = ({ status, darkMode = false, className = "" }) => {
  const statusConfig = {
    Done: {
      icon: <CheckCircle className="w-4 h-4" />,
      bgColor: darkMode ? "bg-green-900/30" : "bg-green-50",
      textColor: darkMode ? "text-green-300" : "text-green-800",
    },
    "In Progress": {
      icon: <Clock className="w-4 h-4" />,
      bgColor: darkMode ? "bg-blue-900/30" : "bg-blue-50",
      textColor: darkMode ? "text-blue-300" : "text-blue-800",
    },
    "To Do": {
      icon: <AlertCircle className="w-4 h-4" />,
      bgColor: darkMode ? "bg-yellow-900/30" : "bg-yellow-50",
      textColor: darkMode ? "text-yellow-300" : "text-yellow-800",
    },
  };

  const config = statusConfig[status] || statusConfig["To Do"];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor} ${className}`}
    >
      {config.icon}
      {status}
    </span>
  );
};

export default StatusBadge;
