const { sendTokenResponse } = require('../utils/jwt.js');
const User = require("../models/user.model.js");
const Team = require("../models/team.model.js");
const connect = require("../db/db.js");
const asyncHandler = require("../utils/asyncHandler.js");
const { ErrorResponse, sendSuccess } = require("../utils/sendResponse.js");
const { uploadToImageKit } = require('../utils/imageKit.js');
const nodemailer = require('nodemailer');

// Register user
const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, username, password } = req.body;

  if (!name || !email || !username || !password) {
    return next(new ErrorResponse('Please provide all required fields', 400));
  }

  try {
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
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    const { name, username, email } = req.body;

    // Enhanced debugging
    console.log('Updating user:', name, username, email);
    console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);

    // Handle file upload if present
    if (req.file) {
      console.log('Processing file upload:', req.file.originalname);
      try {
        const avatarUrl = await uploadToImageKit(req.file);
        console.log('ImageKit upload successful:', avatarUrl);
        user.avatar = avatarUrl.url;
      } catch (uploadError) {
        console.error('Error uploading to ImageKit:', uploadError);
        return next(new ErrorResponse('Error uploading avatar', 500));
      }
    } else {
      console.log('No file detected in request');
    }

    // Update other user fields
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return next(new ErrorResponse('Email already in use', 400));
      }
      user.email = email;
    }

    if (username && username !== user.username) {
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        return next(new ErrorResponse('Username already in use', 400));
      }
      user.username = username;
    }

    if (name) user.fullName = name;

    await user.save();

    sendSuccess(res, user, 'User updated successfully');
  } catch (error) {
    console.error('Error updating user:', error);
    return next(new ErrorResponse("Internal Server Error", 500));
  }
});

// Update password
const updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
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

const getAllNotification = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }

    const response = user.notifications || [];
    sendSuccess(res, response, "Notifications fetched successfully.");
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return next(new ErrorResponse("Failed to fetch notifications", 500));
  }
});

const checkNotification = asyncHandler(async (req, res, next) => {
  const notificationId = req.params.id;
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }
    const markedRead = user.notifications.filter(n => n._id.toString() === notificationId ? n.isRead = true : null);
    await user.save();
    const readInvitation = user.notifications.find(
      (n) => n.type === 'invitation' && n.isRead === true
    );
    const teamIds = user.teams.map(t => t.teamId);
    let invitationAccepted = false;

    for (const teamId of teamIds) {
      const team = await Team.findById(teamId);
      if (!team) continue;

      // Find invitation in the team
      const invitationIndex = team.invitations.findIndex(
        (inv) => inv.userId.toString() === req.user._id.toString()
      );

      if (invitationIndex === -1) continue;

      const memberIdx = team.members.findIndex(
        (mem) => mem.userId.toString() === req.user._id.toString()
      );

      if (memberIdx !== -1) {
        team.members[memberIdx].isAcceptedInvite = true;
        team.invitations.splice(invitationIndex, 1);
        await team.save();
        invitationAccepted = true;
        break; // Accept only the first valid invitation
      }
    }

    return sendSuccess(res, markedRead, "Fetched unread notifications");
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

//notify user by email
const notifyUserByEmail = async (userId, subject, message) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    console.log(`Sending email to ${user.email} with subject: ${subject}`);
    console.log(`Message: ${message}`);

    const mailOptions = {
      to: user.email,
      subject: subject,
      html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2c3e50; margin: 0; font-size: 28px; font-weight: 600;">Reso</h1>
          <p style="color: #7f8c8d; margin: 5px 0 0;">Collaborative Project Management</p>
        </div>
        <h2 style="color: #2c3e50; font-size: 24px; margin-bottom: 20px;">Hello ${user.fullName || user.username},</h2>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin-bottom: 30px;">
          <p style="font-size: 16px; line-height: 1.6; color: #34495e; margin: 0;">
            ${message}
          </p>
        </div>
        <div style="border-top: 2px solid #eceef1; padding-top: 20px; margin-top: 30px;">
          <p style="font-size: 14px; color: #7f8c8d; line-height: 1.5; margin: 0;">
            Best regards,<br>
            <strong style="color: #2c3e50;">The Reso Team</strong>
          </p>
        </div>
        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #95a5a6; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Reso. All rights reserved.</p>
        </div>
      </div>
      `,
    };
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      port: 587,
    });
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: mailOptions.to,
      subject: mailOptions.subject,
      html: mailOptions.html,
    });
    console.log(
      `Email sent successfully to ${user.email}:`,
      info.messageId
    );
  } catch (error) {
    console.error("Error sending email notification:", error);
  }
};




module.exports = {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
  updateUser,
  updatePassword,
  getAllUsers,
  getAllNotification,
  checkNotification,
  deleteNotificationById,
  notifyUserByEmail
};