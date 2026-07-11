import { validationResult } from "express-validator";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";
import { ERROR_MESSAGES } from "../constants/errorMessages.js";

// Cookie options for the refresh token — reused across login/register/refresh
const refreshTokenCookieOptions = {
  httpOnly: true, // JS on the frontend cannot read this cookie (XSS protection)
  secure: process.env.NODE_ENV === "production", // HTTPS only in production
  sameSite: "strict", // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
};

// @route  POST /api/v1/auth/register
export const registerUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error(ERROR_MESSAGES.USER_EXISTS);
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create({ name, email, password });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Save refresh token to DB so we can invalidate it later on logout
  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// @route  POST /api/v1/auth/login
export const loginUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { email, password } = req.body;

  // explicitly select password since schema has select: false
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    const error = new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
    error.statusCode = 401;
    throw error;
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

  res.status(200).json({
    success: true,
    message: "Login successful",
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// @route  POST /api/v1/auth/refresh
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const tokenFromCookie = req.cookies.refreshToken;

  if (!tokenFromCookie) {
    const error = new Error(ERROR_MESSAGES.NO_REFRESH_TOKEN);
    error.statusCode = 401;
    throw error;
  }

  const jwt = (await import("jsonwebtoken")).default;

  let decoded;
  try {
    decoded = jwt.verify(tokenFromCookie, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    const error = new Error(ERROR_MESSAGES.INVALID_TOKEN);
    error.statusCode = 403;
    throw error;
  }

  const user = await User.findById(decoded.id).select("+refreshToken");

  // Ensure the token matches what's stored in DB (allows us to invalidate on logout)
  if (!user || user.refreshToken !== tokenFromCookie) {
    const error = new Error(ERROR_MESSAGES.INVALID_TOKEN);
    error.statusCode = 403;
    throw error;
  }

  const newAccessToken = generateAccessToken(user._id);

  res.status(200).json({
    success: true,
    accessToken: newAccessToken,
  });
});

// @route  POST /api/v1/auth/logout
export const logoutUser = asyncHandler(async (req, res) => {
  const tokenFromCookie = req.cookies.refreshToken;

  if (tokenFromCookie) {
    // Invalidate the refresh token in DB so it can't be reused
    await User.findOneAndUpdate(
      { refreshToken: tokenFromCookie },
      { refreshToken: null }
    );
  }

  res.clearCookie("refreshToken", refreshTokenCookieOptions);

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// @route  GET /api/v1/auth/me
export const getCurrentUser = asyncHandler(async (req, res) => {
  // req.user is attached by authMiddleware (Step 8)
  res.status(200).json({
    success: true,
    user: req.user,
  });
});