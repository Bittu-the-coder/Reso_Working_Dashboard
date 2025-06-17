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
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [dataSharing, setDataSharing] = useState(true);

  // Define setting categories for the new UI
  const settingCategories = [
    {
      name: "Appearance",
      icon: <Monitor className="w-5 h-5" />,
      color: "bg-blue-100 text-blue-600",
      settings: [
        {
          id: "dark-mode",
          label: "Dark Mode",
          description: "Use dark theme across the dashboard",
          checked: darkMode,
          onChange: () => setDarkMode(!darkMode),
          icon: darkMode ? (
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
      color: "bg-purple-100 text-purple-600",
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
      color: "bg-indigo-100 text-indigo-600",
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
        className="flex items-center gap-3 mb-6"
        variants={itemVariants}
      >
        <div className="p-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg">
          <SettingsIcon className="w-6 h-6 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-indigo-900">
          Dashboard Settings
        </h2>
      </motion.div>

      {settingCategories.map((category) => (
        <motion.div
          key={category.name}
          className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-blue-100 relative overflow-hidden"
          variants={itemVariants}
          whileHover={{
            boxShadow: "0 8px 30px rgba(59, 130, 246, 0.15)",
            transition: { type: "spring", stiffness: 300, damping: 20 },
          }}
        >
          <div className="flex items-center gap-3 mb-6 z-10 relative">
            <div className={`p-2 rounded-lg ${category.color}`}>
              {category.icon}
            </div>
            <h3 className="text-xl font-bold text-indigo-900">
              {category.name}
            </h3>
          </div>

          <div className="space-y-6 z-10 relative">
            {category.settings.map((setting) => (
              <motion.div
                key={setting.id}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded-xl border border-blue-100"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2 rounded-lg ${category.color
                      .replace("bg-", "bg-")
                      .replace("text-", "text-")}`}
                  >
                    {setting.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-indigo-900">
                      {setting.label}
                    </h4>
                    <p className="text-sm text-indigo-700">
                      {setting.description}
                    </p>
                  </div>
                </div>

                {setting.type === "select" ? (
                  <select className="bg-white text-indigo-900 border border-indigo-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-300">
                    {setting.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={setting.checked}
                      onChange={setting.onChange}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                )}
              </motion.div>
            ))}
          </div>

          {/* Decorative corner elements */}
          <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-blue-200 rounded-tl-lg" />
          <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-blue-200 rounded-br-lg" />

          {/* Decorative Elements */}
          <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-r from-blue-100/50 to-purple-100/50 rounded-full opacity-50" />
        </motion.div>
      ))}

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
