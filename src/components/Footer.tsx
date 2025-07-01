import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { isDarkMode } = useTheme();

  return (
    <motion.footer
      className={`border-t ${
        isDarkMode
          ? "border-gray-700 bg-gray-800/50"
          : "border-blue-100 bg-white/50"
      } mt-8 backdrop-blur-sm`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <motion.div
          className={`flex justify-center items-center gap-2 text-center text-sm ${
            isDarkMode ? "text-blue-400" : "text-blue-600"
          }`}
          whileHover={{ scale: 1.02 }}
        >
          <span>&copy; {currentYear} MMMUT RESO.</span>
          <div className="flex items-center">
            <span>Made with</span>
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="inline-block mx-1"
            >
              <Heart size={14} className="text-red-500 fill-red-500" />
            </motion.div>
          </div>
          <span>All rights reserved.</span>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
