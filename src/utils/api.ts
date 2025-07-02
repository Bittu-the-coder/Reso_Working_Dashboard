import axios from "axios";

// Set the API URL with the environment variable or fallback to localhost
export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3030/api";

// Configure default axios settings for CORS support
axios.defaults.withCredentials = true; // Enable cookies and credentials

// Add axios interceptors for all requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => Promise.reject(error)
);

// Add axios response interceptor to handle common errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - could redirect to login or refresh token
      console.error(
        "Authentication error:",
        error.response?.data?.message || "Unauthorized"
      );
    } else if (error.response?.status === 403) {
      console.error(
        "Permission denied:",
        error.response?.data?.message || "Forbidden"
      );
    } else if (!error.response && error.message?.includes("Network Error")) {
      console.error("Network error - API server may be down or CORS issue");
    }
    return Promise.reject(error);
  }
);
