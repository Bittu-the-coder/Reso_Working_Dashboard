import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Info,
  CheckCircle,
  ChevronRight,
  Mail,
  Search,
  BookOpen,
  Handshake,
  Megaphone,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { GlowingCard, TextGenerateEffect } from "../components/ui/aceternity";

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

  const pillars = [
    {
      title: "Research",
      description:
        "Conducting innovative research projects in emerging technologies",
      icon: <Search className="w-5 h-5" />,
      color: isDarkMode
        ? "bg-blue-900/30 text-blue-400 border-blue-800/50"
        : "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      title: "Education",
      description:
        "Creating learning resources and organizing workshops",
      icon: <BookOpen className="w-5 h-5" />,
      color: isDarkMode
        ? "bg-emerald-900/30 text-emerald-400 border-emerald-800/50"
        : "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      title: "Services",
      description:
        "Providing technical assistance to university departments and external organizations",
      icon: <Handshake className="w-5 h-5" />,
      color: isDarkMode
        ? "bg-amber-900/30 text-amber-400 border-amber-800/50"
        : "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      title: "Outreach",
      description:
        "Engaging with the community through tech events and knowledge-sharing initiatives",
      icon: <Megaphone className="w-5 h-5" />,
      color: isDarkMode
        ? "bg-rose-900/30 text-rose-400 border-rose-800/50"
        : "bg-rose-50 text-rose-700 border-rose-200",
    },
  ];

  return (
    <motion.main
      className="flex-grow max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 relative z-10"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <GlowingCard
        className={`${
          isDarkMode ? "!bg-slate-900 !border-slate-800" : "!bg-white !border-slate-200"
        } rounded-2xl p-8`}
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className={`p-3 ${
              isDarkMode ? "bg-blue-900/40" : "bg-blue-50"
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
              isDarkMode ? "text-slate-100" : "text-slate-900"
            }`}
          >
            About RESO
          </h2>
        </div>

        <motion.div className="space-y-6" variants={containerVariants}>
          <motion.p
            className={`${
              isDarkMode ? "text-slate-300" : "text-slate-600"
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
                  isDarkMode ? "bg-slate-800" : "bg-slate-100"
                }`}
              >
                <BookOpen
                  className={`w-5 h-5 ${
                    isDarkMode ? "text-slate-300" : "text-slate-600"
                  }`}
                />
              </div>
              <TextGenerateEffect
                words="Our Mission"
                className={`text-2xl ${
                  isDarkMode ? "text-slate-100" : "text-slate-900"
                }`}
              />
            </div>
            <p
              className={`${
                isDarkMode ? "text-slate-300" : "text-slate-600"
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
              <div
                className={`p-2 rounded-lg ${
                  isDarkMode ? "bg-slate-800" : "bg-slate-100"
                }`}
              >
                <CheckCircle
                  className={`w-5 h-5 ${
                    isDarkMode ? "text-slate-300" : "text-slate-600"
                  }`}
                />
              </div>
              <h2
                className={`text-2xl font-bold ${
                  isDarkMode ? "text-slate-100" : "text-slate-900"
                }`}
              >
                Key Pillars
              </h2>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {pillars.map((pillar) => (
                <motion.li
                  key={pillar.title}
                  className={`${pillar.color} border p-4 rounded-xl shadow-sm`}
                  whileHover={{
                    y: -5,
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    },
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {pillar.icon}
                    <h3 className="font-bold text-lg">{pillar.title}</h3>
                  </div>
                  <p className="text-sm opacity-80">{pillar.description}</p>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div className="mt-10" variants={itemVariants}>
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`p-2 rounded-lg ${
                  isDarkMode ? "bg-emerald-900/40" : "bg-emerald-50"
                }`}
              >
                <Mail
                  className={`w-5 h-5 ${
                    isDarkMode ? "text-emerald-400" : "text-emerald-600"
                  }`}
                />
              </div>
              <h2
                className={`text-2xl font-bold ${
                  isDarkMode ? "text-slate-100" : "text-slate-900"
                }`}
              >
                Join Us
              </h2>
            </div>
            <p
              className={`mb-6 ${
                isDarkMode ? "text-slate-300" : "text-slate-600"
              }`}
            >
              We're always looking for passionate individuals to join our team.
              Whether you're interested in research, education, or community
              outreach, there's a place for you at RESO.
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.a
                href="mailto:reso@mmmut.ac.in"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
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
                      ? "bg-slate-800 hover:bg-slate-700 text-white border-slate-700"
                      : "bg-white hover:bg-slate-50 text-slate-900 border-slate-200"
                  } px-5 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border`}
                >
                  Go to Dashboard
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </GlowingCard>
    </motion.main>
  );
};

export default LearnMorePage;
