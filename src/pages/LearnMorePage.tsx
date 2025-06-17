import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Info, CheckCircle, ChevronRight, Mail, Sparkles } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

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

const rotatingAnimation = {
  animate: {
    rotate: 360,
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: "linear" as const,
    },
  },
};

const LearnMorePage: React.FC = () => {
  // Background Decorative Elements
  const BackgroundElements = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Rotating Diamonds */}
      <motion.div
        variants={rotatingAnimation}
        animate="animate"
        className="absolute -top-20 -left-20 hidden md:block"
      >
        <div className="w-32 h-32 bg-blue-400 opacity-5 rounded-md transform rotate-45" />
      </motion.div>

      <motion.div
        variants={rotatingAnimation}
        animate="animate"
        className="absolute top-1/4 right-10 hidden lg:block"
      >
        <div className="w-24 h-24 bg-purple-500 opacity-5 rounded-md transform rotate-45" />
      </motion.div>

      {/* Background Circles */}
      <div className="fixed -bottom-40 -right-20 w-96 h-96 bg-red-400 rounded-full opacity-5 hidden md:block" />

      {/* Pattern overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white/0 to-purple-50/50 opacity-80" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 flex flex-col overflow-hidden">
      <BackgroundElements />
      <Header />

      <motion.main
        className="flex-grow max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 relative z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div
          className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl border border-blue-100 shadow-lg relative overflow-hidden"
          variants={itemVariants}
          whileHover={{
            boxShadow: "0 8px 30px rgba(59, 130, 246, 0.15)",
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
              className="p-2 rounded-lg bg-blue-100"
            >
              <Info className="w-6 h-6 text-blue-600" />
            </motion.div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              About MMMUT RESO
            </h1>
          </div>

          <motion.div
            className="space-y-6 text-gray-700"
            variants={containerVariants}
          >
            <motion.p className="text-lg" variants={itemVariants}>
              MMMUT RESO (Research, Education, Services, and Outreach) is a
              student-led organization at Madan Mohan Malaviya University of
              Technology focused on advancing research and educational
              initiatives.
            </motion.p>

            <motion.div className="mt-10" variants={itemVariants}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-purple-100">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-purple-900">
                  Our Mission
                </h2>
              </div>
              <p className="text-gray-700">
                Our mission is to create a collaborative environment for
                students and faculty to engage in cutting-edge research, provide
                educational resources, and contribute to the technological
                advancement of society through innovative projects and outreach
                programs.
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
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-4 rounded-xl shadow-sm"
                  whileHover={{
                    y: -5,
                    boxShadow: "0 4px 20px rgba(59, 130, 246, 0.15)",
                  }}
                >
                  <h3 className="font-bold text-blue-800 text-lg mb-2">
                    Research
                  </h3>
                  <p className="text-blue-700">
                    Conducting innovative research projects in emerging
                    technologies
                  </p>
                </motion.li>

                <motion.li
                  className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 p-4 rounded-xl shadow-sm"
                  whileHover={{
                    y: -5,
                    boxShadow: "0 4px 20px rgba(79, 70, 229, 0.15)",
                  }}
                >
                  <h3 className="font-bold text-indigo-800 text-lg mb-2">
                    Education
                  </h3>
                  <p className="text-indigo-700">
                    Creating learning resources and organizing workshops
                  </p>
                </motion.li>

                <motion.li
                  className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 p-4 rounded-xl shadow-sm"
                  whileHover={{
                    y: -5,
                    boxShadow: "0 4px 20px rgba(139, 92, 246, 0.15)",
                  }}
                >
                  <h3 className="font-bold text-purple-800 text-lg mb-2">
                    Services
                  </h3>
                  <p className="text-purple-700">
                    Providing technical assistance to university departments and
                    external organizations
                  </p>
                </motion.li>

                <motion.li
                  className="bg-gradient-to-r from-pink-50 to-red-50 border border-pink-100 p-4 rounded-xl shadow-sm"
                  whileHover={{
                    y: -5,
                    boxShadow: "0 4px 20px rgba(219, 39, 119, 0.15)",
                  }}
                >
                  <h3 className="font-bold text-pink-800 text-lg mb-2">
                    Outreach
                  </h3>
                  <p className="text-pink-700">
                    Engaging with the community through tech events and
                    knowledge-sharing initiatives
                  </p>
                </motion.li>
              </ul>
            </motion.div>

            <motion.div className="mt-10" variants={itemVariants}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-green-100">
                  <Mail className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-green-800">Join Us</h2>
              </div>
              <p className="text-gray-700 mb-6">
                We're always looking for passionate individuals to join our
                team. Whether you're interested in research, education, or
                community outreach, there's a place for you at RESO.
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
                    className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-900 px-5 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
                  >
                    Go to Dashboard
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Decorative corner elements */}
          <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-blue-400 rounded-tl-lg" />
          <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-blue-400 rounded-tr-lg" />
          <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-blue-400 rounded-bl-lg" />
          <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-blue-400 rounded-br-lg" />
        </motion.div>
      </motion.main>

      <Footer />
    </div>
  );
};

export default LearnMorePage;
