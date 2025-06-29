const { sendTokenResponse } = require('../utils/jwt');
const User = require("../models/User.model");
const connect = require("../db/db");
const asyncHandler = require("../utils/asyncHandler");
const { ErrorResponse, sendSuccess } = require("../utils/sendResponse");
const { uploadToImageKit } = require('../utils/imageKit');

// Register user
const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, username, password } = req.body;

  if (!name || !email || !username || !password) {
    return next(new ErrorResponse('Please provide all required fields', 400));
  }

  try {
    await connect();

    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return next(new ErrorResponse('User already exists', 400));
    }

    const user = await User.create({
      fullName: name,
      email,
      username,
      password
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error('Error while registering the user:', error);
    return next(new ErrorResponse('Internal Server Error', 500));
  }
});

// Login user
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse('Please provide email and password', 400));
  }

  try {
    await connect();

    // Find user by email
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Error while logging in:', error);
    return next(new ErrorResponse('Internal Server Error', 500));
  }
});

// Get current logged in user
const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
});

// Logout user
const logoutUser = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// Update user details
const updateUser = asyncHandler(async (req, res, next) => {
  const { name, username, email, avatar } = req.body

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    // upload avatar if provided
    if (req.file) {
      const avatarUrl = await uploadToImageKit(req.file);
      user.avatar = avatarUrl.url;
    }

    // Check if email is being changed and if it already exists
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return next(new ErrorResponse('Email already in use', 400));
      }
    }

    // Check if username is being changed and if it already exists
    if (username && username !== user.username) {
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        return next(new ErrorResponse('Username already in use', 400));
      }
    }

    if (name) user.fullName = name
    if (username) user.username = username
    if (email) user.email = email
    if (avatar) user.avatar = avatar

    await user.save()

    sendSuccess(res, user, 'User updated successfully')
  } catch (error) {
    console.error('Error updating user:', error);
    return next(new ErrorResponse("Internal Server Error", 500));
  }
});

// Update password
const updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  await connect();
  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendSuccess(res, user, 'Password updated successfully');
});

const getAllUsers = asyncHandler(async (req, res, next) => {
  try {
    const users = await User.find();
    sendSuccess(res, users, 'Users fetched successfully');
  } catch (error) {
    console.error('Error while fetching users:', error);
    return next(new ErrorResponse('Internal Server Error', 500));
  }
});

const checkNotification = asyncHandler(async (req, res, next) => {
  try {

    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }

    const unreadNotifications = user.notifications.filter(n => !n.isRead);
    // isRead = true
    user.notifications.forEach(n => {
      if (!n.isRead) {
        n.isRead = true;
      }
    });
    await user.save();

    return sendSuccess(res, unreadNotifications, "Fetched unread notifications");
  } catch (error) {
    console.error("Error while checking notifications:", error);
    return next(new ErrorResponse("Server error", 500));
  }
});

const deleteNotificationById = asyncHandler(async (req, res, next) => {
  const notificationId = req.params.id;

  try {

    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }

    const index = user.notifications.findIndex(
      (n) => n._id.toString() === notificationId
    );

    if (index === -1) {
      return next(new ErrorResponse("Notification not found", 404));
    }

    user.notifications.splice(index, 1);
    await user.save();

    return sendSuccess(res, user.notifications, "Notification deleted");
  } catch (error) {
    console.error("Error while deleting notification:", error);
    return next(new ErrorResponse("Server error", 500));
  }
});




module.exports = {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
  updateUser,
  updatePassword,
  getAllUsers,
  checkNotification,
  deleteNotificationById
};