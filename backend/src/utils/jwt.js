const jwt = require("jsonwebtoken");

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + (process.env.JWT_COOKIE_EXPIRE || 30) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === "production"
  };

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      token, // Still send token in response for frontend storage if needed
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        teamId: user.teamId?.toString()
      }
    });
};

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "your-secret-key", {
    expiresIn: process.env.JWT_EXPIRE || "30d",
  });
};

module.exports = {
  sendTokenResponse,
  generateToken,
};
