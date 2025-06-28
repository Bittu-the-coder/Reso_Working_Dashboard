const { generateToken } = require("./jwt");

class SuccessResponse {
  constructor(data, message = 'Success', statusCode = 200, token) {
    this.success = true;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.token = token;
  }
}

class ErrorResponse extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.success = false;
    this.statusCode = statusCode;
  }
}

const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
  res
    .status(statusCode)
    .json(new SuccessResponse(data, message, statusCode, generateToken(data)));
};

const sendError = (res, error) => {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    statusCode,
    message: error.message || 'Server Error',
  });
};

module.exports = {
  ErrorResponse,
  sendSuccess,
  sendError,
};
