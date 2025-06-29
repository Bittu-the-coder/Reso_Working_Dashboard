import React from "react";

const LoadingSpinner = ({ darkMode = false, size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-b-2",
    lg: "h-12 w-12 border-b-2",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full ${
          darkMode ? "border-blue-400" : "border-blue-600"
        } ${sizeClasses[size]}`}
      />
    </div>
  );
};

export default LoadingSpinner;
