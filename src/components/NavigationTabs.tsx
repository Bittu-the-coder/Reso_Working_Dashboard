import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPieChart,
  FiCalendar,
  FiCode,
  FiFileText,
  FiSettings,
} from "react-icons/fi";

interface NavigationTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const navigate = useNavigate();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    navigate(`/dashboard?tab=${tab}`);
  };

  return (
    <div className="border-b border-white/20">
      <nav className="-mb-px flex space-x-8">
        <button
          onClick={() => handleTabChange("overview")}
          className={`${
            activeTab === "overview"
              ? "border-white text-white"
              : "border-transparent text-white/60 hover:text-white hover:border-white/60"
          } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
        >
          <FiPieChart className="mr-2" />
          Overview
        </button>
        <button
          onClick={() => handleTabChange("events")}
          className={`${
            activeTab === "events"
              ? "border-white text-white"
              : "border-transparent text-white/60 hover:text-white hover:border-white/60"
          } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
        >
          <FiCalendar className="mr-2" />
          Events
        </button>
        <button
          onClick={() => handleTabChange("projects")}
          className={`${
            activeTab === "projects"
              ? "border-white text-white"
              : "border-transparent text-white/60 hover:text-white hover:border-white/60"
          } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
        >
          <FiCode className="mr-2" />
          Projects
        </button>
        <button
          onClick={() => handleTabChange("tasks")}
          className={`${
            activeTab === "tasks"
              ? "border-white text-white"
              : "border-transparent text-white/60 hover:text-white hover:border-white/60"
          } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
        >
          <FiFileText className="mr-2" />
          Tasks
        </button>
        <button
          onClick={() => handleTabChange("docs")}
          className={`${
            activeTab === "docs"
              ? "border-white text-white"
              : "border-transparent text-white/60 hover:text-white hover:border-white/60"
          } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
        >
          <FiFileText className="mr-2" />
          Docs
        </button>
        <button
          onClick={() => handleTabChange("settings")}
          className={`${
            activeTab === "settings"
              ? "border-white text-white"
              : "border-transparent text-white/60 hover:text-white hover:border-white/60"
          } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
        >
          <FiSettings className="mr-2" />
          Settings
        </button>
      </nav>
    </div>
  );
};

export default NavigationTabs;
