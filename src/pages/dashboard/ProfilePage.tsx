import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  User,
  Lock,
  Bell,
  Edit2,
  Save,
  Check,
  X,
  Trash2,
  ShieldCheck,
  BellRing,
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useTheme } from "../../contexts/ThemeContext";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { GlowingCard, TextGenerateEffect } from "../../components/ui/aceternity";

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

  const [activeTab, setActiveTab] = useState<"profile" | "security" | "notifications">("profile");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isDarkMode } = useTheme();

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
        const response = await getAllNotifications();
        if (response.success && response.notifications) {
          setNotifications(response.notifications);
        }
      } catch (error) {
        console.error("Notifications fetch error:", error);
      }
    };
    fetchNotifications();
  }, [getAllNotifications]);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.fullName || "",
        email: user.email || "",
        username: user.username || "",
        avatar: null,
        avatarPreview: user.avatar || "",
      });
    }
  }, [user]);

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Invalid image file");
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setProfile((prev) => ({
        ...prev,
        avatar: file,
        avatarPreview: previewUrl,
      }));
    }
  };

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updateData: any = {
        name: profile.name.trim(),
        email: profile.email.trim(),
        username: profile.username.trim(),
      };
      if (profile.avatar) updateData.avatar = profile.avatar;

      const result = await updateUser(updateData);
      if (result.success) {
        setEditMode(false);
        toast.success("Profile updated!");
      } else {
        toast.error(result.error || "Update failed");
      }
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error("Passwords don't match");
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
        toast.success("Password updated!");
      } else {
        toast.error(result.error || "Update failed");
      }
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationAction = async (id: string, action: "read" | "delete") => {
    try {
      if (action === "read") {
        await checkNotifications(id);
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      } else {
        await deleteNotification(id);
        setNotifications(prev => prev.filter(n => n._id !== id));
      }
    } catch (error) {
      toast.error(`Action failed`);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: <User size={18} /> },
    { id: "security", label: "Security", icon: <Lock size={18} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={18} />, count: unreadCount },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <TextGenerateEffect 
            words="Account Settings" 
            className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`} 
          />
          <p className={`mt-2 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
            Manage your personal information, security, and preferences.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-semibold ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : isDarkMode
                  ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                {tab.icon}
                <span>{tab.label}</span>
              </div>
              {tab.count !== undefined && tab.count > 0 && (
                <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
          <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-500/10 font-semibold transition-all"
            >
              <X size={18} />
              Sign Out
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "profile" && (
                <GlowingCard className={`${isDarkMode ? "!bg-slate-900 !border-slate-800" : "!bg-white !border-slate-200"} p-8`}>
                  <div className="flex justify-between items-start mb-8 relative z-10">
                    <h3 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                      Profile Information
                    </h3>
                    {!editMode && (
                      <button
                        onClick={() => setEditMode(true)}
                        className="flex items-center gap-2 text-sm font-bold text-blue-500 hover:text-blue-600"
                      >
                        <Edit2 size={16} /> Edit Profile
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleProfileSubmit} className="space-y-6 relative z-10">
                    <div className="flex flex-col sm:flex-row items-center gap-8 mb-8">
                      <div className="relative group">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-800 border-2 border-slate-700">
                          {profile.avatarPreview ? (
                            <img src={profile.avatarPreview} className="w-full h-full object-cover" alt="Profile" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-500">
                              <User size={40} />
                            </div>
                          )}
                        </div>
                        {editMode && (
                          <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-2xl">
                            <Edit2 size={20} className="text-white" />
                            <input type="file" className="hidden" onChange={handleAvatarChange} />
                          </label>
                        )}
                      </div>
                      <div className="text-center sm:text-left">
                        <h4 className={`text-lg font-bold ${isDarkMode ? "text-slate-200" : "text-slate-900"}`}>
                          {user?.fullName}
                        </h4>
                        <p className="text-sm text-slate-500">@{user?.username}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                          Full Name
                        </label>
                        <input
                          disabled={!editMode}
                          value={profile.name}
                          onChange={e => setProfile({ ...profile, name: e.target.value })}
                          className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium outline-none transition-all ${
                            isDarkMode 
                              ? "bg-slate-800 border-slate-700 text-white focus:border-blue-500" 
                              : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500"
                          } disabled:opacity-60`}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                          Username
                        </label>
                        <input
                          disabled={!editMode}
                          value={profile.username}
                          onChange={e => setProfile({ ...profile, username: e.target.value })}
                          className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium outline-none transition-all ${
                            isDarkMode 
                              ? "bg-slate-800 border-slate-700 text-white focus:border-blue-500" 
                              : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500"
                          } disabled:opacity-60`}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                          Email Address
                        </label>
                        <input
                          disabled={!editMode}
                          value={profile.email}
                          onChange={e => setProfile({ ...profile, email: e.target.value })}
                          className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium outline-none transition-all ${
                            isDarkMode 
                              ? "bg-slate-800 border-slate-700 text-white focus:border-blue-500" 
                              : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500"
                          } disabled:opacity-60`}
                        />
                      </div>
                    </div>

                    {editMode && (
                      <div className="flex gap-4 pt-4">
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                        >
                          <Save size={18} /> {loading ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditMode(false)}
                          className={`px-6 py-2.5 rounded-xl font-bold border transition-all ${
                            isDarkMode ? "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200" : "bg-white border-slate-200 text-slate-500 hover:text-slate-700"
                          }`}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </form>
                </GlowingCard>
              )}

              {activeTab === "security" && (
                <GlowingCard className={`${isDarkMode ? "!bg-slate-900 !border-slate-800" : "!bg-white !border-slate-200"} p-8`}>
                  <div className="mb-8 relative z-10">
                    <h3 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                      Password & Security
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Ensure your account stays protected by using a strong password.
                    </p>
                  </div>

                  <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md relative z-10">
                    <div className="space-y-2">
                      <label className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={passwords.current}
                        onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium outline-none transition-all ${
                          isDarkMode 
                            ? "bg-slate-800 border-slate-700 text-white focus:border-blue-500" 
                            : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500"
                        }`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                        New Password
                      </label>
                      <input
                        type="password"
                        value={passwords.new}
                        onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium outline-none transition-all ${
                          isDarkMode 
                            ? "bg-slate-800 border-slate-700 text-white focus:border-blue-500" 
                            : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500"
                        }`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={passwords.confirm}
                        onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium outline-none transition-all ${
                          isDarkMode 
                            ? "bg-slate-800 border-slate-700 text-white focus:border-blue-500" 
                            : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500"
                        }`}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                    >
                      <ShieldCheck size={18} /> {loading ? "Updating..." : "Update Password"}
                    </button>
                  </form>
                </GlowingCard>
              )}

              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center px-2">
                    <h3 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                      Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <span className={`text-sm font-bold ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                        {unreadCount} New
                      </span>
                    )}
                  </div>

                  {notifications.length > 0 ? (
                    <div className="space-y-4">
                      {notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((n) => (
                        <GlowingCard
                          key={n._id}
                          className={`${
                            n.isRead 
                              ? (isDarkMode ? "!bg-slate-900/50 !border-slate-800" : "!bg-white !border-slate-100") 
                              : (isDarkMode ? "!bg-blue-900/10 !border-blue-800/50" : "!bg-blue-50 !border-blue-200")
                          } px-6 py-4`}
                        >
                          <div className="flex items-start gap-4 relative z-10">
                            <div className={`p-2 rounded-lg mt-1 ${n.isRead ? "bg-slate-800/50 text-slate-500" : "bg-blue-500/20 text-blue-500"}`}>
                              <BellRing size={16} />
                            </div>
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>
                                {n.message}
                              </p>
                              <p className="text-xs text-slate-500 mt-1">
                                {new Date(n.createdAt).toLocaleString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {!n.isRead && (
                                <button
                                  onClick={() => handleNotificationAction(n._id, "read")}
                                  className={`p-1.5 rounded-lg transition-all ${isDarkMode ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}
                                  title="Mark as read"
                                >
                                  <Check size={16} />
                                </button>
                              )}
                              <button
                                onClick={() => handleNotificationAction(n._id, "delete")}
                                className={`p-1.5 rounded-lg transition-all ${isDarkMode ? "hover:bg-rose-900/20 text-rose-400" : "hover:bg-rose-50 text-rose-500"}`}
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </GlowingCard>
                      ))}
                    </div>
                  ) : (
                    <div className={`text-center py-20 rounded-3xl border-2 border-dashed ${isDarkMode ? "border-slate-800 bg-slate-900/20" : "border-slate-200 bg-slate-50"}`}>
                      <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${isDarkMode ? "bg-slate-800 text-slate-500" : "bg-white text-slate-300"}`}>
                        <Bell size={32} />
                      </div>
                      <h3 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>All Caught Up!</h3>
                      <p className={`mt-2 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                        You don't have any new notifications at the moment.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

// import { useState, useEffect } from "react";
// import type { ChangeEvent, FormEvent } from "react";
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

// interface Notification {
//   _id: string;
//   message: string;
//   isRead: boolean;
//   type: string;
//   createdAt: string;
// }

// interface ProfileForm {
//   name: string;
//   email: string;
//   username: string;
//   avatar: File | null;
//   avatarPreview: string;
// }

// interface PasswordForm {
//   current: string;
//   new: string;
//   confirm: string;
// }

// interface DarkModeClasses {
//   container: string;
//   sidebar: string;
//   card: string;
//   text: {
//     primary: string;
//     secondary: string;
//     muted: string;
//   };
//   input: string;
//   button: {
//     active: string;
//     inactive: string;
//   };
// }

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

//   const [activeTab, setActiveTab] = useState<
//     "profile" | "security" | "notifications"
//   >("profile");
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [editMode, setEditMode] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const { isDarkMode } = useTheme();

//   // Form states
//   const [profile, setProfile] = useState<ProfileForm>({
//     name: "",
//     email: "",
//     username: "",
//     avatar: null,
//     avatarPreview: "",
//   });

//   const [passwords, setPasswords] = useState<PasswordForm>({
//     current: "",
//     new: "",
//     confirm: "",
//   });

//   const unreadCount = notifications.filter((n) => !n.isRead).length;

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         setLoading(true);
//         const response = await getAllNotifications();
//         // console.log("Notice res", response);
//         if (response.success && response.notifications) {
//           setNotifications(response.notifications);
//         }
//       } catch (error: any) {
//         toast.error("Failed to fetch notifications");
//         console.log(error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNotifications();
//   }, [getAllNotifications]);

//   // Initialize form with user data
//   useEffect(() => {
//     if (user) {
//       // console.log("User data:", user);
//       setProfile({
//         name: user.fullName || "",
//         email: user.email || "",
//         username: user.username || "",
//         avatar: null,
//         avatarPreview: user.avatar || "",
//       });
//     }
//   }, [user]);

//   // Handle avatar file selection
//   const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     console.log("=== Avatar Change Debug ===");
//     console.log("File input changed:", file);
//     console.log("File details:", {
//       name: file?.name,
//       size: file?.size,
//       type: file?.type,
//       isFile: file instanceof File,
//     });

//     if (file) {
//       // Validate file type
//       if (!file.type.startsWith("image/")) {
//         toast.error("Please select a valid image file");
//         return;
//       }

//       // Validate file size (5MB limit)
//       if (file.size > 5 * 1024 * 1024) {
//         toast.error("File size must be less than 5MB");
//         return;
//       }

//       // Create preview URL
//       const previewUrl = URL.createObjectURL(file);
//       console.log("Created preview URL:", previewUrl);

//       setProfile((prev) => {
//         const newProfile = {
//           ...prev,
//           avatar: file, // This should be the actual File object
//           avatarPreview: previewUrl,
//         };
//         console.log("Updated profile with avatar:", newProfile);
//         return newProfile;
//       });
//     } else {
//       console.log("No file selected");
//     }
//   };

//   const handleProfileSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       console.log("=== Profile Submit Debug ===");
//       console.log("Profile state:", profile);
//       console.log("Avatar file details:", {
//         file: profile.avatar,
//         isFile: profile.avatar instanceof File,
//         name: profile.avatar?.name,
//         size: profile.avatar?.size,
//         type: profile.avatar?.type,
//         constructor: profile.avatar?.constructor?.name,
//       });

//       // Prepare the update data
//       const updateData: {
//         name: string;
//         email: string;
//         username: string;
//         avatar?: File;
//       } = {
//         name: profile.name.trim(),
//         email: profile.email.trim(),
//         username: profile.username.trim(),
//       };

//       // Only include avatar if it's a valid File object
//       if (profile.avatar && profile.avatar instanceof File) {
//         updateData.avatar = profile.avatar;
//         console.log("✅ Including avatar in update:", {
//           name: profile.avatar.name,
//           size: profile.avatar.size,
//           type: profile.avatar.type,
//         });
//       } else {
//         console.log("❌ No valid avatar file to upload");
//       }

//       console.log("Final updateData:", updateData);

//       const result = await updateUser(updateData);
//       console.log("Update result:", result);

//       if (result.success) {
//         setEditMode(false);
//         // Reset avatar file after successful upload
//         setProfile((prev) => ({ ...prev, avatar: null }));
//         toast.success("Profile updated successfully!");
//       } else {
//         toast.error(result.error || "Update failed");
//       }
//     } catch (error: any) {
//       console.error("Profile update error:", error);
//       toast.error("Update failed: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePasswordSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     if (passwords.new !== passwords.confirm) {
//       toast.error("Passwords don't match");
//       return;
//     }
//     if (passwords.new.length < 6) {
//       toast.error("Password must be at least 6 characters long");
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
//         toast.success("Password updated successfully!");
//       } else {
//         toast.error(result.error || "Password update failed");
//       }
//     } catch (error: any) {
//       toast.error("Password update failed: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleNotificationAction = async (
//     id: string,
//     action: "read" | "delete"
//   ) => {
//     try {
//       if (action === "read") {
//         await checkNotifications(id);
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
//     } catch (error: any) {
//       toast.error(`Failed to ${action} notification: ${error.message}`);
//     }
//   };

//   const handleCancelEdit = () => {
//     setEditMode(false);
//     // Reset form to original user data
//     if (user) {
//       setProfile({
//         name: user.fullName || "",
//         email: user.email || "",
//         username: user.username || "",
//         avatar: null,
//         avatarPreview: user.avatar || "",
//       });
//     }
//   };

//   // Dark mode classes
//   const darkModeClasses: DarkModeClasses = {
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
//                 alt={user.fullName || "User"}
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
//                   onClick={handleCancelEdit}
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
//               <form onSubmit={handleProfileSubmit} className="space-y-6">
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
//                     <div className="flex-1">
//                       <input
//                         type="file"
//                         accept="image/*"
//                         onChange={handleAvatarChange}
//                         className={`block w-full text-sm ${darkModeClasses.text.secondary} file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${darkModeClasses.input}`}
//                       />
//                       <p
//                         className={`text-xs ${darkModeClasses.text.muted} mt-1`}
//                       >
//                         PNG, JPG, GIF up to 5MB
//                       </p>
//                     </div>
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
//                       setProfile({
//                         ...profile,
//                         name: e.target.value,
//                       })
//                     }
//                     className={`w-full px-4 py-2 rounded-lg ${darkModeClasses.input}`}
//                     required
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
//                       setProfile({
//                         ...profile,
//                         username: e.target.value,
//                       })
//                     }
//                     className={`w-full px-4 py-2 rounded-lg ${darkModeClasses.input}`}
//                     required
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
//                       setProfile({
//                         ...profile,
//                         email: e.target.value,
//                       })
//                     }
//                     className={`w-full px-4 py-2 rounded-lg ${darkModeClasses.input}`}
//                     required
//                   />
//                 </div>
//                 <button
//                   type="submit"
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
//               </form>
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
//             <form
//               onSubmit={handlePasswordSubmit}
//               className="space-y-6 max-w-md"
//             >
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
//                     setPasswords({
//                       ...passwords,
//                       current: e.target.value,
//                     })
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
//                     setPasswords({
//                       ...passwords,
//                       new: e.target.value,
//                     })
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
//                     setPasswords({
//                       ...passwords,
//                       confirm: e.target.value,
//                     })
//                   }
//                   className={`w-full px-4 py-2 rounded-lg ${darkModeClasses.input}`}
//                   required
//                   minLength={6}
//                 />
//               </div>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
//               >
//                 {loading ? "Updating..." : "Update Password"}
//               </button>
//             </form>
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
//                 {/* Sort notifications by date descending */}
//                 {[...notifications]
//                   .sort(
//                     (a, b) =>
//                       new Date(b.createdAt).getTime() -
//                       new Date(a.createdAt).getTime()
//                   )
//                   .map((notification) => (
//                     <div
//                       key={notification._id}
//                       className={`flex items-center justify-between p-4 rounded-lg border ${
//                         notification.isRead
//                           ? isDarkMode
//                             ? "bg-gray-700 border-gray-600"
//                             : "bg-gray-50 border-gray-200"
//                           : isDarkMode
//                           ? "bg-blue-900/20 border-blue-700"
//                           : "bg-blue-50 border-blue-200"
//                       }`}
//                     >
//                       <div className="flex-1">
//                         <p
//                           className={`text-sm ${darkModeClasses.text.primary}`}
//                         >
//                           {notification.message}
//                         </p>
//                         <p
//                           className={`text-xs ${darkModeClasses.text.muted} mt-1`}
//                         >
//                           {new Date(notification.createdAt).toLocaleString()}
//                         </p>
//                         <span
//                           className={`flex items-center gap-1 ${darkModeClasses.text.secondary} mt-1`}
//                         >
//                           {notification.type === "task" ? (
//                             <>
//                               <CheckSquare size={14} /> Task
//                             </>
//                           ) : notification.type === "invitation" ? (
//                             <>
//                               <UserPlus size={14} /> Invitation
//                             </>
//                           ) : (
//                             <>
//                               <Bell size={14} /> Notification
//                             </>
//                           )}
//                         </span>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         {!notification.isRead && (
//                           <button
//                             onClick={() =>
//                               handleNotificationAction(notification._id, "read")
//                             }
//                             className="p-1 text-blue-600 hover:text-blue-700 transition-colors"
//                             title="Mark as read"
//                           >
//                             <Check size={16} />
//                           </button>
//                         )}
//                         <button
//                           onClick={() =>
//                             handleNotificationAction(notification._id, "delete")
//                           }
//                           className="p-1 text-red-600 hover:text-red-700 transition-colors"
//                           title="Delete notification"
//                         >
//                           <X size={16} />
//                         </button>
//                       </div>
//                     </div>
//                   ))}
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
