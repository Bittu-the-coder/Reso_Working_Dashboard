const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const documentsRoutes = require("./routes/document.route.js");
const eventRoutes = require("./routes/event.route.js");
const projectRoutes = require("./routes/project.route.js");
const taskRoutes = require("./routes/task.route.js");
const userRoutes = require("./routes/user.route.js");
const teamRoutes = require("./routes/team.route.js");
const connect = require('./db/db.js')
const errorHandler = require("./middlewares/error.middleware.js");
require("dotenv").config();

const app = express();

// Enhanced CORS configuration
const corsOptions = {
  origin: [
    "https://reso-working-dashboard.vercel.app",
    "http://localhost:3000",
    "http://localhost:5173",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

// Handle OPTIONS preflight requests directly to prevent redirect issues
// This is a more compatible way of handling all OPTIONS requests
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// Connect to MongoDB only if not already connected
// This prevents multiple connection attempts in serverless environment
if (mongoose.connection.readyState !== 1) {
  // Handle connection asynchronously but don't block app startup
  connect().catch((err) => {
    console.error("Initial database connection failed:", err.message);
    // Don't exit the process in serverless environment
  });
}

app.get("/", (req, res) => {
  res.send("Welcome to the Reso Working Dashboard API");
});
app.use("/api/users", userRoutes);
// User routes are now merged with auth routes
app.use("/api/teams", teamRoutes);
app.use("/api/documents", documentsRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

// Error handler (should be after all route handlers)
app.use(errorHandler);

// For local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
  });
}

// Export the Express app for serverless use
module.exports = app;
