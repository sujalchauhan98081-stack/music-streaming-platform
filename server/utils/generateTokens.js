import jwt from "jsonwebtoken";

// Access token: short-lived, sent in Authorization header on every request
export const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRY,
  });
};

// Refresh token: long-lived, stored in httpOnly cookie only
export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRY,
  });
};