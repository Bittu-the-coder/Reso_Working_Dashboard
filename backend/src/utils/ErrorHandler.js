const errorHandler = (err, req, res, next) => {
  console.error('Error:', {
    name: err.name,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  const error = {
    success: false,
    message: err.message || 'Server Error',
    statusCode: err.statusCode || 500
  };

  // Handle Mongoose errors
  if (err.name === 'ValidationError') {
    error.message = Object.values(err.errors).map(val => val.message);
    error.statusCode = 400;
  }

  // Handle MongoDB duplicate key errors
  if (err.code === 11000) {
    error.message = 'Duplicate field value entered';
    error.statusCode = 400;
  }

  // Handle MongoDB connection errors
  if (err.name === 'MongoNetworkError' || err.name === 'MongoServerSelectionError') {
    error.message = 'Database connection error. Please try again later.';
    error.statusCode = 503;
  }

  res.status(error.statusCode).json(error);
};

module.exports = errorHandler;