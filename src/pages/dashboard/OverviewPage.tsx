import { useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import StatsCard from "../../components/overview/StatsCard";
import RecentActivities from "../../components/overview/RecentActivities";
import ProjectStatus from "../../components/overview/ProjectStatus";
import RecentTasks from "../../components/overview/RecentTasks";
import { useEventStore } from "../../store/useEventStore";
import { useProjectStore } from "../../store/useProjectStore";
import { useTaskStore } from "../../store/useTaskStore";
import { FolderKanban, CalendarDays, FileText, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { TextGenerateEffect } from "../../components/ui/aceternity";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

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
      icon: <FolderKanban size={20} />,
      value: projects.length,
      colorClass: isDarkMode ? "text-blue-400" : "text-blue-600",
      bgColorClass: isDarkMode ? "bg-blue-900/30" : "bg-blue-50",
      iconColorClass: isDarkMode ? "text-blue-400" : "text-blue-600",
    },
    {
      title: "Upcoming Events",
      icon: <CalendarDays size={20} />,
      value: events.length,
      colorClass: isDarkMode ? "text-indigo-400" : "text-indigo-600",
      bgColorClass: isDarkMode ? "bg-indigo-900/30" : "bg-indigo-50",
      iconColorClass: isDarkMode ? "text-indigo-400" : "text-indigo-600",
    },
    {
      title: "Pending Tasks",
      icon: <FileText size={20} />,
      value: tasks.filter((t) => t.status !== "done").length,
      colorClass: isDarkMode ? "text-amber-400" : "text-amber-600",
      bgColorClass: isDarkMode ? "bg-amber-900/30" : "bg-amber-50",
      iconColorClass: isDarkMode ? "text-amber-400" : "text-amber-600",
    },
    {
      title: "Completed Tasks",
      icon: <CheckCircle2 size={20} />,
      value: tasks.filter((t) => t.status === "done").length,
      colorClass: isDarkMode ? "text-emerald-400" : "text-emerald-600",
      bgColorClass: isDarkMode ? "bg-emerald-900/30" : "bg-emerald-50",
      iconColorClass: isDarkMode ? "text-emerald-400" : "text-emerald-600",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <TextGenerateEffect 
          words="Dashboard Overview" 
          className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`} 
        />
        <p className={`mt-2 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
          Welcome back! Here's what's happening with your projects today.
        </p>
      </div>

      <motion.div 
        className="space-y-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivities events={events} />
          <ProjectStatus projects={projects} />
        </div>

        <RecentTasks tasks={tasks} />
      </motion.div>
    </div>
  );
};

export default OverviewPage;
