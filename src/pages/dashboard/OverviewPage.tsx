// pages/OverviewPage.js
import React, { useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
// import StatsCard from "../../components/overview/StatsCard";
// import RecentActivities from "../../components/overview/RecentActivities";
// import ProjectStatus from "../../components/overview/ProjectStatus";
import RecentTasks from "../../components/overview/RecentTasks";
import { useEventStore } from "../../store/useEventStore";
import { useProjectStore } from "../../store/useProjectStore";
import { useTaskStore } from "../../store/useTaskStore";
import { Code, Calendar, FileText, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const OverviewPage = () => {
  const { isDarkMode } = useTheme();
  const { events, getUserEvents } = useEventStore();
  const { projects, getUserProjects } = useProjectStore();
  const { tasks, getUserTasks } = useTaskStore();

  useEffect(() => {
    getUserEvents();
    getUserProjects();
    getUserTasks();
  }, [getUserEvents, getUserProjects, getUserTasks]);

  const stats = [
    {
      title: "Active Projects",
      icon: <Code className="w-5 h-5" />,
      value: projects.length,
      color: "from-blue-600 to-indigo-600",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
    },
    {
      title: "Upcoming Events",
      icon: <Calendar className="w-5 h-5" />,
      value: events.length,
      color: "from-indigo-600 to-purple-600",
      bgColor: "bg-indigo-100",
      textColor: "text-indigo-600",
    },
    {
      title: "Pending Tasks",
      icon: <FileText className="w-5 h-5" />,
      value: tasks.filter((t) => t.status === "pending").length,
      color: "from-purple-600 to-pink-600",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
    },
    {
      title: "Completed Tasks",
      icon: <CheckCircle className="w-5 h-5" />,
      value: tasks.filter((t) => t.status === "completed").length,
      color: "from-green-600 to-emerald-600",
      bgColor: "bg-green-100",
      textColor: "text-green-600",
    },
  ];

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="container mx-auto px-4 py-8">
        <motion.div className="space-y-6" initial="hidden" animate="visible">
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* {stats.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))} */}
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* <RecentActivities events={events} /> */}
            {/* <ProjectStatus projects={projects} /> */}
          </div>
          <RecentTasks tasks={tasks} />
        </motion.div>
      </div>
    </div>
  );
};

export default OverviewPage;
