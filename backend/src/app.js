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

if (!process.env.IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY || !process.env.IMAGEKIT_URL_ENDPOINT) {
  console.error('Missing required ImageKit configuration');
}

app.use(cors(corsOptions));
// Body parser with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
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



// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Connect to MongoDB
connect();

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

// Log error details before passing to the error handler
app.use((err, req, res, next) => {
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    headers: req.headers
  });
  next(err);
});

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
