const User = require("../modals/user.modal");
const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../utils/asyncHandler");

// @desc    Get all users (for team invites)
// @route   GET /api/users
// @access  Private
exports.getUsers = asyncHandler(async (req, res, next) => {
  const { search, limit = 10 } = req.query;

  let filter = { isActive: true };

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const users = await User.find(filter)
    .select("name email avatar")
    .limit(parseInt(limit))
    .sort("name");

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)
    .select("name email avatar role teams")
    .populate("teams", "name description");

  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Search users by email
// @route   GET /api/users/search
// @access  Private
exports.searchUsersByEmail = asyncHandler(async (req, res, next) => {
  const { email } = req.query;

  if (!email) {
    return next(new ErrorResponse("Please provide an email to search", 400));
  }

  const users = await User.find({
    email: { $regex: email, $options: "i" },
    isActive: true,
  })
    .select("name email avatar")
    .limit(5);

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});
