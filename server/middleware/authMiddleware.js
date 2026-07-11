import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ERROR_MESSAGES } from "../constants/errorMessages.js";

// Protects routes — verifies the access token sent in Authorization header
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    const error = new Error(ERROR_MESSAGES.UNAUTHORIZED);
    error.statusCode = 401;
    throw error;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = await User.findById(decoded.id); // attach user to request
    next();
  } catch (err) {
    const error = new Error(ERROR_MESSAGES.TOKEN_EXPIRED);
    error.statusCode = 401;
    throw error;
  }
});

// Restricts routes to specific roles (used later for Admin Dashboard, Phase 11)
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      const error = new Error("You do not have permission to perform this action");
      error.statusCode = 403;
      throw error;
    }
    next();
  };
};