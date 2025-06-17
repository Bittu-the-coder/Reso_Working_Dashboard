const mongoose = require("mongoose");

// Cache the database connection
let cachedConnection = null;

const connection = async () => {
  if (cachedConnection) {
    console.log("Using cached database connection");
    return cachedConnection;
  }

  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is not defined");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB connected successfully");
    cachedConnection = conn;
    return conn;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    // Don't exit process in serverless environment
    throw error;
  }
}

module.exports = connection;
