import { AppError } from "../utils/appError.util.js";

function handleMongooseCastError(err) {
  return new AppError(`Invalid value for field "${err.path}": ${err.value}`, 400);
}

function handleMongooseDuplicateKey(err) {
  const field = Object.keys(err.keyValue)[0];
  return new AppError(`"${err.keyValue[field]}" is already taken for field "${field}"`, 409);
}

function handleMongooseValidationError(err) {
  const messages = Object.values(err.errors).map((e) => e.message);
  return new AppError(`Validation failed: ${messages.join(", ")}`, 400);
}

function handleJWTError() {
  return new AppError("Invalid token. Please log in again.", 401);
}

function handleJWTExpiredError() {
  return new AppError("Your token has expired. Please log in again.", 401);
}

function sendErrorDev(err, res) {
  res.status(err.statusCode).json({
    success: false,
    status: err.statusCode,
    message: err.message,
    stack: err.stack,
  });
}

function sendErrorProd(err, res) {
  // Operational errors: safe to expose to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      status: err.statusCode,
      message: err.message,
    });
  }

  // Unknown errors: don't leak details
  console.error("UNEXPECTED ERROR:", err);
  return res.status(500).json({
    success: false,
    status: 500,
    message: "Something went wrong. Please try again later.",
  });
}

export function errorHandler(err, req, res, next) {
  err.statusCode = err.statusCode || 500;

  let error = Object.assign(Object.create(Object.getPrototypeOf(err)), err);
  error.message = err.message;

  if (err.name === "CastError") error = handleMongooseCastError(err);
  if (err.code === 11000) error = handleMongooseDuplicateKey(err);
  if (err.name === "ValidationError") error = handleMongooseValidationError(err);
  if (err.name === "JsonWebTokenError") error = handleJWTError();
  if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
}