import { Routes, Route } from "react-router-dom";
import OverviewPage from "../pages/dashboard/OverviewPage";
import TeamsPage from "../pages/dashboard/TeamsPage";
import TeamManagementPage from "../pages/dashboard/TeamManagementPage";
// import EventsPage from "../pages/dashboard/EventsPage";
// import ProjectsPage from "../pages/dashboard/ProjectsPage";
import TasksPage from "../pages/dashboard/TasksPage";
import SettingsPage from "../pages/dashboard/SettingsPage";
import DocumentsPage from "../pages/dashboard/DocumentsPage";
import ProfilePage from "../pages/dashboard/ProfilePage";
import TaskManagementPage from "../pages/dashboard/TaskManagementPage";

// No need for props as each page component manages its own state
const DashboardRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<OverviewPage />} />
      <Route path="/teams" element={<TeamsPage />} />
      <Route path="/teams/:teamId" element={<TeamManagementPage />} />
      {/* <Route path="/events" element={<EventsPage />} />
      <Route path="/projects" element={<ProjectsPage />} /> */}
      <Route path="/tasks" element={<TasksPage />} />
      <Route path="/tasks/:taskId" element={<TaskManagementPage />} />
      <Route path="/documents" element={<DocumentsPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
};

export default DashboardRoutes;
