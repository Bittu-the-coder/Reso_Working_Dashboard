import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Info, CheckCircle, ChevronRight, Mail, Sparkles } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

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

const LearnMorePage: React.FC = () => {
  const { isDarkMode } = useTheme();

  return (
    <motion.main
      className="flex-grow max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 relative z-10"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className={`${
          isDarkMode
            ? "bg-gray-800/80 backdrop-blur-lg border-gray-700"
            : "bg-white/80 backdrop-blur-lg border-blue-100"
        } p-8 rounded-2xl border shadow-lg relative overflow-hidden`}
        variants={itemVariants}
        whileHover={{
          boxShadow: `0 8px 30px ${
            isDarkMode ? "rgba(59, 130, 246, 0.2)" : "rgba(59, 130, 246, 0.15)"
          }`,
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className={`p-3 ${
              isDarkMode ? "bg-blue-900" : "bg-blue-100"
            } rounded-full`}
          >
            <Info
              className={`w-6 h-6 ${
                isDarkMode ? "text-blue-400" : "text-blue-600"
              }`}
            />
          </div>
          <h2
            className={`text-2xl font-bold ${
              isDarkMode ? "text-blue-400" : "text-blue-900"
            }`}
          >
            About RESO
          </h2>
        </div>

        <motion.div className="space-y-6" variants={containerVariants}>
          <motion.p
            className={`${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            } leading-relaxed`}
            variants={itemVariants}
          >
            RESO (Research, Education, Services, Outreach) is a dynamic research
            group at Madan Mohan Malaviya University of Technology (MMMUT)
            dedicated to advancing knowledge and fostering innovation across
            multiple disciplines.
          </motion.p>

          <motion.div className="mt-10" variants={itemVariants}>
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`p-2 rounded-lg ${
                  isDarkMode ? "bg-purple-900" : "bg-purple-100"
                }`}
              >
                <Sparkles
                  className={`w-5 h-5 ${
                    isDarkMode ? "text-purple-400" : "text-purple-600"
                  }`}
                />
              </div>
              <h2
                className={`text-2xl font-bold ${
                  isDarkMode ? "text-purple-300" : "text-purple-900"
                }`}
              >
                Our Mission
              </h2>
            </div>
            <p
              className={`${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              } leading-relaxed`}
            >
              Our mission is to create a collaborative environment that enables
              students, researchers, and faculty to pursue groundbreaking
              research, provide educational resources, deliver valuable
              services, and engage in meaningful outreach activities.
            </p>
          </motion.div>

          <motion.div className="mt-10" variants={itemVariants}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-indigo-100">
                <CheckCircle className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-indigo-900">
                Key Pillars
              </h2>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <motion.li
                className={`${
                  isDarkMode
                    ? "bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border-blue-800"
                    : "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100"
                } border p-4 rounded-xl shadow-sm`}
                whileHover={{
                  y: -5,
                  boxShadow: `0 4px 20px ${
                    isDarkMode
                      ? "rgba(59, 130, 246, 0.2)"
                      : "rgba(59, 130, 246, 0.15)"
                  }`,
                }}
              >
                <h3
                  className={`font-bold ${
                    isDarkMode ? "text-blue-300" : "text-blue-800"
                  } text-lg mb-2`}
                >
                  Research
                </h3>
                <p
                  className={`${
                    isDarkMode ? "text-blue-200" : "text-blue-700"
                  }`}
                >
                  Conducting innovative research projects in emerging
                  technologies
                </p>
              </motion.li>

              <motion.li
                className={`${
                  isDarkMode
                    ? "bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border-indigo-800"
                    : "bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-100"
                } border p-4 rounded-xl shadow-sm`}
                whileHover={{
                  y: -5,
                  boxShadow: `0 4px 20px ${
                    isDarkMode
                      ? "rgba(79, 70, 229, 0.2)"
                      : "rgba(79, 70, 229, 0.15)"
                  }`,
                }}
              >
                <h3
                  className={`font-bold ${
                    isDarkMode ? "text-indigo-300" : "text-indigo-800"
                  } text-lg mb-2`}
                >
                  Education
                </h3>
                <p
                  className={`${
                    isDarkMode ? "text-indigo-200" : "text-indigo-700"
                  }`}
                >
                  Creating learning resources and organizing workshops
                </p>
              </motion.li>

              <motion.li
                className={`${
                  isDarkMode
                    ? "bg-gradient-to-r from-purple-900/40 to-pink-900/40 border-purple-800"
                    : "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100"
                } border p-4 rounded-xl shadow-sm`}
                whileHover={{
                  y: -5,
                  boxShadow: `0 4px 20px ${
                    isDarkMode
                      ? "rgba(139, 92, 246, 0.2)"
                      : "rgba(139, 92, 246, 0.15)"
                  }`,
                }}
              >
                <h3
                  className={`font-bold ${
                    isDarkMode ? "text-purple-300" : "text-purple-800"
                  } text-lg mb-2`}
                >
                  Services
                </h3>
                <p
                  className={`${
                    isDarkMode ? "text-purple-200" : "text-purple-700"
                  }`}
                >
                  Providing technical assistance to university departments and
                  external organizations
                </p>
              </motion.li>

              <motion.li
                className={`${
                  isDarkMode
                    ? "bg-gradient-to-r from-pink-900/40 to-red-900/40 border-pink-800"
                    : "bg-gradient-to-r from-pink-50 to-red-50 border-pink-100"
                } border p-4 rounded-xl shadow-sm`}
                whileHover={{
                  y: -5,
                  boxShadow: `0 4px 20px ${
                    isDarkMode
                      ? "rgba(219, 39, 119, 0.2)"
                      : "rgba(219, 39, 119, 0.15)"
                  }`,
                }}
              >
                <h3
                  className={`font-bold ${
                    isDarkMode ? "text-pink-300" : "text-pink-800"
                  } text-lg mb-2`}
                >
                  Outreach
                </h3>
                <p
                  className={`${
                    isDarkMode ? "text-pink-200" : "text-pink-700"
                  }`}
                >
                  Engaging with the community through tech events and
                  knowledge-sharing initiatives
                </p>
              </motion.li>
            </ul>
          </motion.div>

          <motion.div className="mt-10" variants={itemVariants}>
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`p-2 rounded-lg ${
                  isDarkMode ? "bg-green-900" : "bg-green-100"
                }`}
              >
                <Mail
                  className={`w-5 h-5 ${
                    isDarkMode ? "text-green-400" : "text-green-600"
                  }`}
                />
              </div>
              <h2
                className={`text-2xl font-bold ${
                  isDarkMode ? "text-green-300" : "text-green-800"
                }`}
              >
                Join Us
              </h2>
            </div>
            <p
              className={`mb-6 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              We're always looking for passionate individuals to join our team.
              Whether you're interested in research, education, or community
              outreach, there's a place for you at RESO.
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.a
                href="mailto:reso@mmmut.ac.in"
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 text-white px-5 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Us
                <Mail className="w-5 h-5" />
              </motion.a>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-2 ${
                    isDarkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                      : "bg-white hover:bg-gray-50 text-gray-900 border-gray-200"
                  } px-5 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border`}
                >
                  Go to Dashboard
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.main>
  );
};

export default LearnMorePage;
