const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../utils/asyncHandler");

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(" ")[1];
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

    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return next(new ErrorResponse("User not found", 404));
    }

    if (!req.user.isActive) {
      return next(new ErrorResponse("User account is deactivated", 401));
    }

    next();
  } catch (err) {
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

// Check if user is team member
exports.checkTeamMembership = asyncHandler(async (req, res, next) => {
  const Team = require("../models/team.model");
  const teamId = req.params.teamId;

  if (!teamId) {
    return next(new ErrorResponse("Team ID is required", 400));
  }

  const team = await Team.findById(teamId);

  if (!team) {
    return next(new ErrorResponse("Team not found", 404));
  }

  if (!team.isMember(req.user._id)) {
    return next(new ErrorResponse("Not authorized to access this team", 403));
  }

  req.team = team;
  next();
});

// Check if user is team admin or owner
exports.checkTeamAdmin = asyncHandler(async (req, res, next) => {
  const Team = require("../models/team.model");
  const teamId = req.params.teamId;

  if (!teamId) {
    return next(new ErrorResponse("Team ID is required", 400));
  }

  const team = await Team.findById(teamId);

  if (!team) {
    return next(new ErrorResponse("Team not found", 404));
  }

  if (!team.isAdminOrOwner(req.user._id)) {
    return next(
      new ErrorResponse("Not authorized to perform this action", 403)
    );
  }

  req.team = team;
  next();
});
