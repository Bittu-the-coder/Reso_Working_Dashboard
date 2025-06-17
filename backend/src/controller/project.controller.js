const asyncHandler = require("../utils/asyncHandler.js");
const ErrorResponse = require("../utils/ErrorResponse.js");

// Placeholder controller functions for projects
const getProjects = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Projects retrieved successfully',
    data: []
  });
});

module.exports = {
  getProjects
};
