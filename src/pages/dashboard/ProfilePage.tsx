import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  User,
  Lock,
  Bell,
  Edit,
  Save,
  Check,
  X,
  CheckSquare,
  UserPlus,
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useTheme } from "../../contexts/ThemeContext";
import toast from "react-hot-toast";

interface Notification {
  _id: string;
  message: string;
  isRead: boolean;
  type: string;
  createdAt: string;
}

interface ProfileForm {
  name: string;
  email: string;
  username: string;
  avatar: File | null;
  avatarPreview: string;
}

interface PasswordForm {
  current: string;
  new: string;
  confirm: string;
}

interface DarkModeClasses {
  container: string;
  sidebar: string;
  card: string;
  text: {
    primary: string;
    secondary: string;
    muted: string;
  };
  input: string;
  button: {
    active: string;
    inactive: string;
  };
}

const ProfilePage = () => {
  const {
    user,
    updateUser,
    updatePassword,
    logout,
    checkNotifications,
    getAllNotifications,
    deleteNotification,
  } = useAuthStore();

  const [activeTab, setActiveTab] = useState<
    "profile" | "security" | "notifications"
  >("profile");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isDarkMode } = useTheme();

  // Form states
  const [profile, setProfile] = useState<ProfileForm>({
    name: "",
    email: "",
    username: "",
    avatar: null,
    avatarPreview: "",
  });

  const [passwords, setPasswords] = useState<PasswordForm>({
    current: "",
    new: "",
    confirm: "",
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await getAllNotifications();
        console.log("Notice res", response);
        if (response.success && response.notifications) {
          setNotifications(response.notifications);
        }
      } catch (error) {
        toast.error("Failed to fetch notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [getAllNotifications]);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      console.log("User data:", user);
      setProfile({
        name: user.fullName || "",
        email: user.email || "",
        username: user.username || "",
        avatar: null,
        avatarPreview: user.avatar || "",
      });
    }
  }, [user]);

  // Handle avatar file selection
  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfile((prev) => ({
        ...prev,
        avatar: file,
        avatarPreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await updateUser({
        name: profile.name,
        email: profile.email,
        username: profile.username,
        avatar: profile.avatar,
      });

      if (result.success) {
        setEditMode(false);
        toast("Profile updated successfully!");
      } else {
        toast(result.error || "Update failed");
      }
    } catch (error) {
      toast("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast("Passwords don't match");
      return;
    }
    if (passwords.new.length < 6) {
      toast("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const result = await updatePassword({
        currentPassword: passwords.current,
        newPassword: passwords.new,
      });

      if (result.success) {
        setPasswords({ current: "", new: "", confirm: "" });
        toast("Password updated successfully!");
      } else {
        toast(result.error || "Password update failed");
      }
    } catch (error) {
      toast("Password update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationAction = async (
    id: string,
    action: "read" | "delete"
  ) => {
    try {
      if (action === "read") {
        await checkNotifications(id);
        setNotifications((prev) =>
          prev.map((notification) =>
            notification._id === id
              ? { ...notification, isRead: true }
              : notification
          )
        );
      } else if (action === "delete") {
        await deleteNotification(id);
        setNotifications((prev) =>
          prev.filter((notification) => notification._id !== id)
        );
      }
    } catch (error) {
      toast.error(`Failed to ${action} notification`);
    }
  };

  // Dark mode classes
  const darkModeClasses: DarkModeClasses = {
    container: isDarkMode ? "bg-gray-900" : "bg-gray-50",
    sidebar: isDarkMode
      ? "bg-gray-800 border-gray-700"
      : "bg-white border-gray-200",
    card: isDarkMode ? "bg-gray-800" : "bg-white",
    text: {
      primary: isDarkMode ? "text-white" : "text-gray-800",
      secondary: isDarkMode ? "text-gray-300" : "text-gray-600",
      muted: isDarkMode ? "text-gray-400" : "text-gray-500",
    },
    input: isDarkMode
      ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-400 focus:border-blue-400"
      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500",
    button: {
      active: isDarkMode
        ? "bg-blue-600 text-blue-100"
        : "bg-blue-50 text-blue-600",
      inactive: isDarkMode
        ? "text-gray-300 hover:bg-gray-700"
        : "text-gray-600 hover:bg-gray-100",
    },
  };

  return (
    <div className={`flex min-h-screen ${darkModeClasses.container}`}>
      {/* Sidebar */}
      <div className={`w-64 ${darkModeClasses.sidebar} shadow-lg p-6 border-r`}>
        {/* User avatar and info */}
        <div className="mb-8 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className={`w-full h-full flex items-center justify-center ${darkModeClasses.text.muted}`}
              >
                <User size={32} />
              </div>
            )}
          </div>
          <h3
            className={`text-xl font-semibold ${darkModeClasses.text.primary}`}
          >
            {user?.fullName || "User"}
          </h3>
          <p className={`text-sm ${darkModeClasses.text.muted}`}>
            @{user?.username || "username"}
          </p>
        </div>

        {/* Navigation */}
        <div className="space-y-2">
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${
              activeTab === "profile"
                ? darkModeClasses.button.active
                : darkModeClasses.button.inactive
            }`}
          >
            <User size={16} className="mr-3" /> Profile
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`w-full flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${
              activeTab === "security"
                ? darkModeClasses.button.active
                : darkModeClasses.button.inactive
            }`}
          >
            <Lock size={16} className="mr-3" /> Security
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`w-full flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${
              activeTab === "notifications"
                ? darkModeClasses.button.active
                : darkModeClasses.button.inactive
            }`}
          >
            <Bell size={16} className="mr-3" />
            Notifications
            {unreadCount > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[1.5rem] h-6 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        <button
          onClick={logout}
          className={`w-full mt-8 px-4 py-2 text-sm text-red-600 hover:bg-red-50 ${
            isDarkMode ? "hover:bg-red-900/20" : ""
          } rounded-lg transition-colors`}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {activeTab === "profile" && (
          <div className={`${darkModeClasses.card} rounded-lg shadow-sm p-6`}>
            <div className="flex justify-between items-center mb-6">
              <h2
                className={`text-2xl font-semibold ${darkModeClasses.text.primary}`}
              >
                Profile Information
              </h2>
              {editMode ? (
                <button
                  onClick={() => setEditMode(false)}
                  className={`${darkModeClasses.text.secondary} hover:${darkModeClasses.text.primary} px-4 py-2 text-sm transition-colors`}
                >
                  Cancel
                </button>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center text-blue-600 hover:text-blue-700 px-4 py-2 text-sm"
                >
                  <Edit size={16} className="mr-2" /> Edit
                </button>
              )}
            </div>

            {editMode ? (
              <div className="space-y-6">
                {/* Avatar Upload */}
                <div>
                  <label
                    className={`block text-sm font-medium ${darkModeClasses.text.secondary} mb-2`}
                  >
                    Avatar
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                      {profile.avatarPreview ? (
                        <img
                          src={profile.avatarPreview}
                          alt="Avatar preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <User size={24} />
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className={`px-4 py-2 rounded-lg ${darkModeClasses.input}`}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${darkModeClasses.text.secondary} mb-2`}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        name: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-2 rounded-lg ${darkModeClasses.input}`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${darkModeClasses.text.secondary} mb-2`}
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    value={profile.username}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        username: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-2 rounded-lg ${darkModeClasses.input}`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${darkModeClasses.text.secondary} mb-2`}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        email: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-2 rounded-lg ${darkModeClasses.input}`}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleProfileSubmit}
                  disabled={loading}
                  className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                >
                  {loading ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save size={16} className="mr-2" /> Save Changes
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div
                  className={`flex border-b ${
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                  } py-4`}
                >
                  <span
                    className={`w-1/4 text-sm font-medium ${darkModeClasses.text.secondary}`}
                  >
                    Name
                  </span>
                  <span
                    className={`flex-1 text-sm ${darkModeClasses.text.primary}`}
                  >
                    {profile?.name || "-"}
                  </span>
                </div>
                <div
                  className={`flex border-b ${
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                  } py-4`}
                >
                  <span
                    className={`w-1/4 text-sm font-medium ${darkModeClasses.text.secondary}`}
                  >
                    Email
                  </span>
                  <span
                    className={`flex-1 text-sm ${darkModeClasses.text.primary}`}
                  >
                    {user?.email || "-"}
                  </span>
                </div>
                <div className="flex py-4">
                  <span
                    className={`w-1/4 text-sm font-medium ${darkModeClasses.text.secondary}`}
                  >
                    Username
                  </span>
                  <span
                    className={`flex-1 text-sm ${darkModeClasses.text.primary}`}
                  >
                    @{user?.username || "-"}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "security" && (
          <div className={`${darkModeClasses.card} rounded-lg shadow-sm p-6`}>
            <h2
              className={`text-2xl font-semibold ${darkModeClasses.text.primary} mb-6`}
            >
              Change Password
            </h2>
            <div className="space-y-6 max-w-md">
              <div>
                <label
                  className={`block text-sm font-medium ${darkModeClasses.text.secondary} mb-2`}
                >
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwords.current}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      current: e.target.value,
                    })
                  }
                  className={`w-full px-4 py-2 rounded-lg ${darkModeClasses.input}`}
                  required
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium ${darkModeClasses.text.secondary} mb-2`}
                >
                  New Password
                </label>
                <input
                  type="password"
                  value={passwords.new}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      new: e.target.value,
                    })
                  }
                  className={`w-full px-4 py-2 rounded-lg ${darkModeClasses.input}`}
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium ${darkModeClasses.text.secondary} mb-2`}
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      confirm: e.target.value,
                    })
                  }
                  className={`w-full px-4 py-2 rounded-lg ${darkModeClasses.input}`}
                  required
                  minLength={6}
                />
              </div>
              <button
                type="button"
                onClick={handlePasswordSubmit}
                disabled={loading}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className={`${darkModeClasses.card} rounded-lg shadow-sm p-6`}>
            <h2
              className={`text-2xl font-semibold ${darkModeClasses.text.primary} mb-6`}
            >
              Notifications
            </h2>
            {notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      notification.isRead
                        ? isDarkMode
                          ? "bg-gray-700 border-gray-600"
                          : "bg-gray-50 border-gray-200"
                        : isDarkMode
                        ? "bg-blue-900/20 border-blue-700"
                        : "bg-blue-50 border-blue-200"
                    }`}
                  >
                    <div className="flex-1">
                      <p className={`text-sm ${darkModeClasses.text.primary}`}>
                        {notification.message}
                      </p>
                      <p
                        className={`text-xs ${darkModeClasses.text.muted} mt-1`}
                      >
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                      <span
                        className={`flex items-center gap-1 ${darkModeClasses.text.secondary} mt-1`}
                      >
                        {notification.type === "task" ? (
                          <>
                            <CheckSquare size={14} /> Task
                          </>
                        ) : notification.type === "invitation" ? (
                          <>
                            <UserPlus size={14} /> Invitation
                          </>
                        ) : (
                          <>
                            <Bell size={14} /> Notification
                          </>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!notification.isRead && (
                        <button
                          onClick={() =>
                            handleNotificationAction(notification._id, "read")
                          }
                          className="p-1 text-blue-600 hover:text-blue-700 transition-colors"
                          title="Mark as read"
                        >
                          <Check size={16} />
                        </button>
                      )}
                      <button
                        onClick={() =>
                          handleNotificationAction(notification._id, "delete")
                        }
                        className="p-1 text-red-600 hover:text-red-700 transition-colors"
                        title="Delete notification"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={`${darkModeClasses.text.muted} text-center py-8`}>
                No notifications yet
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

// import React, { useState, useEffect } from "react";
// import {
//   User,
//   Lock,
//   Bell,
//   Edit,
//   Save,
//   Check,
//   X,
//   CheckSquare,
//   UserPlus,
// } from "lucide-react";
// import { useAuthStore } from "../../store/useAuthStore";
// import { useTheme } from "../../contexts/ThemeContext";
// import toast from "react-hot-toast";

// const ProfilePage = () => {
//   const {
//     user,
//     updateUser,
//     updatePassword,
//     logout,
//     checkNotifications,
//     getAllNotifications,
//     deleteNotification,
//   } = useAuthStore();
//   const [activeTab, setActiveTab] = useState("profile");
//   interface Notification {
//     _id: string;
//     message: string;
//     isRead: boolean;
//     type: string;
//     createdAt: string;
//   }

//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [editMode, setEditMode] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const { isDarkMode } = useTheme();

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         setLoading(true);
//         const response = await getAllNotifications();
//         console.log("Notice res", response);
//         if (response.success && response.notifications) {
//           setNotifications(response.notifications);
//         }
//       } catch (error) {
//         toast.error("Failed to fetch notifications");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNotifications(); // Always fetch on initial load, not just when empty
//   }, [getAllNotifications]);

//   // Form states
//   const [profile, setProfile] = useState({
//     name: "",
//     email: "",
//     username: "",
//     avatar: null,
//     avatarPreview: "",
//   });

//   const [passwords, setPasswords] = useState({
//     current: "",
//     new: "",
//     confirm: "",
//   });

//   // Initialize form with user data
//   useEffect(() => {
//     if (user) {
//       setProfile({
//         name: user.fullName || "",
//         email: user.email || "",
//         username: user.username || "",
//         avatar: null,
//         avatarPreview: user.avatar || "",
//       });
//     }
//   }, [user]);
//   const unreadCount = notifications.filter((n) => !n.isRead).length;

//   // Handle avatar file selection
//   const handleAvatarChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setProfile((prev) => ({
//         ...prev,
//         avatar: file,
//         avatarPreview: URL.createObjectURL(file),
//       }));
//     }
//   };

//   const handleProfileSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const result = await updateUser({
//         name: profile.name,
//         email: profile.email,
//         username: profile.username,
//         avatar: profile.avatar,
//       });

//       if (result.success) {
//         setEditMode(false);
//         toast("Profile updated successfully!");
//       } else {
//         toast(result.error || "Update failed");
//       }
//     } catch (error) {
//       toast("Update failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePasswordSubmit = async (e) => {
//     e.preventDefault();
//     if (passwords.new !== passwords.confirm) {
//       toast("Passwords don't match");
//       return;
//     }
//     if (passwords.new.length < 6) {
//       toast("Password must be at least 6 characters long");
//       return;
//     }

//     setLoading(true);
//     try {
//       const result = await updatePassword({
//         currentPassword: passwords.current,
//         newPassword: passwords.new,
//       });

//       if (result.success) {
//         setPasswords({ current: "", new: "", confirm: "" });
//         toast("Password updated successfully!");
//       } else {
//         toast(result.error || "Password update failed");
//       }
//     } catch (error) {
//       toast("Password update failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleNotificationAction = async (id, action) => {
//     try {
//       if (action === "read") {
//         await checkNotifications(id);
//         // Update local state to mark as read
//         setNotifications((prev) =>
//           prev.map((notification) =>
//             notification._id === id
//               ? { ...notification, isRead: true }
//               : notification
//           )
//         );
//       } else if (action === "delete") {
//         await deleteNotification(id);
//         setNotifications((prev) =>
//           prev.filter((notification) => notification._id !== id)
//         );
//       }
//     } catch (error) {
//       toast.error(`Failed to ${action} notification`);
//     }
//   };

//   // Dark mode classes
//   const darkModeClasses = {
//     container: isDarkMode ? "bg-gray-900" : "bg-gray-50",
//     sidebar: isDarkMode
//       ? "bg-gray-800 border-gray-700"
//       : "bg-white border-gray-200",
//     card: isDarkMode ? "bg-gray-800" : "bg-white",
//     text: {
//       primary: isDarkMode ? "text-white" : "text-gray-800",
//       secondary: isDarkMode ? "text-gray-300" : "text-gray-600",
//       muted: isDarkMode ? "text-gray-400" : "text-gray-500",
//     },
//     input: isDarkMode
//       ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-400 focus:border-blue-400"
//       : "border-gray-300 focus:ring-blue-500 focus:border-blue-500",
//     button: {
//       active: isDarkMode
//         ? "bg-blue-600 text-blue-100"
//         : "bg-blue-50 text-blue-600",
//       inactive: isDarkMode
//         ? "text-gray-300 hover:bg-gray-700"
//         : "text-gray-600 hover:bg-gray-100",
//     },
//   };

//   return (
//     <div className={`flex min-h-screen ${darkModeClasses.container}`}>
//       {/* Sidebar */}
//       <div className={`w-64 ${darkModeClasses.sidebar} shadow-lg p-6 border-r`}>
//         {/* User avatar and info */}
//         <div className="mb-8 text-center">
//           <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
//             {user?.avatar ? (
//               <img
//                 src={user.avatar}
//                 alt={user.fullName}
//                 className="w-full h-full object-cover"
//               />
//             ) : (
//               <div
//                 className={`w-full h-full flex items-center justify-center ${darkModeClasses.text.muted}`}
//               >
//                 <User size={32} />
//               </div>
//             )}
//           </div>
//           <h3
//             className={`text-xl font-semibold ${darkModeClasses.text.primary}`}
//           >
//             {user?.fullName || "User"}
//           </h3>
//           <p className={`text-sm ${darkModeClasses.text.muted}`}>
//             @{user?.username || "username"}
//           </p>
//         </div>

//         {/* Navigation */}
//         <div className="space-y-2">
//           <button
//             onClick={() => setActiveTab("profile")}
//             className={`w-full flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${
//               activeTab === "profile"
//                 ? darkModeClasses.button.active
//                 : darkModeClasses.button.inactive
//             }`}
//           >
//             <User size={16} className="mr-3" /> Profile
//           </button>
//           <button
//             onClick={() => setActiveTab("security")}
//             className={`w-full flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${
//               activeTab === "security"
//                 ? darkModeClasses.button.active
//                 : darkModeClasses.button.inactive
//             }`}
//           >
//             <Lock size={16} className="mr-3" /> Security
//           </button>
//           <button
//             onClick={() => setActiveTab("notifications")}
//             className={`w-full flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${
//               activeTab === "notifications"
//                 ? darkModeClasses.button.active
//                 : darkModeClasses.button.inactive
//             }`}
//           >
//             <Bell size={16} className="mr-3" />
//             Notifications
//             {unreadCount > 0 && (
//               <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[1.5rem] h-6 flex items-center justify-center">
//                 {unreadCount}
//               </span>
//             )}
//           </button>
//         </div>

//         <button
//           onClick={logout}
//           className={`w-full mt-8 px-4 py-2 text-sm text-red-600 hover:bg-red-50 ${
//             isDarkMode ? "hover:bg-red-900/20" : ""
//           } rounded-lg transition-colors`}
//         >
//           Logout
//         </button>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 p-8">
//         {activeTab === "profile" && (
//           <div className={`${darkModeClasses.card} rounded-lg shadow-sm p-6`}>
//             <div className="flex justify-between items-center mb-6">
//               <h2
//                 className={`text-2xl font-semibold ${darkModeClasses.text.primary}`}
//               >
//                 Profile Information
//               </h2>
//               {editMode ? (
//                 <button
//                   onClick={() => setEditMode(false)}
//                   className={`${darkModeClasses.text.secondary} hover:${darkModeClasses.text.primary} px-4 py-2 text-sm transition-colors`}
//                 >
//                   Cancel
//                 </button>
//               ) : (
//                 <button
//                   onClick={() => setEditMode(true)}
//                   className="flex items-center text-blue-600 hover:text-blue-700 px-4 py-2 text-sm"
//                 >
//                   <Edit size={16} className="mr-2" /> Edit
//                 </button>
//               )}
//             </div>

//             {editMode ? (
//               <div className="space-y-6">
//                 {/* Avatar Upload */}
//                 <div>
//                   <label
//                     className={`block text-sm font-medium ${darkModeClasses.text.secondary} mb-2`}
//                   >
//                     Avatar
//                   </label>
//                   <div className="flex items-center space-x-4">
//                     <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
//                       {profile.avatarPreview ? (
//                         <img
//                           src={profile.avatarPreview}
//                           alt="Avatar preview"
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         <div className="w-full h-full flex items-center justify-center text-gray-400">
//                           <User size={24} />
//                         </div>
//                       )}
//                     </div>
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={handleAvatarChange}
//                       className={`px-4 py-2 rounded-lg ${darkModeClasses.input}`}
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label
//                     className={`block text-sm font-medium ${darkModeClasses.text.secondary} mb-2`}
//                   >
//                     Name
//                   </label>
//                   <input
//                     type="text"
//                     value={profile.name}
//                     onChange={(e) =>
//                       setProfile({ ...profile, name: e.target.value })
//                     }
//                     className={`w-full px-4 py-2 rounded-lg ${darkModeClasses.input}`}
//                   />
//                 </div>
//                 <div>
//                   <label
//                     className={`block text-sm font-medium ${darkModeClasses.text.secondary} mb-2`}
//                   >
//                     Username
//                   </label>
//                   <input
//                     type="text"
//                     value={profile.username}
//                     onChange={(e) =>
//                       setProfile({ ...profile, username: e.target.value })
//                     }
//                     className={`w-full px-4 py-2 rounded-lg ${darkModeClasses.input}`}
//                   />
//                 </div>
//                 <div>
//                   <label
//                     className={`block text-sm font-medium ${darkModeClasses.text.secondary} mb-2`}
//                   >
//                     Email
//                   </label>
//                   <input
//                     type="email"
//                     value={profile.email}
//                     onChange={(e) =>
//                       setProfile({ ...profile, email: e.target.value })
//                     }
//                     className={`w-full px-4 py-2 rounded-lg ${darkModeClasses.input}`}
//                   />
//                 </div>
//                 <button
//                   type="button"
//                   onClick={handleProfileSubmit}
//                   disabled={loading}
//                   className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
//                 >
//                   {loading ? (
//                     "Saving..."
//                   ) : (
//                     <>
//                       <Save size={16} className="mr-2" /> Save Changes
//                     </>
//                   )}
//                 </button>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 <div
//                   className={`flex border-b ${
//                     isDarkMode ? "border-gray-700" : "border-gray-200"
//                   } py-4`}
//                 >
//                   <span
//                     className={`w-1/4 text-sm font-medium ${darkModeClasses.text.secondary}`}
//                   >
//                     Name
//                   </span>
//                   <span
//                     className={`flex-1 text-sm ${darkModeClasses.text.primary}`}
//                   >
//                     {user?.fullName || "-"}
//                   </span>
//                 </div>
//                 <div
//                   className={`flex border-b ${
//                     isDarkMode ? "border-gray-700" : "border-gray-200"
//                   } py-4`}
//                 >
//                   <span
//                     className={`w-1/4 text-sm font-medium ${darkModeClasses.text.secondary}`}
//                   >
//                     Email
//                   </span>
//                   <span
//                     className={`flex-1 text-sm ${darkModeClasses.text.primary}`}
//                   >
//                     {user?.email || "-"}
//                   </span>
//                 </div>
//                 <div className="flex py-4">
//                   <span
//                     className={`w-1/4 text-sm font-medium ${darkModeClasses.text.secondary}`}
//                   >
//                     Username
//                   </span>
//                   <span
//                     className={`flex-1 text-sm ${darkModeClasses.text.primary}`}
//                   >
//                     @{user?.username || "-"}
//                   </span>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {activeTab === "security" && (
//           <div className={`${darkModeClasses.card} rounded-lg shadow-sm p-6`}>
//             <h2
//               className={`text-2xl font-semibold ${darkModeClasses.text.primary} mb-6`}
//             >
//               Change Password
//             </h2>
//             <div className="space-y-6 max-w-md">
//               <div>
//                 <label
//                   className={`block text-sm font-medium ${darkModeClasses.text.secondary} mb-2`}
//                 >
//                   Current Password
//                 </label>
//                 <input
//                   type="password"
//                   value={passwords.current}
//                   onChange={(e) =>
//                     setPasswords({ ...passwords, current: e.target.value })
//                   }
//                   className={`w-full px-4 py-2 rounded-lg ${darkModeClasses.input}`}
//                   required
//                 />
//               </div>
//               <div>
//                 <label
//                   className={`block text-sm font-medium ${darkModeClasses.text.secondary} mb-2`}
//                 >
//                   New Password
//                 </label>
//                 <input
//                   type="password"
//                   value={passwords.new}
//                   onChange={(e) =>
//                     setPasswords({ ...passwords, new: e.target.value })
//                   }
//                   className={`w-full px-4 py-2 rounded-lg ${darkModeClasses.input}`}
//                   required
//                   minLength={6}
//                 />
//               </div>
//               <div>
//                 <label
//                   className={`block text-sm font-medium ${darkModeClasses.text.secondary} mb-2`}
//                 >
//                   Confirm New Password
//                 </label>
//                 <input
//                   type="password"
//                   value={passwords.confirm}
//                   onChange={(e) =>
//                     setPasswords({ ...passwords, confirm: e.target.value })
//                   }
//                   className={`w-full px-4 py-2 rounded-lg ${darkModeClasses.input}`}
//                   required
//                   minLength={6}
//                 />
//               </div>
//               <button
//                 type="button"
//                 onClick={handlePasswordSubmit}
//                 disabled={loading}
//                 className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
//               >
//                 {loading ? "Updating..." : "Update Password"}
//               </button>
//             </div>
//           </div>
//         )}

//         {activeTab === "notifications" && (
//           <div className={`${darkModeClasses.card} rounded-lg shadow-sm p-6`}>
//             <h2
//               className={`text-2xl font-semibold ${darkModeClasses.text.primary} mb-6`}
//             >
//               Notifications
//             </h2>
//             {notifications.length > 0 ? (
//               <div className="space-y-4">
//                 {notifications.map((notification) => (
//                   <div
//                     key={notification._id}
//                     className={`flex items-center justify-between p-4 rounded-lg border ${
//                       notification.isRead
//                         ? isDarkMode
//                           ? "bg-gray-700 border-gray-600"
//                           : "bg-gray-50 border-gray-200"
//                         : isDarkMode
//                         ? "bg-blue-900/20 border-blue-700"
//                         : "bg-blue-50 border-blue-200"
//                     }`}
//                   >
//                     <div className="flex-1">
//                       <p className={`text-sm ${darkModeClasses.text.primary}`}>
//                         {notification.message}
//                       </p>
//                       <p
//                         className={`text-xs ${darkModeClasses.text.muted} mt-1`}
//                       >
//                         {new Date(notification.createdAt).toLocaleString()}
//                       </p>
//                       <span
//                         className={`flex items-center gap-1 ${darkModeClasses.text.secondary} mt-1`}
//                       >
//                         {notification.type === "task" ? (
//                           <>
//                             <CheckSquare size={14} /> Task
//                           </>
//                         ) : notification.type === "invitation" ? (
//                           <>
//                             <UserPlus size={14} /> Invitation
//                           </>
//                         ) : (
//                           <>
//                             <Bell size={14} /> Notification
//                           </>
//                         )}
//                       </span>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       {!notification.isRead && (
//                         <button
//                           onClick={() =>
//                             handleNotificationAction(notification._id, "read")
//                           }
//                           className="p-1 text-blue-600 hover:text-blue-700 transition-colors"
//                           title="Mark as read"
//                         >
//                           <Check size={16} />
//                         </button>
//                       )}
//                       <button
//                         onClick={() =>
//                           handleNotificationAction(notification._id, "delete")
//                         }
//                         className="p-1 text-red-600 hover:text-red-700 transition-colors"
//                         title="Delete notification"
//                       >
//                         <X size={16} />
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className={`${darkModeClasses.text.muted} text-center py-8`}>
//                 No notifications yet
//               </p>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;
