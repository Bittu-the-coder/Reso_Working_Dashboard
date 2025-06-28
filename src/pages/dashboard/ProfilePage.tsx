import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuthStore } from "../../store/useAuthStore";
import { useNotificationStore } from "../../store/useNotificationStore";
import { toast } from "react-hot-toast";
import { User, Lock, Bell, Check, Trash2, Edit, Upload, X } from "lucide-react";

const ProfilePage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const {
    user,
    token,
    loading,
    error,
    getMe,
    updateUser,
    updatePassword,
    checkNotifications,
    deleteNotification,
    logout,
  } = useAuthStore();
  const {
    notifications,
    unreadCount,
    setNotifications,
    markAsRead,
    deleteNotification: deleteLocalNotification,
  } = useNotificationStore();
  const [activeTab, setActiveTab] = useState<
    "profile" | "security" | "notifications"
  >("profile");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    avatarFile: null as File | null,
    avatarPreview: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Load user data and notifications on mount
  useEffect(() => {
    const loadData = async () => {
      if (token) {
        await getMe();
        const notificationsResult = await checkNotifications();
        if (notificationsResult.success && notificationsResult.notifications) {
          setNotifications(notificationsResult.notifications);

          // Show toast for unread notifications
          notificationsResult.notifications
            .filter((n) => !n.isRead)
            .forEach((notification) => {
              toast(
                <div className="flex items-start">
                  <Bell className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{notification.title}</p>
                    <p className="text-sm">{notification.message}</p>
                  </div>
                </div>,
                { duration: 5000 }
              );
            });
        }
      }
    };
    loadData();
  }, [token, getMe, checkNotifications, setNotifications]);

  // Set form data when user data is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
        avatarFile: null,
        avatarPreview: user.avatar || "",
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        avatarFile: file,
        avatarPreview: URL.createObjectURL(file),
      }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await updateUser({
      name: formData.name,
      username: formData.username,
      email: formData.email,
      avatarFile: formData.avatarFile,
    });
    if (result.success) {
      toast.success("Profile updated successfully");
      setEditMode(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    const result = await updatePassword({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
    if (result.success) {
      toast.success("Password updated successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    await deleteNotification(notificationId);
    markAsRead(notificationId);
    toast.success("Notification marked as read");
  };

  const handleDeleteNotif = async (notificationId: string) => {
    await deleteNotification(notificationId);
    deleteLocalNotification(notificationId);
    toast.success("Notification deleted");
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="md:w-1/4">
          <motion.div
            className={`${
              isDarkMode
                ? "bg-gray-800/80 border-indigo-900/30"
                : "bg-white/80 border-blue-100"
            } backdrop-blur-lg rounded-2xl p-6 border shadow-lg sticky top-6`}
            whileHover={{
              boxShadow: isDarkMode
                ? "0 8px 30px rgba(30, 58, 138, 0.2)"
                : "0 8px 30px rgba(59, 130, 246, 0.15)",
            }}
          >
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-4">
                {formData.avatarFile && (
                  <img
                    src={formData.avatarPreview}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500"
                  />
                )}

                {editMode && (
                  <label
                    className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700"
                    title="Change avatar"
                  >
                    <Upload className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </label>
                )}
              </div>
              <h2
                className={`text-xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                {user?.name || "User"}
              </h2>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                @{user?.username || "username"}
              </p>
            </div>

            <nav className="space-y-2">
              <motion.button
                onClick={() => setActiveTab("profile")}
                className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 ${
                  activeTab === "profile"
                    ? isDarkMode
                      ? "bg-indigo-900/50 text-indigo-300"
                      : "bg-indigo-100 text-indigo-700"
                    : isDarkMode
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                whileHover={{ x: 5 }}
              >
                <User className="w-5 h-5" />
                Profile
              </motion.button>
              <motion.button
                onClick={() => setActiveTab("security")}
                className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 ${
                  activeTab === "security"
                    ? isDarkMode
                      ? "bg-indigo-900/50 text-indigo-300"
                      : "bg-indigo-100 text-indigo-700"
                    : isDarkMode
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                whileHover={{ x: 5 }}
              >
                <Lock className="w-5 h-5" />
                Security
              </motion.button>
              <motion.button
                onClick={() => setActiveTab("notifications")}
                className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 ${
                  activeTab === "notifications"
                    ? isDarkMode
                      ? "bg-indigo-900/50 text-indigo-300"
                      : "bg-indigo-100 text-indigo-700"
                    : isDarkMode
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                whileHover={{ x: 5 }}
              >
                <div className="relative">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </div>
                Notifications
              </motion.button>
            </nav>

            <motion.button
              onClick={logout}
              className={`mt-6 w-full px-4 py-2 rounded-lg flex items-center justify-center gap-2 ${
                isDarkMode
                  ? "bg-red-900/50 hover:bg-red-900/70 text-red-300"
                  : "bg-red-100 hover:bg-red-200 text-red-700"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Logout
            </motion.button>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="md:w-3/4">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <motion.div
              className={`${
                isDarkMode
                  ? "bg-gray-800/80 border-indigo-900/30"
                  : "bg-white/80 border-blue-100"
              } backdrop-blur-lg rounded-2xl p-6 border shadow-lg`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2
                  className={`text-xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Profile Information
                </h2>
                {!editMode ? (
                  <motion.button
                    onClick={() => setEditMode(true)}
                    className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm ${
                      isDarkMode
                        ? "bg-indigo-700 hover:bg-indigo-600"
                        : "bg-indigo-600 hover:bg-indigo-500"
                    } text-white`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={() => setEditMode(false)}
                    className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm ${
                      isDarkMode
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </motion.button>
                )}
              </div>

              {editMode ? (
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        className={`block text-sm font-medium mb-1 ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full ${
                          isDarkMode
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-700"
                        } border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                        required
                      />
                    </div>
                    <div>
                      <label
                        className={`block text-sm font-medium mb-1 ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className={`w-full ${
                          isDarkMode
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-700"
                        } border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label
                        className={`block text-sm font-medium mb-1 ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full ${
                          isDarkMode
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-700"
                        } border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <motion.button
                      type="submit"
                      className={`px-4 py-2 ${
                        isDarkMode ? "bg-indigo-700" : "bg-indigo-600"
                      } text-white rounded-lg font-medium flex items-center gap-2`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={loading}
                    >
                      {loading ? (
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : (
                        <>
                          <Check className="w-5 h-5" />
                          Save Changes
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Full Name
                      </p>
                      <p
                        className={`${
                          isDarkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {user?.name || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Username
                      </p>
                      <p
                        className={`${
                          isDarkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
                        @{user?.username || "Not provided"}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p
                        className={`text-sm font-medium ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Email
                      </p>
                      <p
                        className={`${
                          isDarkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {user?.email || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <motion.div
              className={`${
                isDarkMode
                  ? "bg-gray-800/80 border-indigo-900/30"
                  : "bg-white/80 border-blue-100"
              } backdrop-blur-lg rounded-2xl p-6 border shadow-lg`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2
                className={`text-xl font-bold mb-6 ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Security Settings
              </h2>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className={`w-full ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-700"
                    } border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    required
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className={`w-full ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-700"
                    } border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    required
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className={`w-full ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-700"
                    } border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    required
                  />
                </div>
                <div className="flex justify-end pt-4">
                  <motion.button
                    type="submit"
                    className={`px-4 py-2 ${
                      isDarkMode ? "bg-indigo-700" : "bg-indigo-600"
                    } text-white rounded-lg font-medium flex items-center gap-2`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                  >
                    {loading ? (
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        Update Password
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <motion.div
              className={`${
                isDarkMode
                  ? "bg-gray-800/80 border-indigo-900/30"
                  : "bg-white/80 border-blue-100"
              } backdrop-blur-lg rounded-2xl p-6 border shadow-lg`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2
                  className={`text-xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Notifications
                </h2>
                {notifications.length > 0 && (
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {unreadCount} unread
                  </p>
                )}
              </div>

              {notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification._id}
                      className={`p-4 rounded-lg ${
                        isDarkMode
                          ? notification.isRead
                            ? "bg-gray-700/50"
                            : "bg-indigo-900/30"
                          : notification.isRead
                          ? "bg-gray-100"
                          : "bg-indigo-100"
                      }`}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3
                            className={`font-medium ${
                              isDarkMode ? "text-white" : "text-gray-800"
                            }`}
                          >
                            {notification.title}
                          </h3>
                          <p
                            className={`text-sm ${
                              isDarkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            {notification.message}
                          </p>
                          <p
                            className={`text-xs mt-2 ${
                              isDarkMode ? "text-gray-500" : "text-gray-400"
                            }`}
                          >
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {!notification.isRead && (
                            <motion.button
                              onClick={() => handleMarkAsRead(notification._id)}
                              className={`p-1.5 rounded-full ${
                                isDarkMode
                                  ? "text-green-400 hover:bg-gray-700"
                                  : "text-green-600 hover:bg-gray-200"
                              }`}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4" />
                            </motion.button>
                          )}
                          <motion.button
                            onClick={() => handleDeleteNotif(notification._id)}
                            className={`p-1.5 rounded-full ${
                              isDarkMode
                                ? "text-red-400 hover:bg-gray-700"
                                : "text-red-600 hover:bg-gray-200"
                            }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div
                    className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-100"
                    } mb-4`}
                  >
                    <Bell
                      className={`h-5 w-5 ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                  </div>
                  <h3
                    className={`text-lg font-medium ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    } mb-1`}
                  >
                    No notifications
                  </h3>
                  <p
                    className={`${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    You don't have any notifications yet.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
