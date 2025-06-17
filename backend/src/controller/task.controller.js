const asyncHandler = require("../utils/asyncHandler.js");
const ErrorResponse = require("../utils/ErrorResponse.js");

// Placeholder controller functions for tasks
const getTasks = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Tasks retrieved successfully',
    data: []
  });
});

module.exports = {
  getTasks
};
