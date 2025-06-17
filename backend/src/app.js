const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const docsRoutes = require('./routes/docs.routes.js');
const eventRoutes = require('./routes/event.routes.js');
const projectRoutes = require('./routes/project.routes.js');
const taskRoutes = require('./routes/task.routes.js');
const connection = require('./db/db.js');
const errorHandler = require('./middleware/error.middleware.js');
require('dotenv').config();

const app = express();

// Enhanced CORS configuration
const corsOptions = {
  origin: [
    'https://reso-working-dashboard.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Handle OPTIONS preflight requests directly to prevent redirect issues
// This is a more compatible way of handling all OPTIONS requests
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Connect to MongoDB only if not already connected
// This prevents multiple connection attempts in serverless environment
if (mongoose.connection.readyState !== 1) {
  // Handle connection asynchronously but don't block app startup
  connection().catch(err => {
    console.error('Initial database connection failed:', err.message);
    // Don't exit the process in serverless environment
  });
}

app.get('/', (req, res) => {
  res.send('Welcome to the Reso Working Dashboard API');
});
app.use('/api/docs', docsRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// Error handler (should be after all route handlers)
app.use(errorHandler);

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
  });
}

// Export the Express app for serverless use
module.exports = app;

