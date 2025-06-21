import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import PropTypes from "prop-types";

interface ThemeContextType {
  theme: "light" | "dark";
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
}

// Create the theme context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Create the ThemeProvider component
function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Check localStorage for saved theme or use system preference as default
  const getInitialTheme = useCallback((): "light" | "dark" => {
    if (typeof window === "undefined") {
      return "light"; // Default for server-side rendering
    }

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || savedTheme === "light") {
      return savedTheme;
    }

    // Check system preference
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    return prefersDark ? "dark" : "light";
  }, []);

  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);

  // Toggle theme function
  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  }, []);

  // Set specific theme
  const setSpecificTheme = useCallback((newTheme: "light" | "dark") => {
    setTheme(newTheme);
  }, []);

  // Apply theme to document when theme changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Save to localStorage
    localStorage.setItem("theme", theme);

    // Apply to HTML element
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      document.body.classList.add("bg-gray-900", "text-white");
    } else {
      root.classList.remove("dark");
      document.body.classList.remove("bg-gray-900", "text-white");
    }
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (!localStorage.getItem("theme")) {
        setTheme(mediaQuery.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Context value
  const value = {
    theme,
    isDarkMode: theme === "dark",
    toggleTheme,
    setTheme: setSpecificTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export { useTheme, ThemeProvider };
