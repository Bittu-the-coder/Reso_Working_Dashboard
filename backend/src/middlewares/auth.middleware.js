const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { ErrorResponse } = require("../utils/sendResponse");
const asyncHandler = require("../utils/asyncHandler");

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check headers for Bearer token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(" ")[1];
  }
  // If no token in Authorization header, check cookies (support both methods)
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );

    // Get user from database
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return next(new ErrorResponse("User not found", 404));
    }

    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    return next(new ErrorResponse("Not authorized to access this route", 401));
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

