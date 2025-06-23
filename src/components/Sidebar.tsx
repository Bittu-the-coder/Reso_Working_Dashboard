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
import { useTheme } from "../contexts/useTheme";
import { useAuth } from "../contexts/AuthContext";

interface SidebarProps {
  navigationItems: {
    name: string;
    icon: React.ReactNode;
    path: string;
    submenu?: { name: string; path: string }[];
  }[];
}

const Sidebar: React.FC<SidebarProps> = ({ navigationItems }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { isDarkMode, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const location = useLocation();
  const { user } = useAuth();

  // Handle responsive state
  useEffect(() => {
    const handleResize = () => {
      // Auto-collapse sidebar on medium screens
      if (window.innerWidth < 1280 && window.innerWidth >= 1024) {
        setIsCollapsed(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Check on initial render

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
      {" "}
      {/* Mobile Header - Compact with Fixed Width */}
      <header
        className={`lg:hidden fixed top-0 left-0 flex items-center py-3 px-4 
        rounded-br-2xl shadow-lg z-20 w-auto max-w-[100px] md:max-w-[120px]
        transition-all duration-300 ease-in-out ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className={`rounded-full touch-manipulation ${
              isDarkMode
                ? "hover:bg-gray-700 active:bg-gray-600"
                : "hover:bg-gray-100 active:bg-gray-200"
            } transition-colors`}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <Link to="/dashboard" className="flex items-center ml-2">
            <span
              className={`font-bold text-lg bg-gradient-to-r ${
                isDarkMode
                  ? "from-blue-400 to-purple-400"
                  : "from-blue-600 to-purple-600"
              } bg-clip-text text-transparent hidden sm:inline-block`}
            >
              RESO
            </span>
          </Link>
        </div>
      </header>{" "}
      {/* Mobile Controls - Fixed to top right */}
      <div
        className={`lg:hidden fixed top-0 right-0 flex items-center gap-2 py-3 px-4 
        rounded-bl-2xl shadow-lg z-20 transition-all duration-300 ease-in-out ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Show user initial on mobile */}
        <div
          className={`w-8 h-8 text-xs rounded-full bg-gradient-to-r hidden sm:flex
          ${
            isDarkMode
              ? "from-blue-500 to-purple-500"
              : "from-blue-600 to-purple-600"
          }
          items-center justify-center text-white font-bold`}
        >
          {user?.name
            ? user.name
                .split(" ")
                .map((name) => name.charAt(0))
                .join("")
            : "U"}
        </div>
        <button
          onClick={toggleTheme}
          className={`rounded-full touch-manipulation ${
            isDarkMode
              ? "bg-gray-700 text-blue-400 active:bg-gray-600"
              : "bg-gray-100 text-blue-600 active:bg-gray-200"
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
            {" "}
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-30 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            {/* Mobile Sidebar */}
            <motion.aside
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`fixed top-0 left-0 bottom-0 w-[75%] max-w-[280px] z-40 ${
                isDarkMode ? "bg-gray-800" : "bg-white"
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
              {" "}
              <div
                className="p-5 flex justify-between items-center border-b border-opacity-10
                  border-gray-300 dark:border-gray-700"
              >
                <Link
                  to="/dashboard"
                  className="flex items-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span
                    className={`font-bold text-xl bg-gradient-to-r ${
                      isDarkMode
                        ? "from-blue-400 to-purple-400"
                        : "from-blue-600 to-purple-600"
                    } bg-clip-text text-transparent`}
                  >
                    RESO Dashboard
                  </span>
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`p-2.5 rounded-full touch-manipulation ${
                    isDarkMode
                      ? "hover:bg-gray-700 active:bg-gray-600"
                      : "hover:bg-gray-100 active:bg-gray-200"
                  } transition-colors`}
                  aria-label="Close menu"
                >
                  <X size={22} />
                </button>
              </div>
              <div className="px-4 pb-6">
                <div
                  className={`p-4 mb-4 rounded-xl ${
                    isDarkMode ? "bg-gray-700/50" : "bg-blue-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {" "}
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-r ${
                        isDarkMode
                          ? "from-blue-500 to-purple-500"
                          : "from-blue-600 to-purple-600"
                      } flex items-center justify-center text-white font-bold`}
                    >
                      {user?.name
                        ? user.name
                            .split(" ")
                            .map((name) => name.charAt(0))
                            .join("")
                        : "U"}
                    </div>
                    <div className="flex-1">
                      <p
                        className={`font-semibold ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {user?.name || "User Name"}
                      </p>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        {user?.email || "user@example.com"}
                      </p>
                    </div>
                  </div>
                </div>{" "}
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
                                  ? "bg-blue-900/40 text-blue-300"
                                  : "bg-blue-50 text-blue-700"
                                : isDarkMode
                                ? "text-gray-200 hover:bg-gray-700 active:bg-gray-600"
                                : "text-gray-700 hover:bg-gray-100 active:bg-gray-200"
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
                                        ? "bg-blue-900/30 text-blue-300"
                                        : "bg-blue-50 text-blue-700"
                                      : isDarkMode
                                      ? "text-gray-300 hover:bg-gray-700 active:bg-gray-600"
                                      : "text-gray-600 hover:bg-gray-100 active:bg-gray-200"
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
                                ? "bg-blue-900/40 text-blue-300"
                                : "bg-blue-50 text-blue-700"
                              : isDarkMode
                              ? "text-gray-200 hover:bg-gray-700 active:bg-gray-600"
                              : "text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                          } transition-all duration-150`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <span className="w-6 h-6">{item.icon}</span>
                          <span className="font-medium">{item.name}</span>
                        </Link>
                      )}
                    </div>
                  ))}{" "}
                  <button
                    onClick={logout}
                    className={`flex items-center gap-3.5 px-4 py-4 rounded-lg w-full touch-manipulation ${
                      isDarkMode
                        ? "text-red-300 hover:bg-red-900/20 active:bg-red-900/40"
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
      {/* Desktop Sidebar */}{" "}
      <motion.aside
        initial="expanded"
        animate={isCollapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`hidden lg:block h-screen sticky top-0 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } shadow-lg overflow-hidden z-20 border-r border-opacity-10 ${
          isDarkMode ? "border-gray-700" : "border-gray-200"
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
                  className={`font-bold text-xl bg-gradient-to-r ${
                    isDarkMode
                      ? "from-blue-400 to-purple-400"
                      : "from-blue-600 to-purple-600"
                  } bg-clip-text text-transparent`}
                >
                  RESO
                </span>
              </Link>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`p-1.5 rounded-full ${
                isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
            >
              <ChevronRight
                size={20}
                className={`transform transition-transform ${
                  isCollapsed ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>{" "}
          {isCollapsed ? (
            <div className="px-2 mt-4 mb-6 flex justify-center">
              <div
                className={`w-10 h-10 text-lg rounded-full bg-gradient-to-r ${
                  isDarkMode
                    ? "from-blue-500 to-purple-500"
                    : "from-blue-600 to-purple-600"
                } flex items-center justify-center text-white font-bold`}
                title={user?.name || "User"}
              >
                {user?.name
                  ? user.name
                      .split(" ")
                      .map((name) => name.charAt(0))
                      .join("")
                  : "U"}
              </div>
            </div>
          ) : (
            <div className={`px-4 mt-2 mb-6`}>
              <div
                className={`p-4 rounded-xl ${
                  isDarkMode ? "bg-gray-700/50" : "bg-blue-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 text-lg rounded-full bg-gradient-to-r ${
                      isDarkMode
                        ? "from-blue-500 to-purple-500"
                        : "from-blue-600 to-purple-600"
                    } flex items-center justify-center text-white font-bold`}
                  >
                    {user?.name
                      ? user.name
                          .split(" ")
                          .map((name) => name.charAt(0))
                          .join("")
                      : "U"}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`font-semibold ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {user?.name || "User Name"}
                    </p>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      {user?.email || "user@example.com"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}{" "}
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
                              ? "bg-blue-900/40 text-blue-300 shadow-inner"
                              : "bg-blue-50 text-blue-700 shadow-sm"
                            : isDarkMode
                            ? "text-gray-200 hover:bg-gray-700 active:bg-gray-600"
                            : "text-gray-700 hover:bg-gray-100 active:bg-gray-200"
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
                                    ? "bg-blue-900/30 text-blue-300"
                                    : "bg-blue-50 text-blue-700"
                                  : isDarkMode
                                  ? "text-gray-300 hover:bg-gray-700 active:bg-gray-600"
                                  : "text-gray-600 hover:bg-gray-100 active:bg-gray-200"
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
                            ? "bg-blue-900/40 text-blue-300 shadow-inner"
                            : "bg-blue-50 text-blue-700 shadow-sm"
                          : isDarkMode
                          ? "text-gray-200 hover:bg-gray-700 active:bg-gray-600"
                          : "text-gray-700 hover:bg-gray-100 active:bg-gray-200"
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
          </nav>{" "}
          <div className={`p-4 ${isCollapsed ? "px-2" : ""}`}>
            <div
              className={`${
                !isCollapsed &&
                "border-t border-opacity-10 pt-4 mt-2 border-gray-300 dark:border-gray-700"
              }`}
            >
              <button
                onClick={toggleTheme}
                className={`mb-3 flex items-center ${
                  isCollapsed ? "justify-center w-full px-0" : "gap-3.5 px-4"
                } py-3 rounded-lg ${
                  isDarkMode
                    ? "text-yellow-300 hover:bg-gray-700 active:bg-gray-600"
                    : "text-blue-700 hover:bg-gray-100 active:bg-gray-200"
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
                    ? "text-red-300 hover:bg-red-900/20 active:bg-red-900/30"
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
