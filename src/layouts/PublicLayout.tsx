import Header from "../components/Header";
import Footer from "../components/Footer";
import { useTheme } from "../contexts/ThemeContext";
import { motion } from "framer-motion";

interface PublicLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({
  children,
  showFooter = true,
}) => {
  const { isDarkMode } = useTheme();

  // Background Decorative Elements
  const BackgroundElements = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Rotating Diamonds */}
      <motion.div
        animate={{
          rotate: 360,
          transition: { duration: 20, repeat: Infinity, ease: "linear" },
        }}
        className="absolute -top-20 -left-20 hidden md:block"
      >
        <div
          className={`w-32 h-32 ${
            isDarkMode ? "bg-blue-600 opacity-10" : "bg-blue-400 opacity-5"
          } rounded-md transform rotate-45`}
        />
      </motion.div>

      <motion.div
        animate={{
          rotate: 360,
          transition: { duration: 20, repeat: Infinity, ease: "linear" },
        }}
        className="absolute top-1/4 right-10 hidden lg:block"
      >
        <div
          className={`w-24 h-24 ${
            isDarkMode ? "bg-purple-700 opacity-10" : "bg-purple-500 opacity-5"
          } rounded-md transform rotate-45`}
        />
      </motion.div>

      {/* Background Circles */}
      <div
        className={`fixed -bottom-40 -right-20 w-96 h-96 ${
          isDarkMode ? "bg-red-600 opacity-10" : "bg-red-400 opacity-5"
        } rounded-full hidden md:block`}
      />

      {/* Pattern overlay */}
      <div
        className={`absolute inset-0 ${
          isDarkMode
            ? "bg-gradient-to-br from-blue-950/30 via-transparent to-purple-950/30"
            : "bg-gradient-to-br from-blue-50/50 via-white/0 to-purple-50/50"
        } opacity-80`}
      />
    </div>
  );

  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-950"
          : "bg-gradient-to-br from-blue-50 via-white to-pink-50"
      } flex flex-col overflow-hidden`}
    >
      <BackgroundElements />
      <Header />

      <main className="flex-grow relative z-10">{children}</main>

      {showFooter && <Footer />}
    </div>
  );
};

export default PublicLayout;
