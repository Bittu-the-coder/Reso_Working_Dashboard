import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon,
  Bell,
  Monitor,
  Shield,
  User,
  Moon,
  Sun,
  Globe,
  Mail,
  Database,
} from "lucide-react";
import { useTheme } from "../contexts/useTheme";

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

const Settings: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [dataSharing, setDataSharing] = useState(true);

  // Define setting categories for the new UI
  const settingCategories = [
    {
      name: "Appearance",
      icon: <Monitor className="w-5 h-5" />,
      color: isDarkMode
        ? "bg-blue-900 text-blue-400"
        : "bg-blue-100 text-blue-600",
      settings: [
        {
          id: "dark-mode",
          label: "Dark Mode",
          description: "Use dark theme across the dashboard",
          checked: isDarkMode,
          onChange: toggleTheme,
          icon: isDarkMode ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4" />
          ),
        },
        {
          id: "language",
          label: "Language",
          description: "Set your preferred language",
          type: "select",
          options: ["English", "Spanish", "French", "German"],
          icon: <Globe className="w-4 h-4" />,
        },
      ],
    },
    {
      name: "Notifications",
      icon: <Bell className="w-5 h-5" />,
      color: isDarkMode
        ? "bg-purple-900 text-purple-400"
        : "bg-purple-100 text-purple-600",
      settings: [
        {
          id: "email-notifications",
          label: "Email Notifications",
          description: "Receive updates via email",
          checked: emailNotifications,
          onChange: () => setEmailNotifications(!emailNotifications),
          icon: <Mail className="w-4 h-4" />,
        },
        {
          id: "push-notifications",
          label: "Push Notifications",
          description: "Receive updates via push notifications",
          checked: pushNotifications,
          onChange: () => setPushNotifications(!pushNotifications),
          icon: <Bell className="w-4 h-4" />,
        },
      ],
    },
    {
      name: "Privacy",
      icon: <Shield className="w-5 h-5" />,
      color: isDarkMode
        ? "bg-indigo-900 text-indigo-400"
        : "bg-indigo-100 text-indigo-600",
      settings: [
        {
          id: "data-sharing",
          label: "Data Sharing",
          description: "Share anonymous usage data",
          checked: dataSharing,
          onChange: () => setDataSharing(!dataSharing),
          icon: <Database className="w-4 h-4" />,
        },
        {
          id: "profile-visibility",
          label: "Profile Visibility",
          description: "Control who can see your profile",
          type: "select",
          options: ["Everyone", "Team Only", "Only Me"],
          icon: <User className="w-4 h-4" />,
        },
      ],
    },
  ];

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className={`${
          isDarkMode
            ? "bg-gray-800/80 border-gray-700"
            : "bg-white/80 border-blue-100"
        } backdrop-blur-lg p-6 rounded-2xl shadow-lg border relative overflow-hidden`}
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
              isDarkMode ? "bg-indigo-900" : "bg-indigo-100"
            } rounded-full`}
          >
            <SettingsIcon
              className={`w-5 h-5 ${
                isDarkMode ? "text-indigo-400" : "text-indigo-600"
              }`}
            />
          </div>
          <h2
            className={`text-xl font-bold ${
              isDarkMode ? "text-indigo-300" : "text-indigo-900"
            }`}
          >
            Settings
          </h2>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {settingCategories.map((category) => (
          <motion.div
            key={category.name}
            className={`${
              isDarkMode
                ? "bg-gray-700/60 border-gray-600"
                : "bg-white/60 border-gray-100"
            } rounded-xl p-5 border shadow-sm`}
            variants={itemVariants}
            whileHover={{
              y: -3,
              transition: { type: "spring", stiffness: 300, damping: 20 },
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className={`p-2 rounded-lg ${category.color}`}>
                {category.icon}
              </div>
              <h3
                className={`font-semibold ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                {category.name}
              </h3>
            </div>

            <div className="space-y-4">
              {category.settings.map((setting) => (
                <div
                  key={setting.id}
                  className={`flex items-center justify-between py-2 border-b ${
                    isDarkMode ? "border-gray-600" : "border-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-1.5 rounded-md ${
                        isDarkMode ? "bg-gray-600" : "bg-gray-100"
                      }`}
                    >
                      {setting.icon}
                    </div>
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          isDarkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {setting.label}
                      </p>
                      <p
                        className={`text-xs ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {setting.description}
                      </p>
                    </div>
                  </div>

                  <div>
                    {setting.type === "select" ? (
                      <select
                        className={`py-1 px-3 text-sm rounded-md ${
                          isDarkMode
                            ? "bg-gray-700 text-white border-gray-600"
                            : "bg-white text-gray-800 border-gray-200"
                        } border`}
                      >
                        {setting.options?.map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="relative inline-block w-10 align-middle select-none">
                        <input
                          type="checkbox"
                          name={setting.id}
                          id={setting.id}
                          checked={setting.checked}
                          onChange={setting.onChange}
                          className="opacity-0 absolute block w-6 h-6 cursor-pointer"
                        />
                        <label
                          htmlFor={setting.id}
                          className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                            setting.checked
                              ? isDarkMode
                                ? "bg-indigo-600"
                                : "bg-indigo-500"
                              : isDarkMode
                              ? "bg-gray-600"
                              : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`block h-5 w-5 rounded-full bg-white border-2 ${
                              setting.checked
                                ? isDarkMode
                                  ? "border-indigo-600 ml-4"
                                  : "border-indigo-500 ml-4"
                                : isDarkMode
                                ? "border-gray-600 ml-0"
                                : "border-gray-300 ml-0"
                            } transform transition-all duration-300 ease-in-out`}
                          ></span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div className="flex justify-end" variants={itemVariants}>
        <motion.button
          className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white py-3 px-8 rounded-xl font-semibold shadow-lg flex items-center gap-2"
          whileHover={{
            scale: 1.02,
            boxShadow: "0 8px 20px rgba(79, 70, 229, 0.3)",
          }}
          whileTap={{ scale: 0.98 }}
        >
          <SettingsIcon className="w-4 h-4" />
          Save Settings
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Settings;
