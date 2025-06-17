import React from "react";
import { motion } from "framer-motion";
import { Code, ChevronRight, Users, Edit } from "lucide-react";

interface Project {
  id: number;
  name: string;
  progress: number;
  members: number;
}

interface ProjectsProps {
  projects: Project[];
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
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

const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  const progressColorClass = (progress: number) => {
    if (progress < 30) return "from-red-500 to-red-600";
    if (progress < 70) return "from-yellow-500 to-orange-500";
    return "from-green-500 to-emerald-500";
  };

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-blue-100 relative overflow-hidden"
        variants={itemVariants}
        whileHover={{
          boxShadow: "0 8px 30px rgba(59, 130, 246, 0.15)",
        }}
      >
        <div className="flex items-center gap-3 mb-6 z-10 relative">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Code className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-blue-900">Active Projects</h3>
        </div>

        {projects.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 z-10 relative"
            variants={containerVariants}
          >
            {projects.map((project) => (
              <motion.div
                key={project.id}
                className="border border-blue-100 rounded-xl p-5 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 shadow-sm relative overflow-hidden"
                variants={itemVariants}
                whileHover={{
                  y: -5,
                  boxShadow: "0 8px 30px rgba(59, 130, 246, 0.15)",
                  transition: { type: "spring", stiffness: 300, damping: 20 },
                }}
              >
                <div className="flex justify-between items-start">
                  <h4 className="text-lg font-bold text-blue-900">
                    {project.name}
                  </h4>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-blue-700 font-medium">Progress</span>
                    <span className="text-blue-900 font-bold">
                      {project.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <motion.div
                      className={`h-2.5 rounded-full bg-gradient-to-r ${progressColorClass(
                        project.progress
                      )}`}
                      style={{ width: "0%" }}
                      animate={{ width: `${project.progress}%` }}
                      transition={{
                        duration: 1,
                        delay: 0.2,
                        ease: "easeOut",
                      }}
                    ></motion.div>
                  </div>
                </div>
                <div className="mt-4 text-sm text-blue-700 flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{project.members} team members</span>
                </div>
                <div className="mt-4 flex space-x-3">
                  <motion.button
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                    whileHover={{ x: 2 }}
                  >
                    View Details <ChevronRight className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                    whileHover={{ x: 2 }}
                  >
                    Edit <Edit className="w-4 h-4" />
                  </motion.button>
                </div>

                {/* Decorative corner elements */}
                <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-blue-300 rounded-tr-lg" />
                <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-blue-300 rounded-bl-lg" />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-12 bg-blue-50/50 rounded-xl border border-blue-100"
            variants={itemVariants}
          >
            <Code className="w-16 h-16 mx-auto text-blue-300 mb-4" />
            <p className="text-blue-700">No projects found.</p>
            <motion.button
              className="mt-4 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-lg mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add Your First Project
            </motion.button>
          </motion.div>
        )}

        {/* Decorative corner elements */}
        <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-blue-400 rounded-tl-lg" />
        <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-blue-400 rounded-tr-lg" />
        <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-blue-400 rounded-bl-lg" />
        <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-blue-400 rounded-br-lg" />

        {/* Decorative Elements */}
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-200 rounded-full opacity-10" />
      </motion.div>
    </motion.div>
  );
};

export default Projects;
