const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require('path');
const fs = require('fs');

// Add file existence check utility
const checkFileExists = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      console.log(`✅ File exists: ${filePath}`);
    } else {
      console.error(`❌ File not found: ${filePath}`);
    }
  } catch (err) {
    console.error(`Error checking file ${filePath}:`, err);
  }
};

// Check critical model files
const modelsPath = path.join(__dirname, 'models');
console.log('Models directory:', modelsPath);
try {
  if (fs.existsSync(modelsPath)) {
    const files = fs.readdirSync(modelsPath);
    console.log('Available model files:', files);
  }
} catch (err) {
  console.error('Error reading models directory:', err);
}

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
try {
  connect().then(() => {
    console.log("Database connection initialized");
  }).catch(err => {
    console.error("Failed to initialize database connection:", err);
  });
} catch (error) {
  console.error("Error in database connection setup:", error);
}

app.use("/api/users", userRoutes);
// User routes are now merged with auth routes
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

// For local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
  });
}

// Export the Express app for serverless use
module.exports = app;
