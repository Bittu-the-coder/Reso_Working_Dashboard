import React, { useMemo } from "react";
import {
  BarChart3,
  Users,
  FileText,
  Settings,
  NotebookPen,
  CalendarDays,
  FolderKanban,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import DashboardRoutes from "./DashboardRoutes";

interface NavigationItem {
  name: string;
  icon: React.ReactNode;
  path: string;
  submenu?: { name: string; path: string }[];
}

const DashboardLayout: React.FC = () => {
  const { isDarkMode } = useTheme();

  // Navigation items with useMemo for optimization
  const navigationItems = useMemo<NavigationItem[]>(
    () => [
      { name: "Overview", icon: <BarChart3 size={20} />, path: "/dashboard" },
      { name: "Teams", icon: <Users size={20} />, path: "/dashboard/teams" },
      {
        name: "Events",
        icon: <CalendarDays size={20} />,
        path: "/dashboard/events",
      },
      {
        name: "Projects",
        icon: <FolderKanban size={20} />,
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
        isDarkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
      } relative overflow-hidden`}
    >
      {/* Background patterns */}
      <div className="absolute inset-0 dot-pattern opacity-20 pointer-events-none" />
      
      <div className="flex flex-1 relative z-10">
        <Sidebar navigationItems={navigationItems} />

        <main className="flex-1 px-4 py-8 md:p-8 lg:p-12 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <DashboardRoutes />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default DashboardLayout;
