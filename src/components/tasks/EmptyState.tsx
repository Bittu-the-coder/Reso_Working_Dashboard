import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  darkMode?: boolean;
  small?: boolean;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  darkMode = false,
  small = false,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-6 rounded-xl text-center ${
        darkMode ? "bg-gray-800" : "bg-white"
      } ${small ? "py-4" : "py-8"} ${className}`}
    >
      <div
        className={`flex items-center justify-center ${
          small ? "w-8 h-8 mb-2" : "w-12 h-12 mb-4"
        } ${darkMode ? "text-gray-400" : "text-gray-500"}`}
      >
        {icon}
      </div>
      <h3
        className={`${small ? "text-lg" : "text-xl"} font-semibold mb-1 ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        {title}
      </h3>
      <p
        className={`${small ? "text-sm" : "text-base"} mb-4 ${
          darkMode ? "text-gray-400" : "text-gray-600"
        }`}
      >
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
