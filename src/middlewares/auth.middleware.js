import { verifyAccessToken } from "../utils/token.util.js";
import { AppError } from "../utils/appError.util.js";
import asyncHandler from "../utils/asyncHandler.util.js";

// Prüft ob ein gültiger Access Token mitgeschickt wurde
export const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("No token provided. Please log in.", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch {
    throw new AppError("Invalid or expired token. Please log in again.", 401);
  }
});

// Schränkt den Zugriff auf bestimmte Rollen ein
// Verwendung: authorize("retailer") oder authorize("user", "retailer")
export const authorize = (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError("You do not have permission to perform this action.", 403);
    }
    next();
  };