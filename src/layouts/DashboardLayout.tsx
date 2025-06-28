import React, { useMemo } from "react";
import {
  BarChart3,
  Users,
  CalendarClock,
  FileText,
  Settings,
  Code,
  NotebookPen,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import DashboardRoutes from "./DashboardRoutes";

const DashboardLayout: React.FC = () => {
  const { isDarkMode } = useTheme();

  // Navigation items with useMemo for optimization
  const navigationItems = useMemo(
    () => [
      { name: "Overview", icon: <BarChart3 size={20} />, path: "/dashboard" },
      { name: "Teams", icon: <Users size={20} />, path: "/dashboard/teams" },
      {
        name: "Events",
        icon: <CalendarClock size={20} />,
        path: "/dashboard/events",
      },
      {
        name: "Projects",
        icon: <Code size={20} />,
        path: "/dashboard/projects",
      },
      { name: "Tasks", icon: <FileText size={20} />, path: "/dashboard/tasks" },
      {
        name: "Documents",
        icon: <NotebookPen size={20} />,
        path: "/dashboard/documents",
      },
      {
        name: "Settings",
        icon: <Settings size={20} />,
        path: "/dashboard/settings",
      },
    ],
    []
  );

  return (
    <div
      className={`flex flex-col min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="flex flex-1">
        <Sidebar navigationItems={navigationItems} />

        <div className="flex-1 px-4 py-8 md:p-8 overflow-y-auto">
          <div className="mt-6">
            <DashboardRoutes />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DashboardLayout;
