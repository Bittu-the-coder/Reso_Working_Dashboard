import { motion } from "framer-motion";
import {
  Bell,
  Database,
  Globe,
  Mail,
  Monitor,
  Moon,
  Save,
  Settings as SettingsIcon,
  Shield,
  Sun,
  User,
} from "lucide-react";
import React, { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { GlowingCard, TextGenerateEffect } from "./ui/aceternity";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

const Settings: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [dataSharing, setDataSharing] = useState(true);

  const settingCategories = [
    {
      name: "Appearance",
      icon: <Monitor size={20} />,
      colorClass: isDarkMode ? "bg-blue-900/30 text-blue-400" : "bg-blue-50 text-blue-600",
      settings: [
        {
          id: "dark-mode",
          label: "Dark Mode",
          description: "Use dark theme across the dashboard",
          checked: isDarkMode,
          onChange: toggleTheme,
          icon: isDarkMode ? <Moon size={16} /> : <Sun size={16} />,
        },
        {
          id: "language",
          label: "Language",
          description: "Set your preferred language",
          type: "select",
          options: ["English", "Spanish", "French", "German"],
          icon: <Globe size={16} />,
        },
      ],
    },
    {
      name: "Notifications",
      icon: <Bell size={20} />,
      colorClass: isDarkMode ? "bg-indigo-900/30 text-indigo-400" : "bg-indigo-50 text-indigo-600",
      settings: [
        {
          id: "email-notifications",
          label: "Email Notifications",
          description: "Receive updates via email",
          checked: emailNotifications,
          onChange: () => setEmailNotifications(!emailNotifications),
          icon: <Mail size={16} />,
        },
        {
          id: "push-notifications",
          label: "Push Notifications",
          description: "Receive updates via push notifications",
          checked: pushNotifications,
          onChange: () => setPushNotifications(!pushNotifications),
          icon: <Bell size={16} />,
        },
      ],
    },
    {
      name: "Privacy",
      icon: <Shield size={20} />,
      colorClass: isDarkMode ? "bg-emerald-900/30 text-emerald-400" : "bg-emerald-50 text-emerald-600",
      settings: [
        {
          id: "data-sharing",
          label: "Data Sharing",
          description: "Share anonymous usage data",
          checked: dataSharing,
          onChange: () => setDataSharing(!dataSharing),
          icon: <Database size={16} />,
        },
        {
          id: "profile-visibility",
          label: "Profile Visibility",
          description: "Control who can see your profile",
          type: "select",
          options: ["Everyone", "Team Only", "Only Me"],
          icon: <User size={16} />,
        },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isDarkMode ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-600"}`}>
            <SettingsIcon size={24} />
          </div>
          <TextGenerateEffect
            words="Dashboard Settings"
            className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}
          />
        </div>
        <p className={`mt-2 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
          Customize your dashboard experience, privacy, and notification preferences.
        </p>
      </div>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {settingCategories.map((category) => (
          <motion.div key={category.name} variants={itemVariants}>
            <GlowingCard
              className={`${
                isDarkMode ? "!bg-slate-900 !border-slate-800" : "!bg-white !border-slate-200"
              } p-6 h-full`}
            >
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className={`p-2 rounded-lg ${category.colorClass}`}>
                  {category.icon}
                </div>
                <h3 className={`font-bold text-lg ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                  {category.name}
                </h3>
              </div>

              <div className="space-y-6 relative z-10">
                {category.settings.map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${isDarkMode ? "bg-slate-800 text-slate-400" : "bg-slate-50 text-slate-500"}`}>
                        {setting.icon}
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${isDarkMode ? "text-slate-200" : "text-slate-900"}`}>
                          {setting.label}
                        </p>
                        <p className={`text-xs ${isDarkMode ? "text-slate-500" : "text-slate-500"}`}>
                          {setting.description}
                        </p>
                      </div>
                    </div>

                    <div>
                      {setting.type === "select" ? (
                        <select
                          className={`text-xs font-semibold px-3 py-1.5 rounded-lg border outline-none cursor-pointer transition-all ${
                            isDarkMode
                              ? "bg-slate-800 border-slate-700 text-slate-300"
                              : "bg-slate-50 border-slate-200 text-slate-600"
                          }`}
                        >
                          {setting.options?.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      ) : (
                        <button
                          onClick={setting.onChange}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                            setting.checked ? "bg-blue-600" : isDarkMode ? "bg-slate-700" : "bg-slate-200"
                          }`}
                        >
                          <span
                            className={`${
                              setting.checked ? "translate-x-6" : "translate-x-1"
                            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                          />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </GlowingCard>
          </motion.div>
        ))}
      </motion.div>

      <motion.div className="flex justify-end pt-4" variants={itemVariants}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all"
        >
          <Save size={18} />
          Save Changes
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Settings;
