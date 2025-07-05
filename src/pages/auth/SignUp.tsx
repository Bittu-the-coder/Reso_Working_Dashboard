import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useTheme } from "../../contexts/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";

export const SignUpPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  // Use Zustand store
  const {
    register,
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
      const result = await register(formData);
      if (result?.success) {
        toast.success("Account created successfully!");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Signup error:", error);
      const errorMsg = error instanceof Error ? error.message : "Signup failed";
      toast.error(errorMsg);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          "url('https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dGVhbXxlbnwwfHwwfHx8MA%3D%3D')",
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
            Create your account
          </h2>
          <p
            className={`mt-2 text-center text-sm ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              className={`font-medium ${
                isDarkMode
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-blue-600 hover:text-blue-500"
              }`}
            >
              Sign in
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "border-gray-300 placeholder-gray-400"
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Enter your full name"
                disabled={authLoading}
              />
            </div>
            <div>
              <label
                htmlFor="username"
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "border-gray-300 placeholder-gray-400"
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Enter your full name"
                disabled={authLoading}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "border-gray-300 placeholder-gray-400"
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Enter your email"
                disabled={authLoading}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "border-gray-300 placeholder-gray-400"
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Enter your password"
                  disabled={authLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center mt-1"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff
                      className={`h-5 w-5 ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                  ) : (
                    <Eye
                      className={`h-5 w-5 ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <motion.button
              type="submit"
              disabled={authLoading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${
                isDarkMode
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-600 hover:bg-blue-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              whileHover={{ scale: authLoading ? 1 : 1.02 }}
              whileTap={{ scale: authLoading ? 1 : 0.98 }}
            >
              {authLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
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
                  Creating account...
                </span>
              ) : (
                "Create account"
              )}
            </motion.button>
          </div>

          <div className="relative my-6">
            <div
              className={`absolute inset-0 flex items-center ${
                isDarkMode ? "text-gray-500" : "text-gray-300"
              }`}
            >
              <div className="border-t w-full"></div>
            </div>
            {/* <div className="relative flex justify-center text-sm">
              <span
                className={`px-4 ${
                  isDarkMode
                    ? "bg-gray-800/80 text-gray-300"
                    : "bg-white text-gray-500"
                }`}
              >
                Or sign up with
              </span>
            </div> */}
          </div>

          {/* <div className="flex justify-center">
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
          </div> */}
        </form>
      </motion.div>
    </motion.div>
  );
};
