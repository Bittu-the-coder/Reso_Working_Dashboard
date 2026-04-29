import { AnimatePresence, motion } from "framer-motion";
import { Filter, FolderKanban, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ProjectDetails from "../../components/projects/ProjectDetails";
import ProjectForm from "../../components/projects/ProjectForm";
import Projects from "../../components/projects/Projects";
import { GlowingCard, TextGenerateEffect } from "../../components/ui/aceternity";
import { useTheme } from "../../contexts/ThemeContext";
import { useProjectStore } from "../../store/useProjectStore";
import { useTeamStore } from "../../store/useTeamStore";

const ProjectsPage = () => {
  const { isDarkMode } = useTheme();
  const {
    projects,
    currentProject,
    getUserProjects,
    createProject,
    updateProject,
    deleteProject,
    clearCurrentProject,
    getProjectById
  } = useProjectStore();

  const { teams, getMyTeams } = useTeamStore();

  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getUserProjects();
    getMyTeams();
  }, [getUserProjects, getMyTeams]);

  const handleCreateOrUpdate = async (projectData: any) => {
    try {
      if (currentProject) {
        await updateProject(currentProject._id, projectData);
        toast.success("Project updated!");
      } else {
        // Use the first available team ID or a fallback
        const teamId = teams.length > 0 ? teams[0]._id : "general";
        
        if (teamId === "general") {
          toast.error("Please create a team first before creating a project");
          return;
        }

        await createProject(teamId, projectData);
        toast.success("Project created!");
      }
      setShowForm(false);
      clearCurrentProject();
      getUserProjects();
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const handleViewDetails = async (project: any) => {
    await getProjectById(project._id);
  };

  const handleDelete = async (projectId: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      await deleteProject(projectId);
      toast.success("Project deleted");
    }
  };

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isDarkMode ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-600"}`}>
              <FolderKanban size={24} />
            </div>
            <TextGenerateEffect
              words="Project Management"
              className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}
            />
          </div>
          <p className={`mt-2 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
            Track and manage all your active projects and milestones.
          </p>
        </div>

        <button
          onClick={() => {
            clearCurrentProject();
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all"
        >
          <Plus size={18} />
          New Project
        </button>
      </div>

      {/* Stats/Filter Bar */}
      <GlowingCard className={`${isDarkMode ? "!bg-slate-900/50 !border-slate-800" : "!bg-white !border-slate-200"} p-4`}>
        <div className="flex flex-col md:flex-row gap-4 relative z-10">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-xl border outline-none transition-all ${
                isDarkMode
                  ? "bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                  : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500"
              }`}
            />
          </div>
          <div className="flex gap-2">
            <button className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-sm transition-all ${
              isDarkMode ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}>
              <Filter size={16} />
              Filters
            </button>
          </div>
        </div>
      </GlowingCard>

      {/* Projects List */}
      <Projects
        projects={filteredProjects}
        onViewDetails={handleViewDetails}
        onDelete={handleDelete}
      />

      {/* Project Form Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-xl relative z-10"
            >
              <ProjectForm
                project={currentProject}
                onSubmit={handleCreateOrUpdate}
                onCancel={() => setShowForm(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Project Details Modal */}
      <AnimatePresence>
        {currentProject && !showForm && (
          <ProjectDetails
            project={currentProject}
            onClose={() => clearCurrentProject()}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectsPage;
