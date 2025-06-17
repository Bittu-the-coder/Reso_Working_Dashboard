import React from "react";

interface Project {
  id: number;
  name: string;
  progress: number;
  members: number;
}

interface ProjectsProps {
  projects: Project[];
}

const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow border border-white/20">
        <h3 className="text-lg font-medium text-white mb-4">Active Projects</h3>
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="border border-white/20 rounded-lg p-4 hover:shadow-lg transition-shadow bg-white/5"
              >
                <div className="flex justify-between items-start">
                  <h4 className="text-lg font-medium text-white">
                    {project.name}
                  </h4>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-white/80 mb-1">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${
                        project.progress < 30
                          ? "bg-red-500"
                          : project.progress < 70
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="mt-4 text-sm text-white/80">
                  <span>{project.members} team members</span>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button className="text-sm text-white hover:text-white/80">
                    View Details
                  </button>
                  <button className="text-sm text-white/70 hover:text-white">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white/70">No projects found.</p>
        )}
      </div>
    </div>
  );
};

export default Projects;
