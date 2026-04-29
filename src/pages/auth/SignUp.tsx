import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useTheme } from "../../contexts/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, AtSign, Mail, Lock, UserPlus, ArrowRight } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { GlowingCard, Spotlight } from "../../components/ui/aceternity";

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

  const {
    register,
    user,
    loading: authLoading,
    error: authError,
  } = useAuthStore();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

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
    <div
      className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? "bg-slate-950" : "bg-slate-50"
      } py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden`}
    >
      <div className="absolute inset-0 dot-pattern opacity-30 pointer-events-none" />
      
      <Spotlight
        className="-top-40 right-0 md:right-60 md:-top-20"
        fill={isDarkMode ? "#1e40af" : "#3b82f6"}
      />

      <motion.div
        className="max-w-md w-full relative z-10"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <GlowingCard className={`${isDarkMode ? "!bg-slate-900/80" : "!bg-white/80"} backdrop-blur-xl p-8`}>
          <div className="text-center mb-8">
            <div className={`mx-auto w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
              isDarkMode ? "bg-blue-900/40 text-blue-400" : "bg-blue-50 text-blue-600"
            }`}>
              <UserPlus size={28} />
            </div>
            <h2 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
              Create Account
            </h2>
            <p className={`mt-2 text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              Join our community and start managing your workspace
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User size={18} />
                  </div>
                  <input
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full rounded-xl pl-10 pr-4 py-2.5 ${
                      isDarkMode
                        ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                        : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                    } border focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
                    placeholder="John Doe"
                    disabled={authLoading}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <AtSign size={18} />
                  </div>
                  <input
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`w-full rounded-xl pl-10 pr-4 py-2.5 ${
                      isDarkMode
                        ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                        : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                    } border focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
                    placeholder="johndoe"
                    disabled={authLoading}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail size={18} />
                  </div>
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full rounded-xl pl-10 pr-4 py-2.5 ${
                      isDarkMode
                        ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                        : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                    } border focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
                    placeholder="name@example.com"
                    disabled={authLoading}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock size={18} />
                  </div>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full rounded-xl pl-10 pr-12 py-2.5 ${
                      isDarkMode
                        ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                        : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                    } border focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
                    placeholder="••••••••"
                    disabled={authLoading}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 mt-4 rounded-xl font-semibold text-white transition-all ${
                authLoading 
                  ? "bg-blue-600/50 cursor-not-allowed" 
                  : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-[0.98]"
              }`}
            >
              {authLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Account <ArrowRight size={18} />
                </>
              )}
            </button>

            <p className={`text-center text-sm mt-6 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              Already have an account?{" "}
              <Link
                to="/login"
                className={`font-semibold ${
                  isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"
                }`}
              >
                Sign In
              </Link>
            </p>
          </form>
        </GlowingCard>
      </motion.div>
    </div>
  );
};
