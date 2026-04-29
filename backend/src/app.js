const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const documentsRoutes = require("./routes/document.route.js");
const eventRoutes = require("./routes/event.route.js");
const projectRoutes = require("./routes/project.route.js");
const taskRoutes = require("./routes/task.route.js");
const userRoutes = require("./routes/user.route.js");
const teamRoutes = require("./routes/team.route.js");
const connect = require('./db/db.js');
const errorHandler = require("./middlewares/error.middleware.js");
require("dotenv").config();

const app = express();

// Configure allowed origins
const allowedOrigins = [
  "https://reso-working-dashboard.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5174"
];

// Add FRONTEND_URL from environment if it exists
if (process.env.FRONTEND_URL) {
  const envOrigins = process.env.FRONTEND_URL.split(',').map(o => o.trim());
  envOrigins.forEach(origin => {
    if (!allowedOrigins.includes(origin)) {
      allowedOrigins.push(origin);
    }
  });
}

// Enhanced CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "X-CSRF-Token",
    "Accept-Version",
    "Content-Length",
    "Content-MD5",
    "Date",
    "X-Api-Version"
  ],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Validate ImageKit configuration
if (!process.env.IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY || !process.env.IMAGEKIT_URL_ENDPOINT) {
  console.error('Missing required ImageKit configuration');
}

// Apply CORS middleware
app.use(cors(corsOptions));

// Body parser with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(express.static("public"));

// Health check endpoint with more debug info
app.get('/api/health', (req, res) => {
  const debugInfo = {
    status: 'ok',
    environment: process.env.NODE_ENV,
    nodeVersion: process.version,
    timestamp: new Date().toISOString(),
    workingDirectory: process.cwd(),
  };
  res.status(200).json(debugInfo);
});

// Enhanced root endpoint with debug information
app.get("/", (req, res) => {
  res.send(`
    <h1>Welcome to the Reso Working Dashboard API</h1>
    <p>Server is running in ${process.env.NODE_ENV || 'development'} mode</p>
    <p>Current time: ${new Date().toISOString()}</p>
    <a href="/api/health">Check API Health</a>
  `);
});

// Connect to MongoDB with better error handling
connect()
  .then(() => console.log("Database connection initialized"))
  .catch(err => console.error("Failed to initialize database connection:", err));

// API routes
app.use("/api/users", userRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/documents", documentsRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

// Enhanced error logging for serverless environment
app.use((err, req, res, next) => {
  const errorDetails = {
    message: err.message,
    name: err.name,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  };

  console.error('Error occurred:', JSON.stringify(errorDetails, null, 2));
  next(err);
});

// Error handler (should be after all route handlers)
app.use(errorHandler);

// For local development and traditional server hosting (not serverless like Vercel)
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  const PORT = process.env.PORT || 3030;
  app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
  });
}

module.exports = app;
