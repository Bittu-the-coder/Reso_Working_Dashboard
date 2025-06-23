import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, ExternalLink, ChevronRight, Sparkles } from "lucide-react";
import { useTheme } from "../contexts/useTheme";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
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

const floatingAnimation = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

const HomePage: React.FC = () => {
  const { isDarkMode } = useTheme();

  return (
    <motion.div
      className="flex-grow max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 relative z-10"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Hero Section */}
      <motion.div
        className="flex flex-col lg:flex-row gap-8 mb-12"
        variants={itemVariants}
      >
        {/* Left side - Image */}
        <motion.div
          className="lg:w-1/2 h-64 lg:h-auto relative overflow-hidden rounded-2xl shadow-xl"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-purple-900/30 z-10 rounded-2xl"></div>
          <img
            src="https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Team working together"
            className="w-full h-full object-cover object-center rounded-2xl"
          />
          <motion.div
            className="absolute bottom-8 left-8 z-20"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              variants={floatingAnimation}
              animate="animate"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-full border border-blue-100 mb-4 shadow-md"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                Innovative Research & Education
              </span>
            </motion.div>
            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
              MMMUT RESO
            </h1>
            <p className="text-lg text-white drop-shadow-md">
              Research, Education, Services, Outreach
            </p>
          </motion.div>
        </motion.div>

        {/* Right side - Welcome Message */}
        <motion.div
          className="lg:w-1/2 flex flex-col justify-center"
          variants={itemVariants}
        >
          <motion.div
            className={`${
              isDarkMode
                ? "bg-gray-800/80 border-gray-700"
                : "bg-white/80 border-blue-100"
            } backdrop-blur-lg rounded-2xl p-8 border shadow-lg relative overflow-hidden`}
            whileHover={{
              boxShadow: "0 8px 30px rgba(59, 130, 246, 0.15)",
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="p-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full w-fit mb-6"
            >
              <Sparkles
                className={`w-6 h-6 ${
                  isDarkMode ? "text-blue-400" : "text-blue-600"
                }`}
              />
            </motion.div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
              Welcome to RESO Dashboard
            </h2>{" "}
            <p
              className={`text-lg mb-6 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Access all our resources, events, and project information in one
              place. Collaborate effectively with team members and track
              progress.
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 text-white px-5 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Go to Dashboard
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/learn-more"
                  className={`flex items-center gap-2 ${
                    isDarkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                      : "bg-white hover:bg-gray-50 text-gray-900 border-gray-200"
                  } px-5 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border`}
                >
                  Learn More
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </div>
            {/* Decorative Elements */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-200 rounded-full opacity-20" />
            <div className="absolute top-10 right-20 w-16 h-16 bg-blue-200 rounded-full opacity-30" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Featured Resources Section */}
      <motion.div className="mt-12" variants={itemVariants}>
        {" "}
        <div className="flex items-center gap-3 mb-6">
          <div
            className={`p-2 ${
              isDarkMode ? "bg-indigo-900" : "bg-indigo-100"
            } rounded-lg`}
          >
            <FileText
              className={`w-6 h-6 ${
                isDarkMode ? "text-indigo-400" : "text-indigo-600"
              }`}
            />
          </div>
          <h3
            className={`text-2xl font-bold ${
              isDarkMode ? "text-indigo-300" : "text-indigo-900"
            }`}
          >
            Featured Resources
          </h3>
        </div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          {/* Resource Card 1 */}
          <motion.div
            className={`${
              isDarkMode
                ? "bg-gray-800/80 border-gray-700"
                : "bg-white/80 border-blue-100"
            } backdrop-blur-lg border rounded-xl overflow-hidden shadow-lg relative`}
            variants={itemVariants}
            whileHover={{
              y: -5,
              boxShadow: "0 8px 30px rgba(59, 130, 246, 0.15)",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="p-6 relative z-10">
              <div className="flex items-center mb-4">
                <div
                  className={`p-2 rounded-full ${
                    isDarkMode
                      ? "bg-blue-900 text-blue-400"
                      : "bg-blue-100 text-blue-600"
                  } mr-3`}
                >
                  <FileText size={24} />
                </div>
                <h4
                  className={`text-xl font-semibold ${
                    isDarkMode ? "text-blue-300" : "text-blue-900"
                  }`}
                >
                  Research Papers
                </h4>
              </div>
              <p
                className={` mb-6 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Access our collection of research papers and publications from
                team members.
              </p>
              <Link
                to="/dashboard?tab=docs"
                className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                View Papers <ExternalLink className="ml-2 w-4 h-4" />
              </Link>
            </div>

            {/* Decorative corner elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-blue-400 rounded-tl-lg" />
            <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-blue-400 rounded-br-lg" />
          </motion.div>

          {/* Resource Card 2 */}
          <motion.div
            className={`${
              isDarkMode
                ? "bg-gray-800/80 border-gray-700"
                : "bg-white/80 border-purple-100"
            } backdrop-blur-lg border rounded-xl overflow-hidden shadow-lg relative`}
            variants={itemVariants}
            whileHover={{
              y: -5,
              boxShadow: "0 8px 30px rgba(139, 92, 246, 0.15)",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {" "}
            <div className="p-6 relative z-10">
              <div className="flex items-center mb-4">
                <div
                  className={`p-2 rounded-full ${
                    isDarkMode
                      ? "bg-purple-900 text-purple-400"
                      : "bg-purple-100 text-purple-600"
                  } mr-3`}
                >
                  <FileText size={24} />
                </div>
                <h4
                  className={`text-xl font-semibold ${
                    isDarkMode ? "text-purple-300" : "text-purple-900"
                  }`}
                >
                  Project Repository
                </h4>
              </div>
              <p
                className={`mb-6 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Explore our GitHub repositories and contribute to ongoing
                projects.
              </p>{" "}
              <Link
                to="/dashboard?tab=projects"
                className={`flex items-center font-medium ${
                  isDarkMode
                    ? "text-purple-400 hover:text-purple-300"
                    : "text-purple-600 hover:text-purple-800"
                }`}
              >
                View Projects <ExternalLink className="ml-2 w-4 h-4" />
              </Link>
            </div>
            {/* Decorative corner elements */}{" "}
            <div
              className={`absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 ${
                isDarkMode ? "border-purple-600" : "border-purple-400"
              } rounded-tl-lg`}
            />
            <div
              className={`absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 ${
                isDarkMode ? "border-purple-600" : "border-purple-400"
              } rounded-br-lg`}
            />
          </motion.div>

          {/* Resource Card 3 */}
          <motion.div
            className={`${
              isDarkMode
                ? "bg-gray-800/80 border-gray-700"
                : "bg-white/80 border-indigo-100"
            } backdrop-blur-lg border rounded-xl overflow-hidden shadow-lg relative`}
            variants={itemVariants}
            whileHover={{
              y: -5,
              boxShadow: "0 8px 30px rgba(79, 70, 229, 0.15)",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {" "}
            <div className="p-6 relative z-10">
              <div className="flex items-center mb-4">
                <div
                  className={`p-2 rounded-full ${
                    isDarkMode
                      ? "bg-indigo-900 text-indigo-400"
                      : "bg-indigo-100 text-indigo-600"
                  } mr-3`}
                >
                  <FileText size={24} />
                </div>
                <h4
                  className={`text-xl font-semibold ${
                    isDarkMode ? "text-indigo-300" : "text-indigo-900"
                  }`}
                >
                  Educational Materials
                </h4>
              </div>
              <p
                className={`mb-6 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Access tutorials, guides, and educational content created by our
                team.
              </p>{" "}
              <Link
                to="/dashboard?tab=docs"
                className={`flex items-center font-medium ${
                  isDarkMode
                    ? "text-indigo-400 hover:text-indigo-300"
                    : "text-indigo-600 hover:text-indigo-800"
                }`}
              >
                View Materials <ExternalLink className="ml-2 w-4 h-4" />
              </Link>
            </div>
            {/* Decorative corner elements */}{" "}
            <div
              className={`absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 ${
                isDarkMode ? "border-indigo-600" : "border-indigo-400"
              } rounded-tl-lg`}
            />
            <div
              className={`absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 ${
                isDarkMode ? "border-indigo-600" : "border-indigo-400"
              } rounded-br-lg`}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default HomePage;
