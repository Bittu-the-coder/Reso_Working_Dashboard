const mongoose = require("mongoose");

let cachedConnection = null;

const connect = async () => {
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    // Add these connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    const conn = await mongoose.connect(process.env.MONGO_URI, options);
    console.log("MongoDB connected successfully");
    cachedConnection = conn;
    return conn;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

module.exports = connect;