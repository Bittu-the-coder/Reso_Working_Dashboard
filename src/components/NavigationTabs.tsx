import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart3,
  CalendarClock,
  Code,
  FileText,
  Settings,
  NotebookPen,
  Users,
} from "lucide-react";

interface NavigationTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface TabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
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
  const tabs: TabItem[] = [
    { id: "overview", label: "Overview", icon: <BarChart3 size={18} /> },
    { id: "teams", label: "Teams", icon: <Users size={18} /> },
    { id: "events", label: "Events", icon: <CalendarClock size={18} /> },
    { id: "projects", label: "Projects", icon: <Code size={18} /> },
    { id: "tasks", label: "Tasks", icon: <FileText size={18} /> },
    { id: "docs", label: "Docs", icon: <NotebookPen size={18} /> },
    { id: "settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
      },
    },
  };

  return (
    <div className="border-b border-blue-100 bg-white/70 backdrop-blur-sm rounded-lg shadow-sm mb-6">
      <motion.nav
        className="flex flex-wrap gap-2 sm:gap-4 md:gap-8 px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`
              relative whitespace-nowrap py-4 px-3 font-medium text-sm flex items-center gap-2
              ${
                activeTab === tab.id
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }
              transition-colors duration-300
            `}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span
              className={
                activeTab === tab.id ? "text-blue-600" : "text-gray-500"
              }
            >
              {tab.icon}
            </span>
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-purple-600"
                layoutId="underline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </motion.nav>
    </div>
  );
};

export default NavigationTabs;
