import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText,
  ExternalLink,
  ChevronRight,
  BookOpen,
  Code2,
  GraduationCap,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import {
  Spotlight,
  TextGenerateEffect,
  GlowingCard,
} from "../components/ui/aceternity";

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

const HomePage: React.FC = () => {
  const { isDarkMode } = useTheme();

  return (
    <motion.div
      className="flex-grow max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 relative z-10"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Spotlight Effect */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill={isDarkMode ? "#1e40af" : "#3b82f6"}
      />

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
          <div className="absolute inset-0 bg-slate-900/30 z-10 rounded-2xl"></div>
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
              animate={{
                y: [0, -6, 0],
                transition: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
              className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200 mb-4 shadow-md"
            >
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-slate-800">
                Innovative Research & Education
              </span>
            </motion.div>
            <h1 className="text-3xl font-bold text-white shadow-text mb-2">
              MMMUT RESO Research Organization
            </h1>
            <p className="text-white text-lg shadow-text">
              Empowering researchers, educators, and students
            </p>
          </motion.div>
        </motion.div>

        {/* Right side - Welcome Message */}
        <motion.div
          className="lg:w-1/2 flex flex-col justify-center"
          variants={itemVariants}
        >
          <GlowingCard
            className={`${
              isDarkMode ? "!bg-slate-900 !border-slate-800" : "!bg-white !border-slate-200"
            } rounded-2xl p-8`}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`p-3 ${
                isDarkMode ? "bg-blue-900/40" : "bg-blue-50"
              } rounded-full w-fit mb-6`}
            >
              <BookOpen
                className={`w-6 h-6 ${
                  isDarkMode ? "text-blue-400" : "text-blue-600"
                }`}
              />
            </motion.div>

            <TextGenerateEffect
              words="Welcome to RESO Dashboard"
              className={`text-3xl mb-6 ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}
            />

            <p
              className={`text-lg mb-6 ${
                isDarkMode ? "text-slate-300" : "text-slate-600"
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
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
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
                      ? "bg-slate-800 hover:bg-slate-700 text-white border-slate-700"
                      : "bg-white hover:bg-slate-50 text-slate-900 border-slate-200"
                  } px-5 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border`}
                >
                  Learn More
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </div>
          </GlowingCard>
        </motion.div>
      </motion.div>

      {/* Featured Resources Section */}
      <motion.div className="mt-12" variants={itemVariants}>
        <div className="flex items-center gap-3 mb-6">
          <div
            className={`p-2 ${
              isDarkMode ? "bg-blue-900/40" : "bg-blue-50"
            } rounded-lg`}
          >
            <FileText
              className={`w-6 h-6 ${
                isDarkMode ? "text-blue-400" : "text-blue-600"
              }`}
            />
          </div>
          <h3
            className={`text-2xl font-bold ${
              isDarkMode ? "text-slate-100" : "text-slate-900"
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
          <motion.div variants={itemVariants}>
            <GlowingCard
              className={`h-full ${
                isDarkMode ? "!bg-slate-900 !border-slate-800" : "!bg-white !border-slate-200"
              }`}
            >
              <div className="flex items-center mb-4">
                <div
                  className={`p-2 rounded-full ${
                    isDarkMode
                      ? "bg-blue-900/40 text-blue-400"
                      : "bg-blue-50 text-blue-600"
                  } mr-3`}
                >
                  <FileText size={24} />
                </div>
                <h4
                  className={`text-xl font-semibold ${
                    isDarkMode ? "text-slate-100" : "text-slate-900"
                  }`}
                >
                  Research Papers
                </h4>
              </div>
              <p
                className={`mb-6 ${
                  isDarkMode ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Access our collection of research papers and publications from
                team members.
              </p>
              <Link
                to="/dashboard?tab=docs"
                className={`flex items-center font-medium ${
                  isDarkMode
                    ? "text-blue-400 hover:text-blue-300"
                    : "text-blue-600 hover:text-blue-700"
                }`}
              >
                View Papers <ExternalLink className="ml-2 w-4 h-4" />
              </Link>
            </GlowingCard>
          </motion.div>

          {/* Resource Card 2 */}
          <motion.div variants={itemVariants}>
            <GlowingCard
              className={`h-full ${
                isDarkMode ? "!bg-slate-900 !border-slate-800" : "!bg-white !border-slate-200"
              }`}
            >
              <div className="flex items-center mb-4">
                <div
                  className={`p-2 rounded-full ${
                    isDarkMode
                      ? "bg-emerald-900/40 text-emerald-400"
                      : "bg-emerald-50 text-emerald-600"
                  } mr-3`}
                >
                  <Code2 size={24} />
                </div>
                <h4
                  className={`text-xl font-semibold ${
                    isDarkMode ? "text-slate-100" : "text-slate-900"
                  }`}
                >
                  Project Repository
                </h4>
              </div>
              <p
                className={`mb-6 ${
                  isDarkMode ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Explore our GitHub repositories and contribute to ongoing
                projects.
              </p>
              <Link
                to="/dashboard?tab=projects"
                className={`flex items-center font-medium ${
                  isDarkMode
                    ? "text-emerald-400 hover:text-emerald-300"
                    : "text-emerald-600 hover:text-emerald-700"
                }`}
              >
                View Projects <ExternalLink className="ml-2 w-4 h-4" />
              </Link>
            </GlowingCard>
          </motion.div>

          {/* Resource Card 3 */}
          <motion.div variants={itemVariants}>
            <GlowingCard
              className={`h-full ${
                isDarkMode ? "!bg-slate-900 !border-slate-800" : "!bg-white !border-slate-200"
              }`}
            >
              <div className="flex items-center mb-4">
                <div
                  className={`p-2 rounded-full ${
                    isDarkMode
                      ? "bg-amber-900/40 text-amber-400"
                      : "bg-amber-50 text-amber-600"
                  } mr-3`}
                >
                  <GraduationCap size={24} />
                </div>
                <h4
                  className={`text-xl font-semibold ${
                    isDarkMode ? "text-slate-100" : "text-slate-900"
                  }`}
                >
                  Educational Materials
                </h4>
              </div>
              <p
                className={`mb-6 ${
                  isDarkMode ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Access tutorials, guides, and educational content created by our
                team.
              </p>
              <Link
                to="/dashboard?tab=docs"
                className={`flex items-center font-medium ${
                  isDarkMode
                    ? "text-amber-400 hover:text-amber-300"
                    : "text-amber-600 hover:text-amber-700"
                }`}
              >
                View Materials <ExternalLink className="ml-2 w-4 h-4" />
              </Link>
            </GlowingCard>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default HomePage;
