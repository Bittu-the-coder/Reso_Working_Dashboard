// pages/ProjectsPage.js
import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import ProjectForm from "../../components/projects/ProjectForm";
import ProjectDetails from "../../components/projects/ProjectDetails";
import { useProjectStore } from "../../store/useProjectStore";
import Projects from "../../../backend/backup/unused/Projects";

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
  } = useProjectStore();

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    getUserProjects();
  }, [getUserProjects]);

  const handleCreateOrUpdate = async (projectData) => {
    if (currentProject) {
      await updateProject(currentProject._id, projectData);
    } else {
      await createProject("teamId", projectData);
    }
    setShowForm(false);
    clearCurrentProject();
    await getUserProjects();
  };

  const handleViewDetails = (project) => {
    // Set the current project to view details
    // This would typically involve setting state in the store
  };

  const handleDelete = async (projectId) => {
    await deleteProject(projectId);
    await getUserProjects();
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Projects</h1>
          <button
            onClick={() => {
              setShowForm(true);
              clearCurrentProject();
            }}
            className={`px-4 py-2 rounded ${
              isDarkMode
                ? "bg-blue-600 hover:bg-blue-500"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
          >
            Create Project
          </button>
        </div>
        {showForm && (
          <ProjectForm
            project={currentProject}
            onSubmit={handleCreateOrUpdate}
          />
        )}
        <Projects
          projects={projects}
          onViewDetails={handleViewDetails}
          onDelete={handleDelete}
        />
        {currentProject && (
          <ProjectDetails
            project={currentProject}
            onClose={() => clearCurrentProject()}
          />
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
