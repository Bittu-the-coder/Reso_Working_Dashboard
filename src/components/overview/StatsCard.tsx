import { useTheme } from "../../contexts/ThemeContext";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { GlowingCard } from "../ui/aceternity";

interface StatsCardProps {
  title: string;
  icon: ReactNode;
  value: string | number;
  colorClass: string;
  bgColorClass: string;
  iconColorClass: string;
}

const StatsCard = ({
  title,
  icon,
  value,
  colorClass,
  bgColorClass,
  iconColorClass,
}: StatsCardProps) => {
  const { isDarkMode } = useTheme();

  return (
    <motion.div
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
      }}
    >
      <GlowingCard
        className={`p-6 ${
          isDarkMode
            ? "!bg-slate-900 !border-slate-800"
            : "!bg-white !border-slate-200"
        }`}
      >
        <div className="flex items-center z-10 relative">
          <div className={`p-3 rounded-xl ${bgColorClass} ${iconColorClass}`}>
            {icon}
          </div>
          <div className="ml-4">
            <p
              className={`text-sm font-medium ${
                isDarkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {title}
            </p>
            <p
              className={`text-2xl font-bold ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}
            >
              {value}
            </p>
          </div>
        </div>
      </GlowingCard>
    </motion.div>
  );
};

export default StatsCard;
