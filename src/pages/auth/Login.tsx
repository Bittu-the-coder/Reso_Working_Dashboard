import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useTheme } from "../../contexts/ThemeContext";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

export const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  // Use Zustand store
  const {
    login,
    user,
    loading: authLoading,
    error: authError,
  } = useAuthStore();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // Handle auth errors
  useEffect(() => {
    if (authError) {
      toast.error(authError);
    }
  }, [authError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login(formData);
      if (result?.success) {
        toast.success("Login successful!");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMsg = error instanceof Error ? error.message : "Login failed";
      toast.error(errorMsg);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        backgroundImage:
          "url('https://plus.unsplash.com/premium_photo-1661767467261-4a4bed92a507?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dGVhbXxlbnwwfHwwfHx8MA%3D%3D')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      } py-12 px-4 sm:px-6 lg:px-8 relative backdrop-blur-sm`}
    >
      {/* Overlay with blur effect */}
      <div
        className="absolute inset-0 backdrop-blur-[2px]"
        style={{
          backgroundColor: isDarkMode
            ? "rgba(17, 24, 39, 0.7)"
            : "rgba(255, 255, 255, 0.5)",
        }}
      ></div>

      <motion.div
        className={`max-w-md w-full space-y-8 ${
          isDarkMode ? "bg-gray-800/80 text-white" : "bg-white/90"
        } backdrop-blur-md p-8 rounded-xl shadow-xl relative z-10`}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div>
          <h2
            className={`mt-2 text-center text-3xl font-extrabold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Sign in to your account
          </h2>
          <p
            className={`mt-2 text-center text-sm ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Don't have an account?{" "}
            <Link
              to="/signup"
              className={`font-medium ${
                isDarkMode
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-blue-600 hover:text-blue-500"
              }`}
            >
              Sign up
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className={`block text-sm font-medium mb-1 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full rounded-lg px-4 py-2 ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter your email"
                required
                disabled={authLoading}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className={`block text-sm font-medium mb-1 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full rounded-lg px-4 py-2 pr-10 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter your password"
                  required
                  disabled={authLoading}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  tabIndex={-1}
                  disabled={authLoading}
                >
                  {showPassword ? (
                    <EyeOff size={18} className="text-gray-500" />
                  ) : (
                    <Eye size={18} className="text-gray-500" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className={`h-4 w-4 rounded border ${
                  isDarkMode
                    ? "border-gray-600 bg-gray-700 checked:bg-blue-600"
                    : "border-gray-300 bg-white checked:bg-blue-600"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                disabled={authLoading}
              />
              <label
                htmlFor="remember"
                className={`ml-2 block text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Remember me
              </label>
            </div>
            <Link
              to="/forgot-password"
              className={`text-sm font-medium ${
                isDarkMode
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-blue-600 hover:text-blue-500"
              }`}
            >
              Forgot password?
            </Link>
          </div>

          <motion.button
            type="submit"
            disabled={authLoading}
            className={`w-full py-2.5 px-4 rounded-lg ${
              authLoading ? "opacity-70 cursor-not-allowed" : ""
            } bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200`}
            whileHover={{ scale: authLoading ? 1 : 1.02 }}
            whileTap={{ scale: authLoading ? 1 : 0.98 }}
          >
            {authLoading ? "Logging in..." : "Login"}
          </motion.button>

          <div className="relative my-6">
            <div
              className={`absolute inset-0 flex items-center`}
              aria-hidden="true"
            >
              <div
                className={`w-full border-t ${
                  isDarkMode ? "border-gray-600" : "border-gray-300"
                }`}
              ></div>
            </div>
            <div className="relative flex justify-center">
              <span
                className={`px-2 text-sm ${
                  isDarkMode
                    ? "bg-gray-800 text-gray-400"
                    : "bg-white text-gray-500"
                }`}
              >
                Or continue with
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            <motion.button
              type="button"
              className={`py-2.5 w-full px-4 rounded-lg border ${
                isDarkMode
                  ? "bg-gray-700/60 border-gray-600 hover:bg-gray-700"
                  : "bg-white border-gray-300 hover:bg-gray-50"
              } flex items-center justify-center`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
