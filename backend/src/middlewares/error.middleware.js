const { ErrorResponse } = require('../utils/sendResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error to console for debugging (in development)
  if (process.env.NODE_ENV !== 'production') {
    console.log(err.stack);
  } else {
    // For production, log important errors but not the full stack trace
    console.error(`${err.name || 'Error'}: ${err.message}`);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(message, 400);
  }

  // MongoDB connection errors
  if (err.name === 'MongoNetworkError' || err.name === 'MongoServerSelectionError') {
    error = new ErrorResponse('Database connection error. Please try again later.', 500);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error'
  });
};

module.exports = errorHandler;
