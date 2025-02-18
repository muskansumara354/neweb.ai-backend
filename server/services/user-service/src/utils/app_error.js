
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    // Capture stack trace to improve error debugging
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
