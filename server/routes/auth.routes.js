import express from "express";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getCurrentUser,
} from "../controllers/auth.controller.js";
import { registerValidator, loginValidator } from "../validators/auth.validator.js";
import { protect } from "../middleware/authMiddleware.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import {
  updateProfile,
  changePassword,
} from "../controllers/auth.controller.js";
import {
  updateProfileValidator,
  changePasswordValidator,
} from "../validators/auth.validator.js";

const router = express.Router();

router.post("/register", authLimiter,registerValidator, registerUser);
router.post("/login",authLimiter, loginValidator, loginUser);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logoutUser);
router.get("/me", protect, getCurrentUser);
router.put("/profile", protect, updateProfileValidator, updateProfile);
router.put("/change-password", protect, changePasswordValidator, changePassword);

export default router;