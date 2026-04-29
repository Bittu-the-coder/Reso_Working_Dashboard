import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronRight,
  Menu,
  X,
  LogOut,
  Moon,
  Sun,
  ChevronDown,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useAuthStore } from "../store/useAuthStore";

interface NavigationItem {
  name: string;
  icon: React.ReactNode;
  path: string;
  submenu?: { name: string; path: string }[];
}

interface SidebarProps {
  navigationItems: NavigationItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ navigationItems }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { isDarkMode, toggleTheme } = useTheme();
  const { logout, user } = useAuthStore();
  const location = useLocation();

  // Handle responsive state
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1280 && window.innerWidth >= 1024) {
        setIsCollapsed(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleDropdown = (menu: string) => {
    if (activeDropdown === menu) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(menu);
    }
  };

  // Animation variants
  const sidebarVariants = {
    expanded: { width: "280px" },
    collapsed: { width: "80px" },
  };

  const mobileMenuVariants = {
    open: { x: 0 },
    closed: { x: "-100%" },
  };

  return (
    <>
      {/* Mobile Header */}
      <header
        className={`lg:hidden fixed top-0 left-0 flex items-center py-3 px-4 
        rounded-br-2xl shadow-lg z-20 w-auto max-w-[100px] md:max-w-[120px]
        transition-all duration-300 ease-in-out ${
          isDarkMode ? "bg-slate-900" : "bg-white"
        }`}
      >
        <div className="flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className={`rounded-full touch-manipulation ${
              isDarkMode
                ? "hover:bg-slate-800 active:bg-slate-700"
                : "hover:bg-slate-100 active:bg-slate-200"
            } transition-colors`}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <Link to="/dashboard" className="flex items-center ml-2">
            <span
              className={`font-bold text-lg ${
                isDarkMode ? "text-blue-400" : "text-blue-600"
              } hidden sm:inline-block`}
            >
              RESO
            </span>
          </Link>
        </div>
      </header>

      {/* Mobile Controls */}
      <div
        className={`lg:hidden fixed top-0 right-0 flex items-center gap-2 py-3 px-4 
        rounded-bl-2xl shadow-lg z-20 transition-all duration-300 ease-in-out ${
          isDarkMode ? "bg-slate-900" : "bg-white"
        }`}
      >
        <div
          className={`w-10 h-10 rounded-full overflow-hidden flex-shrink-0 
                      ring-2 ${
                        isDarkMode ? "ring-slate-700" : "ring-slate-200"
                      }`}
        >
          <img
            src={
              user?.avatar ||
              "https://mighty.tools/mockmind-api/content/cartoon/25.jpg"
            }
            alt={user?.fullName || "User avatar"}
            className="w-full h-full object-cover"
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.src =
                "https://ui-avatars.com/api/?name=" +
                (user?.fullName || "User") +
                "&background=1e40af&color=fff";
            }}
          />
        </div>
        <button
          onClick={toggleTheme}
          className={`rounded-full touch-manipulation ${
            isDarkMode
              ? "bg-slate-800 text-amber-400 active:bg-slate-700"
              : "bg-slate-100 text-slate-600 active:bg-slate-200"
          } transition-colors`}
          aria-label={
            isDarkMode ? "Switch to light mode" : "Switch to dark mode"
          }
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* Page Content Spacer for Mobile */}
      <div className="h-20 lg:hidden"></div>

      {/* Mobile Sidebar (Overlay) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-30 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`fixed top-0 left-0 bottom-0 w-[75%] max-w-[280px] z-40 ${
                isDarkMode ? "bg-slate-900" : "bg-white"
              } shadow-xl lg:hidden overflow-y-auto safe-area-inset-left`}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, { offset, velocity }) => {
                if (offset.x < -50 || velocity.x < -500) {
                  setIsMobileMenuOpen(false);
                }
              }}
            >
              <div
                className={`p-5 flex justify-between items-center border-b ${
                  isDarkMode ? "border-slate-800" : "border-slate-200"
                }`}
              >
                <Link
                  to="/dashboard"
                  className="flex items-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span
                    className={`font-bold text-xl ${
                      isDarkMode ? "text-blue-400" : "text-blue-600"
                    }`}
                  >
                    RESO Dashboard
                  </span>
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`p-2.5 rounded-full touch-manipulation ${
                    isDarkMode
                      ? "hover:bg-slate-800 active:bg-slate-700"
                      : "hover:bg-slate-100 active:bg-slate-200"
                  } transition-colors`}
                  aria-label="Close menu"
                >
                  <X size={22} />
                </button>
              </div>
              <div className="px-4 pb-6">
                <div
                  className={`p-4 mb-4 rounded-xl ${
                    isDarkMode ? "bg-slate-800/50" : "bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full overflow-hidden flex-shrink-0 
                      ring-2 ${
                        isDarkMode ? "ring-slate-700" : "ring-slate-200"
                      }`}
                    >
                      <img
                        src={
                          user?.avatar ||
                          "https://mighty.tools/mockmind-api/content/cartoon/25.jpg"
                        }
                        alt={user?.fullName || "User avatar"}
                        className="w-full h-full object-cover"
                        onError={(
                          e: React.SyntheticEvent<HTMLImageElement>
                        ) => {
                          e.currentTarget.src =
                            "https://ui-avatars.com/api/?name=" +
                            (user?.fullName || "User") +
                            "&background=1e40af&color=fff";
                        }}
                      />
                    </div>
                    <Link
                      to="/dashboard/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex-1">
                        <p
                          className={`font-semibold ${
                            isDarkMode ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {user?.fullName || "User Name"}
                        </p>
                        <p
                          className={`text-sm ${
                            isDarkMode ? "text-slate-400" : "text-slate-500"
                          }`}
                        >
                          {user?.email || "user@example.com"}
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>
                <nav className="space-y-0.5 pt-2">
                  {navigationItems.map((item) => (
                    <div key={item.name} className="mb-1">
                      {item.submenu ? (
                        <div>
                          <button
                            onClick={() => toggleDropdown(item.name)}
                            className={`w-full flex items-center justify-between px-4 py-4 rounded-lg mb-1 touch-manipulation ${
                              location.pathname.includes(item.path)
                                ? isDarkMode
                                  ? "bg-blue-900/30 text-blue-400"
                                  : "bg-blue-50 text-blue-700"
                                : isDarkMode
                                ? "text-slate-200 hover:bg-slate-800 active:bg-slate-700"
                                : "text-slate-700 hover:bg-slate-100 active:bg-slate-200"
                            } transition-all duration-150`}
                          >
                            <div className="flex items-center gap-3.5">
                              <span className="w-6 h-6">{item.icon}</span>
                              <span className="font-medium">{item.name}</span>
                            </div>
                            <ChevronDown
                              size={18}
                              className={`transform transition-transform ${
                                activeDropdown === item.name ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          {activeDropdown === item.name && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="ml-10 mb-1 space-y-0.5"
                            >
                              {item.submenu.map((subitem) => (
                                <Link
                                  key={subitem.name}
                                  to={subitem.path}
                                  className={`block px-4 py-3.5 rounded-lg touch-manipulation ${
                                    location.pathname === subitem.path
                                      ? isDarkMode
                                        ? "bg-blue-900/20 text-blue-400"
                                        : "bg-blue-50 text-blue-700"
                                      : isDarkMode
                                      ? "text-slate-300 hover:bg-slate-800 active:bg-slate-700"
                                      : "text-slate-600 hover:bg-slate-100 active:bg-slate-200"
                                  } transition-all duration-150`}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  {subitem.name}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </div>
                      ) : (
                        <Link
                          to={item.path}
                          className={`flex items-center gap-3.5 px-4 py-4 rounded-lg touch-manipulation ${
                            location.pathname === item.path ||
                            (item.path === "/dashboard" &&
                              location.pathname === "/dashboard/")
                              ? isDarkMode
                                ? "bg-blue-900/30 text-blue-400"
                                : "bg-blue-50 text-blue-700"
                              : isDarkMode
                              ? "text-slate-200 hover:bg-slate-800 active:bg-slate-700"
                              : "text-slate-700 hover:bg-slate-100 active:bg-slate-200"
                          } transition-all duration-150`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <span className="w-6 h-6">{item.icon}</span>
                          <span className="font-medium">{item.name}</span>
                        </Link>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={logout}
                    className={`flex items-center gap-3.5 px-4 py-4 rounded-lg w-full touch-manipulation ${
                      isDarkMode
                        ? "text-red-400 hover:bg-red-900/20 active:bg-red-900/40"
                        : "text-red-600 hover:bg-red-50 active:bg-red-100"
                    } transition-all duration-150 mt-4 font-medium`}
                  >
                    <span className="w-6 h-6">
                      <LogOut />
                    </span>
                    <span>Logout</span>
                  </button>
                </nav>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        initial="expanded"
        animate={isCollapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`hidden lg:block h-screen sticky top-0 ${
          isDarkMode ? "bg-slate-900" : "bg-white"
        } shadow-lg overflow-hidden z-20 border-r ${
          isDarkMode ? "border-slate-800" : "border-slate-200"
        }`}
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "transparent transparent",
        }}
      >
        <div
          className={`h-full flex flex-col ${
            isCollapsed ? "items-center" : ""
          }`}
        >
          <div
            className={`p-6 flex ${
              isCollapsed ? "justify-center" : "justify-between"
            } items-center`}
          >
            {!isCollapsed && (
              <Link to="/dashboard" className="flex items-center">
                <span
                  className={`font-bold text-xl ${
                    isDarkMode ? "text-blue-400" : "text-blue-600"
                  }`}
                >
                  RESO
                </span>
              </Link>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`p-1.5 rounded-full ${
                isDarkMode ? "hover:bg-slate-800" : "hover:bg-slate-100"
              }`}
            >
              <ChevronRight
                size={20}
                className={`transform transition-transform ${
                  isCollapsed ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
          {isCollapsed ? (
            <div
              className={`w-10 h-10 rounded-full overflow-hidden flex-shrink-0 
            ring-2 ${isDarkMode ? "ring-slate-700" : "ring-slate-200"}`}
            >
              <img
                src={
                  user?.avatar ||
                  "https://mighty.tools/mockmind-api/content/cartoon/25.jpg"
                }
                alt={user?.fullName || "User avatar"}
                className="w-full h-full object-cover"
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.src =
                    "https://ui-avatars.com/api/?name=" +
                    (user?.fullName || "User") +
                    "&background=1e40af&color=fff";
                }}
              />
            </div>
          ) : (
            <div className={`px-4 mt-2 mb-6`}>
              <div
                className={`p-4 rounded-xl ${
                  isDarkMode ? "bg-slate-800/50" : "bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full overflow-hidden flex-shrink-0 
                      ring-2 ${
                        isDarkMode ? "ring-slate-700" : "ring-slate-200"
                      }`}
                  >
                    <img
                      src={
                        user?.avatar ||
                        "https://mighty.tools/mockmind-api/content/cartoon/25.jpg"
                      }
                      alt={user?.fullName || "User avatar"}
                      className="w-full h-full object-cover"
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        e.currentTarget.src =
                          "https://ui-avatars.com/api/?name=" +
                          (user?.fullName || "User") +
                          "&background=1e40af&color=fff";
                      }}
                    />
                  </div>
                  <Link to={"/dashboard/profile"}>
                    <div className="flex-1">
                      <p
                        className={`font-semibold ${
                          isDarkMode ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {user?.fullName || "User Name"}
                      </p>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-slate-400" : "text-slate-500"
                        }`}
                      >
                        {user?.email || "user@example.com"}
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          )}
          <nav
            className={`flex-1 overflow-y-auto ${
              isCollapsed ? "px-2" : "px-4"
            } py-2`}
          >
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <div key={item.name} className="mb-1.5">
                  {item.submenu && !isCollapsed ? (
                    <div>
                      <button
                        onClick={() => toggleDropdown(item.name)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg mb-1 ${
                          location.pathname.includes(item.path)
                            ? isDarkMode
                              ? "bg-blue-900/30 text-blue-400"
                              : "bg-blue-50 text-blue-700 shadow-sm"
                            : isDarkMode
                            ? "text-slate-200 hover:bg-slate-800 active:bg-slate-700"
                            : "text-slate-700 hover:bg-slate-100 active:bg-slate-200"
                        } transition-all duration-150`}
                      >
                        <div className="flex items-center gap-3.5">
                          <span className="w-5 h-5">{item.icon}</span>
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <ChevronDown
                          size={16}
                          className={`transform transition-transform ${
                            activeDropdown === item.name ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {activeDropdown === item.name && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="ml-9 mb-1.5 space-y-1"
                        >
                          {item.submenu.map((subitem) => (
                            <Link
                              key={subitem.name}
                              to={subitem.path}
                              className={`block px-4 py-2.5 rounded-lg ${
                                location.pathname === subitem.path
                                  ? isDarkMode
                                    ? "bg-blue-900/20 text-blue-400"
                                    : "bg-blue-50 text-blue-700"
                                  : isDarkMode
                                  ? "text-slate-300 hover:bg-slate-800 active:bg-slate-700"
                                  : "text-slate-600 hover:bg-slate-100 active:bg-slate-200"
                              } transition-all duration-150 text-sm`}
                            >
                              {subitem.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className={`flex items-center ${
                        isCollapsed ? "justify-center" : "gap-3.5"
                      } px-4 py-3 rounded-lg ${
                        location.pathname === item.path ||
                        (item.path === "/dashboard" &&
                          location.pathname === "/dashboard/")
                          ? isDarkMode
                            ? "bg-blue-900/30 text-blue-400"
                            : "bg-blue-50 text-blue-700 shadow-sm"
                          : isDarkMode
                          ? "text-slate-200 hover:bg-slate-800 active:bg-slate-700"
                          : "text-slate-700 hover:bg-slate-100 active:bg-slate-200"
                      } transition-all duration-150`}
                      title={isCollapsed ? item.name : ""}
                    >
                      <span
                        className={`${isCollapsed ? "w-6 h-6" : "w-5 h-5"}`}
                      >
                        {item.icon}
                      </span>
                      {!isCollapsed && (
                        <span className="font-medium">{item.name}</span>
                      )}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </nav>
          <div className={`p-4 ${isCollapsed ? "px-2" : ""}`}>
            <div
              className={`${
                !isCollapsed &&
                `border-t pt-4 mt-2 ${
                  isDarkMode ? "border-slate-800" : "border-slate-200"
                }`
              }`}
            >
              <button
                onClick={toggleTheme}
                className={`mb-3 flex items-center ${
                  isCollapsed ? "justify-center w-full px-0" : "gap-3.5 px-4"
                } py-3 rounded-lg ${
                  isDarkMode
                    ? "text-amber-400 hover:bg-slate-800 active:bg-slate-700"
                    : "text-slate-700 hover:bg-slate-100 active:bg-slate-200"
                } transition-all duration-150`}
                title={
                  isCollapsed
                    ? isDarkMode
                      ? "Switch to Light Mode"
                      : "Switch to Dark Mode"
                    : ""
                }
              >
                <span className={`${isCollapsed ? "w-6 h-6" : "w-5 h-5"}`}>
                  {isDarkMode ? <Sun /> : <Moon />}
                </span>
                {!isCollapsed && (
                  <span className="font-medium">
                    {isDarkMode ? "Light Mode" : "Dark Mode"}
                  </span>
                )}
              </button>

              <button
                onClick={logout}
                className={`flex items-center ${
                  isCollapsed ? "justify-center w-full px-0" : "gap-3.5 px-4"
                } py-3 rounded-lg ${
                  isDarkMode
                    ? "text-red-400 hover:bg-red-900/20 active:bg-red-900/30"
                    : "text-red-600 hover:bg-red-50 active:bg-red-100"
                } transition-all duration-150`}
                title={isCollapsed ? "Logout" : ""}
              >
                <span className={`${isCollapsed ? "w-6 h-6" : "w-5 h-5"}`}>
                  <LogOut />
                </span>
                {!isCollapsed && <span className="font-medium">Logout</span>}
              </button>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
