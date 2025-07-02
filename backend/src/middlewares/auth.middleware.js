const jwt = require("jsonwebtoken");
const User = require("../models/User.model.js");
const { ErrorResponse } = require("../utils/sendResponse.js");
const asyncHandler = require("../utils/asyncHandler.js");

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check headers for Bearer token
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  // Check cookies
  else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new ErrorResponse("Not authorized - No token provided", 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add more detailed logging
    console.log('Token verification successful:', decoded);

    // Get user from token
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return next(new ErrorResponse("Not authorized - Invalid token", 401));
  }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};

